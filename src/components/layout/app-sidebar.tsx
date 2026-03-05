import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Shield,
  User,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import icon from "@/assets/Icon.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const navItems = [
  {
    label: "Panou Principal",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Cotații",
    href: "/quotes",
    icon: ClipboardList,
    countKey: "totalQuotes" as const,
  },
  {
    label: "Polițe",
    href: "/policies",
    icon: FileText,
    countKey: "activePolicies" as const,
  },
];

const accountItems = [
  {
    label: "Profil",
    href: "/profile",
    icon: User,
  },
  {
    label: "Securitate",
    href: "/security",
    icon: Shield,
  },
  {
    label: "Setări",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: stats } = useDashboardStats();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`
    : "??";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-200 bg-white"
    >
      <SidebarHeader className="p-[0.600rem]">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center" >
          <img
            src={logo}
            alt="asigurari.ro"
            className="h-9 w-6/7 group-data-[collapsible=icon]:hidden"
          />
          <img
            src={icon}
            alt="asigurari.ro"
            className="hidden h-9 w-9 shrink-0 group-data-[collapsible=icon]:block"
          />
        </div>
      </SidebarHeader>

      <Separator className="bg-gray-200 group-data-[collapsible=icon]:mx-2" />

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-2 overflow-auto hide-scrollbar pt-2">
        <SidebarGroup className="space-y-1 p-0">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-2 group-data-[collapsible=icon]:hidden">
            Navigare
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                const count = item.countKey && stats
                  ? stats[item.countKey]
                  : undefined;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.href)}
                      tooltip={item.label}
                    >
                      <item.icon className="min-w-5 min-h-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                      <span className="flex-1 font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                      {count !== undefined && (
                        <Badge
                          className="ml-auto h-5 min-w-[20px] justify-center rounded-full bg-accent-green/15 px-1.5 text-[11px] font-semibold text-accent-green group-data-[collapsible=icon]:hidden"
                        >
                          {count}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="space-y-1 p-0">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-2 group-data-[collapsible=icon]:hidden">
            Cont
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {accountItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.href)}
                      tooltip={item.label}
                    >
                      <item.icon className="min-w-5 min-h-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-3">
        <Separator className="mb-3 bg-gray-200" />
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-accent-green text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : ""}
            </span>
            <span className="truncate text-xs text-gray-500">
              {user?.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors group-data-[collapsible=icon]:hidden"
            title="Deconectare"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-accent-green/30 after:transition-colors after:duration-200" />
    </Sidebar>
  );
}
