import { Phone } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = "+923001234567"; // Placeholder
  const message = encodeURIComponent("Hello Gourmet Haven! I'd like to make a reservation or inquire about today's deals.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-green-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition group"
    >
      <Phone size={24} className="group-hover:rotate-12 transition fill-current" />
      <span className="absolute -top-12 -left-20 bg-stone-900 text-white text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition transition-all uppercase tracking-widest pointer-events-none">
        Order on WhatsApp
      </span>
    </a>
  );
}
