export type ProviderSchema = {
    id: string;
    alias: string;
    apiKey: string;
    provider: "onesignal" | "firebase" | "custom";
    secret: string;
    createdAt: Date;
  };