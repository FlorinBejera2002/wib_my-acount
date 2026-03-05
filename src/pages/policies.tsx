import { PoliciesTable } from "@/components/policies/policies-table";

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Polițele Mele</h1>
        <p className="text-sm text-muted-foreground">
          Vezi și gestionează toate polițele tale de asigurare
        </p>
      </div>
      <PoliciesTable />
    </div>
  );
}
