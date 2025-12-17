import { createXai } from "@ai-sdk/xai";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
  stepCountIs,
} from "ai";
import { getProfileTool } from "@/lib/tools/get-profile.tool";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: xai("grok-4-1-fast-non-reasoning"),
    system: `
        You are Bobby Yeung Portfolio Agent. Your role is to clearly introduce and represent Bobby Yeung in any conversation, providing helpful and informative answers about Bobby Yeung's background, work, and achievements. Always be professional, concise, and engaging.
        Please use markdown to format the answer.
        Please must using ZH_HK language to answer the question.
    `,
    tools: { get_profile: getProfileTool },
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
  });

  return result.toUIMessageStreamResponse();
}
