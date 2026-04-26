import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ai, CHAT_MODEL, CHAT_CONFIG } from "../../lib/ai";

export default function AIChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Greeting, guest of the Haven. How may I assist your culinary journey today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    
    // Construct history: strictly alternate user and model, starting with user.
    // The initial greeting (assistant) is skipped.
    const history = [];
    let expectingRole = "user";
    
    // Use the messages snapshot from when the function started to avoid sync issues
    for (let i = 1; i < messages.length; i++) {
      const m = messages[i];
      const mappedRole = m.role === "assistant" ? "model" : "user";
      if (mappedRole === expectingRole) {
        history.push({
          role: mappedRole,
          parts: [{ text: m.content }],
        });
        expectingRole = mappedRole === "user" ? "model" : "user";
      }
    }
    
    // If the last message was a model response, the next one MUST be user (which is the current input)
    // The history loop handled messages up to current.
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use generateContent for flexible history handling with @google/genai
      const response = await ai.models.generateContent({
        model: CHAT_MODEL,
        contents: [
          ...history,
          { role: "user", parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: CHAT_CONFIG.systemInstruction,
        }
      });

      const text = response.text || "I apologize, my creative senses are momentarily clouded. Please ask again.";

      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, my creative senses are momentarily clouded. Please ask again or contact us directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-stone-900 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-serif italic font-bold">
                  G
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold">Concierge AI</h3>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow h-96 overflow-y-auto p-4 space-y-4 bg-stone-50"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === "user" 
                      ? "bg-brand-primary text-white rounded-tr-none" 
                      : "bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none font-serif italic"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-stone-100 italic flex items-center space-x-2">
                    <Loader2 size={14} className="animate-spin text-stone-400" />
                    <span className="text-[10px] uppercase tracking-widest text-stone-400">Crafting...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-stone-100 bg-white">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center space-x-2"
              >
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about menu, deals..."
                  className="flex-grow py-2 px-4 bg-stone-50 rounded-full border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition disabled:opacity-50 shadow-lg"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-stone-900 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition group border-2 border-brand-primary/20"
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center text-[10px] border-2 border-white animate-bounce">
          1
        </span>
      </button>
    </div>
  );
}
