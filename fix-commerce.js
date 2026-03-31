import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

const fixes = [
  // Commerce Processed value - ? = ₱
  ['{val:"?2.4B+",label:"Commerce Processed"}', '{val:"₱2.4B+",label:"Commerce Processed"}'],
  // PH Market banner heading
  ['}}>? BUILT FOR PHILIPPINE COMMERCE', '}}>🇵🇭 BUILT FOR PHILIPPINE COMMERCE'],
  // Key Trends heading
  ['{head:"? Key Trends"', '{head:"📈 Key Trends"'],
  // Market size values
  ['[["?892B","PH Market Size"', '[["₱892B","PH Market Size"'],
  ['["?124B","Social Commerce"', '["₱124B","Social Commerce"'],
  // GoldKPI Social Commerce value
  ['value="?124B"', 'value="₱124B"'],
  // Market size in research
  ['value="?892B"', 'value="₱892B"'],
  // CPM benchmark ranges (e.g. ?28—42 → ₱28–42)
  ['cpm:"?', 'cpm:"₱'],
  ['cpc:"?', 'cpc:"₱'],
  ['cpl:"?', 'cpl:"₱'],
];

let count = 0;
fixes.forEach(([from, to]) => {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    count++;
  }
});

writeFileSync(filePath, content, 'utf8');
console.log(`Fixed ${count} commerce values`);
