const fs = require('fs');
const filePath = 'src/app.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  ['icon:"?",title:"Sacred Inbox"', 'icon:"📥",title:"Sacred Inbox"'],
  ['icon:"?",title:"Merchant CRM"', 'icon:"🤝",title:"Merchant CRM"'],
  ['icon:"?",title:"Olympian ERP"', 'icon:"⚡",title:"Olympian ERP"'],
  ['icon:"?",title:"Oracle Analytics"', 'icon:"📊",title:"Oracle Analytics"'],
  ['icon:"?",title:"Agora Demographics"', 'icon:"👥",title:"Agora Demographics"'],
  ['icon:"?",title:"Pythian Research"', 'icon:"🔬",title:"Pythian Research"'],
  ['icon:"?",title:"Hermes AI Chatbot"', 'icon:"🤖",title:"Hermes AI Chatbot"'],
  ['icon:"?",title:"Agora Social Ads"', 'icon:"📱",title:"Agora Social Ads"'],
  ['icon:"?",title:"Brand-Trained Intelligence"', 'icon:"✨",title:"Brand-Trained Intelligence"'],
];

let count = 0;
replacements.forEach(([from, to]) => {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    count++;
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed', count, 'icons');
