export type Message = {
    id: string;
    receiver: string;
    content: string;
    provider: string;
    status: "sent" | "failed" | "pending";
    createdAt: Date;
  };