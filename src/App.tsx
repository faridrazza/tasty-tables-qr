
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardLayout from "./components/DashboardLayout";
import MenuPage from "./pages/MenuPage";
import CreateMenu from "./pages/dashboard/CreateMenu";
import QRCode from "./pages/dashboard/QRCode";
import Orders from "./pages/dashboard/Orders";
import Analytics from "./pages/dashboard/Analytics";
import GSTSettings from "./pages/dashboard/GSTSettings";
import AIChatQR from "./pages/dashboard/AIChatQR";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="create-menu" element={<CreateMenu />} />
              <Route path="qr-code" element={<QRCode />} />
              <Route path="ai-chat-qr" element={<AIChatQR />} />
              <Route path="orders" element={<Orders />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="gst-settings" element={<GSTSettings />} />
            </Route>
            <Route path="/menu/:restaurantId" element={<MenuPage />} />
            <Route path="/chat/:restaurantId" element={<ChatPage />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
