import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// Replace ? followed by digits/numbers (₱ peso sign before monetary values)
// e.g. "?1.4M" → "₱1.4M", "?184K" → "₱184K", ?42K → ₱42K
const before = (content.match(/\?(\d)/g) || []).length;
content = content.replace(/\?(\d)/g, '₱$1');

// Also fix icon:"?" (single ?) that are leftover - replace with 📊
const iconBefore = (content.match(/icon[=:]"\?"/g) || []).length;
content = content.replace(/icon[=:]"\?"/g, 'icon:"📊"');
content = content.replace(/icon=""/g, 'icon="📊"');

// Fix ["?","Customers"] style icon in arrays
content = content.replace(/"248",C\.green,"\?"\]/g, '"248",C.green,"👥"]');

writeFileSync(filePath, content, 'utf8');
console.log(`Fixed ${before} peso values, ${iconBefore} icon:"?" remaining`);
