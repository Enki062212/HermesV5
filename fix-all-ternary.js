import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// Find all lines containing ₱ and check context
const lines = content.split('\n');
let fixCount = 0;

const fixed = lines.map((line, idx) => {
  if (!line.includes('₱')) return line;

  // Process each ₱ in the line
  // Strategy: go char by char and determine if ₱ is inside a string
  let result = '';
  let inString = false;
  let stringChar = '';
  let inTemplate = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (!inString && !inTemplate && (ch === '"' || ch === "'")) {
      inString = true;
      stringChar = ch;
      result += ch;
    } else if (inString && ch === stringChar && line[i-1] !== '\\') {
      inString = false;
      result += ch;
    } else if (!inString && ch === '`') {
      inTemplate = !inTemplate;
      result += ch;
    } else if (ch === '₱') {
      if (inString || inTemplate) {
        // Keep ₱ in strings - it's a valid peso sign
        result += ch;
      } else {
        // ₱ in code context = was a ternary ? - revert it
        result += '?';
        fixCount++;
      }
    } else {
      result += ch;
    }
    i++;
  }

  return result;
});

content = fixed.join('\n');
writeFileSync(filePath, content, 'utf8');
console.log(`Reverted ${fixCount} incorrect ₱ in code contexts`);

// Verify remaining ₱ count
const remaining = (content.match(/₱/g) || []).length;
console.log(`₱ signs remaining (in strings): ${remaining}`);
