import { Outlet, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  MenuSquare,
  QrCode,
  ClipboardList,
  BarChart,
  LogOut,
  IndianRupee,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";

const DashboardLayout = () => {
  useRequireAuth();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      title: "Create Menu",
      url: "/dashboard/create-menu",
      icon: MenuSquare,
    },
    {
      title: "QR Code",
      url: "/dashboard/qr-code",
      icon: QrCode,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ClipboardList,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart,
    },
    {
      title: "GST Settings",
      url: "/dashboard/gst-settings",
      icon: IndianRupee,
    },
  ];

  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>RestaurantOS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => navigate(item.url)}
                      >
                        <button className="w-full">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8 bg-background">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;