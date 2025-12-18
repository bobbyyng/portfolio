"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatMDXComponents } from "@/lib/chat-mdx-components";
import { Badge } from "@/components/ui/badge";
import { ContactCard } from "@/components/tool/contact-card";
import { OpportunityCard } from "@/components/tool/opportunity-card";

const WELCOME_MESSAGE =
  "Hello! I am your agent for Bobby Yeung's CV portfolio. Ask me anything about his skills, projects, or professional history—I'm here to help!";

const EXAMPLE_MESSAGES = [
  "What are Bobby Yeung's skills?",
  "What are Bobby Yeung's projects?",
  "What is Bobby Yeung's professional history?",
  "What is Bobby Yeung's contact information?",
  "What is Bobby Yeung's email?",
  "What is Bobby Yeung's phone number?",
  "I have a job opportunity that might be suitable for Bobby",
  "What projects has Bobby Yeung completed that are related to building APIs?",
  "What projects are related to AI?",
  "What projects are related to serverless architecture?",
];

function useStableRandomizedMessages(messages: string[]) {
  const [shuffled, setShuffled] = useState<string[] | null>(null);
  useEffect(() => {
    // Only run on client to avoid SSR/CSR mismatch!
    const copied = messages.slice();
    for (let i = copied.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    setShuffled(copied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once after mount
  return shuffled;
}

export default function Page() {
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const shuffledExampleMessages = useStableRandomizedMessages(EXAMPLE_MESSAGES);

  useEffect(() => {
    console.log(messages);
    if (messages.length === 0 && isStreaming) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < WELCOME_MESSAGE.length) {
          setStreamingText(WELCOME_MESSAGE.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsStreaming(false);
          clearInterval(interval);
        }
      }, 30); // Adjust speed here (lower = faster)

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isStreaming]);

  // Auto scroll to bottom when new messages arrive or when streaming
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSend = async () => {
    if (input.trim() && status !== "submitted" && status !== "streaming") {
      await sendMessage({
        parts: [{ type: "text", text: input }],
      });
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // Auto adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200; // Max height in pixels
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight
      )}px`;
    }
  }, [input]);

  // NEW: Handle clicking on example message button
  const handleExampleClick = async (message: string) => {
    if (status === "submitted" || status === "streaming") return;
    setInput(message);
    // Immediately send when clicking
    await sendMessage({
      parts: [{ type: "text", text: message }],
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px-80px)] container mx-auto">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2 max-w-md w-full">
              <Bot className="size-12 mx-auto text-muted-foreground/50" />
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3">
                  <p className="text-foreground whitespace-pre-wrap wrap-break-word">
                    {streamingText}
                    {isStreaming && (
                      <span className="inline-block w-0.5 h-4 bg-foreground ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div>
              <div className="flex flex-wrap gap-2">
                {message.parts.map((part, partIndex) => {
                  if (part.type.startsWith("tool-")) {
                    return (
                      <Badge
                        variant="yellow"
                        key={`${message.id}-tool-${partIndex}`}
                        className="px-4 py-1 mb-2"
                      >
                        {part.type.replace("tool-", "")}
                      </Badge>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Before Custom Tool UI */}
              {message.parts.map((part, partIndex) => {
                if (part.type.startsWith("tool-")) {
                  const toolName = part.type.replace("tool-", "");
                  switch (toolName) {
                    case "get_profile":
                      return null;
                    case "get_contact":
                      return (
                        <div className="mb-2" key={`${message.id}-contact-${partIndex}`}>
                          <ContactCard />
                        </div>
                      );
                    case "create_opportunity":
                      const toolResult = part as { output?: { details?: { companyName: string; roleDescription: string; contactName: string; contactEmail: string; timestamp: string } } };
                      if (toolResult?.output?.details) {
                        const details = toolResult.output.details;
                        return (
                          <div className="mb-2" key={`${message.id}-opportunity-${partIndex}`}>
                            <OpportunityCard
                              companyName={details.companyName}
                              roleDescription={details.roleDescription}
                              contactName={details.contactName}
                              contactEmail={details.contactEmail}
                              timestamp={details.timestamp}
                            />
                          </div>
                        );
                      }
                      return null;
                    default:
                      return null;
                  }
                }
                return null;
              })}
              <div
                className={`px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-3xl max-w-full"
                    : "bg-muted text-foreground rounded-3xl max-w-full sm:max-w-[80%] sm:min-w-[400px]"
                }`}
              >
                {message.parts.map((part, partIndex) => {
                  if (part.type === "text") {
                    return (
                      <div
                        key={`${message.id}-text-${partIndex}`}
                        className="wrap-break-word"
                      >
                        <ReactMarkdown components={chatMDXComponents}>
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              {/* After Custom Tool UI */}
              {message.parts.map((part, partIndex) => {
                if (part.type.startsWith("tool-")) {
                  switch (part.type.replace("tool-", "")) {
                    case "get_profile":
                      return <></>;
                    case "get_contact":
                      return <></>;
                    default:
                      return null;
                  }
                }
                return null;
              })}
            </div>
          </div>
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-background p-2 space-y-2">
        <div
          className="flex gap-2 overflow-x-auto custom-scrollbar"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {(shuffledExampleMessages ?? EXAMPLE_MESSAGES).map(
            (message, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-xs"
                onClick={() => handleExampleClick(message)}
                disabled={status === "submitted" || status === "streaming"}
              >
                {message}
              </Button>
            )
          )}
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (e) => {
              // Ctrl/Cmd + Enter to send
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                await handleSend();
              }
              // Enter alone will create a new line (default behavior)
            }}
            placeholder="Ask anything... (Press Ctrl/Cmd+Enter to send)"
            disabled={status === "submitted" || status === "streaming"}
            className="flex-1 rounded-lg text-xs px-4 py-3 resize-none overflow-y-auto"
            style={{
              fontSize: "0.875rem",
              minHeight: "2.25rem",
              maxHeight: "200px",
              lineHeight: "1.5",
            }}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={
              !input.trim() || status === "submitted" || status === "streaming"
            }
            size="icon"
            className="shrink-0 h-10 w-10"
          >
            <Send className="size-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          AI might be wrong. Double check.
        </p>
      </div>
    </div>
  );
}
