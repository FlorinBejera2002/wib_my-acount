import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Pagina nu a fost găsită</h2>
        <p className="text-muted-foreground">
          Pagina pe care o cauți nu există sau a fost mutată.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">
          <Home className="mr-2 h-4 w-4" />
          Înapoi la pagina principală
        </Link>
      </Button>
    </div>
  );
}
