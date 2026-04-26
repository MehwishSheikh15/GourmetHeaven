import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, Clock, Utensils, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { client, queries, urlFor, MOCK_DATA, safeFetch } from "../../lib/sanity";

export default function Home() {
  const [specialItems, setSpecialItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchSpecials = async () => {
      const result = await safeFetch<any>(
        queries.specialMenuItems,
        "menuItems",
        item => item.isSpecial
      );
      setSpecialItems(result);
    };
    fetchSpecials();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0 scale-105 opacity-60">
          <img 
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxurious Restaurant Background" 
            className="w-full h-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-brand-primary uppercase tracking-[0.4em] text-xs font-semibold block">
              Established 2026 &bull; Islamabad
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-tight tracking-tighter">
              Culinary <br /> <span className="italic text-brand-primary">Elegance.</span>
            </h1>
            <p className="text-stone-300 max-w-lg mx-auto text-sm md:text-base font-light leading-relaxed tracking-wide font-serif italic">
              "Where the heritage of spices meets the precision of continental artistry. A symphony of flavors crafted for the discerning palate."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link 
                to="/reservations" 
                className="px-10 py-4 bg-brand-primary text-white text-xs uppercase tracking-widest font-bold rounded-full hover:bg-amber-700 transition shadow-2xl"
              >
                Book a Table
              </Link>
              <Link 
                to="/menu" 
                className="px-10 py-4 border border-white/30 text-white text-xs uppercase tracking-widest font-bold rounded-full hover:bg-white/10 transition backdrop-blur-md"
              >
                View the Menu
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <div className="w-[1px] h-12 bg-white/30" />
        </div>
      </section>

      {/* Specialty Highlights */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-brand-primary text-xs uppercase tracking-widest font-bold mb-4 block">Our Specialties</span>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-800">The Chef's <span className="italic">Signature</span></h2>
            </div>
            <Link to="/menu" className="text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-brand-primary transition flex items-center group">
              Explore Full Menu <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {specialItems.length > 0 ? (
              specialItems.map((item, idx) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-64 md:h-96 overflow-hidden rounded-2xl mb-6 shadow-xl">
                    <img 
                      src={item.image ? urlFor(item.image).width(600).url() : "https://images.unsplash.com/photo-1551218808-94e220e0349c?auto=format&fit=crop&q=80&w=600"} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs uppercase tracking-widest border border-white/50 px-6 py-2 rounded-full backdrop-blur-md">
                        Order Now
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif text-stone-900 mb-1">{item.name}</h3>
                      <p className="text-stone-500 text-xs italic font-serif">"{item.description.substring(0, 60)}..."</p>
                    </div>
                    <span className="text-brand-primary font-bold">PKR {item.price}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              // Placeholder skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="h-96 bg-stone-200 rounded-2xl" />
                  <div className="h-4 bg-stone-200 w-2/3" />
                  <div className="h-4 bg-stone-100 w-1/3" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Floating Info Grid */}
      <section className="py-24 bg-stone-50 border-y border-stone-200 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <Utensils className="mx-auto md:mx-0 text-brand-primary" size={32} />
            <h4 className="font-serif text-lg text-stone-800">Gourmet Fusion</h4>
            <p className="text-xs text-stone-500 leading-relaxed uppercase tracking-widest">Bridging Eastern heart & Western soul.</p>
          </div>
          <div className="space-y-4">
            <Clock className="mx-auto md:mx-0 text-brand-primary" size={32} />
            <h4 className="font-serif text-lg text-stone-800">Hours of Haven</h4>
            <p className="text-xs text-stone-500 leading-relaxed uppercase tracking-widest">Open Daily: 12:00 PM - 1:00 AM</p>
          </div>
          <div className="space-y-4">
            <Star className="mx-auto md:mx-0 text-brand-primary" size={32} />
            <h4 className="font-serif text-lg text-stone-800">Michelin Aspirations</h4>
            <p className="text-xs text-stone-500 leading-relaxed uppercase tracking-widest">Guided by excellence, served with passion.</p>
          </div>
          <div className="space-y-4">
            <MapPin className="mx-auto md:mx-0 text-brand-primary" size={32} />
            <h4 className="font-serif text-lg text-stone-800">The Estate</h4>
            <p className="text-xs text-stone-500 leading-relaxed uppercase tracking-widest">Islamabad Enclave, Sector F-7, Capital.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
