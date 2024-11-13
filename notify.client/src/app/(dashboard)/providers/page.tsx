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
import { PlusCircle, Search } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import PageContainer from "@/components/layout/page-container";
import { Input } from "@/components/ui/input";
import useFilter from "@/hooks/use-filter";
import Pagination from "@/components/table-pagination";
import ProviderDetailsModal from "./_components/provider-details-modal";
import ProviderTable from "./_components/provider-table";
import { ProviderSchema } from "@/utils/providerSchema";

const initialProviders: ProviderSchema[] = [
  {
    Id: "1",
    Alias: "OneSignal App",
    Token: "os_api_key_123",
    Provider: "onesignal",
    secret: JSON.stringify({
      app_id: "os_app_id_123",
      api_key: "os_secret_123",
    }),
    CreatedAt: new Date("2024-10-15"),
  },
  {
    Id: "2",
    Alias: "Firebase Project",
    Token: "fb_api_key_456",
    Provider: "firebase",
    Secret: JSON.stringify({
      project_id: "fb_project_id_456",
      server_key: "fb_secret_456",
    }),
    CreatedAt: new Date("2024-10-20"),
  },
  {
    Id: "3",
    Alias: "Custom WebPush",
    Token: "wp_api_key_789",
    Provider: "custom",
    Secret: JSON.stringify({ custom: "custom_secret_789" }),
    CreatedAt: new Date("2024-10-10"),
  },
];

export default function NotificationProvidersPage() {
  const router = useRouter();
  const [providers, setProviders] =
    useState<ProviderSchema[]>(initialProviders);
  const {
    filteredItems: filteredProviders,
    dateRange,
    setDateRange,
    selectedProviderType,
    setSelectedProviderType,
    searchTerm,
    setSearchTerm,
  } = useFilter(providers, {
    from: new Date("2024-09-01"),
    to: new Date("2024-10-31"),
  });
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderSchema | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewDetails = (provider: ProviderSchema) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleSave = (provider: ProviderSchema) => {
    setProviders(providers.map((p) => (p.id === provider.id ? provider : p)));
    setIsModalOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProviders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <PageContainer scrollable>
      <div className="w-full max-w-full min-w-full">
        <h1 className="text-2xl font-bold mb-5">Notification Providers</h1>

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
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <Button onClick={() => router.push("/providers/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
        </div>

        <ProviderTable
          providers={currentItems}
          onViewDetails={handleViewDetails}
        />

        <Pagination
          totalItems={filteredProviders.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          paginate={paginate}
          setItemsPerPage={setItemsPerPage}
        />

        <ProviderDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          provider={selectedProvider}
          onSave={handleSave}
        />
      </div>
    </PageContainer>
  );
}
