import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
    DialogHeader,
    DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateNewToken } from "@/app/api/data/UserTokens";
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
      console.log("Saving provider from modal:", currentProvider);
      onSave(currentProvider);
    }
  };

  const generateToken = async () => {
    if (currentProvider) {
      const newToken = await generateNewToken();
      setCurrentProvider({ ...currentProvider, Token: newToken });
    }
  };

  const handleSecretChange = (value: string) => {
    if (currentProvider) {
      try {
        JSON.parse(value);
        setCurrentProvider({
          ...currentProvider,
          Secret: value,
        });
      } catch (e) {
        setCurrentProvider({
          ...currentProvider,
          Secret: value,
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
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Provider Details</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                  Fill in the details for the provider below.
              </DialogDescription>
        {currentProvider && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Alias" className="text-center">
                Alias
              </Label>
              <Input
                id="Alias"
                value={currentProvider.Alias}
                onChange={(e) =>
                  setCurrentProvider({
                    ...currentProvider,
                    Alias: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Token" className="text-center">
                API Key
              </Label>
              <div className="col-span-3 flex">
                <Input
                  id="Token"
                  value={currentProvider.Token}
                  readOnly
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateToken}
                  className="ml-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Provider" className="text-center">
                Provider
              </Label>
              <Select
                value={currentProvider.Provider}
                onValueChange={(value) =>
                  setCurrentProvider({
                    ...currentProvider,
                    Provider: value as ProviderSchema["Provider"],
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
              <Label htmlFor="Secret" className="text-center">
                Secret
              </Label>
              <div className="col-span-3 flex">
                <Textarea
                  id="Secret"
                  value={formatJSON(currentProvider.Secret)}
                  onChange={(e) => handleSecretChange(e.target.value)}
                  className="font-mono text-sm"
                  rows={10}
                  style={{ minHeight: "200px", resize: "vertical" }}
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
