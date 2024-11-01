"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { addDays, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import PageContainer from "@/components/layout/page-container";

type Message = {
  id: string;
  receiver: string;
  message: string;
  provider: string;
  status: "sent" | "failed" | "pending";
  createdAt: Date;
};

const initialMessages: Message[] = [
  {
    id: "1",
    receiver: "user1@example.com",
    message: "Hello, this is a test message.",
    provider: "onesignal",
    status: "sent",
    createdAt: new Date("2024-10-15"),
  },
  {
    id: "2",
    receiver: "user2@example.com",
    message: "Another test message for a different user.",
    provider: "firebase",
    status: "pending",
    createdAt: new Date("2024-10-20"),
  },
  {
    id: "3",
    receiver: "user3@example.com",
    message: "This message failed to send.",
    provider: "custom",
    status: "failed",
    createdAt: new Date("2024-10-10"),
  },
];

type BadgeVariant = "success" | "destructive" | "warning";
const StatusBadge = ({ status }: { status: Message["status"] }) => {
  const variant: BadgeVariant = {
    sent: "success",
    failed: "destructive",
    pending: "warning",
  }[status] as BadgeVariant;

  return <Badge variant={variant}>{status}</Badge>;
};

export default function MessagePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(messages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: parseISO("2024-09-01"),
    to: parseISO("2024-10-31"),
  });
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const filtered = messages.filter((message) => {
      const isInDateRange =
        dateRange?.from && dateRange?.to
          ? message.createdAt >= dateRange.from &&
            message.createdAt <= addDays(dateRange.to, 1)
          : true;
      const matchesProvider =
        selectedProvider === "all" || message.provider === selectedProvider;
      const matchesStatus =
        selectedStatus === "all" || message.status === selectedStatus;
      const matchesSearch =
        message.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      return isInDateRange && matchesProvider && matchesStatus && matchesSearch;
    });
    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [messages, dateRange, selectedProvider, selectedStatus, searchTerm]);

  const handleViewDetails = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMessages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <PageContainer scrollable>
      <div className="w-full max-w-full min-w-full">
        <h1 className="text-2xl font-bold mb-5">Messages</h1>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="onesignal">OneSignal</SelectItem>
              <SelectItem value="firebase">Firebase</SelectItem>
              <SelectItem value="custom">Custom WebPush</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receiver</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.receiver}</TableCell>
                  <TableCell>{message.message.substring(0, 50)}...</TableCell>
                  <TableCell>{message.provider}</TableCell>
                  <TableCell>
                    <StatusBadge status={message.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(message)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            {Array.from(
              { length: Math.ceil(filteredMessages.length / itemsPerPage) },
              (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className="mx-1"
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              )
            )}
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="receiver" className="text-right">
                    Receiver
                  </Label>
                  <Input
                    id="receiver"
                    value={selectedMessage.receiver}
                    readOnly
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">
                    Message
                  </Label>
                  <Input
                    id="message"
                    value={selectedMessage.message}
                    readOnly
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="provider" className="text-right">
                    Provider
                  </Label>
                  <Input
                    id="provider"
                    value={selectedMessage.provider}
                    readOnly
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <div className="col-span-3">
                    <StatusBadge status={selectedMessage.status} />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="createdAt" className="text-right">
                    Created At
                  </Label>
                  <Input
                    id="createdAt"
                    value={selectedMessage.createdAt.toLocaleString()}
                    readOnly
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
