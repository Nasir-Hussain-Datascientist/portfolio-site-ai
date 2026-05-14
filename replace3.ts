import fs from 'fs';
import path from 'path';

const dir = './src';

const replacements: [RegExp, string][] = [
  [/hover:bg-zinc-100 text-zinc-950 hover:text-white/g, 'hover:bg-zinc-100 hover:text-zinc-950'],
  [/text-zinc-900\/50/g, 'text-zinc-400'],
  [/border-\[\#FDFBF7\]/g, 'border-zinc-800'],
  [/bg-zinc-100 text-zinc-950\/20/g, 'bg-zinc-950/20'],
  [/shadow-cyan-900\/10/g, 'shadow-black/50'],
  [/border-\[\#1A1A1A\]\/10/g, 'border-white/10'],
  [/hover:bg-white text-zinc-900/g, 'hover:bg-white hover:text-zinc-950'],
  [/hover:bg-zinc-100 text-zinc-950/g, 'hover:bg-zinc-100 hover:text-zinc-950']
];

function processDir(currentDir: string) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
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
