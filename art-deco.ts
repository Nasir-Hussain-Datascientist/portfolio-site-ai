import fs from 'fs';
import path from 'path';

const dir = './src';

const replacements: [RegExp, string][] = [
  // Typography - favoring serif for Art Deco
  [/font-sans/g, 'font-serif'],
  [/font-light/g, 'font-normal'], // Art Deco looks better with regular or bold weights usually
  
  // Colors & Backgrounds
  [/bg-\[\#050505\]/g, 'bg-[#0A0A0A]'],
  [/bg-\[\#030303\]/g, 'bg-[#0A0A0A]'],
  [/bg-\[\#111\]/g, 'bg-[#151515]'],
  [/bg-\[\#222\]/g, 'bg-[#1A1A1A]'],
  [/bg-\[\#FF2E93\]/g, 'bg-[#D4AF37]'], // Replace pink with Gold
  [/bg-\[\#00FFCC\]/g, 'bg-[#F9F6EE]'], // Replace cyan with Ivory
  
  [/text-\[\#FF2E93\]/g, 'text-[#D4AF37]'],
  [/text-\[\#00FFCC\]/g, 'text-[#F9F6EE]'],
  
  [/border-\[\#FF2E93\]/g, 'border-[#D4AF37]'],
  [/border-\[\#00FFCC\]/g, 'border-[#F9F6EE]'],
  
  [/hover:bg-\[\#FF007A\]/g, 'hover:bg-[#B3932F]'],
  [/hover:bg-\[\#00FFCC\]/g, 'hover:bg-[#C5A059]'],
  
  [/selection:bg-\[\#FF2E93\]/g, 'selection:bg-[#D4AF37]'],
  
  // Specifically text-gray-xxx to a more ivory/cream tint
  [/text-gray-300/g, 'text-[#D3C7B6]'],
  [/text-gray-400/g, 'text-[#B5A89B]'],
  [/text-gray-500/g, 'text-[#8E8377]'],
  
  // Modifying borders to look more Art Deco (often gold-tinted)
  [/blur-\[1px\]/g, ''],
  [/border-white\/10/g, 'border-[#D4AF37]/30'],
  [/border-white\/20/g, 'border-[#D4AF37]/50'],
  [/border-white\/40/g, 'border-[#D4AF37]/80'],
  
  // Text colors
  [/text-white/g, 'text-[#F9F6EE]'], 
  [/text-black/g, 'text-[#0A0A0A]'],
];

function processDir(currentDir: string) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let modified = content;
      for (const [regex, replacement] of replacements) {
        modified = modified.replace(regex, replacement);
      }
      if (content !== modified) {
        fs.writeFileSync(fullPath, modified);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(dir);
