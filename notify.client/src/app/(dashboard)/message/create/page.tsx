"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PageContainer from "@/components/layout/page-container";
import { CheckCircle } from "lucide-react";
import { postMessage } from "@/app/api/data/Message";
import { MessageSaveSchema, MessageSchema } from "@/utils/messageSchema";
import { getProviders } from "@/app/api/data/Provider";
import { ProviderSchema } from "@/utils/providerSchema";

export default function CreateMessagePage() {
  const router = useRouter();
  const [messageData, setMessageData] = useState<
    Omit<MessageSchema, "Id" | "CreatedAt">
  >({
    Receiver: "",
    Content: "",
    Title: "",
    Provider: "",
    Status: "pending",
  });
  const [providers, setProviders] = useState<ProviderSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    async function GetData() {
      const providerDetails = await getProviders();
      if (!providerDetails) {
        throw new Error("Failed to fetch provider details");
      }
      // console.log("Fetched providers:", providerDetails);
      setProviders(providerDetails);
    }
    GetData();
  }, []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setMessageData({ ...messageData, [id]: value });
  };

  const handleProviderChange = (value: string) => {
    setMessageData({ ...messageData, Provider: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (
      !messageData.Receiver ||
      !messageData.Content ||
      !messageData.Provider
    ) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const MessagePost: MessageSaveSchema = {
        Receiver: messageData.Receiver,
        Content: messageData.Content,
        Provider: parseInt(messageData.Provider),
      };
      const response = await postMessage(messageData);
      console.log("Message sent:", response);
      if (!response) {
        setError("Failed to send message. Please try again.");
      }
      setIsConfirmationOpen(true);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    // Reset form
    setMessageData({
      Receiver: "",
      Content: "",
      Title: "",
      Provider: "",
      Status: "pending",
    });
    // Navigate back to messages list
    router.push("/messages");
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Message</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="Receiver">Receiver</Label>
            <Input
              id="Receiver"
              type="text"
              placeholder="Enter receiver's Token"
              value={messageData.Receiver}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="Title">Title</Label>
            <Input
              id="Title"
              type="text"
              placeholder="Enter Title of the message"
              value={messageData.Title}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="Content">Message</Label>
            <Textarea
              id="Content"
              placeholder="Type your message here"
              value={messageData.Content}
              onChange={handleInputChange}
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="Provider">Provider</Label>
            <Select
              value={messageData.Provider}
              onValueChange={handleProviderChange}
            >
              <SelectTrigger id="Provider">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.Id} value={provider.Token}>
                    {provider.Alias}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>

        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message Sent Successfully</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center py-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="text-center">
              Your message has been sent successfully.
            </p>
            <DialogFooter>
              <Button onClick={handleConfirmationClose} className="w-full">
                Back to Messages
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
