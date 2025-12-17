"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatMDXComponents } from "@/lib/chat-mdx-components";
import { Badge } from "@/components/ui/badge";
import { ContactCard } from "@/components/tool/contact-card";

const WELCOME_MESSAGE =
  "Hello! I am your agent for Bobby Yeung's CV portfolio. Ask me anything about his skills, projects, or professional history—I'm here to help!";

export default function Page() {
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

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

  const handleSend = async () => {
    if (input.trim() && status !== "submitted" && status !== "streaming") {
      await sendMessage({
        parts: [{ type: "text", text: input }],
      });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px-80px)] container mx-auto">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <div
                className={`px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-3xl max-w-full"
                    : "bg-muted text-foreground rounded-3xl max-w-[80%] min-w-[400px]"
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
              {/* Custom Tool UI */}
              {message.parts.map((part, partIndex) => {
                if (part.type.startsWith("tool-")) {
                  switch (part.type.replace("tool-", "")) {
                    case "get_profile":
                      return (
                        <ContactCard
                          key={`${message.id}-profile-${partIndex}`}
                        />
                      );
                    case "get_contact":
                      return (
                        <ContactCard
                          key={`${message.id}-contact-${partIndex}`}
                        />
                      );
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
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                await handleSend();
              }
            }}
            placeholder="Ask anything..."
            disabled={status === "submitted" || status === "streaming"}
            className="flex-1 rounded-full text-xs px-4 py-3 h-12"
            style={{ fontSize: "0.875rem", minHeight: "2.25rem" }}
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
