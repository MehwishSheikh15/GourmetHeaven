import { X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { client, queries, urlFor, MOCK_DATA, safeFetch } from "../../lib/sanity";

export default function DealsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [deal, setDeal] = useState<any>(null);

  useEffect(() => {
    const hasSeenDeals = localStorage.getItem("gourmet_haven_deals_dismissed");
    
    const fetchDeal = async () => {
      const result = await safeFetch<any>(queries.activeDeals, "deals", d => d.isActive);
      if (result && result.length > 0) {
        setDeal(result[0]);
      }
      
      if (!hasSeenDeals) {
        // Delay popup for better UX
        setTimeout(() => setIsOpen(true), 2000);
      }
    };

    fetchDeal();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("gourmet_haven_deals_dismissed", "true");
  };

  if (!deal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(133,77,14,0.3)] border border-stone-100"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition flex items-center justify-center"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col">
              <div className="relative h-64 bg-stone-800 overflow-hidden">
                {deal.image ? (
                  <img 
                    src={urlFor(deal.image).width(800).url()} 
                    alt={deal.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-500">
                    <Sparkles size={64} className="mb-4 opacity-50 text-brand-primary" />
                    <span className="text-[10px] uppercase tracking-widest">Exclusive Haven Offer</span>
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-brand-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Latest Deal
                  </span>
                </div>
              </div>

              <div className="p-8 text-center space-y-4">
                <h3 className="text-3xl font-serif text-stone-800">{deal.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed max-w-sm mx-auto italic font-serif">
                  "{deal.description}"
                </p>
                
                <div className="py-6 inline-block">
                  <div className="border-y-2 border-brand-primary/20 py-2 px-8">
                    <span className="text-4xl font-serif font-black text-brand-primary tracking-tight">
                      {deal.discount}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleClose}
                    className="flex-grow bg-stone-900 text-white font-semibold py-4 rounded-full hover:bg-stone-800 transition shadow-xl uppercase tracking-widest text-xs"
                  >
                    Claim This Offer
                  </button>
                  <button 
                    onClick={handleClose}
                    className="flex-grow bg-white text-stone-500 font-semibold py-4 rounded-full hover:bg-stone-50 transition border border-stone-200 uppercase tracking-widest text-xs"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
