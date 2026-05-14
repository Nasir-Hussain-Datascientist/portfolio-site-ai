import fs from 'fs';
import path from 'path';

const dir = './src';

// Clean up weird text and color classes
const replacements: [RegExp, string][] = [
  // Fix the weird "Engineering Intelligence. by design." text
  [/Engineering <br\/>\n\s*<span className="text-cyan-400">Intelligence.<\/span>/g, 'Intelligence <br/>\n              <span className="font-light text-zinc-500">by design.</span>'],
  
  // Fix incorrect font usage
  [/font-serif/g, 'font-sans'],
  
  // Colors cleanup - removing all cyan/slate/etc and using zinc
  [/bg-slate-950/g, 'bg-zinc-950'],
  [/bg-slate-900/g, 'bg-zinc-900'],
  [/bg-slate-800/g, 'bg-zinc-800'],
  [/text-slate-100/g, 'text-zinc-100'],
  [/text-slate-300/g, 'text-zinc-300'],
  [/text-slate-400/g, 'text-zinc-400'],
  [/text-slate-500/g, 'text-zinc-500'],
  [/border-cyan-500/g, 'border-zinc-800'],
  [/border-slate-800/g, 'border-zinc-800'],
  [/border-slate-400/g, 'border-zinc-400'],
  
  [/bg-cyan-600/g, 'bg-zinc-100'],
  [/text-cyan-400/g, 'text-zinc-100'],
  
  [/hover:bg-cyan-500/g, 'hover:bg-white'],
  [/hover:bg-cyan-600/g, 'hover:bg-white text-zinc-900'],
  [/hover:text-cyan-400/g, 'hover:text-white'],
  [/hover:border-cyan-400/g, 'hover:border-zinc-400'],
  
  // Specific complex component classes fixes
  [/selection:bg-cyan-600 selection:text-white/g, 'selection:bg-white/20 selection:text-white'],
  
  // Image hover effects reset to something sensible
  [/opacity-70 saturate-50 mix-blend-luminosity hover:opacity-100 hover:filter-none hover:mix-blend-normal/g, 'opacity-80 grayscale hover:grayscale-0 hover:opacity-100'],
  [/opacity-70 saturate-50 group-hover:opacity-100 group-hover:filter-none/g, 'opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100'],
  [/opacity-70 saturate-50/g, 'opacity-80 grayscale'],
  [/hover:filter-none/g, 'hover:grayscale-0'],
  
  // Update buttons to look like solid minimal design
  [/bg-zinc-100/g, 'bg-zinc-100 text-zinc-950'], // ensuring zinc-100 buttons have dark text
  [/text-white text-sm tracking-widest uppercase font-medium/g, 'text-zinc-950 text-sm tracking-widest uppercase font-bold'],
  [/text-zinc-950 text-zinc-950/g, 'text-zinc-950'],
  [/bg-zinc-100 text-zinc-950 hover:bg-white/g, 'bg-zinc-100 text-zinc-950 hover:bg-white'],
  
  // Fix button text colors for specific "View Works" which was cyan-600 (now zinc-100)
  [/className="bg-zinc-100 hover:bg-white px-10 py-4 rounded-none text-zinc-950/g, 'className="bg-zinc-100 hover:bg-white px-10 py-4 rounded-none text-zinc-950'],
  
  // Navbar 
  [/bg-gradient/g, ''] // removing weird bg-gradient completely in components if it exists
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
