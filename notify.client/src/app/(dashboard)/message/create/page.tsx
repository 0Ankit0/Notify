"use client";

import { useState } from "react";
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
import { AlertCircle, CheckCircle } from "lucide-react";

type Provider = "onesignal" | "firebase" | "custom";

export default function CreateMessagePage() {
  const router = useRouter();
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [provider, setProvider] = useState<Provider | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (!receiver || !message || !provider) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call to send message
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
    setReceiver("");
    setMessage("");
    setProvider("");
    // Navigate back to messages list
    router.push("/messages");
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Message</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="receiver">Receiver</Label>
            <Input
              id="receiver"
              type="text"
              placeholder="Enter receiver's email or ID"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select
              value={provider}
              onValueChange={(value) => setProvider(value as Provider)}
            >
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onesignal">OneSignal</SelectItem>
                <SelectItem value="firebase">Firebase</SelectItem>
                <SelectItem value="custom">Custom WebPush</SelectItem>
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
