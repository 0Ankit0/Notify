import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Adjust the import based on your icon library
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ApiKeyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  apiKey: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, ...props }) => {
  const [isSecretVisible, setIsSecretVisible] = useState(false);

  const toggleSecretVisibility = () => {
    setIsSecretVisible((prev) => !prev);
  };

  return (
    <div className="flex">
      <Input
        type={isSecretVisible ? "text" : "password"}
        value={apiKey}
        {...props}
      />
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
