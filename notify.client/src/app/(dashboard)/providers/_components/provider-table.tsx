// components/ProviderTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ApiKeyInput from "./api_key";
import { ProviderSchema } from "@/utils/providerSchema";

type ProviderTableProps = {
  providers: ProviderSchema[];
  onViewDetails: (provider: ProviderSchema) => void;
};

const ProviderTable = ({ providers, onViewDetails }: ProviderTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Alias</TableHead>
            <TableHead className="w-1/6">Token</TableHead>
            <TableHead className="w-1/6">Provider</TableHead>
            <TableHead className="w-1/6">Secret</TableHead>
            <TableHead className="w-1/6">Created At</TableHead>
            <TableHead className="w-1/6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.Id}>
              <TableCell>{provider.Alias}</TableCell>
              <TableCell className="flex">
                <ApiKeyInput apiKey={provider.Token}></ApiKeyInput>
              </TableCell>
              <TableCell>{provider.Provider}</TableCell>
              <TableCell>{"•".repeat(10)}</TableCell>
              <TableCell>{provider.CreatedAt.toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(provider)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProviderTable;
