import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { firestoreService } from '../lib/firestore-service';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: "Hi! I'm Nasir's AI assistant. Ask me anything about his projects, experience, or certifications!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadContext() {
      try {
        const [projects, certs, blogs, services] = await Promise.all([
          firestoreService.list('projects'),
          firestoreService.list('certifications'),
          firestoreService.list('blogs'),
          firestoreService.list('services')
        ]);
        
        const contextData = `
          Nasir's Projects:
          ${projects.map((p: any) => `- ${p.title}: ${p.description}`).join('\n')}
          
          Nasir's Certifications:
          ${certs.map((c: any) => `- ${c.title} by ${c.issuer}`).join('\n')}
          
          Nasir's Services:
          ${services.map((s: any) => `- ${s.title}: ${s.description}`).join('\n')}
          
          Nasir's Blog Posts:
          ${blogs.map((b: any) => `- ${b.title}`).join('\n')}
        `;
        setPortfolioData(contextData);
      } catch (e) {
        console.error("Failed to load portfolio data for AI", e);
      }
    }
    loadContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    const historyText = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
    const prompt = `${historyText}\nUser: ${userText}\nAssistant:`;
    
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are Nasir Hussain's AI portfolio assistant. Answer questions about his experience based strictly on this data:\n\n${portfolioData}\n\nBe professional, friendly, human-like, and concise. Do not hallucinate.`,
        }
      });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't generate a response." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "There was an error connecting to my server. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-[var(--brand-main)] text-[var(--brand-text)] shadow-xl hover:bg-[var(--brand-hover)] transition-all z-40 transform hover:scale-105 [border-radius:var(--radius-main)]"
      >
        <MessageSquare size={20} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 bg-[var(--bg-card)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] shadow-2xl shadow-black/50 z-50 flex flex-col [border-radius:var(--radius-main)]"
            style={{ height: '520px', maxHeight: 'calc(100vh - 120px)' }}
          >
            <div className="p-4 bg-[var(--bg-main)] border-b border-[var(--border-light)] text-[var(--text-main)] flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <Bot size={18} strokeWidth={1.5} />
                <span className="font-[family-name:var(--font-heading)] font-bold text-lg tracking-tight">AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-card)] text-[var(--text-main)]">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 [border-radius:var(--radius-full)] flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-[var(--brand-main)] text-[var(--brand-text)]' : 'bg-[var(--bg-main)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] text-[var(--text-main)]'}`}>
                    {m.role === 'user' ? <User size={14} strokeWidth={1.5} /> : <Bot size={14} strokeWidth={1.5} />}
                  </div>
                  <div className={`p-4 text-sm leading-relaxed ${m.role === 'user' ? 'bg-[var(--brand-main)] text-[var(--brand-text)]' : 'bg-[var(--bg-main)] text-[var(--text-sub)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)]'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 [border-radius:var(--radius-full)] bg-[var(--bg-main)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] text-[var(--text-main)] flex items-center justify-center shrink-0">
                    <Loader2 size={14} className="animate-spin" strokeWidth={1.5} />
                  </div>
                  <div className="p-4 text-sm bg-[var(--bg-main)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] text-[var(--text-muted)] font-medium font-[family-name:var(--font-heading)] ">
                    Reasoning...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-light)] flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my projects..."
                className="flex-1 bg-[var(--bg-main)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] focus:border-[var(--border-light)] px-4 py-3 text-sm focus:ring-0 outline-none transition-colors text-[var(--text-main)]"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-12 bg-[var(--brand-main)] text-[var(--brand-text)] flex justify-center items-center hover:bg-[var(--brand-hover)] disabled:opacity-50 transition-colors"
               >
                <Send size={16} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
