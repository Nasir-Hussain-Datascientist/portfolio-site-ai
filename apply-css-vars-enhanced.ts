import fs from 'fs';
import path from 'path';

const dir = './src';

const replacements: [RegExp, string][] = [
  // Clean up explicit borders and padding to use generic card/glass styles where appropriate
  [/border border-\[var\(--border-light\)\]/g, 'border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)]'],
  [/border border-\[var\(--border-main\)\]/g, 'border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-main)]'],
  
  // Make borders for Doodle / Coquette / Art Deco adaptive on cards specifically
  [/className="aspect-\[4\/3\] w-full overflow-hidden relative border border-\[var\(--border-main\)\] bg-\[var\(--bg-sub\)\]"/g, 'className="aspect-[4/3] w-full overflow-hidden relative glass"'],
  
  [/className="bg-\[var\(--bg-main\)\] group cursor-pointer border border-\[var\(--border-light\)\] flex flex-col items-center p-2"/g, 'className="bg-[var(--bg-main)] group cursor-pointer border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] flex flex-col items-center p-2 shadow-[var(--card-shadow)]"'],
  
  // Refine project modal card to use box-shadow
  [/className="glass w-full max-w-5xl rounded-none relative overflow-hidden flex flex-col md:flex-row pointer-events-auto"/g, 'className="glass w-full max-w-5xl relative overflow-hidden flex flex-col md:flex-row pointer-events-auto shadow-[var(--card-shadow)]"'],
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
