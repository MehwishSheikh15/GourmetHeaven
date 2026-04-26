import { motion } from "motion/react";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useState, useEffect } from "react";
import { queries, safeFetch } from "../../lib/sanity";
import { toast } from "sonner";

const stats = [
  { name: "Total Orders", value: "1,284", change: "+12.5%", icon: ShoppingBag, color: "bg-blue-500" },
  { name: "Active Users", value: "482", change: "+18.2%", icon: Users, color: "bg-green-500" },
  { name: "Revenue", value: "PKR 45.2M", change: "+24.3%", icon: TrendingUp, color: "bg-amber-500" },
  { name: "Active Deals", value: "8", change: "-2", icon: Package, color: "bg-purple-500" },
];

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const result = await safeFetch<any>(queries.orders, "orders");
        setOrders(result.slice(0, 6)); // Get only the 6 most recent
      } catch (error) {
        console.error(error);
        toast.error("The Royal Records could not be synchronized.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    
    // Simulate stats calculation loading
    const timer = setTimeout(() => setIsStatsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 pb-10 max-w-[1400px] mx-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.name}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
          >
            {isStatsLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-2 bg-slate-50 w-1/3 rounded" />
                <div className="h-8 bg-slate-100 w-2/3 rounded" />
                <div className="h-3 bg-slate-50 w-1/2 rounded-full mt-4" />
              </div>
            ) : (
              <div className="relative z-10">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1 group-hover:text-slate-600 transition-colors">{stat.name}</p>
                <p className="text-3xl font-serif text-slate-900 group-hover:text-[#C5A059] transition-colors">{stat.value}</p>
                <div className={`text-[10px] font-bold mt-3 px-2 py-0.5 rounded-full inline-flex items-center ${
                  stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.change} from last month
                </div>
              </div>
            )}
            <stat.icon className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" size={120} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main View: Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[450px]">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-serif text-xl text-slate-800">Revenue Analysis</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest bg-slate-50 border rounded hover:bg-slate-100 transition">Period</button>
              <button className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest bg-slate-50 border rounded hover:bg-slate-100 transition">Export</button>
            </div>
          </div>
          <div className="flex-1 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '11px',
                    fontFamily: 'Inter, sans-serif'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#C5A059" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Sidebar: Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[450px]">
          <div className="p-6 border-b">
            <h3 className="font-serif text-xl text-slate-800">Fresh Orders</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="p-5 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-50" />
                    <div className="space-y-2">
                       <div className="h-3 bg-slate-100 w-16 rounded" />
                       <div className="h-2 bg-slate-50 w-10 rounded" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-3 bg-slate-100 w-12 rounded ml-auto" />
                    <div className="h-2 bg-slate-50 w-8 rounded ml-auto" />
                  </div>
                </div>
              ))
            ) : orders.length > 0 ? (
              orders.map((order, i) => (
                <div key={order._id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#C5A059] group-hover:text-white transition-all">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 truncate max-w-[80px]">{order.customer?.name || "Order"}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                        {new Date(order._createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-serif font-bold text-slate-900">PKR {order.total}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 italic font-serif p-10 text-center">
                <p>No sequences found in the current record.</p>
              </div>
            )}
          </div>
          <div className="p-6 border-t bg-slate-50/50">
            <button className="w-full py-2.5 text-center text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors">
              Manage Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
