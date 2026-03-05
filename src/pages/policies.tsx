import { PoliciesTable } from "@/components/policies/policies-table";

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Polițele Mele</h1>
        <p className="text-sm text-gray-400">
          Vezi și gestionează toate polițele tale de asigurare
        </p>
      </div>
      <PoliciesTable />
    </div>
  );
}
