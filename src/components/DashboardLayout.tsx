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
  // Add authentication check at the layout level
  useRequireAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>RestaurantOS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarNav />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;