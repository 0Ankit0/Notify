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
import { PlusCircle, Search } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import PageContainer from "@/components/layout/page-container";
import { Input } from "@/components/ui/input";
import useFilter from "@/hooks/use-filter";
import Pagination from "@/components/table-pagination";
import MessageTable from "./_components/message-table";
import { MessageSchema } from "@/utils/messageSchema";
import MessageDetailsModal from "./_components/message-details-modal";
import { add, addDays, subMonths } from "date-fns";
import { getMessages } from "@/app/api/data/Message";

export default function MessagePage() {
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  useEffect(() => {
    async function GetData() {
      const messageDetails = await getMessages();
      if (!messageDetails) {
        throw new Error("Failed to fetch message details");
      }
      setMessages(messageDetails);
    }
    GetData();
  }, []);

  const router = useRouter();
  const {
    filteredItems: filteredMessages,
    dateRange,
    setDateRange,
    selectedProviderType,
    setSelectedProviderType,
    searchTerm,
    setSearchTerm,
  } = useFilter(messages, {
    from: subMonths(new Date(), 1),
    to: addDays(new Date(), 1),
  });
  const [selectedMessage, setSelectedMessage] = useState<MessageSchema | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewDetails = (message: MessageSchema) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // const handleSave = (message: MessageSchema) => {
  //   setMessages(messages.map((m) => (m.Id === message.Id ? message : m)));
  //   setIsModalOpen(false);
  // };

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
          <Select
            value={selectedProviderType}
            onValueChange={setSelectedProviderType}
          >
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
          <div className="relative">
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <Button onClick={() => router.push("/message/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Message
          </Button>
        </div>

        <MessageTable
          messages={currentItems}
          onViewDetails={handleViewDetails}
        />

        <Pagination
          totalItems={filteredMessages.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          paginate={paginate}
          setItemsPerPage={setItemsPerPage}
        />

        <MessageDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={selectedMessage}
          // onSave={handleSave}
        />
      </div>
    </PageContainer>
  );
}
