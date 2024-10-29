"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Save, RefreshCw } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { addDays, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import PageContainer from "@/components/layout/page-container";
import { Textarea } from "@/components/ui/textarea";
import ApiKeyInput from "./_components/api_key";

type Provider = {
  id: string;
  alias: string;
  apiKey: string;
  provider: "onesignal" | "firebase" | "custom";
  secret: string;
  createdAt: Date;
};

const initialProviders: Provider[] = [
  {
    id: "1",
    alias: "OneSignal App",
    apiKey: "os_api_key_123",
    provider: "onesignal",
    secret: JSON.stringify({
      app_id: "os_app_id_123",
      api_key: "os_secret_123",
    }),
    createdAt: new Date("2024-10-15"),
  },
  {
    id: "2",
    alias: "Firebase Project",
    apiKey: "fb_api_key_456",
    provider: "firebase",
    secret: JSON.stringify({
      project_id: "fb_project_id_456",
      server_key: "fb_secret_456",
    }),
    createdAt: new Date("2024-10-20"),
  },
  {
    id: "3",
    alias: "Custom WebPush",
    apiKey: "wp_api_key_789",
    provider: "custom",
    secret: JSON.stringify({ custom: "custom_secret_789" }),
    createdAt: new Date("2024-10-10"),
  },
];

export default function NotificationProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [filteredProviders, setFilteredProviders] =
    useState<Provider[]>(providers);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: parseISO("2024-09-01"),
    to: parseISO("2024-10-31"),
  });
  const [selectedProviderType, setSelectedProviderType] =
    useState<string>("all");

  useEffect(() => {
    const filtered = providers.filter((provider) => {
      const isInDateRange =
        dateRange?.from && dateRange?.to
          ? provider.createdAt >= dateRange.from &&
            provider.createdAt <= addDays(dateRange.to, 1)
          : true;
      const matchesProviderType =
        selectedProviderType === "all" ||
        provider.provider === selectedProviderType;
      return isInDateRange && matchesProviderType;
    });
    setFilteredProviders(filtered);
  }, [providers, dateRange, selectedProviderType]);

  const handleViewDetails = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedProvider) {
      setProviders(
        providers.map((p) =>
          p.id === selectedProvider.id ? selectedProvider : p
        )
      );
      setIsModalOpen(false);
    }
  };

  const generateApiKey = () => {
    if (selectedProvider) {
      const newApiKey = `${
        selectedProvider.provider
      }_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSelectedProvider({ ...selectedProvider, apiKey: newApiKey });
    }
  };
  const formatJSON = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };
  const handleSecretChange = (value: string) => {
    if (selectedProvider) {
      try {
        // Attempt to parse and re-stringify to validate JSON
        JSON.parse(value);
        setSelectedProvider({
          ...selectedProvider,
          secret: value,
        });
      } catch (e) {
        // If it's not valid JSON, just set the value as is
        setSelectedProvider({
          ...selectedProvider,
          secret: value,
        });
      }
    }
  };
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
        </div>

        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">Alias</TableHead>
                <TableHead className="w-1/6">API Key</TableHead>
                <TableHead className="w-1/6">Provider</TableHead>
                <TableHead className="w-1/6">Secret</TableHead>
                <TableHead className="w-1/6">Created At</TableHead>
                <TableHead className="w-1/6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.alias}</TableCell>
                  <TableCell className=" flex">
                    <ApiKeyInput apiKey={provider.apiKey}></ApiKeyInput>
                  </TableCell>
                  <TableCell>{provider.provider}</TableCell>
                  <TableCell>{"•".repeat(10)}</TableCell>
                  <TableCell>
                    {provider.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(provider)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
            </DialogHeader>
            {selectedProvider && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="alias" className="text-right">
                    Alias
                  </Label>
                  <Input
                    id="alias"
                    value={selectedProvider.alias}
                    onChange={(e) =>
                      setSelectedProvider({
                        ...selectedProvider,
                        alias: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiKey" className="text-right">
                    API Key
                  </Label>
                  <div className="col-span-3 flex">
                    <Input
                      id="apiKey"
                      value={selectedProvider.apiKey}
                      readOnly
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={generateApiKey}
                      className="ml-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="provider" className="text-right">
                    Provider
                  </Label>
                  <Select
                    value={selectedProvider.provider}
                    onValueChange={(value) =>
                      setSelectedProvider({
                        ...selectedProvider,
                        provider: value as Provider["provider"],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onesignal">OneSignal</SelectItem>
                      <SelectItem value="firebase">Firebase</SelectItem>
                      <SelectItem value="custom">Custom WebPush</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="secret" className="text-right">
                    Secret
                  </Label>
                  <div className="col-span-3 flex">
                    <Textarea
                      id="secret"
                      value={formatJSON(selectedProvider.secret)}
                      onChange={(e) => handleSecretChange(e.target.value)}
                      className="font-mono text-sm"
                      rows={10}
                      style={{ minHeight: "150px", resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
