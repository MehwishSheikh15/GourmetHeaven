import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, ChevronRight, CheckCircle2, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.date || !formData.time || !formData.guests) {
        toast.error('Please select date, time and number of guests');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Reservation request sent successfully!');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-stone-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-stone-800 mb-4">Request Received</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Your reservation request for <span className="font-bold text-stone-800">{formData.guests} guests</span> on <span className="font-bold text-stone-800">{formData.date}</span> at <span className="font-bold text-stone-800">{formData.time}</span> has been sent to our royal concierge.
          </p>
          <div className="bg-stone-50 p-6 rounded-2xl mb-8 text-left border border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2">Confirmation</p>
            <p className="text-sm text-stone-500 italic">
              We will contact you via email ({formData.email}) or phone ({formData.phone}) within the next 2 hours to confirm your table.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-stone-900 text-white rounded-full font-bold hover:shadow-xl transition-all"
          >
            Return to Palace
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F7F3] min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Content & Contact */}
          <div className="space-y-12 py-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <span className="text-[#C5A059] uppercase tracking-[0.4em] text-sm font-bold block">Reserve Your Experience</span>
              <h1 className="text-5xl md:text-6xl font-serif text-stone-800 leading-tight">
                Secure a Table <br />
                <span className="italic text-[#C5A059]">at the Haven</span>
              </h1>
              <p className="text-stone-500 text-lg leading-relaxed font-light">
                Experience culinary excellence in an atmosphere of refined luxury. 
                Whether it's an intimate dinner or a grand celebration, we ensure every moment is extraordinary.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-stone-800">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Phone className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <span className="font-serif">+1 (555) ROYAL-99</span>
                </div>
                <div className="flex items-center gap-4 text-stone-800">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <span className="font-serif">concierge@gourmethaven.com</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-stone-800">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Map_Pin className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <span className="font-serif">123 Royal Plaza, Culinary District</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h3 className="text-2xl font-serif mb-6 text-[#C5A059]">Service Hours</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-stone-400">Lunch Service</span>
                  <span className="font-serif">11:30 AM — 2:30 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-stone-400">Afternoon Tea</span>
                  <span className="font-serif">3:00 PM — 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Dinner Service</span>
                  <span className="font-serif">6:00 PM — 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reservation Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[4rem] p-12 shadow-2xl border border-stone-100 relative z-10"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex gap-2">
                <div className={`w-12 h-1 ${step >= 1 ? 'bg-[#C5A059]' : 'bg-stone-100'} rounded-full transition-colors`}></div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-[#C5A059]' : 'bg-stone-100'} rounded-full transition-colors`}></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Step {step} of 2</span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif text-stone-800">Timing & Guests</h2>
                    <p className="text-stone-400 text-sm">When would you like to join the royal table?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-4">Select Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C5A059]" size={18} />
                        <input 
                          type="date" 
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-5 bg-stone-50 border-none rounded-3xl focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-4">Guests</label>
                        <div className="relative">
                          <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C5A059]" size={18} />
                          <select 
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            className="w-full pl-14 pr-6 py-5 bg-stone-50 border-none rounded-3xl focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-stone-800 appearance-none"
                          >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                            <option value="10+">10+ Guests</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-4">Selected Slot</label>
                        <div className="relative">
                          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C5A059]" size={18} />
                          <select 
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full pl-14 pr-6 py-5 bg-stone-50 border-none rounded-3xl focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-stone-800 appearance-none"
                          >
                            <option value="">Select Time</option>
                            {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full py-5 bg-stone-800 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-stone-900 hover:shadow-xl transition-all group"
                  >
                    Continue to Details
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif text-stone-800">Final Details</h2>
                    <p className="text-stone-400 text-sm">How may we address you?</p>
                  </div>

                  <div className="space-y-4">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Your Full Name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-8 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-stone-800"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Email Address"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-8 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-stone-800"
                      />
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder="Phone Number"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-8 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-stone-800"
                      />
                    </div>
                    <textarea 
                      name="specialRequests"
                      rows={3}
                      placeholder="Special Requests (Allergies, Occasions, Dietary Restrictions)"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      className="w-full px-8 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-stone-800 resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-5 bg-stone-100 text-stone-600 rounded-full font-bold hover:bg-stone-200 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-5 bg-stone-900 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Please Wait...
                        </>
                      ) : (
                        'Request Table'
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest pt-4">
                    By requesting, you agree to our royal dining terms.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Map_Pin = MapPin; // Alias for consistency in my eyes

export default Reservation;
