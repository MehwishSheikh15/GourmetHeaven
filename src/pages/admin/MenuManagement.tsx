import { useState, useEffect, useRef, ChangeEvent } from "react";
import { client, queries, urlFor, MOCK_DATA, safeFetch } from "../../lib/sanity";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  PlusCircle
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";

export default function MenuManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formState, setFormState] = useState({
    name: "",
    category: "Main Course",
    price: "",
    description: "",
    isAvailable: true,
    isSpecial: false,
    image: null as any
  });

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const result = await safeFetch<any>(queries.menuItems, "menuItems");
      setItems(result);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync with the Golden Ledger.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
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
      toast.success("Imagery captured successfully.");
    } catch (error: any) {
      const msg = error.message || String(error);
      const isMissingProject = msg.includes("Project not found") || msg.includes("404") || msg.includes("Request error");
      
      if (isMissingProject) {
        toast.error("Cloud storage is not configured.", {
          description: "Connect to Sanity to enable image uploads."
        });
      } else {
        toast.error(`The Archive failed to capture the imagery: ${msg.substring(0, 50)}`);
      }
      console.error("Upload failed", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to erase this masterpiece from the menu?")) return;
    setIsDeleting(id);
    try {
      await client.delete(id);
      toast.success("Item erased from the Golden Ledger.");
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error("The Archive rejected the deletion. (Requires Write Access)");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!formState.name || !formState.price) {
      toast.error("Name and Price are essential, my Liege.");
      return;
    }

    const doc = {
      _type: 'menuItem',
      name: formState.name,
      category: formState.category,
      price: parseFloat(formState.price),
      description: formState.description,
      isAvailable: formState.isAvailable,
      isSpecial: formState.isSpecial,
      image: formState.image
    };

    try {
      await toast.promise(
        client.create(doc),
        {
          loading: 'Recording to the Golden Ledger...',
          success: 'Menu item has been immortalized.',
          error: 'The Ledger rejected the entry. Check your Sanity token and write permissions.',
        }
      );
      
      setIsDialogOpen(false);
      setFormState({
        name: "",
        category: "Main Course",
        price: "",
        description: "",
        isAvailable: true,
        isSpecial: false,
        image: null
      });
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-sm"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="px-6 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition flex items-center shadow-lg text-sm font-semibold">
            <Plus size={18} className="mr-2" />
            New Menu Item
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Create New Masterpiece</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Grilled Salmon" 
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  value={formState.category}
                  onChange={e => setFormState({...formState, category: e.target.value})}
                  className="w-full h-10 px-3 py-2 bg-white border border-stone-200 rounded-md text-sm focus:outline-none"
                >
                  <option>Starters</option>
                  <option>Main Course</option>
                  <option>Deserts</option>
                  <option>Beverages</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (PKR)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="2500" 
                  value={formState.price}
                  onChange={e => setFormState({...formState, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isSpecial">Highlight?</Label>
                <div className="flex items-center space-x-2 h-10">
                  <input 
                    type="checkbox" 
                    id="isSpecial"
                    checked={formState.isSpecial}
                    onChange={e => setFormState({...formState, isSpecial: e.target.checked})}
                    className="w-4 h-4 rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <Label htmlFor="isSpecial" className="font-normal text-stone-500">Mark as Chef's Special</Label>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="desc">Description</Label>
                <textarea 
                  id="desc"
                  rows={3}
                  value={formState.description}
                  onChange={e => setFormState({...formState, description: e.target.value})}
                  placeholder="Describe the ingredients and essence..."
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-md text-sm focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center bg-stone-50 hover:bg-stone-100 transition cursor-pointer relative overflow-hidden min-h-[160px] flex flex-col items-center justify-center"
                >
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={32} className="text-brand-primary animate-spin mb-2" />
                      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Uploading imagery...</p>
                    </div>
                  ) : formState.image ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={urlFor(formState.image).width(400).url()} 
                        alt="Preview" 
                        className="max-h-[140px] mx-auto rounded-lg object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-lg">
                        <PlusCircle className="text-white" />
                        <span className="ml-2 text-white text-xs font-bold uppercase">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={32} className="mx-auto text-stone-300 mb-2" />
                      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Click to upload imagery</p>
                      <p className="text-[10px] text-stone-400 mt-1 uppercase">JPG, PNG or WEBP (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <button 
                onClick={handleSave}
                disabled={isUploadingImage}
                className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-amber-700 shadow-xl transition uppercase tracking-widest text-xs disabled:opacity-50"
              >
                Immortalize Item
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <Table className="high-density-table">
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-16"></TableHead>
                <TableHead className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Culinary Name</TableHead>
                <TableHead className="hidden md:table-cell py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Category</TableHead>
                <TableHead className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Price (PKR)</TableHead>
                <TableHead className="hidden sm:table-cell py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Availability</TableHead>
                <TableHead className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <TableRow key={i}>
                    <TableCell><div className="w-10 h-10 rounded bg-slate-50 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-slate-50 rounded w-48 animate-pulse" /></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-4 bg-slate-50 rounded w-24 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-slate-50 rounded w-16 animate-pulse" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="h-4 bg-slate-50 rounded w-20 animate-pulse" /></TableCell>
                    <TableCell className="text-right"><div className="h-4 bg-slate-50 rounded w-12 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item._id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                    <TableCell>
                      <div className="w-10 h-10 rounded overflow-hidden bg-slate-50 border border-slate-200">
                        {item.image ? (
                          <img 
                            src={urlFor(item.image).width(80).height(80).url()} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : <ImageIcon size={14} className="m-auto mt-2.5 text-slate-300" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 py-4">
                      <div className="flex items-center">
                        <span className="truncate max-w-[120px] sm:max-w-none">{item.name}</span>
                        {item.isSpecial && (
                          <span className="hidden xs:inline-block ml-2 px-1.5 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-[8px] font-bold rounded uppercase tracking-widest border border-[#C5A059]/20">Chef Select</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-serif font-bold text-slate-900 border-l border-slate-50">PKR {item.price}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {item.isAvailable ? (
                        <span className="flex items-center text-green-600 text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 shadow-sm" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-200 mr-2" /> Sold Out
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end space-x-2">
                         <button 
                          onClick={() => handleDelete(item._id)}
                          disabled={isDeleting === item._id}
                          className="text-red-400 hover:text-red-600 transition disabled:opacity-50"
                         >
                          {isDeleting === item._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                         </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-serif italic border-none bg-slate-50/30">
                    No culinary works found in the database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
