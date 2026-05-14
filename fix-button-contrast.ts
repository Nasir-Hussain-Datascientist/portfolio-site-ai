import fs from 'fs';
import path from 'path';

const dir = './src';

const replacements: [RegExp, string][] = [
  [/bg-\[\#D4AF37\] text-\[\#F9F6EE\]/g, 'bg-[#D4AF37] text-[#0A0A0A]'],
  [/hover:bg-\[\#B3932F\]/g, 'hover:bg-[#C5A059]'], // a bit lighter gold for hover
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
