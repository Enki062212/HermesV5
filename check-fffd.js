import { readFileSync } from 'fs';
const content = readFileSync('src/app.jsx', 'utf8');
const lines = content.split('\n');
const FFFD = '\uFFFD';
let count = 0;
lines.forEach((line, i) => {
  if (line.includes(FFFD)) {
    count++;
    console.log(`Line ${i+1}: ${line.trim().substring(0, 80)}`);
  }
});
console.log(`Total lines with U+FFFD: ${count}`);
