import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// Step 1: Revert ALL ₱ followed by digits OUTSIDE of string quotes
// (i.e., in JSX code like ternary operators p.popular₱700:400)
// Strategy: revert ₱ to ? in non-string contexts

// Revert known bad patterns (ternary operators like ?700:, ?400:, ?600:, etc.)
content = content.replace(/₱(\d+):/g, '?$1:');

// Step 2: Now apply peso sign ONLY inside string literals
// Match strings like "₱..." that came from our earlier fix, but also find
// remaining ?+digit patterns ONLY inside quoted strings
// Replace ?digit inside quotes only
content = content.replace(/"([^"]*)\?(\d)([^"]*)"/g, (match, pre, digit, post) => {
  return `"${pre}₱${digit}${post}"`;
});
// Also handle template literal strings with backticks
content = content.replace(/`([^`]*)\?(\d)([^`]*)`/g, (match, pre, digit, post) => {
  return `\`${pre}₱${digit}${post}\``;
});

writeFileSync(filePath, content, 'utf8');
console.log('Done fixing peso values safely');
