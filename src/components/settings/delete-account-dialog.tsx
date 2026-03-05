import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = confirmation === "ȘTERG CONTUL";

  const handleDelete = async () => {
    setIsDeleting(true);
    // TODO: API call pentru ștergere cont
    await new Promise((r) => setTimeout(r, 1000));
    setIsDeleting(false);
    setOpen(false);
    toast.success("Cererea de ștergere a fost trimisă");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Șterge contul</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Ștergere cont
          </DialogTitle>
          <DialogDescription>
            Această acțiune este ireversibilă. Toate datele tale vor fi șterse
            permanent, inclusiv polițele, cotațiile și istoricul.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">Atenție!</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Toate polițele active vor fi anulate</li>
              <li>Istoricul cotațiilor va fi pierdut</li>
              <li>Nu vei mai putea accesa documentele</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Scrie <span className="font-mono font-bold">ȘTERG CONTUL</span>{" "}
              pentru a confirma
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="ȘTERG CONTUL"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anulează
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se procesează...
              </>
            ) : (
              "Confirmă ștergerea"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
