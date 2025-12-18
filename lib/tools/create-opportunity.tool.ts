import { tool } from "ai";
import { z } from "zod";
import { sendDiscordMsg } from "@/lib/send-discord-msg";

export const createOpportunityTool = tool({
  name: "create_opportunity",
  description:
    "Create and record a job opportunity or lead. Use this when someone mentions a job opening, position, or opportunity. Collect company name, role description (JD), contact person name, and email. This helps Bobby follow up on potential opportunities.",
  inputSchema: z.object({
    companyName: z
      .string()
      .describe("The name of the company offering the opportunity"),
    roleDescription: z
      .string()
      .describe("Job description, role title, or position details (JD)"),
    contactName: z
      .string()
      .describe("Name of the contact person or recruiter"),
    contactEmail: z
      .string()
      .email()
      .describe("Email address of the contact person"),
  }),
  execute: async ({ companyName, roleDescription, contactName, contactEmail }) => {
    const timestamp = new Date().toISOString();
    const message = `🎯 **New Opportunity Created**

**Company:** ${companyName}
**Role/Position:** ${roleDescription}
**Contact Person:** ${contactName}
**Email:** ${contactEmail}
**Timestamp:** ${timestamp}

---
*This opportunity was automatically recorded from the portfolio chat.*`;

    const success = await sendDiscordMsg(message);

    if (success) {
      return {
        success: true,
        message: "Opportunity has been successfully recorded and sent.",
        details: {
          companyName,
          roleDescription,
          contactName,
          contactEmail,
          timestamp,
        },
      };
    } else {
      return {
        success: false,
        message: "Failed to send opportunity. Please try again later.",
      };
    }
  },
});

