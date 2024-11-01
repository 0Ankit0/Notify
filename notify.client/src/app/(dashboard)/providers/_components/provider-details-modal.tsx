import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, RefreshCw } from "lucide-react";
import { ProviderSchema } from "@/utils/providerSchema";

type ProviderDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderSchema | null;
  onSave: (provider: ProviderSchema) => void;
};

const ProviderDetailsModal = ({
  isOpen,
  onClose,
  provider,
  onSave,
}: ProviderDetailsModalProps) => {
  const [currentProvider, setCurrentProvider] = useState<ProviderSchema | null>(
    provider
  );

  useEffect(() => {
    setCurrentProvider(provider);
  }, [provider]);

  const handleSave = () => {
    if (currentProvider) {
      onSave(currentProvider);
    }
  };

  const generateApiKey = () => {
    if (currentProvider) {
      const newApiKey = `${
        currentProvider.provider
      }_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentProvider({ ...currentProvider, apiKey: newApiKey });
    }
  };

  const handleSecretChange = (value: string) => {
    if (currentProvider) {
      try {
        JSON.parse(value);
        setCurrentProvider({
          ...currentProvider,
          secret: value,
        });
      } catch (e) {
        setCurrentProvider({
          ...currentProvider,
          secret: value,
        });
      }
    }
  };

  const formatJSON = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provider Details</DialogTitle>
        </DialogHeader>
        {currentProvider && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alias" className="text-right">
                Alias
              </Label>
              <Input
                id="alias"
                value={currentProvider.alias}
                onChange={(e) =>
                  setCurrentProvider({
                    ...currentProvider,
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
                  value={currentProvider.apiKey}
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
                value={currentProvider.provider}
                onValueChange={(value) =>
                  setCurrentProvider({
                    ...currentProvider,
                    provider: value as ProviderSchema["provider"],
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
                  value={formatJSON(currentProvider.secret)}
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
  );
};

export default ProviderDetailsModal;
