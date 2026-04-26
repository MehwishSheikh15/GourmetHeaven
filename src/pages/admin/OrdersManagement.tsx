import { useState, useEffect } from "react";
import { client, queries, safeFetch } from "../../lib/sanity";
import { Clock, CheckCircle, Package, Truck, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const result = await safeFetch<any>(queries.orders, "orders");
      setOrders(result);
    } catch (error) {
      console.warn("Order sync failed, using temporary ledger.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      toast.success(`Order status set to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to erase this record from history?")) return;
    try {
      await client.delete(orderId);
      toast.success("Order erased.");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-stone-800">Order Book</h1>
          <p className="text-stone-500 text-sm italic">Manage sequences of culinary excellence.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-stone-100 rounded-full text-xs font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-200 transition"
        >
          Refresh Ledger
        </button>
      </header>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-stone-100 p-8 h-64 animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3 w-1/3">
                  <div className="h-4 bg-stone-100 rounded-full w-24" />
                  <div className="h-6 bg-stone-100 rounded w-full" />
                </div>
                <div className="h-10 bg-stone-100 rounded-2xl w-24" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-stone-50 rounded w-full" />
                <div className="h-4 bg-stone-50 rounded w-5/6" />
                <div className="h-4 bg-stone-50 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-widest flex items-center">
                      <Clock size={12} className="mr-1.5" />
                      {new Date(order._createdAt || order.orderDate).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-brand-primary uppercase font-bold tracking-widest flex items-center">
                      {order.deliveryMethod === 'delivery' ? <Truck size={12} className="mr-1.5" /> : <Package size={12} className="mr-1.5" />}
                      {order.deliveryMethod}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-lg font-serif text-stone-800">{order.customer?.name}</h4>
                    <p className="text-xs text-stone-500">{order.customer?.phone} • {order.customer?.email}</p>
                    <p className="text-xs text-stone-400 italic">{order.customer?.address}</p>
                  </div>

                  <div className="pt-4 space-y-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Order Contents</p>
                    <div className="space-y-1 text-sm text-stone-600">
                      {order.items?.map((item: any, i: number) => (
                        <div key={item._key || i} className="flex justify-between border-b border-stone-50 py-1">
                          <span>{item.quantity}x {item.menuItem?.name || "Premium Selection"}</span>
                          <span className="font-mono text-xs">PKR {item.priceAtOrder * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 text-stone-800">
                        <span className="font-bold uppercase tracking-widest text-[10px]">Total Royalty</span>
                        <span className="font-bold text-lg">PKR {order.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end">
                  <button 
                    onClick={() => updateStatus(order._id, 'preparing')}
                    className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group"
                  >
                    <Package size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => updateStatus(order._id, 'delivered')}
                    className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all group"
                  >
                    <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => deleteOrder(order._id)}
                    className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all group"
                  >
                    <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-24 rounded-3xl border-2 border-dashed border-stone-100 text-center">
          <p className="text-stone-300 italic font-serif">The ledger is blank.</p>
        </div>
      )}
    </div>
  );
}
