// components/MessageTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Message } from "@/utils/messageSchema";

type MessageTableProps = {
  messages: Message[];
  onViewDetails: (message: Message) => void;
};

const MessageTable = ({ messages, onViewDetails }: MessageTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Receiver</TableHead>
            <TableHead className="w-1/6">Message</TableHead>
            <TableHead className="w-1/6">Provider</TableHead>
            <TableHead className="w-1/6">Status</TableHead>
            <TableHead className="w-1/6">Created At</TableHead>
            <TableHead className="w-1/6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.receiver}</TableCell>
              <TableCell>{message.content}</TableCell>
              <TableCell>{message.provider}</TableCell>
              <TableCell>{message.status}</TableCell>
              <TableCell>{message.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(message)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MessageTable;
