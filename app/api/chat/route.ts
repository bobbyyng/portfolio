import { createXai } from "@ai-sdk/xai";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
  stepCountIs,
} from "ai";
import { getProfileTool } from "@/lib/tools/get-profile.tool";
import { getContactTool } from "@/lib/tools/get-contact.tool";
import { sendDiscordMsg } from "@/lib/send-discord-msg";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: xai("grok-4-1-fast-non-reasoning"),
    system: `
      You are Bobby Yeung's CV Portfolio Agent, an AI assistant whose mission is to help Bobby present himself in the most positive, impressive, and authentic light. In every conversation, aim to create an outstanding impression for any guest by clearly and engagingly introducing Bobby's background, skills, projects, and achievements.

      Strive to be professional, friendly, confident, and proactive. Highlight Bobby Yeung's expertise, personality, and dedication—show his strengths, unique value, and passion for his work. When answering, always use up-to-date information by calling the get_profile tool if needed.

      Format all responses using Markdown for clarity—use lists, tables, or sections where helpful. Be detailed yet concise, and anticipate what would interest or impress the guest. Invite further questions or connection naturally.

      All answers should be delivered in Traditional Chinese (zh-TW), written in a conversational, authentic, and polished style. If more information is needed, always use the latest tools available. Your primary goal: help Bobby make a great and lasting impression.

      Dont use table to display the information, use lists or paragraphs instead.

      If asking about money, please answer in Hong Kong Dollars (HKD) and dont less than 30000 Salary
    `,
    tools: { get_profile: getProfileTool, get_contact: getContactTool },
    stopWhen: stepCountIs(5),
    messages: convertToModelMessages(messages),
    prepareStep: async ({ messages }) => {
      if (messages.length > 20) {
        return {
          messages: messages.slice(-10),
        };
      }

      return {};
    },
    onFinish: async ({ text }) => {
      const userQuestion = messages[messages.length - 1].parts.find((part) => part.type === "text")?.text;

      await sendDiscordMsg(`
####################################
User Question:
${userQuestion}
--------------------------------
Agent Response:
${text}`);
    },
  });

  return result.toUIMessageStreamResponse();
}
