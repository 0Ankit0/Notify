"use client";

import { useEffect, useState } from "react";
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
import { getProviders } from "@/app/api/data/Provider";
import { add, addDays, subMonths } from "date-fns";

export default function NotificationProvidersPage() {
  const [providers, setProviders] = useState<ProviderSchema[]>([]);
  useEffect(() => {
    async function GetData() {
      const providerDetails = await getProviders();
      if (!providerDetails) {
        throw new Error("Failed to fetch provider details");
      }
      // console.log("Fetched providers:", providerDetails);
      setProviders(providerDetails);
    }
    GetData();
  }, []);
  const router = useRouter();

  const {
    filteredItems: filteredProviders,
    dateRange,
    setDateRange,
    selectedProviderType,
    setSelectedProviderType,
    searchTerm,
    setSearchTerm,
  } = useFilter(providers, {
    from: subMonths(new Date(), 1),
    to: addDays(new Date(), 1),
  });
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderSchema | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewDetails = (provider: ProviderSchema) => {
    // console.log("Viewing details for provider:", provider);
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleSave = (provider: ProviderSchema) => {
    // console.log("Saving provider:", provider);
    setProviders((prevProviders) =>
      prevProviders.map((p) => (p.Id === provider.Id ? provider : p))
    );
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
              autoComplete="off"
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
