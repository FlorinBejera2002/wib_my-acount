import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { InsuranceTypeBadge } from "@/components/ui/insurance-type-badge";
import { PolicyStatusBadge } from "./policy-status-badge";
import { usePolicies } from "@/hooks/use-policies";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Policy, TableParams } from "@/api/types";

const filterConfigs = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Activ", value: "ACTIVE" },
      { label: "Expirat", value: "EXPIRED" },
      { label: "Anulat", value: "CANCELLED" },
      { label: "În așteptare", value: "PENDING" },
    ],
  },
  {
    key: "type",
    label: "Tip",
    options: [
      { label: "RCA", value: "RCA" },
      { label: "CASCO", value: "CASCO" },
      { label: "CASCO Econom", value: "CASCO_ECONOM" },
      { label: "Locuință PAD", value: "LOCUINTA_PAD" },
      { label: "Locuință Facultativă", value: "LOCUINTA_FACULTATIVA" },
      { label: "Călătorie", value: "CALATORIE" },
      { label: "Asistență Rutieră", value: "ASISTENTA_RUTIERA" },
      { label: "Malpraxis", value: "MALPRAXIS" },
      { label: "Sănătate", value: "SANATATE" },
      { label: "Accidente Călători", value: "ACCIDENTE_CALATORI" },
      { label: "Accidente Persoane", value: "ACCIDENTE_PERSOANE" },
      { label: "Accidente Taxi", value: "ACCIDENTE_TAXI" },
      { label: "CMR", value: "CMR" },
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
    limit: 9999,
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
      cell: ({ row }) => <InsuranceTypeBadge type={row.original.type} />,
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
  ];

  const handleSearchChange = (search: string) => {
    setParams((prev) => ({ ...prev, search }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value === "ALL" ? "" : value,
      },
    }));
  };

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
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
        data={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        onRowClick={(row: Policy) => navigate(`/policies/${row.id}`)}
      />

    </div>
  );
}
