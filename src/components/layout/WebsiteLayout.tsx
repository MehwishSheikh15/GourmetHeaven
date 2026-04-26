import { Outlet, Link, useLocation } from "react-router-dom";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Menu, X, Instagram, Facebook, Phone, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DealsPopup from "../website/DealsPopup";
import AIChatAgent from "../shared/AIChatAgent";
import WhatsAppButton from "../shared/WhatsAppButton";
import { useCart } from "../../context/CartContext";

export default function WebsiteLayout() {
  const { itemsCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Reservations", path: "/reservations" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <DealsPopup />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-stone-200">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-stone-800">
            GOURMET <span className="text-brand-primary">HAVEN</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm tracking-widest uppercase transition-colors ${
                  location.pathname === link.path ? "text-brand-primary font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link to="/checkout" className="relative text-stone-600 hover:text-stone-900 transition-colors">
              <ShoppingBag size={20} />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            <SignedIn>
              <Link to="/admin" className="text-xs px-4 py-1.5 border border-stone-300 rounded-full hover:bg-stone-50 transition">
                Portal
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-xs px-4 py-1.5 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/checkout" className="relative text-stone-600">
              <ShoppingBag size={20} />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
            <button className="text-stone-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-stone-200 p-6 flex flex-col space-y-4"
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-serif text-stone-800 border-b border-stone-50 pb-2"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 flex items-center justify-between">
                <SignedIn>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs font-bold uppercase tracking-widest text-[#C5A059]"
                  >
                    Staff Portal
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full py-3 bg-stone-800 text-white rounded-full font-bold uppercase tracking-widest text-xs">
                      Login
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Margin */}
      <div className="h-20" />

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 px-6 border-t border-stone-800">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-white font-serif text-xl">Gourmet Haven</h3>
            <p className="text-sm leading-relaxed">
              Exquisite Pakistani and Continental fusion dining in the heart of Islamabad.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-6">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>123 Luxury Ave, Sector F-7</p>
              <p>Islamabad, Pakistan</p>
              <p className="text-brand-primary">+92 300 1234567</p>
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <Instagram size={20} className="hover:text-brand-primary cursor-pointer" />
              <Facebook size={20} className="hover:text-brand-primary cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest mb-6">Newsletter</h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-stone-800 border-none px-4 py-2 text-sm focus:ring-0 w-full"
              />
              <button className="bg-brand-primary text-white px-4 py-2 text-sm hover:bg-amber-700 transition">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-stone-800 text-center text-[10px] uppercase tracking-widest">
          &copy; 2026 Gourmet Haven. All Rights Reserved.
        </div>
      </footer>

      {/* Floating Buttons */}
      <WhatsAppButton />
      <AIChatAgent />
    </div>
  );
}
