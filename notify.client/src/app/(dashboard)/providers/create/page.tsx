"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle, RefreshCw } from "lucide-react";
import PageContainer from "@/components/layout/page-container";
import ApiKeyInput from "../_components/api_key";

type Provider = {
  id: string;
  alias: string;
  apiKey: string;
  provider: "onesignal" | "firebase" | "custom";
  secret: string;
  createdAt: Date;
};

export default function CreateProviderPage() {
  const router = useRouter();
  const [newProvider, setNewProvider] = useState<
    Omit<Provider, "id" | "createdAt">
  >({
    alias: "",
    apiKey: "",
    provider: "onesignal",
    secret: "",
  });

  const getSecretHint = (provider: "onesignal" | "firebase" | "custom") => {
    switch (provider) {
      case "onesignal":
        return "Enter JSON with app_id and api_key";
      case "firebase":
        return "Enter JSON with project_id and server_key";
      case "custom":
        return "Enter custom secret data as JSON";
    }
  };

  const handleAddProvider = () => {
    // Here you would typically send the new provider data to your backend
    // For now, we'll just simulate adding it and navigate back to the main page
    const newProviderWithId: Provider = {
      ...newProvider,
      id: `${Date.now()}`,
      createdAt: new Date(),
    };
    console.log("New provider added:", newProviderWithId);
    router.push("/providers");
  };

  const generateApiKey = () => {
    const newApiKey = `${newProvider.provider}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setNewProvider({ ...newProvider, apiKey: newApiKey });
  };

  return (
    <PageContainer scrollable>
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-5">Add New Provider</h1>
        <div className="grid gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label htmlFor="new-alias">Alias</Label>
                  <Input
                    id="new-alias"
                    value={newProvider.alias}
                    onChange={(e) =>
                      setNewProvider({ ...newProvider, alias: e.target.value })
                    }
                    placeholder="Enter provider alias"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter a unique name for this provider</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label htmlFor="new-provider">Provider</Label>
                  <Select
                    value={newProvider.provider}
                    onValueChange={(value) =>
                      setNewProvider({
                        ...newProvider,
                        provider: value as Provider["provider"],
                      })
                    }
                  >
                    <SelectTrigger id="new-provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onesignal">OneSignal</SelectItem>
                      <SelectItem value="firebase">Firebase</SelectItem>
                      <SelectItem value="custom">Custom WebPush</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select the type of notification provider</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label htmlFor="new-api-key">API Key</Label>
                  <div className="flex space-x-2">
                    <ApiKeyInput
                      className="w-full"
                      apiKey={newProvider.apiKey}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          apiKey: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={generateApiKey}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  API Key for the provider. Click the refresh button to generate
                  a new one.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label htmlFor="new-secret">Secret</Label>
                  <Textarea
                    id="new-secret"
                    value={newProvider.secret}
                    onChange={(e) =>
                      setNewProvider({ ...newProvider, secret: e.target.value })
                    }
                    placeholder={getSecretHint(newProvider.provider)}
                    className="font-mono text-sm"
                    rows={5}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getSecretHint(newProvider.provider)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button onClick={handleAddProvider} className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>
    </PageContainer>
  );
}
