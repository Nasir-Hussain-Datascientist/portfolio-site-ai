import fs from 'fs';
import path from 'path';

const dir = './src';

const replacements: [RegExp, string][] = [
  // Update colors to vibrant themes
  [/bg-zinc-950/g, 'bg-[#050505]'],
  [/bg-zinc-900/g, 'bg-[#111]'],
  [/bg-zinc-800/g, 'bg-[#222]'],
  [/bg-zinc-100/g, 'bg-[#FF2E93]'],
  [/text-zinc-100/g, 'text-white'],
  [/text-zinc-300/g, 'text-gray-300'],
  [/text-zinc-400/g, 'text-gray-400'],
  [/text-zinc-500/g, 'text-gray-500'],
  [/border-zinc-800/g, 'border-white/10'],
  [/border-zinc-700/g, 'border-white/20'],
  [/border-zinc-400/g, 'border-white/40'],
  
  // Specific buttons
  [/bg-[#FF2E93] text-zinc-950/g, 'bg-[#FF2E93] text-white font-bold'],
  [/hover:bg-zinc-200/g, 'hover:bg-[#FF007A]'],
  [/hover:bg-[#FF2E93] hover:text-zinc-950/g, 'hover:bg-[#FF2E93] hover:text-white'],
  [/hover:bg-white hover:text-zinc-950/g, 'hover:bg-[#00FFCC] hover:text-black'],
  
  // Text that used to be dark in the zinc-100 boxes need to be white
  [/text-zinc-900/g, 'text-black'],
  
  // Hover effects
  [/hover:bg-white/g, 'hover:bg-[#00FFCC]'],
  [/hover:text-zinc-950/g, 'hover:text-black'],
  [/hover:bg-zinc-800/g, 'hover:bg-white/10'],
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
