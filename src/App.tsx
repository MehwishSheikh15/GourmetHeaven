import React from "react";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/website/Home";
import Menu from "./pages/website/Menu";
import Checkout from "./pages/website/Checkout";
import About from "./pages/website/About";
import Gallery from "./pages/website/Gallery";
import Reservation from "./pages/website/Reservation";
import Dashboard from "./pages/admin/Dashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import DealsManagement from "./pages/admin/DealsManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import AdminLayout from "./components/layout/AdminLayout";
import WebsiteLayout from "./components/layout/WebsiteLayout";
import { useUser } from "@clerk/clerk-react";
import { getUserRole, isAdmin } from "./lib/auth-utils";
import { CartProvider } from "./context/CartContext";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment.");
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const isIframe = window.self !== window.top;

  if (!isLoaded) return <div className="h-screen w-full flex items-center justify-center">Loading Authority...</div>;
  
  if (!user) {
    if (isIframe) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center text-center p-8 bg-[#F8F7F3]">
          <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl border border-stone-100">
            <h1 className="text-3xl font-serif mb-4 text-stone-800">Secure Access Required</h1>
            <p className="text-stone-600 mb-8 leading-relaxed">
              The royal chambers require a secure connection. Due to modern browser privacy restrictions (ITP/Third-party cookies), authentication cannot be completed within this preview frame.
            </p>
            <button 
              onClick={() => window.open(window.location.href, '_blank')}
              className="w-full px-8 py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Open Secure Dashboard
            </button>
            <p className="mt-6 text-xs text-stone-400 italic">
              Once logged in, your session will be active for both this preview and the new window.
            </p>
          </div>
        </div>
      );
    }
    return <RedirectToSignIn />;
  }

  const role = getUserRole(user.primaryEmailAddress?.emailAddress, user.publicMetadata);
  
  if (!isAdmin(role)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-serif mb-4 text-stone-800">403 - Forbidden</h1>
        <p className="text-stone-600 mb-6">You do not have the clearance to access the royal chambers.</p>
        <a href="/" className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition">Return Home</a>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
          {/* Website Routes */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reservations" element={<Reservation />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="deals" element={<DealsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="users" element={<UsersManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
        </BrowserRouter>
      </CartProvider>
    </ClerkProvider>
  );
}
