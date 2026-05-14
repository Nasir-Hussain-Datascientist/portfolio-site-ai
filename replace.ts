import fs from 'fs';
import path from 'path';

const dir = './src';
const replacements: [RegExp, string][] = [
  [/font-sans tracking-tight/g, 'font-serif']
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
