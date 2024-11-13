import { z } from 'zod';

export const MessageSchema = z.object({
    Id: z.string(),
    Receiver: z.string().min(1, "Receiver is required"),
    Content: z.string().min(1, "Content is required"),
    Provider: z.string().min(1, "Provider is required"),
    Status: z.enum(["sent", "failed", "pending"]),
    CreatedAt: z.date()
});

export type Message = z.infer<typeof MessageSchema>;
