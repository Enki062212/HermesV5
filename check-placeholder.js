import { readFileSync } from 'fs';
const content = readFileSync('src/app.jsx', 'utf8');
const lines = content.split('\n');
// Find lines with placeholder near password fields (around line 455)
for (let i = 450; i < 480; i++) {
  if (lines[i] && lines[i].includes('placeholder')) {
    const chars = [...lines[i]].map(c => `${c}(${c.charCodeAt(0).toString(16)})`).join('');
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
    console.log(`  Chars: ${chars.substring(0, 100)}`);
  }
}
