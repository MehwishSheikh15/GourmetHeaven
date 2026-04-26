import { useState, useEffect } from "react";
import { client, queries, urlFor, MOCK_DATA, safeFetch } from "../../lib/sanity";
import { 
  Plus, 
  Search, 
  Trash2, 
  Sparkles,
  Calendar,
  Tag,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function DealsManagement() {
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const result = await safeFetch<any>(queries.activeDeals, "deals");
      setDeals(result);
    } catch (error) {
      console.error(error);
      toast.error("Failed to retrieve active promotions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const deleteDeal = async (id: string) => {
    if (!confirm("Are you sure you want to retire this promotion?")) return;
    setIsDeleting(id);
    try {
      await client.delete(id);
      toast.success("Promotion successfully retired.");
      fetchDeals();
    } catch (error) {
      console.error(error);
      toast.error("The Archive rejected the deletion request. (Requires API Token)");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif text-stone-800">Promotions & Festivals</h1>
          <p className="text-stone-500 text-sm italic">Define the moments of celebration for your guests.</p>
        </div>
        <button 
          onClick={() => toast.info("New deal creation coming soon to the royal panel.")}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create Festival
        </button>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 animate-pulse space-y-6">
              <div className="h-48 bg-stone-50 rounded-2xl w-full" />
              <div className="space-y-3">
                <div className="h-6 bg-stone-50 rounded w-2/3" />
                <div className="h-4 bg-stone-50 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {deals.map((deal) => (
              <motion.div 
                layout
                key={deal._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-48 bg-stone-800">
                  {deal.image ? (
                    <img 
                      src={urlFor(deal.image).width(600).url()} 
                      alt={deal.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 bg-stone-900">
                      <Sparkles size={40} className="opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg">
                      {deal.discount}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                    <button 
                      disabled={isDeleting === deal._id}
                      onClick={() => deleteDeal(deal._id)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      {isDeleting === deal._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif text-stone-800">{deal.title}</h3>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed italic">"{deal.description}"</p>
                  
                  <div className="pt-4 flex items-center justify-between border-t border-stone-50 mt-4">
                    <div className="flex items-center text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      <Calendar size={12} className="mr-1.5" />
                      {deal.validUntil ? new Date(deal.validUntil).toLocaleDateString() : 'Everlasting'}
                    </div>
                    <div className={`flex items-center text-[10px] font-bold uppercase tracking-widest ${deal.isActive ? 'text-emerald-500' : 'text-stone-300'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${deal.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
                      {deal.isActive ? 'Live' : 'Archived'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-stone-100 text-center space-y-4">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
            <Tag size={32} />
          </div>
          <h3 className="text-xl font-serif text-stone-400">The hall of festivals is empty.</h3>
          <p className="text-stone-300 text-sm italic">Your guests await a reason to celebrate.</p>
        </div>
      )}

      {/* Connection Notice */}
      {!import.meta.env.VITE_SANITY_PROJECT_ID && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start space-x-4">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div className="space-y-1">
            <p className="text-amber-800 font-bold text-xs uppercase tracking-widest">Local Archives Mode</p>
            <p className="text-amber-700/70 text-xs leading-relaxed">
              You are currently viewing cached promotions. To connect your live Sanity database, please configure <code className="bg-amber-100 px-1.5 py-0.5 rounded">VITE_SANITY_PROJECT_ID</code> in the Secrets panel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

