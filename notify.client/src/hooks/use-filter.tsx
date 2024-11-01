"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

type FilterableItem = {
  createdAt: Date;
  provider: string;
};

const useFilter = <T extends FilterableItem>(
  items: T[],
  initialDateRange: DateRange
) => {
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange
  );
  const [selectedProviderType, setSelectedProviderType] =
    useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = items.filter((item) => {
      const isInDateRange =
        dateRange?.from && dateRange?.to
          ? item.createdAt >= dateRange.from &&
            item.createdAt <= addDays(dateRange.to, 1)
          : true;
      const matchesProviderType =
        selectedProviderType === "all" ||
        item.provider === selectedProviderType;
      const matchesSearch = item.provider
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return isInDateRange && matchesProviderType && matchesSearch;
    });
    setFilteredItems(filtered);
  }, [items, dateRange, selectedProviderType, searchTerm]);

  return {
    filteredItems,
    dateRange,
    setDateRange,
    selectedProviderType,
    setSelectedProviderType,
    searchTerm,
    setSearchTerm,
  };
};

export default useFilter;
