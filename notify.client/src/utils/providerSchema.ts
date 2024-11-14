import { z } from 'zod';

export const provider = z.object({
    Id: z.string(),
    Alias: z.string().min(1, "Receiver is required"),
    Token: z.string().min(1, "Receiver is required"),
    Secret: z.string().min(1, "Content is required"),
    Provider: z.enum(["onesignal", "firebase", "custom"]),
    CreatedAt: z.date()
});

export type ProviderSchema = z.infer<typeof provider>;

export const providerRes = z.object({
    id: z.string(),
    alias: z.string().min(1, "Receiver is required"),
    token: z.string().min(1, "Receiver is required"),
    secret: z.string().min(1, "Content is required"),
    provider: z.enum(["onesignal", "firebase", "custom"]),
    createdAt: z.date()
});

export type ProviderResponseSchema = z.infer<typeof providerRes>;
