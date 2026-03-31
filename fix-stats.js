import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// ── Realistic figures for a growing Philippine B2B SaaS ──────────────────
// Hero stats row (4 tiles shown in screenshot)
content = content.split('{val:"₱2.4B+",label:"Commerce Processed"}').join('{val:"₱580M+",label:"Commerce Processed"}');
content = content.split('{val:"3,842+",label:"Brands Onboarded"}').join('{val:"1,240+",label:"Brands Onboarded"}');
content = content.split('{val:"99.98%",label:"Uptime Guaranteed"}').join('{val:"99.9%",label:"Uptime Guaranteed"}');

// Scrolling ticker section
content = content.split('{val:"7",label:"Platforms Connected"}').join('{val:"18+",label:"Platforms Connected"}');
content = content.split('{val:"₱2.4B+",label:"Commerce Processed"}').join('{val:"₱580M+",label:"Commerce Processed"}');
content = content.split('{val:"99.98%",label:"Uptime SLA"}').join('{val:"99.9%",label:"Uptime SLA"}');

// Also update any other occurrences of these figures elsewhere
content = content.split('"₱2.4B+"').join('"₱580M+"');
content = content.split('"3,842+"').join('"1,240+"');
content = content.split('"99.98%"').join('"99.9%"');

writeFileSync(filePath, content, 'utf8');
console.log('Stats updated to realistic figures');
