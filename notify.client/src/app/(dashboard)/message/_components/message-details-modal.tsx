// components/MessageDetailsModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSchema as Message } from "@/utils/messageSchema";

type MessageDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  // onSave: (message: Message) => void;
};

const MessageDetailsModal = ({
  isOpen,
  onClose,
  message,
}: // onSave,
MessageDetailsModalProps) => {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(message);

  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Fill in the details for the message below.
        </DialogDescription>
        {currentMessage && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Receiver" className="text-center">
                Receiver
              </Label>
              <Input
                id="Receiver"
                value={currentMessage.Receiver}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Content" className="text-center">
                Message
              </Label>
              <Textarea
                id="Content"
                value={currentMessage.Content}
                readOnly
                className="col-span-3"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Provider" className="text-center">
                Provider
              </Label>
              <Input
                id="Provider"
                value={currentMessage.Provider}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Status" className="text-center">
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
        {/* <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailsModal;
