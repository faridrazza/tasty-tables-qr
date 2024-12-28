import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">RestaurantOS</div>
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-6">
            Transform Your Restaurant Operations
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline orders, delight customers, and grow your business with our
            all-in-one restaurant management platform.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Digital Menu</h3>
            <p className="text-gray-600">
              Create and update your menu instantly with our easy-to-use interface.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">QR Code Orders</h3>
            <p className="text-gray-600">
              Let customers order directly from their phones with QR code menus.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Real-time Analytics</h3>
            <p className="text-gray-600">
              Track sales, popular items, and customer trends with detailed
              analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;