import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'art-deco', name: 'Art Deco' },
    { id: 'doodle', name: 'Doodle Art' },
    { id: 'coquette', name: 'Coquette' },
    { id: 'tenebrism', name: 'Tenebrism' },
    { id: 'future-medieval', name: 'Future Med.' },
    { id: 'chinoiserie', name: 'Chinoiserie' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 left-0 bg-[var(--bg-card)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] shadow-xl p-2 w-48"
            style={{ borderRadius: 'var(--radius-main)' }}
          >
            <div className="flex justify-between items-center px-2 py-2 border-b border-[var(--border-light)] mb-2">
              <span className="text-[var(--text-main)] font-bold text-xs uppercase tracking-widest">Theme</span>
              <button onClick={() => setIsOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as any);
                    setIsOpen(false);
                  }}
                  className={`text-left px-3 py-3 text-sm transition-colors ${theme === t.id ? 'bg-[var(--brand-main)] text-[var(--brand-text)]' : 'text-[var(--text-sub)] hover:bg-[var(--bg-sub)] hover:text-[var(--text-main)]'}`}
                  style={{ borderRadius: 'var(--radius-main)' }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[var(--brand-main)] text-[var(--brand-text)] shadow-xl flex items-center justify-center hover:bg-[var(--brand-hover)] transition-colors"
        style={{ borderRadius: 'var(--radius-main)' }}
      >
        <Palette size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
};
