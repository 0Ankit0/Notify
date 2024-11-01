// components/MessageDetailsModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/utils/messageSchema";

type MessageDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  onSave: (message: Message) => void;
};

const MessageDetailsModal = ({
  isOpen,
  onClose,
  message,
  onSave,
}: MessageDetailsModalProps) => {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(message);

  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  const handleSave = () => {
    if (currentMessage) {
      onSave(currentMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
        </DialogHeader>
        {currentMessage && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receiver" className="text-right">
                Receiver
              </Label>
              <Input
                id="receiver"
                value={currentMessage.receiver}
                onChange={(e) =>
                  setCurrentMessage({
                    ...currentMessage,
                    receiver: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Message
              </Label>
              <Textarea
                id="content"
                value={currentMessage.content}
                onChange={(e) =>
                  setCurrentMessage({
                    ...currentMessage,
                    content: e.target.value,
                  })
                }
                className="col-span-3"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <Input
                id="provider"
                value={currentMessage.provider}
                onChange={(e) =>
                  setCurrentMessage({
                    ...currentMessage,
                    provider: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Input
                id="status"
                value={currentMessage.status}
                readOnly
                className="col-span-3"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailsModal;
