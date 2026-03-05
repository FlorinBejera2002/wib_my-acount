import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { toast } from "sonner";

export function PrivacySettings() {
  const handleExportData = () => {
    // TODO: API call pentru export date
    toast.success("Cererea de export a fost trimisă. Vei primi un email cu datele.");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Confidențialitate</CardTitle>
        <CardDescription>
          Gestionare datele tale personale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Exportă datele</p>
            <p className="text-sm text-muted-foreground">
              Descarcă o copie a tuturor datelor tale personale
            </p>
          </div>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Exportă
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-destructive">Ștergere cont</p>
            <p className="text-sm text-muted-foreground">
              Șterge permanent contul și toate datele asociate
            </p>
          </div>
          <DeleteAccountDialog />
        </div>
      </CardContent>
    </Card>
  );
}
