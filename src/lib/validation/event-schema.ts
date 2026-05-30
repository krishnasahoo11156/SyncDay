import { z } from "zod";

export const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title must be 100 characters or less"),
    description: z
      .string()
      .trim()
      .max(1000, "Description must be 1000 characters or less")
      .optional()
      .or(z.literal("")),
    location: z
      .string()
      .trim()
      .max(200, "Location must be 200 characters or less")
      .optional()
      .or(z.literal("")),
    startAt: z.string().min(1, "Start date and time are required"),
    endAt: z.string().min(1, "End date and time are required"),
    isAllDay: z.boolean().default(false),
    color: z.string().trim().default("#7c3aed"), // Violet-600 default
  })
  .refine(
    (data) => {
      const start = new Date(data.startAt).getTime();
      const end = new Date(data.endAt).getTime();
      return end >= start;
    },
    {
      message: "End time cannot be earlier than start time",
      path: ["endAt"],
    }
  );

export type EventSchemaType = z.infer<typeof eventSchema>;
