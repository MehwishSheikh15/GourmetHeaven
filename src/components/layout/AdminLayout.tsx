import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Utensils, 
  Ticket, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { getUserRole, SUPER_ADMIN_EMAIL } from "../../lib/auth-utils";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminLayout() {
  const { user } = useUser();
  const location = useLocation();
  const role = getUserRole(user?.primaryEmailAddress?.emailAddress, user?.publicMetadata);
  const isSuperAdmin = user?.primaryEmailAddress?.emailAddress === SUPER_ADMIN_EMAIL;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "Menu Items", icon: Utensils, path: "/admin/menu" },
    { name: "Deals", icon: Ticket, path: "/admin/deals" },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Gallery", icon: ImageIcon, path: "/admin/gallery" },
    { name: "Users & Roles", icon: Users, path: "/admin/users" },
  ];

  return (
    <div className="flex h-screen bg-[#F8F7F3] text-slate-900 overflow-hidden font-sans">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 bg-[#1A1A1A] text-white flex-col shadow-2xl shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C5A059] rounded flex items-center justify-center font-bold text-black shadow-inner">G</div>
            <h1 className="font-serif text-xl tracking-wide uppercase">Gourmet Haven</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mt-2 opacity-80 font-bold">Management Console</p>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em] px-3 mb-3">Overview</p>
            <Link 
              to="/admin" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                location.pathname === "/admin" ? "bg-white/10 text-[#C5A059] shadow-inner" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard size={18} /> <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em] px-3 mb-3">Culinary Assets</p>
            <div className="space-y-1">
              {menuItems.slice(1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    location.pathname === item.path 
                      ? "bg-white/10 text-[#C5A059] shadow-inner" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="shrink-0 border-2 border-[#C5A059]/30 rounded-full p-0.5">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate text-white">{user?.firstName || "Mehwish"}</p>
              <p className="text-[9px] text-[#C5A059] uppercase font-bold tracking-tighter opacity-80">{role.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#1A1A1A] text-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#C5A059] rounded flex items-center justify-center font-bold text-black">G</div>
                  <h1 className="font-serif text-xl uppercase">Gourmet</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex-grow py-8 px-6 space-y-8 overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em] px-3">Main</p>
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        location.pathname === item.path 
                          ? "bg-[#C5A059] text-black font-bold" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="p-6 border-t border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                  <UserButton afterSignOutUrl="/" />
                  <div>
                    <p className="text-sm font-bold text-white">{user?.firstName}</p>
                    <p className="text-[10px] text-[#C5A059] uppercase font-black">{role.replace("_", " ")}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-4 border-l lg:border-none pl-4 lg:pl-0">
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded">System: Live</span>
              <div className="hidden md:block h-4 w-[1px] bg-slate-200"></div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide">CMS v3.2</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="relative cursor-pointer group hidden xs:block">
              <div className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition text-xl">
                🔔
              </div>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <Link to="/admin/menu" className="bg-slate-900 text-white text-[10px] uppercase tracking-widest font-bold px-3 sm:px-5 py-2 rounded sm:rounded-lg hover:bg-slate-800 transition shadow-lg whitespace-nowrap">
              Manage Items
            </Link>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
