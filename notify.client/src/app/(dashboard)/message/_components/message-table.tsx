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
import { MessageSchema as Message } from "@/utils/messageSchema";
import { Badge } from "@/components/ui/badge";

type MessageTableProps = {
  messages: Message[];
  onViewDetails: (message: Message) => void;
};

const MessageTable = ({ messages, onViewDetails }: MessageTableProps) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "failed":
        return "bg-red-600 text-white hover:bg-red-300";
      case "sent":
        return "bg-green-600 text-white hover:bg-green-300";
      default:
        return "bg-blue-600 text-white hover:bg-blue-300";
    }
  };
  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Receiver</TableHead>
            <TableHead className="w-1/6">Title</TableHead>
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
              <TableCell>{message.Title}</TableCell>
              <TableCell>
                {" "}
                {message.Content.length > 10
                  ? `${message.Content.substring(0, 10)}...`
                  : message.Content}
              </TableCell>
              <TableCell>{message.Provider}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeClass(message.Status)}>
                  {message.Status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(message.CreatedAt).toString()}</TableCell>
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
