import { z } from 'zod';

export const provider = z.object({
    Id: z.string(),
    ProviderId: z.string(),
    Alias: z.string().min(1, "Receiver is required"),
    Token: z.string().min(1, "Receiver is required"),
    Secret: z.string().min(1, "Content is required"),
    Provider: z.string(),
    CreatedAt: z.date()
});

export const providerSave = z.object({
    ProviderId: z.string(),
    Alias: z.string().min(1, "Receiver is required"),
    Token: z.string().min(1, "Receiver is required"),
    Secret: z.string().min(1, "Content is required"),
    Provider: z.number(),
    CreatedAt: z.date()
});

export type ProviderSchema = z.infer<typeof provider>;
export type ProviderSaveSchema = z.infer<typeof providerSave>;