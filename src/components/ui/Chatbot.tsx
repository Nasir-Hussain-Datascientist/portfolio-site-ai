import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hi! I am the AI assistant for this portfolio. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Send to the Express API proxy or Cloudflare Function
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      // Graceful fallback if Gemini or server is unavailable
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: 'Sorry, I am currently unavailable. Please feel free to reach out via the Contact page!' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-main)] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Portfolio AI</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Ask me anything!</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)] rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    chat.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-main)] rounded-tl-sm'
                  }`}>
                    {chat.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-main)] rounded-2xl rounded-tl-sm p-3 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-3 border-t border-[var(--border-main)] bg-[var(--bg-secondary)]">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-blue-700 transition"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
