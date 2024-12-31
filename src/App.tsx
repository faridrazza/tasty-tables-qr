import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import CreateMenu from "@/pages/dashboard/CreateMenu";
import QRCode from "@/pages/dashboard/QRCode";
import Orders from "@/pages/dashboard/Orders";
import Analytics from "@/pages/dashboard/Analytics";
import GSTSettings from "@/pages/dashboard/GSTSettings";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import MenuPage from "@/pages/MenuPage";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/menu/:restaurantId",
    element: <MenuPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "create-menu",
        element: <CreateMenu />,
      },
      {
        path: "qr-code",
        element: <QRCode />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "gst-settings",
        element: <GSTSettings />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;