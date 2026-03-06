import { useLocation, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationsSlideOver } from "@/components/notifications/notifications-slide-over";
import { useState } from "react";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Panou Principal",
  "/quotes": "Cotații",
  "/policies": "Polițe",
  "/profile": "Profil",
  "/security": "Securitate",
  "/settings": "Setări",
};

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: Array<{ label: string; href: string }> = [];

  if (parts.length === 0) return crumbs;

  const firstPath = `/${parts[0]}`;
  const label = breadcrumbMap[firstPath];
  if (label) {
    crumbs.push({ label, href: firstPath });
  }

  if (parts.length > 1 && parts[1]) {
    if (parts[0] === "quotes") {
      crumbs.push({ label: `Cotație #${parts[1]}`, href: pathname });
    } else if (parts[0] === "policies") {
      crumbs.push({ label: `Poliță #${parts[1]}`, href: pathname });
    }
  }

  return crumbs;
}

export function AppHeader() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const { data: notifications } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
        <SidebarTrigger />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            Acasă
          </Link>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">/</span>
              <Link
                to={crumb.href}
                className="font-medium text-foreground"
              >
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>
      
      <NotificationsSlideOver 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
    </>
  );
}
