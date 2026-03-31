import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');
const FFFD = '\uFFFD';

// Fix 1: placeholder with FFFD chars (already fixed, but just in case)
content = content.replace(new RegExp(`placeholder="${FFFD}+"`, 'g'), 'placeholder="Enter password"');

// Fix 2: ₱ (Philippine Peso) before numbers: like "?28-42" or "?1.4M"
// Pattern: FFFD followed by digits or digits.digits
content = content.replace(new RegExp(`${FFFD}(\\d)`, 'g'), '₱$1');

// Fix 3: FFFD between digits - en-dash in ranges like "28?42"
content = content.replace(new RegExp(`(\\d)${FFFD}(\\d)`, 'g'), '$1–$2');

// Fix 4: FFFD between words with spaces " ? " - bullet or em-dash separator
content = content.replace(new RegExp(` ${FFFD} `, 'g'), ' • ');

// Fix 5: FFFD at end of truncated string like name.slice(0,30)?
content = content.replace(new RegExp(`}${FFFD}\``, 'g'), '}…`');

// Fix 6: any remaining FFFD in strings - replace with em-dash
content = content.replace(new RegExp(FFFD, 'g'), '—');

const remaining = (content.match(new RegExp(FFFD, 'g')) || []).length;
writeFileSync(filePath, content, 'utf8');
console.log(`Done. Remaining U+FFFD: ${remaining}`);
