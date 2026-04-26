import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ChevronLeft, CreditCard, Truck, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../../lib/sanity";
import { toast } from "sonner";

export default function Checkout() {
  const { cart, totalAmount, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryMethod: "delivery", // or 'pickup'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your basket is empty of treasures!");
      return;
    }

    if (!import.meta.env.VITE_SANITY_PROJECT_ID || !import.meta.env.VITE_SANITY_TOKEN) {
      setIsSubmitting(true);
      // Simulate success for demo purposes if not configured
      setTimeout(() => {
        setIsSuccess(true);
        clearCart();
        toast.info("Demo Mode: Order simulation complete. Configure Sanity for real storage.");
        setIsSubmitting(false);
      }, 1500);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderDoc = {
        _type: "order",
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.deliveryMethod === 'delivery' ? formData.address : 'Store Pickup',
        },
        items: cart.map(item => ({
          _key: Math.random().toString(36).substring(2, 9),
          menuItem: {
            _type: 'reference',
            _ref: item._id
          },
          quantity: item.quantity,
          priceAtOrder: item.price
        })),
        total: totalAmount,
        status: "pending",
        paymentStatus: "cash",
        deliveryMethod: formData.deliveryMethod,
        orderDate: new Date().toISOString(),
      };

      await client.create(orderDoc);
      
      setIsSuccess(true);
      clearCart();
      toast.success("Royal order placed successfully!");
      
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("The scribe failed to record your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6 border border-stone-100"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-serif text-stone-800">Order Confirmed</h1>
          <p className="text-stone-500 leading-relaxed">
            Your request has been received by our master chefs. Expect excellence shortly.
          </p>
          <div className="pt-6">
            <Link to="/" className="inline-block px-8 py-3 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:shadow-xl transition-all">
              Return to Kingdom
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link to="/menu" className="inline-flex items-center text-stone-400 hover:text-stone-800 transition-colors mb-8 md:mb-12 group">
          <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold">Return to Menu</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Form */}
          <div className="space-y-8 md:space-y-12">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-serif text-stone-800 tracking-tight">Checkout</h1>
              <p className="text-brand-primary text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold">The Royal Seal</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-stone-100 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg md:text-xl font-serif text-stone-800 border-b border-stone-50 pb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Full Name</label>
                      <input 
                        required
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-full focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                        placeholder="Emperor Alexander"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-full focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Email Address</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-full focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                      placeholder="noble@gourmethaven.com"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-stone-800 border-b border-stone-50 pb-4">Delivery Options</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'delivery' }))}
                      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
                        formData.deliveryMethod === 'delivery' 
                        ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-lg" 
                        : "border-stone-100 text-stone-400 hover:border-stone-200"
                      }`}
                    >
                      <Truck size={32} className="mb-2" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
                      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
                        formData.deliveryMethod === 'pickup' 
                        ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-lg" 
                        : "border-stone-100 text-stone-400 hover:border-stone-200"
                      }`}
                    >
                      <MapPin size={32} className="mb-2" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Pickup</span>
                    </button>
                  </div>

                  {formData.deliveryMethod === 'delivery' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Full Address</label>
                      <textarea 
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-8 py-6 bg-stone-50 border border-stone-100 rounded-[2rem] focus:ring-1 focus:ring-brand-primary outline-none transition-all resize-none"
                        placeholder="House X, Street Y, Royal Colony, City..."
                      />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-stone-800 border-b border-stone-50 pb-4">Payment</h3>
                  <div className="flex items-center p-6 rounded-3xl bg-brand-primary/5 border border-brand-primary/20 text-brand-primary">
                    <CreditCard size={24} className="mr-4" />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-widest">Cash on Delivery / Pickup</p>
                      <p className="text-[10px] opacity-70">Payment will be collected upon arrival.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-6 bg-stone-800 text-white rounded-full font-bold uppercase tracking-[0.4em] text-sm shadow-2xl hover:bg-stone-900 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={20} />
                    Processing...
                  </>
                ) : (
                  `Seal the Order • PKR ${totalAmount}`
                )}
              </button>
            </form>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-8">
            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-stone-100">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-50">
                <ShoppingBag className="text-brand-primary" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Order Summary</span>
              </div>

              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-stone-800">{item.name}</h4>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-6 h-6 rounded-full bg-stone-50 flex items-center justify-center text-xs text-stone-400 hover:bg-brand-primary hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-stone-600">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-6 h-6 rounded-full bg-stone-50 flex items-center justify-center text-xs text-stone-400 hover:bg-brand-primary hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-stone-800">PKR {item.price * item.quantity}</p>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-[10px] text-red-400 uppercase font-medium hover:underline transition"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {cart.length === 0 && (
                  <div className="py-12 text-center space-y-4">
                    <p className="text-stone-300 italic font-serif">The treasure chest is empty.</p>
                    <Link to="/menu" className="text-[10px] uppercase font-bold tracking-widest text-brand-primary hover:underline underline-offset-4">
                      Go discover excellence
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t-2 border-dashed border-stone-50 space-y-4">
                <div className="flex justify-between text-stone-400 text-xs">
                  <span>Subtotal</span>
                  <span>PKR {totalAmount}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-xs">
                  <span>Delivery Fee</span>
                  <span>{formData.deliveryMethod === 'pickup' ? 'FREE' : 'PKR 150'}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-primary mb-1">Total Royalty</p>
                    <p className="text-4xl font-serif font-black text-stone-800 leading-none">
                      PKR {totalAmount + (formData.deliveryMethod === 'pickup' ? 0 : 150)}
                    </p>
                  </div>
                  <Sparkles className="text-brand-primary animate-pulse w-8 h-8 opacity-20" />
                </div>
              </div>
            </div>

            <div className="bg-stone-900 p-8 rounded-[3rem] text-white space-y-4">
              <h4 className="text-sm font-serif italic text-white/50">"Cooking is a master project that requires attention to detail and a passion for flavor."</h4>
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-primary">— Executive Chef</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className, ...props }: any) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/>
    </svg>
  );
}
