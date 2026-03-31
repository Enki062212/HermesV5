import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/app.jsx';
let content = readFileSync(filePath, 'utf8');

// 1. Add useCountUp hook + CountUp component right after the React import line
const reactImport = `import { useState, useEffect, useRef } from "react";`;

const countUpHook = `
// ── CountUp Animation Hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function CountUp({ val, duration = 1800 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Parse value: extract prefix, number, suffix
  // e.g. "₱2.4B+" → prefix="₱", num=2.4, suffix="B+"
  // "3,842+" → prefix="", num=3842, suffix="+"
  // "99.98%" → prefix="", num=99.98, suffix="%"
  // "18+" → prefix="", num=18, suffix="+"
  // "0.8s" → prefix="", num=0.8, suffix="s"
  // "14-days" → just show as-is
  const match = val.match(/^([₱]?)([\\d,]+(?:\\.\\d+)?)([BKMG%+sx\\-a-z]*)$/i);
  if (!match) return <span ref={ref}>{val}</span>;

  const prefix = match[1] || '';
  const rawNum = parseFloat(match[2].replace(/,/g, ''));
  const suffix = match[3] || '';
  const hasDecimal = match[2].includes('.');
  const decimalPlaces = hasDecimal ? match[2].split('.')[1].length : 0;

  const animated = useCountUp(rawNum * Math.pow(10, decimalPlaces), duration, visible);
  const displayNum = decimalPlaces > 0
    ? (animated / Math.pow(10, decimalPlaces)).toFixed(decimalPlaces)
    : animated.toLocaleString();

  return <span ref={ref}>{prefix}{displayNum}{suffix}</span>;
}
// ────────────────────────────────────────────────────────────────────────────
`;

content = content.replace(reactImport, reactImport + countUpHook);

// 2. Update stats row section (line ~1488-1505) to use CountUp
// Find the pattern: {s.val}</div> in the stats row and replace with <CountUp val={s.val}/>
// There are two stats sections - update both

// Stats section 1 (scrolling ticker): fontFamily Cormorant, fontSize:25
const statsVal1 = `}}>{s.val}</div>
                  <div style={{fontSize:13,color:C.muted,letterSpacing:"0.5px"}}>{s.label}</div>`;
const statsVal1Fixed = `}}><CountUp val={s.val}/></div>
                  <div style={{fontSize:13,color:C.muted,letterSpacing:"0.5px"}}>{s.label}</div>`;
content = content.split(statsVal1).join(statsVal1Fixed);

// Stats section 2 (hero stats row): fontFamily Cormorant, fontSize:30
const statsVal2 = `WebkitTextFillColor:"transparent"}}>{s.val}</div>`;
const statsVal2Fixed = `WebkitTextFillColor:"transparent"}}><CountUp val={s.val}/></div>`;
content = content.split(statsVal2).join(statsVal2Fixed);

writeFileSync(filePath, content, 'utf8');
console.log('Added CountUp animation to stats sections');
