import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSchema } from "@/utils/messageSchema";
import axios from "axios";
import { getRecentMessages } from "@/app/api/data/Message";

export function RecentMessages() {
  const [messages, setMessages] = useState<MessageSchema[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getRecentMessages();
        setMessages(response);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="space-y-8">
      {messages.map((message) => (
        <div key={message.Id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>{message.Provider[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {message.Receiver}
            </p>
            <p className="text-sm text-muted-foreground">{message.Content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
