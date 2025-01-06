import { useNavigate } from "react-router-dom";
import {
  MenuSquare,
  QrCode,
  ClipboardList,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SidebarNav = () => {
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
      icon: Settings,
    },
  ];

  return (
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
  );
};