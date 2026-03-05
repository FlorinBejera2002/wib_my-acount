import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  filterConfigs: FilterConfig[];
  onClearFilters: () => void;
}

export function DataTableToolbar({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  filterConfigs,
  onClearFilters,
}: DataTableToolbarProps) {
  const hasActiveFilters =
    search || Object.values(filters).some((v) => v && v !== "ALL");

  return (
    <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Caută..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterConfigs.map((config) => (
          <Select
            key={config.key}
            value={filters[config.key] || "ALL"}
            onValueChange={(value) => onFilterChange(config.key, value)}
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder={config.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toate ({config.label})</SelectItem>
              {config.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 px-2"
          >
            <X className="mr-1 h-4 w-4" />
            Șterge filtre
          </Button>
        )}
      </div>
    </div>
  );
}
