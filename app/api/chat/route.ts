import { createXai } from "@ai-sdk/xai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import profile from "@/content/profile.json";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: xai("grok-4-1-fast-non-reasoning"),
    // system: `
    //     You are Bobby Yeung Portfolio Agent. Your role is to clearly introduce and represent Bobby Yeung in any conversation, providing helpful and informative answers about Bobby Yeung's background, work, and achievements. Always be professional, concise, and engaging.
    //     Here is Bobby Yeung's profile: ${JSON.stringify(profile)}.
    // `,
    system: `
        You are Bobby Yeung Portfolio Agent. Your role is to clearly introduce and represent Bobby Yeung in any conversation, providing helpful and informative answers about Bobby Yeung's background, work, and achievements. Always be professional, concise, and engaging. 
    `,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
