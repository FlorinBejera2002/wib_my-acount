import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-zinc-50/40">
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-4 pt-8 lg:p-8 lg:pt-12">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
