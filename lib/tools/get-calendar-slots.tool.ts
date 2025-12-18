import { tool } from "ai";
import { z } from "zod";

// Example calendar slot interface
interface CalendarSlot {
  id: string;
  startTime: string; // ISO 8601 format
  endTime: string;
  date: string; // YYYY-MM-DD format
  available: boolean;
}

export const getCalendarSlotsTool = tool({
  name: "get_calendar_slots",
  description:
    "Get available calendar time slots for scheduling a meeting or interview with Bobby Yeung. Returns a list of available time slots.",
  inputSchema: z.object({
    dateRange: z
      .object({
        start: z.string().optional(),
        end: z.string().optional(),
      })
      .optional()
      .describe("Optional date range to filter slots"),
  }),
  execute: async ({ dateRange }) => {
    // TODO: Replace with actual calendar API integration
    // This is a mock implementation
    const now = new Date();
    const slots: CalendarSlot[] = [];

    // Generate sample slots for the next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);

      // Skip weekends for example
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const dateString = date.toISOString().split("T")[0];

      // Generate 3 time slots per day (9am, 2pm, 4pm)
      const timeSlots = [
        { hour: 9, minute: 0 },
        { hour: 14, minute: 0 },
        { hour: 16, minute: 0 },
      ];

      timeSlots.forEach((time, index) => {
        const startTime = new Date(date);
        startTime.setHours(time.hour, time.minute, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(time.hour + 1, time.minute, 0, 0);

        slots.push({
          id: `${dateString}-${index}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          date: dateString,
          available: true,
        });
      });
    }

    return {
      slots,
      timezone: "Asia/Hong_Kong",
    };
  },
});

