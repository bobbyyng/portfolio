import { tool } from "ai";
import { z } from "zod";
import profile from "@/content/profile.json";

export const getProfileTool = tool({
  name: "get_profile",
  description: "Get Bobby Yeung's profile",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      profile: profile,
    };
  },
});
