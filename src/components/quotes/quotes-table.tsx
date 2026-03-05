import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { QuoteStatusBadge } from "./quote-status-badge";
import { useQuotes } from "@/hooks/use-quotes";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Quote, TableParams } from "@/api/types";

const typeLabels: Record<string, string> = {
  RCA: "RCA",
  CASCO: "CASCO",
  LOCUINTA: "Locuință",
  CALATORIE: "Călătorie",
  VIATA: "Viață",
};

const filterConfigs = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Activă", value: "ACTIVE" },
      { label: "Expirată", value: "EXPIRED" },
      { label: "Convertită", value: "CONVERTED" },
      { label: "Schiță", value: "DRAFT" },
    ],
  },
  {
    key: "type",
    label: "Tip",
    options: [
      { label: "RCA", value: "RCA" },
      { label: "CASCO", value: "CASCO" },
      { label: "Locuință", value: "LOCUINTA" },
      { label: "Călătorie", value: "CALATORIE" },
      { label: "Viață", value: "VIATA" },
    ],
  },
];

export function QuotesTable() {
  const navigate = useNavigate();
  const [params, setParams] = useState<TableParams>({
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc",
    search: "",
    filters: {},
  });

  const { data, isLoading, isError, refetch } = useQuotes(params);

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: "quoteNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Număr cotație" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.quoteNumber}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Tip",
      cell: ({ row }) => typeLabels[row.original.type] || row.original.type,
    },
    {
      accessorKey: "insurerName",
      header: "Asigurător",
    },
    {
      accessorKey: "vehicleOrProperty",
      header: "Obiect asigurat",
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate block">
          {row.original.vehicleOrProperty || "—"}
        </span>
      ),
    },
    {
      accessorKey: "premium",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Primă" />
      ),
      cell: ({ row }) => formatCurrency(row.original.premium),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <QuoteStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dată creare" />
      ),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/quotes/${row.original.id}`)}
          aria-label="Vezi detalii"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleSearchChange = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      filters: {
        ...prev.filters,
        [key]: value === "ALL" ? "" : value,
      },
    }));
  };

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: "",
      filters: {},
    }));
  };

  return (
    <div>
      <DataTableToolbar
        search={params.search || ""}
        onSearchChange={handleSearchChange}
        filters={params.filters || {}}
        onFilterChange={handleFilterChange}
        filterConfigs={filterConfigs}
        onClearFilters={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      {data?.meta && (
        <DataTablePagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.totalPages}
          totalItems={data.meta.totalItems}
          itemsPerPage={data.meta.itemsPerPage}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          onPageSizeChange={(limit) =>
            setParams((prev) => ({ ...prev, limit, page: 1 }))
          }
        />
      )}
    </div>
  );
}
