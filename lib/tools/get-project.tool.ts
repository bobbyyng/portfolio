import { tool } from "ai";
import { z } from "zod";
import { getRelatedProjectsByTags, getAllProjectTags } from "@/lib/projects";

export const searchProjectTool = tool({
  name: "search_project",
  description: "Search Bobby Yeung's projects by tags",
  inputSchema: z.object({
    tags: z.enum(getAllProjectTags()),
  }),
  execute: async ({ tags }) => {
    const projects = getRelatedProjectsByTags(tags);

    return {
      projects,
    };
  },
});
