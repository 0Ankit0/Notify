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
              <Label htmlFor="Receiver" className="text-right">
                Receiver
              </Label>
              <Input
                id="Receiver"
                value={currentMessage.Receiver}
                onChange={(e) =>
                  setCurrentMessage({
                    ...currentMessage,
                    Receiver: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Content" className="text-right">
                Message
              </Label>
              <Textarea
                id="Content"
                value={currentMessage.Content}
                onChange={(e) =>
                  setCurrentMessage({
                    ...currentMessage,
                    Content: e.target.value,
                  })
                }
                className="col-span-3"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Provider" className="text-right">
                Provider
              </Label>
              <Input
                id="Provider"
                value={currentMessage.Provider}
                onChange={(e) =>
                  setCurrentMessage({
                    ...currentMessage,
                    Provider: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Status" className="text-right">
                Status
              </Label>
              <Input
                id="Status"
                value={currentMessage.Status}
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
