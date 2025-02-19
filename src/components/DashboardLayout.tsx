
import { Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { SidebarNav } from "./sidebar/SidebarNav";

const DashboardLayout = () => {
  useRequireAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="hidden md:block">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>RestaurantOS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarNav />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 bg-gray-50 w-full">
          {/* Add padding to account for fixed mobile header */}
          <div className="pt-16 md:pt-0 min-h-screen">
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
