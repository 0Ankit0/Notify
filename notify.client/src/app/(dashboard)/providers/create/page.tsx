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
import { ProviderSchema as Provider } from "@/utils/providerSchema";
import { generateNewToken } from "@/app/api/data/UserTokens";
import { postProvider } from "@/app/api/data/Provider";

export default function CreateProviderPage() {
  const router = useRouter();
  const [newProvider, setNewProvider] = useState<
    Omit<Provider, "Id" | "CreatedAt">
  >({
    Alias: "",
    ProviderId: "",
    Token: "",
    Provider: "0",
    Secret: "",
  });

  const getSecretHint = (provider: "0" | "1" | "2") => {
    switch (provider) {
      case "0":
        return "Enter JSON with app_id and api_key";
      case "1":
        return "Enter JSON That contains the server key and other details.";
      case "2":
        return "Enter custom secret data as JSON";
    }
  };

  const handleAddProvider = () => {
    const response = postProvider(newProvider);
    router.push("/providers");
  };

  const generateApiKey = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to generate a new API key?The previous one won't work anymore."
    );
    if (userConfirmed) {
      const newToken = await generateNewToken();
      setNewProvider({ ...newProvider, Token: newToken });
    }
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
                    value={newProvider.Alias}
                    onChange={(e) =>
                      setNewProvider({ ...newProvider, Alias: e.target.value })
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
                    value={newProvider.Provider}
                    onValueChange={(value) =>
                      setNewProvider({
                        ...newProvider,
                        Provider: value as Provider["Provider"],
                      })
                    }
                  >
                    <SelectTrigger id="new-provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">OneSignal</SelectItem>
                      <SelectItem value="1">Firebase</SelectItem>
                      <SelectItem value="2">Custom WebPush</SelectItem>
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
                  <Label htmlFor="new-api-key">Token</Label>
                  <div className="flex space-x-2">
                    <ApiKeyInput
                      className="w-full"
                      apiKey={newProvider.Token}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          Token: e.target.value,
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
                    value={newProvider.Secret}
                    onChange={(e) =>
                      setNewProvider({ ...newProvider, Secret: e.target.value })
                    }
                    placeholder={getSecretHint(newProvider.Provider)}
                    className="font-mono text-sm"
                    rows={5}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getSecretHint(newProvider.Provider)}</p>
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
