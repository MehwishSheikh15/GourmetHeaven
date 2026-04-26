import { useState, useEffect, useRef, ChangeEvent } from "react";
import { client, queries, urlFor, safeFetch } from "../../lib/sanity";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  PlusCircle,
  Maximize2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function GalleryManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formState, setFormState] = useState({
    title: "",
    caption: "",
    image: null as any
  });

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const result = await safeFetch<any>(queries.gallery, "gallery");
      setItems(result);
    } catch (error) {
      toast.error("Failed to fetch gallery records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const asset = await client.assets.upload('image', file, {
        contentType: file.type,
        filename: file.name
      });
      setFormState({ 
        ...formState, 
        image: { 
          _type: 'image', 
          asset: { 
            _type: 'reference', 
            _ref: asset._id 
          } 
        } 
      });
      toast.success("Imagery uploaded safely.");
    } catch (error: any) {
      const msg = error.message || String(error);
      const isMissingProject = msg.includes("Project not found") || msg.includes("404") || msg.includes("Request error");
      
      if (isMissingProject) {
        toast.error("Cloud storage is unavailable.", {
          description: "Connect to Sanity to enable image uploads."
        });
      } else {
        toast.error(`Archive error: ${msg.substring(0, 50)}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formState.image) {
      toast.error("An image must be selected for the gallery.");
      return;
    }

    try {
      const doc = {
        _type: 'galleryItem',
        title: formState.title || "Untitled Masterpiece",
        caption: formState.caption,
        image: formState.image
      };

      await toast.promise(
        client.create(doc),
        {
          loading: 'Immortalizing in the Gallery...',
          success: 'Visual asset added successfully.',
          error: 'The Archive rejected the entry.',
        }
      );
      
      setIsDialogOpen(false);
      setFormState({ title: "", caption: "", image: null });
      fetchGallery();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently erase this visual asset?")) return;
    try {
      await client.delete(id);
      toast.success("Asset returned to the void.");
      fetchGallery();
    } catch (error: any) {
      toast.error(`Deletion failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-800">Visual Portfolio</h1>
          <p className="text-stone-500 text-sm italic">Manage the aesthetic essence of Gourmet Haven.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="px-6 py-3 bg-stone-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center">
            <Plus size={16} className="mr-2" />
            Exhibit New Work
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">New Gallery Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Work Title</Label>
                <Input 
                  id="title"
                  value={formState.title}
                  onChange={e => setFormState({...formState, title: e.target.value})}
                  placeholder="e.g. Moonlight Dinner Setting" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Input 
                  id="caption"
                  value={formState.caption}
                  onChange={e => setFormState({...formState, caption: e.target.value})}
                  placeholder="A brief description..." 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imagery</Label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center bg-stone-50 hover:bg-stone-100 transition cursor-pointer relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={32} className="text-brand-primary animate-spin mb-2" />
                      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Uploading...</p>
                    </div>
                  ) : formState.image ? (
                    <img 
                      src={urlFor(formState.image).width(400).url()} 
                      alt="Preview" 
                      className="max-h-[180px] mx-auto rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <ImageIcon size={32} className="mx-auto text-stone-300 mb-2" />
                      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Select Visual Asset</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={handleSave}
              disabled={isUploading}
              className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-amber-700 shadow-xl transition uppercase tracking-widest text-xs disabled:opacity-50"
            >
              Add to Collection
            </button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm min-h-[60vh]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-stone-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-sm"
                >
                  <img 
                    src={urlFor(item.image).width(600).height(600).url()} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={item.title}
                  />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-serif text-lg">{item.title}</h4>
                      {item.caption && <p className="text-white/60 text-[10px] uppercase tracking-wider">{item.caption}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
            <ImageIcon size={48} className="text-stone-200" />
            <h3 className="text-xl font-serif text-stone-400">The exhibition hall is empty.</h3>
            <p className="text-stone-300 text-sm max-w-xs italic text-center">Add stunning visuals to showcase the luxury of Gourmet Haven.</p>
          </div>
        )}
      </div>
    </div>
  );
}
