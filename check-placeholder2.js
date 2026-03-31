import { readFileSync, writeFileSync } from 'fs';
const content = readFileSync('src/app.jsx', 'utf8');
const lines = content.split('\n');

for (let i = 450; i < 480; i++) {
  if (lines[i] && lines[i].includes('placeholder')) {
    const line = lines[i].trim();
    const match = line.match(/placeholder="([^"]*)"/);
    if (match) {
      const val = match[1];
      const codes = [...val].map(c => c.codePointAt(0).toString(16)).join(',');
      console.log(`Line ${i+1} placeholder value codepoints: [${codes}]`);
      console.log(`  Length: ${val.length} chars`);
    }
  }
}
