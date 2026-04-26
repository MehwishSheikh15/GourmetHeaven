import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { safeFetch, queries } from '../../lib/sanity';
import { Camera, Maximize2, X } from 'lucide-react';

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const query = `*[_type == "galleryItem"]{ _id, title, category, "imageUrl": image.asset->url }`;
        // We use safeFetch to handle connection errors and empty states gracefully
        const data = await safeFetch<GalleryItem>(query, 'gallery');
        setItems(data);
      } catch (error) {
        console.error("Error in Gallery component:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

  return (
    <div className="bg-[#F8F7F3] min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-bold"
          >
            The Visual Feast
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-serif text-stone-800"
          >
            Royal Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 font-light"
          >
            Witness the artistry of our kitchens and the elegance of our halls.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat 
                ? 'bg-stone-900 text-[#C5A059] shadow-lg scale-105' 
                : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImage(item.imageUrl)}
              >
                <div className="relative overflow-hidden rounded-[2rem] shadow-sm transform transition-all duration-700 group-hover:shadow-2xl">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center px-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                        <Maximize2 className="text-white w-5 h-5" />
                      </div>
                      <h3 className="text-white font-serif text-xl mb-1">{item.title}</h3>
                      <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">{item.category}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
            <p className="text-stone-400 font-serif italic">Unveiling masterpieces...</p>
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <Camera className="w-16 h-16 text-stone-200 mx-auto" />
            <h3 className="text-xl font-serif text-stone-400">The archive is empty for this category.</h3>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage} 
              alt="Viewing Artwork"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
