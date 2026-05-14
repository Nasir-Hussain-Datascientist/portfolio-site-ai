import fs from 'fs';
import path from 'path';

const dir = './src';

const replacements: [RegExp, string][] = [
  [/bg-\[\#0A0A0A\]/g, 'bg-[var(--bg-main)]'],
  [/bg-\[\#0D0D0D\]/g, 'bg-[var(--bg-sub)]'],
  [/bg-\[\#151515\]/g, 'bg-[var(--bg-card)]'],
  [/bg-\[\#1A1A1A\]/g, 'bg-[var(--bg-card)]'],
  [/bg-\[\#D4AF37\]/g, 'bg-[var(--brand-main)]'],
  [/bg-\[\#C5A059\]/g, 'bg-[var(--brand-hover)]'],
  [/bg-\[\#B3932F\]/g, 'bg-[var(--brand-hover)]'],
  [/hover:bg-\[\#C5A059\]/g, 'hover:bg-[var(--brand-hover)]'],
  [/hover:bg-\[\#B3932F\]/g, 'hover:bg-[var(--brand-hover)]'],
  [/hover:bg-\[\#151515\]/g, 'hover:bg-[var(--bg-card)]'],
  [/hover:bg-\[\#F9F6EE\]/g, 'hover:bg-[var(--text-main)]'],
  [/hover:bg-\[\#0A0A0A\]/g, 'hover:bg-[var(--bg-main)]'],
  [/hover:bg-white\/10/g, 'hover:bg-[var(--bg-card)]'],
  [/bg-\[\#FAFAFA\]/g, 'bg-[var(--bg-main)]'],
  
  [/text-\[\#F9F6EE\]/g, 'text-[var(--text-main)]'],
  [/text-\[\#D3C7B6\]/g, 'text-[var(--text-sub)]'],
  [/text-\[\#B5A89B\]/g, 'text-[var(--text-muted)]'],
  [/text-\[\#8E8377\]/g, 'text-[var(--text-muted)]'],
  [/text-\[\#D4AF37\]/g, 'text-[var(--brand-main)]'],
  [/text-\[\#0A0A0A\]/g, 'text-[var(--brand-text)]'],
  [/hover:text-\[\#0A0A0A\]/g, 'hover:text-[var(--brand-text)]'],
  [/hover:text-\[\#F9F6EE\]/g, 'hover:text-[var(--text-main)]'],
  
  [/border-\[\#D4AF37\]\/30/g, 'border-[var(--border-light)]'],
  [/border-\[\#D4AF37\]\/20/g, 'border-[var(--border-light)]'],
  [/border-\[\#D4AF37\]\/50/g, 'border-[var(--border-light)]'],
  [/border-\[\#D4AF37\]\/80/g, 'border-[var(--border-light)]'],
  [/border-\[\#D4AF37\]/g, 'border-[var(--border-main)]'],
  [/hover:border-\[\#D4AF37\]\/30/g, 'hover:border-[var(--border-light)]'],
  
  [/selection:bg-\[\#D4AF37\]\/30/g, 'selection:bg-[var(--brand-main)]/30'],
  [/selection:bg-\[\#D4AF37\]/g, 'selection:bg-[var(--brand-main)]'],
  [/selection:text-\[\#F9F6EE\]/g, 'selection:text-[var(--text-main)]'],

  [/font-serif/g, 'font-[family-name:var(--font-heading)]'],
  [/font-sans/g, 'font-[family-name:var(--font-body)]'],

  [/rounded-none/g, '[border-radius:var(--radius-main)]'],
  [/rounded-full/g, '[border-radius:var(--radius-full)]'],
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
