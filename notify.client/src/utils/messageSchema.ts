import { z } from 'zod';

export const Message = z.object({
    Id: z.string(),
    Receiver: z.string().min(1, "Receiver is required"),
    Content: z.string().min(1, "Content is required"),
    Title: z.string(),
    Provider: z.string().min(1, "Provider is required"),
    Status: z.enum(["sent", "failed", "pending"]),
    CreatedAt: z.date()
});

const MessageReport = z.object({
    SuccessCount: z.number(),
    FailedCount: z.number(),
    Date: z.date()
});

const MessageProviderReport = z.object({
    Provider: z.string(),
    TotalMessages: z.number(),
    SuccessCount: z.number(),
    FailedCount: z.number(),
    fill: z.string()
});

export type MessageProviderReportSchema = z.infer<typeof MessageProviderReport>;
export type MessageReportSchema = z.infer<typeof MessageReport>;
const MessageSave = Message.omit({ Id: true, CreatedAt: true,Status:true });
export type MessageSchema = z.infer<typeof Message>;
export type MessageSaveSchema = z.infer<typeof MessageSave>;