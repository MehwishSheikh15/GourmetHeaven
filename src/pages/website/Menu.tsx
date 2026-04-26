import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { client, queries, urlFor, MOCK_DATA, safeFetch } from "../../lib/sanity";
import { Search, SlidersHorizontal, Filter, ShoppingBag, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CATEGORIES = ["All", "Starters", "Main Course", "Deserts", "Beverages", "Deals"];

export default function Menu() {
  const { addToCart, itemsCount, totalAmount } = useCart();
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      const result = await safeFetch<any>(queries.menuItems, "menuItems");
      setItems(result);
      setFilteredItems(result);
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    let result = items;
    if (activeCategory !== "All") {
      result = items.filter(item => item.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [activeCategory, searchQuery, items]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="relative h-[40vh] bg-stone-900 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          alt="Menu Header"
        />
        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-serif text-white tracking-widest uppercase">The Menu</h1>
          <p className="text-brand-primary text-xs uppercase tracking-[0.6em] font-bold">Curated Excellence</p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12 relative z-20">
        {/* Controls */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-stone-100 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex overflow-x-auto pb-4 md:pb-0 scrollbar-hide flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                    activeCategory === cat 
                      ? "bg-brand-primary text-white shadow-lg scale-105" 
                      : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Search treasures..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-stone-50 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse space-y-6">
                <div className="h-64 bg-stone-100 rounded-3xl" />
                <div className="space-y-3 px-4">
                  <div className="h-6 bg-stone-100 rounded w-2/3" />
                  <div className="h-4 bg-stone-50 rounded w-full" />
                  <div className="h-4 bg-stone-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-50 group hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image ? urlFor(item.image).width(600).height(400).url() : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-widest border border-stone-100">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-serif text-stone-800 group-hover:text-brand-primary transition-colors">{item.name}</h3>
                      <span className="text-brand-primary font-bold text-lg">PKR {item.price}</span>
                    </div>
                    <p className="text-stone-500 text-xs italic font-serif leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="pt-4 flex items-center justify-between border-t border-stone-50">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-20" />
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          addToCart(item);
                          toast.success(`${item.name} added to your quest`);
                        }}
                        className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-stone-400 group-hover:text-brand-primary transition-all hover:scale-110 active:scale-95"
                      >
                        <Plus size={14} />
                        <span>Order Now</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-stone-100 rounded-3xl">
            <h3 className="text-2xl font-serif text-stone-400">No treasures found matching your search.</h3>
            <p className="text-stone-300 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {itemsCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6"
          >
            <Link 
              to="/checkout"
              className="group flex items-center justify-between bg-stone-900 text-white p-2 pl-6 rounded-full shadow-2xl hover:bg-black transition-all border border-stone-800"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-primary">View Basket</span>
                <span className="text-xs font-mono">{itemsCount} artifacts • PKR {totalAmount}</span>
              </div>
              <div className="bg-brand-primary w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <ShoppingBag size={20} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
