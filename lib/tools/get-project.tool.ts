import { tool } from "ai";
import { z } from "zod";
import { getRelatedProjectsByTags } from "@/lib/projects";

export const getProjectTool = tool({
  name: "get_project",
  description: "Get Bobby Yeung's projects",
  inputSchema: z.object({
    tags: z.enum([
      "PHP",
      "Yii2",
      "MySQL",
      "Wordpress",
      "NestJS",
      "Hono",
      "Laravel",
      "LangChain",
      "LangGraph",
      "AWS",
      "Docker",
    ]),
  }),
  execute: async ({ tags }) => {
    const projects = getRelatedProjectsByTags(tags);

    return {
      projects,
    };
  },
});
