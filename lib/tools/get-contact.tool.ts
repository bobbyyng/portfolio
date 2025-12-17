import { tool } from "ai";
import { z } from "zod";
import profile from "@/content/profile.json";

export const getContactTool = tool({
  name: "get_contact",
  description: "Get Bobby Yeung's contact information",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      ...profile.contact,
    };
  },
});
