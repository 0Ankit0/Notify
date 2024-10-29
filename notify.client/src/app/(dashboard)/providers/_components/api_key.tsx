import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Adjust the import based on your icon library
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ApiKeyInput = ({ apiKey }: { apiKey: string }) => {
  const [isSecretVisible, setIsSecretVisible] = useState(false);

  const toggleSecretVisibility = () => {
    setIsSecretVisible((prev) => !prev);
  };

  return (
    <div className="flex">
      <Input type={isSecretVisible ? "text" : "password"} value={apiKey} />
      <Button variant="outline" size="icon" onClick={toggleSecretVisibility}>
        {isSecretVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ApiKeyInput;
