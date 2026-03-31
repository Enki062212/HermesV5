const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Batch 1: Module cards
const replacements = [
  // Module cards
  { from: /icon:"\?",title:"Sacred Inbox"/g, to: 'icon:"📥",title:"Sacred Inbox"' },
  { from: /icon:"\?",title:"Merchant CRM"/g, to: 'icon:"🤝",title:"Merchant CRM"' },
  { from: /icon:"\?",title:"Olympian ERP"/g, to: 'icon:"⚡",title:"Olympian ERP"' },
  { from: /icon:"\?",title:"Oracle Analytics"/g, to: 'icon:"📊",title:"Oracle Analytics"' },
  { from: /icon:"\?",title:"Agora Demographics"/g, to: 'icon:"👥",title:"Agora Demographics"' },
  { from: /icon:"\?",title:"Pythian Research"/g, to: 'icon:"🔬",title:"Pythian Research"' },
  { from: /icon:"\?",title:"Hermes AI Chatbot"/g, to: 'icon:"🤖",title:"Hermes AI Chatbot"' },
  { from: /icon:"\?",title:"Agora Social Ads"/g, to: 'icon:"📱",title:"Agora Social Ads"' },
  { from: /icon:"\?",title:"Brand-Trained Intelligence"/g, to: 'icon:"✨",title:"Brand-Trained Intelligence"' },
  { from: /icon:"\?",desc:"Scheduling/g, to: 'icon:"💆",desc:"Scheduling' },
  // Feature cards
  { from: /icon:"\?",title:"Taglish-Native Replies"/g, to: 'icon:"💬",title:"Taglish-Native Replies"' },
  { from: /icon:"\?",title:"Lead Qualification Engine"/g, to: 'icon:"🎯",title:"Lead Qualification Engine"' },
  { from: /icon:"\?",title:"Multi-Platform Unified"/g, to: 'icon:"🌐",title:"Multi-Platform Unified"' },
  { from: /icon:"\?",title:"Smart Escalation"/g, to: 'icon:"🚨",title:"Smart Escalation"' },
  { from: /icon:"\?",title:"No-Code Configuration"/g, to: 'icon:"🔧",title:"No-Code Configuration"' },
  { from: /icon:"\?",title:"Real-Time ROAS Tracking"/g, to: 'icon:"💰",title:"Real-Time ROAS Tracking"' },
  { from: /icon:"\?",title:"Creative Performance Scoring"/g, to: 'icon:"🎨",title:"Creative Performance Scoring"' },
  { from: /icon:"\?",title:"Audience Overlap Detector"/g, to: 'icon:"🔍",title:"Audience Overlap Detector"' },
  { from: /icon:"\?",title:"AI Budget Optimizer"/g, to: 'icon:"🧠",title:"AI Budget Optimizer"' },
  { from: /icon:"\?",title:"Attribution Stitching"/g, to: 'icon:"🔗",title:"Attribution Stitching"' },
  // KPI cards
  { from: /C\.gold,"\?\?"/g, to: 'C.gold,"📦"' },
  { from: /C\.green,"\?\?"/g, to: 'C.green,"💰"' },
  { from: /C\.amber,"\?\?"/g, to: 'C.amber,"📈"' },
  { from: /C\.cyan,"\?\?"/g, to: 'C.cyan,"💎"' },
  { from: /C\.rose,"\?\?"/g, to: 'C.rose,"🎯"' },
  // Other patterns
  { from: /\|\| "\?\?"/g, to: '|| "👤"' },
  { from: /thumbnail:"\?\?"/g, to: 'thumbnail:"🖼️"' },
  { from: /mobileMenuOpen \? "\?" : "\?"/g, to: 'mobileMenuOpen ? "✕" : "☰"' },
  { from: /unit:"\?"/g, to: 'unit:"₱"' },
  // Activity icons
  { from: /message: "\?\?"/g, to: 'message: "💬"' },
  { from: /call: "\?\?"/g, to: 'call: "📞"' },
  { from: /email: "\?\?"/g, to: 'email: "📧"' },
  { from: /note: "\?\?"/g, to: 'note: "📝"' },
  { from: /stage_change: "\?\?"/g, to: 'stage_change: "🔄"' },
  { from: /purchase: "\?\?"/g, to: 'purchase: "🛒"' },
  // Trust badges
  { from: /\["\?\?","Secured by Supabase"\]/g, to: '["🔒","Secured by Supabase"]' },
  { from: /\["\?\?","Privacy compliant"\]/g, to: '["🛡️","Privacy compliant"]' },
  { from: /\["\?\?","No credit card for trial"\]/g, to: '["💳","No credit card for trial"]' },
  { from: /\["\?\?","Cancel anytime"\]/g, to: '["✓","Cancel anytime"]' },
];

let count = 0;
replacements.forEach(({ from, to }) => {
  const matches = content.match(from);
  if (matches) {
    count += matches.length;
    content = content.replace(from, to);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Fixed ${count} ? icons in app.jsx`);
