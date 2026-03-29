const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace ? icons with proper emojis
const replacements = [
  { from: /icon:"\?",title:"Agora Demographics"/g, to: 'icon:"👥",title:"Agora Demographics"' },
  { from: /icon:"\?",title:"Pythian Research"/g, to: 'icon:"🔬",title:"Pythian Research"' },
  { from: /icon:"\?",title:"Hermes AI Chatbot"/g, to: 'icon:"🤖",title:"Hermes AI Chatbot"' },
  { from: /icon:"\?",title:"Agora Social Ads"/g, to: 'icon:"📱",title:"Agora Social Ads"' },
  { from: /icon:"\?",title:"Brand-Trained Intelligence"/g, to: 'icon:"✨",title:"Brand-Trained Intelligence"' },
  { from: /icon:"\?",desc:"Scheduling/g, to: 'icon:"💆",desc:"Scheduling' },
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed ? icons in app.jsx');
