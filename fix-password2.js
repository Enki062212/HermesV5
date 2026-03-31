import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// U+FFFD is the Unicode replacement character - shown as ? in browser
const FFFD = '\uFFFD';
const pattern = new RegExp(`placeholder="${FFFD}+"`, 'g');

const before = (content.match(pattern) || []).length;
content = content.replace(pattern, 'placeholder="Enter password"');
const after = (content.match(pattern) || []).length;

writeFileSync(filePath, content, 'utf8');
console.log(`Fixed ${before} placeholder(s). Remaining: ${after}`);
