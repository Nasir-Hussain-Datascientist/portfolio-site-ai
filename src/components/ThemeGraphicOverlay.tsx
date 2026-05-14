import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';

export const ThemeGraphicOverlay = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Tenebrism Grain Effect */}
      {theme === 'tenebrism' && (
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-150" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      )}

      {/* 2. Coquette Ribbons */}
      {theme === 'coquette' && (
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <motion.path
            d="M-50,100 C150,200 350,0 600,150 S900,300 1200,100"
            stroke="var(--brand-main)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.circle cx="10%" cy="10%" r="40" fill="var(--brand-main)" opacity="0.1" />
          <motion.circle cx="90%" cy="80%" r="60" fill="var(--brand-main)" opacity="0.1" />
        </svg>
      )}

      {/* 3. Future Medieval Runes */}
      {theme === 'future-medieval' && (
        <div className="absolute inset-0 opacity-10 font-mono text-[8px] leading-tight select-none p-4 whitespace-pre overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              01011001 01010101 01010101 ᚛ ᚆᚒᚐᚅᚔᚅ ᚜ 11010010 10101111
            </motion.div>
          ))}
        </div>
      )}

      {/* 4. Doodle Scribbles */}
      {theme === 'doodle' && (
        <div className="absolute inset-0">
          <motion.div 
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute -top-10 -left-10 w-64 h-64 border-4 border-black/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]" 
          />
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute bottom-20 right-10 w-32 h-32 border-2 border-black/5 rotate-12" 
          />
        </div>
      )}

      {/* 5. Chinoiserie Porcelain Detail */}
      {theme === 'chinoiserie' && (
        <div className="absolute inset-0 p-8 border-[24px] border-double border-[var(--border-light)] opacity-20" />
      )}
    </div>
  );
};
