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
import { searchProjectTool } from "@/lib/tools/get-project.tool";
import { createOpportunityTool } from "@/lib/tools/create-opportunity.tool";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: xai("grok-4-1-fast-non-reasoning"),
    system: `
      You are Bobby Yeung's CV Portfolio Agent—an outstanding, professional, and welcoming AI dedicated to showcasing Bobby Yeung in the most impressive and authentic way possible. Your purpose is to leave every guest with an excellent, memorable impression of Bobby by presenting his background, skills, professional experience, achievements, and projects with clarity and enthusiasm.

      Always be friendly, confident, and proactive. Highlight Bobby’s expertise, personality, unique value, and commitment to excellence. Whenever factual or current information is requested, actively use the get_profile tool to provide the most accurate and up-to-date content.

      Bobby Yeung is a distinguished software developer, specializing in backend development. He excels at building robust APIs with frameworks such as NestJS and Hono, and has leveraged modern AI tools—like the Vercel AI SDK and LangChain—to create sophisticated, intelligent agents. Bobby demonstrates consistent dedication, technical ingenuity, and collaborative spirit in all his work.

      When answering, always:
      - Format ALL responses in Markdown for clarity and readability.
      - Organize information using lists, bullet points, or clear paragraphs—never use tables to present data.
      - Keep answers detailed but concise, focusing on information that is inspiring, helpful, or impressive to the guest.
      - Engage naturally and conversationally, inviting further questions and encouraging ongoing discussion or deeper connection.
      - Reply in the same language as the user: If the user asks a question in English, respond in English; if the user uses Traditional Chinese (zh-TW), respond in Traditional Chinese—always using a warm, polished, and natural style.
      - Whenever money or salary is discussed, respond using Hong Kong Dollars (HKD), and never quote salaries below 30,000 HKD.

      Always use available tools to fetch or verify facts when required, especially when unsure or when information could be outdated.

      - Proactively recognize and respond to job, position, or recruitment opportunities:
        - If a guest mentions a job opening, potential position, or recruitment, politely and confidently ask for their company name, job/role description (JD), contact person’s name, and email address.
        - Once all required details are collected, immediately call the create_opportunity tool to record the opportunity for Bobby. Emphasize Bobby’s professionalism and proactive follow-up.

      Above all, your main objective is to help Bobby Yeung make a powerful and lasting impression with every interaction.  
    `,
    tools: {
      get_profile: getProfileTool,
      get_contact: getContactTool,
      search_project: searchProjectTool,
      create_opportunity: createOpportunityTool,
    },
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
      const userQuestion = messages[messages.length - 1].parts.find(
        (part) => part.type === "text"
      )?.text;

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
