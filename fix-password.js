import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// Count occurrences before
const before = (content.match(/placeholder="[?]+"/g) || []).length;

// Replace corrupted password placeholders
content = content.replace(/placeholder="[?]+"/g, 'placeholder="Enter password"');

const after = (content.match(/placeholder="[?]+"/g) || []).length;
writeFileSync(filePath, content, 'utf8');
console.log(`Fixed ${before} placeholder(s). Remaining: ${after}`);
