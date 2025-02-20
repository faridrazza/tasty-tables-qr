
import { useNavigate } from "react-router-dom";
import {
  MenuSquare,
  QrCode,
  ClipboardList,
  BarChart,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const SidebarNav = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

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
      title: "AI Chat QR",
      url: "/dashboard/ai-chat-qr",
      icon: MessageSquare,
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

  const handleNavigation = (url: string) => {
    navigate(url);
    setOpen(false);
  };

  // Mobile navigation component
  const MobileNav = () => (
    <>
      {/* Fixed mobile header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b md:hidden z-40 flex items-center px-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setOpen(true)}
          className="mr-3"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold text-primary">RestaurantOS</h1>
      </div>

      {/* Mobile slide-out menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full bg-white">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-primary">RestaurantOS</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.url)}
                  className="flex items-center w-full px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3 text-primary" />
                  {item.title}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-left text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );

  return (
    <>
      <MobileNav />
      <div className="hidden md:block">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                onClick={() => handleNavigation(item.url)}
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
      </div>
    </>
  );
};
