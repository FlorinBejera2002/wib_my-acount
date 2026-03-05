import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { PolicyStatusBadge } from "./policy-status-badge";
import { usePolicies } from "@/hooks/use-policies";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Policy, TableParams } from "@/api/types";

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
      { label: "Anulată", value: "CANCELLED" },
      { label: "În așteptare", value: "PENDING" },
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

function ExpiryBadge({ days }: { days: number }) {
  if (days < 0) return null;
  if (days <= 7) {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">
        {days} zile
      </Badge>
    );
  }
  if (days <= 30) {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
        {days} zile
      </Badge>
    );
  }
  return <span className="text-sm text-muted-foreground">{days} zile</span>;
}

export function PoliciesTable() {
  const navigate = useNavigate();
  const [params, setParams] = useState<TableParams>({
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc",
    search: "",
    filters: {},
  });

  const { data, isLoading, isError, refetch } = usePolicies(params);

  const columns: ColumnDef<Policy>[] = [
    {
      accessorKey: "policyNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Număr poliță" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.policyNumber}</span>
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
      accessorKey: "premium",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Primă" />
      ),
      cell: ({ row }) => formatCurrency(row.original.premium),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PolicyStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expirare" />
      ),
      cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
      accessorKey: "daysUntilExpiry",
      header: "Zile rămase",
      cell: ({ row }) => {
        if (row.original.status !== "ACTIVE") return "—";
        return <ExpiryBadge days={row.original.daysUntilExpiry} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/policies/${row.original.id}`)}
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
