import { z } from 'zod';

export const MessageSchema = z.object({
    id: z.string(),
    receiver: z.string().min(1, "Receiver is required"),
    content: z.string().min(1, "Content is required"),
    provider: z.string().min(1, "Provider is required"),
    status: z.enum(["sent", "failed", "pending"]),
    createdAt: z.date()
});

export type Message = z.infer<typeof MessageSchema>;
