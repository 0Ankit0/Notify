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
            <TableRow key={message.Id}>
              <TableCell>{message.Receiver}</TableCell>
              <TableCell>{message.Content}</TableCell>
              <TableCell>{message.Provider}</TableCell>
              <TableCell>{message.Status}</TableCell>
              <TableCell>{message.CreatedAt.toLocaleDateString()}</TableCell>
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
