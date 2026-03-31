import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// Revert ALL ₱ that appear in ternary expressions (JSX code, not string values)
// Pattern: variable₱number:number (ternary like popular₱700:400)
// Also: ₱number:number (standalone ternary result)
let count = 0;

// Fix ternary patterns: identifier₱digits:digits
content = content.replace(/([a-zA-Z_$.)\]])(₱)(\d+)(:)/g, (m, pre, peso, num, colon) => {
  count++;
  return `${pre}?${num}${colon}`;
});

// Also fix patterns like ₱digits: that are NOT inside quotes
// Split by lines and fix each line
const lines = content.split('\n');
const fixed = lines.map(line => {
  // If line has ₱ followed by digits followed by : and is NOT in a string context
  // Check if ₱ is inside a JSX expression (style={{...}}, className={...}, etc.)
  return line.replace(/([\w.)\]])₱(\d+):/g, (m, pre, num) => {
    count++;
    return `${pre}?${num}:`;
  });
});

content = fixed.join('\n');
writeFileSync(filePath, content, 'utf8');
console.log(`Reverted ${count} incorrect ₱ ternary replacements`);
