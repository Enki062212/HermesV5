import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "./lib/supabase.js";

// ---------------------------------------------------------------------------
//  MODULE SYSTEM IMPORTS
// ---------------------------------------------------------------------------
import { ALL_MODULES, useModules } from "./lib/modules.js";
import ModuleManager from "./components/ModuleManager.jsx";
// ---------------------------------------------------------------------------
//  NEW MODULE IMPORTS
// ---------------------------------------------------------------------------
import SalesModule from "./components/modules/SalesModule.jsx";
import MarketingModule from "./components/modules/MarketingModule.jsx";

import EmailModule from "./components/modules/EmailModule.jsx";
import ChatbotModule from "./components/modules/ChatbotModule.jsx";
import LeadsModule from "./components/modules/LeadsModule.jsx";
import CampaignsModule from "./components/modules/CampaignsModule.jsx";
import AccountingModule from "./components/modules/AccountingModule.jsx";
import HRModule from "./components/modules/HRModule.jsx";
import TaxReportsModule from "./components/modules/TaxReportsModule.jsx";
import SupportModule from "./components/modules/SupportModule.jsx";
import NPSModule from "./components/modules/NPSModule.jsx";
import ProjectsModule from "./components/modules/ProjectsModule.jsx";
import TimeTrackModule from "./components/modules/TimeTrackModule.jsx";
import ProcurementModule from "./components/modules/ProcurementModule.jsx";
import WarehouseModule from "./components/modules/WarehouseModule.jsx";
import LogisticsModule from "./components/modules/LogisticsModule.jsx";
import LegalModule from "./components/modules/LegalModule.jsx";
import RiskModule from "./components/modules/RiskModule.jsx";
import ITSecModule from "./components/modules/ITSecModule.jsx";
import FacilitiesModule from "./components/modules/FacilitiesModule.jsx";
import DocAIModule from "./components/modules/DocAIModule.jsx";
import BizAssistModule from "./components/modules/BizAssistModule.jsx";
import PredictModule from "./components/modules/PredictModule.jsx";

// ---------------------------------------------------------------------------
//  HERMES DESIGN SYSTEM — Gold & Obsidian
// ---------------------------------------------------------------------------
const C = {
  bg0:    "#06050a",       // deep obsidian
  bg1:    "#0b0a12",       // dark void
  bg2:    "#100f1a",       // elevated surface
  bg3:    "#161524",       // card surface
  bg4:    "#1d1b2e",       // hover state
  border: "#1e1c30",
  border2:"#2d2a48",
  text:   "#f0ead6",       // warm parchment
  muted:  "#6b6580",
  dim:    "#2e2b45",
  // Hermes gold palette
  gold:   "#c9a84c",       // primary gold
  gold2:  "#e8c96a",       // bright gold
  gold3:  "#a07830",       // deep gold
  goldGlow:"#c9a84c",
  // Accent colors
  cyan:   "#38bdf8",
  green:  "#34d399",
  red:    "#f87171",
  amber:  "#fbbf24",
  rose:   "#fb7185",
  violet: "#a78bfa",
  // Greek marble texture via CSS
  marble: "linear-gradient(135deg, #100f1a 0%, #13121e 50%, #0e0d18 100%)",
};

const GOLD_GRADIENT = `linear-gradient(135deg, ${C.gold3}, ${C.gold}, ${C.gold2})`;
const GOLD_GLOW     = `0 0 30px ${C.gold}40, 0 0 60px ${C.gold}20`;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5055";
const IUBENDA_SCRIPT_ID = "iubenda-embed-script";
const PRIVACY_POLICY_URL = "https://www.iubenda.com/privacy-policy/83524104";
const COOKIE_POLICY_URL = "https://www.iubenda.com/privacy-policy/83524104/cookie-policy";

// ---------------------------------------------------------------------------
//  DATA (keeping all your existing data)
// ---------------------------------------------------------------------------
const revenueData = [
  {m:"Jan",revenue:420000,expenses:180000,profit:240000,leads:340},
  {m:"Feb",revenue:510000,expenses:200000,profit:310000,leads:412},
  {m:"Mar",revenue:480000,expenses:195000,profit:285000,leads:389},
  {m:"Apr",revenue:620000,expenses:230000,profit:390000,leads:520},
  {m:"May",revenue:710000,expenses:245000,profit:465000,leads:610},
  {m:"Jun",revenue:690000,expenses:238000,profit:452000,leads:588},
  {m:"Jul",revenue:820000,expenses:260000,profit:560000,leads:702},
  {m:"Aug",revenue:940000,expenses:280000,profit:660000,leads:824},
  {m:"Sep",revenue:880000,expenses:272000,profit:608000,leads:776},
  {m:"Oct",revenue:1020000,expenses:295000,profit:725000,leads:891},
  {m:"Nov",revenue:1180000,expenses:318000,profit:862000,leads:1024},
  {m:"Dec",revenue:1340000,expenses:340000,profit:1000000,leads:1188},
];

const ageData = [
  {age:"13–17",male:4.2,female:6.8},{age:"18–24",male:18.4,female:24.6},
  {age:"25–34",male:21.2,female:26.8},{age:"35–44",male:14.6,female:16.4},
  {age:"45–54",male:7.8,female:9.2},{age:"55+",male:3.4,female:4.6},
];

const geoData = [
  {region:"Metro Manila",value:38.4,color:C.gold},
  {region:"CALABARZON",value:16.8,color:C.cyan},
  {region:"Central Luzon",value:14.2,color:C.violet},
  {region:"Central Visayas",value:9.4,color:C.green},
  {region:"Western Visayas",value:8.1,color:C.amber},
  {region:"Davao Region",value:7.2,color:C.rose},
  {region:"Others",value:5.9,color:C.muted},
];

const platformPerf = [
  {platform:"Facebook",reach:68,conv:2.8,color:"#1877f2"},
  {platform:"Instagram",reach:52,conv:3.4,color:"#e1306c"},
  {platform:"TikTok",reach:44,conv:2.1,color:"#fe2c55"},
  {platform:"Shopee",reach:38,conv:6.8,color:"#f04f23"},
  {platform:"Lazada",reach:29,conv:5.2,color:"#4f46e5"},
  {platform:"X/Twitter",reach:18,conv:1.4,color:"#94a3b8"},
];

const sentimentData = [
  {month:"Sep",positive:72,neutral:18,negative:10},
  {month:"Oct",positive:75,neutral:16,negative:9},
  {month:"Nov",positive:68,neutral:20,negative:12},
  {month:"Dec",positive:81,neutral:13,negative:6},
];

const CRM_CONTACTS = [
  {id:"c1",name:"Maria Santos",email:"maria@gmail.com",phone:"+63 917 123 4567",stage:"Customer",value:48200,platform:"Instagram",brand:"Bloom Cosmetics",lastContact:"2h ago",score:92,tags:["VIP","Repeat"],avatar:"MS",color:C.rose},
  {id:"c2",name:"Jun Reyes",email:"jun@yahoo.com",phone:"+63 918 234 5678",stage:"Lead",value:12500,platform:"Facebook",brand:"Bloom Home",lastContact:"1d ago",score:64,tags:["Warm Lead"],avatar:"JR",color:C.violet},
  {id:"c3",name:"Carla Cruz",email:"carla@email.com",phone:"+63 919 345 6789",stage:"Prospect",value:28900,platform:"TikTok",brand:"Bloom Cosmetics",lastContact:"3h ago",score:78,tags:["High Intent"],avatar:"CC",color:C.green},
  {id:"c4",name:"Paolo Tan",email:"paolo@gmail.com",phone:"+63 920 456 7890",stage:"Customer",value:91400,platform:"Shopee",brand:"Bloom Home",lastContact:"5m ago",score:98,tags:["VIP","Wholesale"],avatar:"PT",color:C.gold},
  {id:"c5",name:"Nina Garcia",email:"nina@gmail.com",phone:"+63 921 567 8901",stage:"Churned",value:6200,platform:"Facebook",brand:"Bloom Kids",lastContact:"14d ago",score:22,tags:["At Risk"],avatar:"NG",color:C.red},
  {id:"c6",name:"Rhea Mendoza",email:"rhea@gmail.com",phone:"+63 922 678 9012",stage:"Lead",value:18700,platform:"Instagram",brand:"Bloom Cosmetics",lastContact:"6h ago",score:71,tags:["Beauty"],avatar:"RM",color:C.cyan},
  {id:"c7",name:"Sunshine Reyes",email:"sunshine@gmail.com",phone:"+63 923 789 0123",stage:"Customer",value:35600,platform:"TikTok",brand:"Bloom Food",lastContact:"1h ago",score:85,tags:["Loyal"],avatar:"SR",color:C.amber},
];

const erpInventory = [
  {id:"P001",name:"Bloom Foundation SPF30",sku:"BF-001",category:"Makeup",stock:1240,reorder:200,price:599,cost:180,sold:4820,brand:"Bloom Cosmetics",status:"healthy"},
  {id:"P002",name:"Vitamin C Serum 30ml",sku:"SK-002",category:"Skincare",stock:84,reorder:100,price:899,cost:240,sold:3210,brand:"Bloom Cosmetics",status:"low"},
  {id:"P003",name:"Minimalist Throw Pillow",sku:"HM-003",category:"Home Decor",stock:560,reorder:80,price:450,cost:120,sold:1890,brand:"Bloom Home",status:"healthy"},
  {id:"P004",name:"Organic Baby Wipes 80s",sku:"KD-004",category:"Baby Care",stock:12,reorder:150,price:289,cost:85,sold:6740,brand:"Bloom Kids",status:"critical"},
  {id:"P005",name:"Matcha Latte Powder 200g",sku:"FD-005",category:"Food & Bev",stock:890,reorder:200,price:349,cost:95,sold:5120,brand:"Bloom Food",status:"healthy"},
  {id:"P006",name:"Rose Gold Skincare Set",sku:"SK-006",category:"Skincare",stock:230,reorder:60,price:1499,cost:420,sold:980,brand:"Bloom Cosmetics",status:"healthy"},
  {id:"P007",name:"Kids Learning Tablet",sku:"KD-007",category:"Toys",stock:45,reorder:50,price:2199,cost:880,sold:420,brand:"Bloom Kids",status:"low"},
];

const keywordData = [
  {keyword:"bloom cosmetics ph",vol:18400,trend:+24,cpc:12.4,comp:0.6},
  {keyword:"beauty products philippines",vol:49200,trend:+18,cpc:8.2,comp:0.8},
  {keyword:"korean skincare ph",vol:62100,trend:+41,cpc:6.8,comp:0.7},
  {keyword:"affordable makeup online",vol:38700,trend:+12,cpc:5.4,comp:0.9},
  {keyword:"baby organic products ph",vol:14200,trend:+33,cpc:9.1,comp:0.5},
  {keyword:"home decor shopee",vol:27800,trend:+8,cpc:4.2,comp:0.7},
  {keyword:"matcha powder philippines",vol:11600,trend:+52,cpc:7.3,comp:0.4},
];

const radarData = [
  {subject:"Brand Awareness",Hermes:72,ManyChat:81,Tidio:44,SocialBee:58},
  {subject:"Engagement Rate",Hermes:88,ManyChat:74,Tidio:48,SocialBee:52},
  {subject:"CSAT",Hermes:91,ManyChat:78,Tidio:66,SocialBee:71},
  {subject:"Price Value",Hermes:76,ManyChat:65,Tidio:55,SocialBee:60},
  {subject:"Platform Reach",Hermes:84,ManyChat:70,Tidio:60,SocialBee:62},
  {subject:"AI Quality",Hermes:95,ManyChat:70,Tidio:50,SocialBee:55},
];

const PIPELINE_STAGES = ["Lead","Prospect","Negotiation","Customer","Churned"];
const STAGE_COLOR = {Lead:C.cyan,Prospect:C.violet,Negotiation:C.amber,Customer:C.green,Churned:C.red};

const PLATFORMS_META = {
  facebook:{color:"#1877f2",icon:"F",label:"Facebook"},
  instagram:{color:"#e1306c",icon:"I",label:"Instagram"},
  tiktok:{color:"#fe2c55",icon:"T",label:"TikTok"},
  shopee:{color:"#f04f23",icon:"S",label:"Shopee"},
  lazada:{color:"#4f46e5",icon:"L",label:"Lazada"},
  twitter:{color:"#94a3b8",icon:"X",label:"X/Twitter"},
  viber:{color:"#7360f2",icon:"V",label:"Viber"},
};
const pc = id => PLATFORMS_META[id]?.color || C.gold;
const pi = id => PLATFORMS_META[id]?.icon || "H";
const pl = id => PLATFORMS_META[id]?.label || id;

// ---------------------------------------------------------------------------
//  SHARED COMPONENTS (keeping all your existing components)
// ---------------------------------------------------------------------------

function HermesLogo({size=28}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Caduceus-inspired winged staff */}
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.gold3}/>
          <stop offset="50%" stopColor={C.gold2}/>
          <stop offset="100%" stopColor={C.gold}/>
        </linearGradient>
      </defs>
      {/* Wings */}
      <path d="M20 14 C14 10 6 12 4 18 C10 16 16 17 20 14Z" fill="url(#hg)" opacity="0.9"/>
      <path d="M20 14 C26 10 34 12 36 18 C30 16 24 17 20 14Z" fill="url(#hg)" opacity="0.9"/>
      {/* Staff */}
      <rect x="18.5" y="10" width="3" height="22" rx="1.5" fill="url(#hg)"/>
      {/* Snakes */}
      <path d="M20 16 C16 18 17 22 20 22 C23 22 24 26 20 28" stroke="url(#hg)" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M20 16 C24 18 23 22 20 22 C17 22 16 26 20 28" stroke="url(#hg)" strokeWidth="1.5" fill="none" opacity="0.7"/>
      {/* Orb top */}
      <circle cx="20" cy="10" r="3" fill="url(#hg)" opacity="0.9"/>
    </svg>
  );
}

function ExponifyWord({style={}}) {
  return (
    <span style={{display:"inline-flex",alignItems:"baseline",gap:2,...style}}>
      <span>EXPONIFY</span>
      <span style={{fontSize:"0.6em",letterSpacing:"1.4px",opacity:0.9,verticalAlign:"top"}}>PH</span>
    </span>
  );
}

function GoldAvatar({initials, color, size=36}) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:`linear-gradient(135deg, ${color}22, ${color}44)`,
      border:`1.5px solid ${color}55`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.3, fontWeight:800, color,
      flexShrink:0, letterSpacing:"-0.5px",
      boxShadow:`0 0 12px ${color}22`,
    }}>{initials}</div>
  );
}

function GoldKPI({label,value,change,up,icon,color}) {
  const col = color || C.gold;
  return (
    <div className="kpi-card" style={{
      background:C.bg3, border:`1px solid ${C.border}`,
      borderRadius:14, padding:"18px 20px",
      borderTop:`2px solid ${col}`,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:0,right:0,width:80,height:80,
        background:`radial-gradient(circle at top right, ${col}12, transparent)`,
        borderRadius:"0 14px 0 80px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <span style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px"}}>{label}</span>
        <span style={{fontSize:16,opacity:0.9}}>{icon}</span>
      </div>
      <div style={{
        fontSize:28, fontWeight:900,
        fontFamily:"'Cormorant Garamond','Georgia',serif",
        letterSpacing:"-1px", color:C.text, marginBottom:5,
        background:GOLD_GRADIENT, WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent",
      }} className="kpi-value">{value}</div>
      <div style={{fontSize:11,fontWeight:700,color:up?C.green:C.red}}>{change}</div>
    </div>
  );
}

function SectionHead({children,sub,action}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div>
        <div style={{
          fontFamily:"'Cormorant Garamond','Georgia',serif",
          fontSize:22, fontWeight:700, color:C.text, letterSpacing:"-0.3px",
          borderLeft:`3px solid ${C.gold}`, paddingLeft:10,
        }} className="section-title">{children}</div>
        {sub && <div style={{fontSize:11,color:C.muted,marginTop:4,paddingLeft:13}} className="section-sub">{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function GoldTag({children,color}) {
  const col = color || C.gold;
  return (
    <span style={{
      padding:"2px 9px", borderRadius:5, fontSize:10, fontWeight:700,
      background:`${col}18`, color:col, border:`1px solid ${col}30`,
    }}>{children}</span>
  );
}

function GoldBtn({children,onClick,disabled,style={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"8px 20px", borderRadius:9,
      background: disabled ? C.bg4 : GOLD_GRADIENT,
      border:"none", color: disabled ? C.muted : C.bg0,
      fontSize:12, fontWeight:800, cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : GOLD_GLOW,
      transition:"all 0.2s", letterSpacing:"0.2px",
      ...style,
    }}>{children}</button>
  );
}

function useIubendaEmbed() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const refreshEmbeds = () => {
      if (typeof window.iubenda?.reload === "function") {
        window.iubenda.reload();
      }
    };

    const existing = document.getElementById(IUBENDA_SCRIPT_ID);
    if (existing) {
      refreshEmbeds();
      return;
    }

    const script = document.createElement("script");
    script.id = IUBENDA_SCRIPT_ID;
    script.src = "https://cdn.iubenda.com/iubenda.js";
    script.async = true;
    script.onload = refreshEmbeds;
    document.body.appendChild(script);
  }, []);
}

function LegalPolicyLinks({center=false,compact=false}) {
  const baseLinkStyle = {
    color: C.gold,
    fontSize: compact ? 10 : 11,
    fontWeight: 700,
    textDecoration: "none",
    letterSpacing: "0.3px",
  };

  return (
    <div style={{
      display:"flex",
      flexWrap:"wrap",
      gap: compact ? 10 : 14,
      alignItems:"center",
      justifyContent:center?"center":"flex-start",
    }}>
      <a
        href={PRIVACY_POLICY_URL}
        className="iubenda-white iubenda-noiframe iubenda-embed"
        title="Privacy Policy"
        style={baseLinkStyle}
      >
        Privacy Policy
      </a>
      <span style={{color:C.border2}}>•</span>
      <a
        href={COOKIE_POLICY_URL}
        className="iubenda-white iubenda-noiframe iubenda-embed"
        title="Cookie Policy"
        style={baseLinkStyle}
      >
        Cookie Policy
      </a>
    </div>
  );
}

const TooltipBox = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:10,padding:"10px 14px",fontSize:12,boxShadow:"0 8px 32px #00000080"}}>
      <div style={{fontWeight:700,marginBottom:6,color:C.gold,fontFamily:"'Cormorant Garamond',serif"}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||C.text,marginBottom:2}}>
          {p.name}: <strong>{typeof p.value==="number"&&p.value>999?`?${(p.value/1000).toFixed(0)}K`:p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
//  LOGIN PAGE (keeping your existing LoginPage component)
// ---------------------------------------------------------------------------
function LoginPage() {
  useIubendaEmbed();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [mode,setMode]=useState("signin");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);

  const submit=async(e)=>{
    e.preventDefault();
    if(mode==="signup" && password !== confirmPassword){
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try{
      if(mode==="signin"){
        const { error:err } = await supabase.auth.signInWithPassword({email,password});
        if(err) throw err;
      }else{
        const { error:err } = await supabase.auth.signUp({email,password});
        if(err) throw err;
      }
    }catch(err){
      setError(err?.message||"Authentication failed.");
    }finally{
      setBusy(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg0,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input{font-family:inherit;}
      `}</style>

      <div style={{width:"min(420px, 100%)",background:C.bg2,border:`1px solid ${C.border2}`,borderRadius:14,boxShadow:"0 30px 80px #00000070",padding:"26px 26px 22px",position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <HermesLogo size={36}/>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,letterSpacing:"1px"}}>
              <ExponifyWord/>
            </div>
            <div style={{fontSize:9,color:C.gold,letterSpacing:"2.5px",fontWeight:700}}>Powered by Hermes</div>
          </div>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[
            {id:"signin",label:"Sign In"},
            {id:"signup",label:"Create Account"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setMode(t.id)} style={{
              flex:1,padding:"8px 10px",borderRadius:8,border:`1px solid ${mode===t.id?C.gold:C.border2}`,
              background:mode===t.id?`${C.gold}22`:"transparent",color:mode===t.id?C.gold:C.muted,
              fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:"0.4px",
            }}>{t.label}</button>
          ))}
        </div>

        <form onSubmit={submit}>
          <label style={{display:"block",fontSize:10,color:C.muted,letterSpacing:"1px",marginBottom:6}}>EMAIL</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
            placeholder="you@company.com"
            style={{width:"100%",padding:"10px 12px",borderRadius:8,background:C.bg3,border:`1px solid ${C.border2}`,color:C.text,marginBottom:12}}/>

          <label style={{display:"block",fontSize:10,color:C.muted,letterSpacing:"1px",marginBottom:6}}>PASSWORD</label>
          <div style={{position:"relative",marginBottom:12}}>
            <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{width:"100%",padding:"10px 38px 10px 12px",borderRadius:8,background:C.bg3,border:`1px solid ${C.border2}`,color:C.text}}/>
            <button type="button" onClick={()=>setShowPass(s=>!s)} aria-label={showPass?"Hide password":"Show password"} style={{
              position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
              background:"transparent",border:`1px solid ${C.border2}`,color:C.muted,cursor:"pointer",
              width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke={C.muted} strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3.5" stroke={C.muted} strokeWidth="1.5"/>
                {showPass && <path d="M4 4l16 16" stroke={C.muted} strokeWidth="1.5" />}
              </svg>
            </button>
          </div>

          {mode==="signup" && (
            <>
              <label style={{display:"block",fontSize:10,color:C.muted,letterSpacing:"1px",marginBottom:6}}>CONFIRM PASSWORD</label>
              <div style={{position:"relative",marginBottom:12}}>
                <input type={showConfirm?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required
                  placeholder="••••••••"
                  style={{width:"100%",padding:"10px 38px 10px 12px",borderRadius:8,background:C.bg3,border:`1px solid ${C.border2}`,color:C.text}}/>
                <button type="button" onClick={()=>setShowConfirm(s=>!s)} aria-label={showConfirm?"Hide password":"Show password"} style={{
                  position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                  background:"transparent",border:`1px solid ${C.border2}`,color:C.muted,cursor:"pointer",
                  width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke={C.muted} strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="3.5" stroke={C.muted} strokeWidth="1.5"/>
                    {showConfirm && <path d="M4 4l16 16" stroke={C.muted} strokeWidth="1.5" />}
                  </svg>
                </button>
              </div>
            </>
          )}

          {error && <div style={{fontSize:11,color:C.red,marginBottom:10}}>{error}</div>}

          <button type="submit" disabled={busy} style={{
            width:"100%",padding:"12px 16px",borderRadius:10,background:busy?C.bg4:GOLD_GRADIENT,
            border:"none",color:busy?C.muted:C.bg0,fontWeight:800,fontSize:13,cursor:busy?"not-allowed":"pointer",
            boxShadow:busy?"none":GOLD_GLOW,letterSpacing:"0.4px",
          }}>{busy?"Please wait...":mode==="signin"?"Enter Exponify":"Create Account"}</button>
        </form>

        <div style={{marginTop:14,fontSize:10,color:C.muted,lineHeight:1.6}}>
          Use your Supabase Auth email and password. After sign up, check your inbox if email confirmation is required.
        </div>

        <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
          <LegalPolicyLinks center compact />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  LANDING PAGE — Pancake.ph layout · Hermes Gold/Obsidian theme
// ---------------------------------------------------------------------------
function DemoBookingForm() {
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", business_name: "",
    platform: "facebook", monthly_messages: "", notes: "",
    preferred_date: "", preferred_time: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) { setErr("Name and email are required."); return; }
    setBusy(true); setErr("");

    try {
      // 1. Find the Exponify / Hermes brand
      // First try env var (fastest, no RLS issues)
      let brandId = import.meta.env.VITE_DEMO_BRAND_ID || null;

      if (!brandId) {
        // Fall back to querying brands table
        // Requires "Public can view brands" RLS policy — see SQL fix
        const { data: brands } = await supabase
          .from("brands")
          .select("id, name")
          .order("created_at", { ascending: true });

        if (brands?.length) {
          const match = brands.find(b =>
            b.name.toLowerCase().includes("exponify") ||
            b.name.toLowerCase().includes("hermes") ||
            b.name.toLowerCase().includes("demo")
          );
          brandId = match?.id || brands[0].id;
        }
      }

      if (!brandId) throw new Error("No brand configured. Please add VITE_DEMO_BRAND_ID to your .env file.");

      // 2. Check if contact already exists for this email + brand
      const { data: existing } = await supabase
        .from("contacts")
        .select("id, tags, notes, stage")
        .eq("brand_id", brandId)
        .eq("email", form.email.trim().toLowerCase())
        .maybeSingle();

      const notes = [
        form.business_name ? `Business: ${form.business_name}` : null,
        form.monthly_messages ? `Monthly messages: ${form.monthly_messages}` : null,
        form.platform ? `Main platform: ${form.platform}` : null,
        form.notes ? `Message: ${form.notes}` : null,
        `Demo requested: ${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })}`,
      ].filter(Boolean).join("\n");

      if (existing) {
        // Update existing contact - upgrade stage if they were churned/lead
        const newStage = ["Churned"].includes(existing.stage) ? "Lead" : existing.stage;
        const updatedTags = [...new Set([...(existing.tags || []), "Demo Request", "Website Lead"])];
        await supabase.from("contacts").update({
          phone: form.phone || undefined,
          stage: newStage,
          tags: updatedTags,
          notes,
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id);

        await supabase.from("contact_activities").insert({
          contact_id: existing.id,
          activity_type: "note",
          description: `New demo request from website. ${form.business_name ? "Business: " + form.business_name : ""}`,
        });

        // Save demo schedule for existing contact
        if (form.preferred_date && form.preferred_time) {
          const [time, meridiem] = form.preferred_time.split(" ");
          const [hours, minutes] = time.split(":").map(Number);
          const hrs = meridiem === "PM" && hours !== 12 ? hours + 12 : (meridiem === "AM" && hours === 12 ? 0 : hours);
          const scheduledAt = new Date(`${form.preferred_date}T${String(hrs).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:00+08:00`);
          await supabase.from("demo_schedules").insert({
            contact_id:   existing.id,
            brand_id:     brandId,
            scheduled_at: scheduledAt.toISOString(),
            status:       "pending",
            notes:        `${form.business_name || form.full_name} — Demo booking from website`,
          });
        }
      } else {
        // Create new contact
        const { data: newContact, error: insertErr } = await supabase
          .from("contacts")
          .insert({
            brand_id: brandId,
            full_name: form.full_name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim() || null,
            platform: form.platform || "facebook",
            stage: "Lead",
            score: 60,
            tags: ["Demo Request", "Website Lead"],
            notes,
          })
          .select("id")
          .single();

        if (insertErr) throw insertErr;

        await supabase.from("contact_activities").insert({
          contact_id: newContact.id,
          activity_type: "note",
          description: `Demo booked from landing page. ${form.business_name ? "Business: " + form.business_name + "." : ""} Platform: ${form.platform}.`,
        });

        // Save demo schedule
        if (form.preferred_date && form.preferred_time) {
          const [time, meridiem] = form.preferred_time.split(" ");
          const [hours, minutes] = time.split(":").map(Number);
          const hrs = meridiem === "PM" && hours !== 12 ? hours + 12 : (meridiem === "AM" && hours === 12 ? 0 : hours);
          const scheduledAt = new Date(`${form.preferred_date}T${String(hrs).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:00+08:00`);
          await supabase.from("demo_schedules").insert({
            contact_id:   newContact.id,
            brand_id:     brandId,
            scheduled_at: scheduledAt.toISOString(),
            status:       "pending",
            notes:        `${form.business_name || form.full_name} — Demo booking from website`,
          });
        }
      }

      setStep(2);
    } catch (e) {
      setErr(e.message || "Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  if (step === 2) {
    return (
      <div style={{
        maxWidth: 560, margin: "0 auto",
        background: C.bg3, border: `1px solid ${C.border2}`,
        borderRadius: 18, padding: "48px 40px", textAlign: "center",
        borderTop: `3px solid ${C.green}`,
      }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>??</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 12 }}>
          You're on the list!
        </div>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
          Salamat, <span style={{ color: C.gold, fontWeight: 700 }}>{form.full_name.split(" ")[0]}</span>! We've received your demo request.
          Our team will reach out within 24 hours to schedule your session.
        </div>
        <div style={{ fontSize: 12, color: C.dim }}>Check your inbox at <span style={{ color: C.gold }}>{form.email}</span></div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 720, margin: "0 auto",
      background: C.bg3, border: `1px solid ${C.border2}`,
      borderRadius: 18, padding: "36px 40px",
      boxShadow: `0 40px 80px #00000060, 0 0 0 1px ${C.gold}12`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GOLD_GRADIENT, borderRadius: "18px 18px 0 0" }} />

      <form onSubmit={submit}>
        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Full Name *</label>
            <input value={form.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Juan dela Cruz" required
              className="auth-input" style={{ width: "100%" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Email Address *</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="juan@business.com" required
              className="auth-input" style={{ width: "100%" }} />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Phone Number</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+63 9XX XXX XXXX"
              className="auth-input" style={{ width: "100%" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Business Name</label>
            <input value={form.business_name} onChange={e => set("business_name", e.target.value)} placeholder="e.g. Bloom Cosmetics PH"
              className="auth-input" style={{ width: "100%" }} />
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Main Platform</label>
            <select value={form.platform} onChange={e => set("platform", e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: C.bg3, border: `1px solid ${C.border2}`, color: C.text, fontSize: 13 }}>
              {[["facebook","Facebook"],["instagram","Instagram"],["tiktok","TikTok"],["shopee","Shopee"],["lazada","Lazada"],["viber","Viber"]].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Monthly Messages (approx.)</label>
            <select value={form.monthly_messages} onChange={e => set("monthly_messages", e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: C.bg3, border: `1px solid ${C.border2}`, color: C.text, fontSize: 13 }}>
              <option value="">Select range</option>
              <option value="<100">Less than 100</option>
              <option value="100-500">100 – 500</option>
              <option value="500-2000">500 – 2,000</option>
              <option value="2000-10000">2,000 – 10,000</option>
              <option value="10000+">10,000+</option>
            </select>
          </div>
        </div>

        {/* Row 4 - Preferred schedule */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Preferred Date *</label>
            <input type="date" value={form.preferred_date} onChange={e => set("preferred_date", e.target.value)} required
              min={new Date().toISOString().split("T")[0]}
              className="auth-input" style={{ width: "100%", colorScheme: "dark" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Preferred Time *</label>
            <select value={form.preferred_time} onChange={e => set("preferred_time", e.target.value)} required
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: C.bg3, border: `1px solid ${C.border2}`, color: C.text, fontSize: 13 }}>
              <option value="">Select time</option>
              {["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Anything else you'd like us to know?</label>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
            placeholder="Tell us about your business, challenges, or what you're hoping Hermes can help with…"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: C.bg3, border: `1px solid ${C.border2}`, color: C.text, fontSize: 13, resize: "vertical" }} />
        </div>

        {err && (
          <div style={{ fontSize: 12, color: C.red, marginBottom: 14, padding: "8px 12px", background: `${C.red}12`, borderRadius: 7, border: `1px solid ${C.red}30` }}>{err}</div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button type="submit" disabled={busy} style={{
            padding: "13px 36px", borderRadius: 11,
            background: busy ? C.bg4 : GOLD_GRADIENT,
            border: "none", color: busy ? C.muted : C.bg0,
            fontSize: 14, fontWeight: 800, cursor: busy ? "not-allowed" : "pointer",
            boxShadow: busy ? "none" : GOLD_GLOW, letterSpacing: "0.4px", transition: "all 0.2s",
          }}>{busy ? "Submitting…" : "Book My Demo ?"}</button>
          <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.5 }}>
            Free, no commitment.<br />We'll reach out within 24 hours.
          </div>
        </div>
      </form>
    </div>
  );
}


// ---------------------------------------------------------------------------
//  PRICING PREVIEW COMPONENT (extracted to allow useState hook)
// ---------------------------------------------------------------------------
function PricingPreview({setMode,focusAuth}) {
  const [billing,setBilling]=useState("monthly");
  const PLANS=[
    {
      name:"Starter",tier:"For solo merchants",monthly:null,annual:null,color:C.cyan,popular:false,badge:"FREE TRIAL",
      freeTier:true,
      features:[{t:"Brands",v:"1 brand"},{t:"Platforms",v:"Facebook + Instagram"},{t:"Inbox",v:"Unified AI Inbox"},{t:"CRM",v:"Basic CRM"},{t:"AI Chatbot",v:"500 AI replies/mo"},{t:"Messages",v:"5,000 msgs/mo"},{t:"Analytics",v:"Basic dashboard"},{t:"ERP",v:"—"},{t:"Market Research",v:"—"},{t:"Social Ads",v:"—"},{t:"Support",v:"Email support"}],
      cta:"Start Free — No Card Needed",highlight:"Full access for 14 days, then upgrade",
    },
    {
      name:"Growth",tier:"Best value for scaling brands",monthly:299000,annual:209300,color:C.gold,popular:true,badge:"BEST VALUE",
      annualDiscount:30,
      features:[{t:"Brands",v:"3 brands"},{t:"Platforms",v:"All 7 platforms"},{t:"Inbox",v:"Unified AI Inbox"},{t:"CRM",v:"Full CRM + Pipeline"},{t:"AI Chatbot",v:"5,000 AI replies/mo"},{t:"Messages",v:"25,000 msgs/mo"},{t:"Analytics",v:"Full Analytics Suite"},{t:"ERP",v:"Inventory + ERP"},{t:"Market Research",v:"10 AI reports/mo"},{t:"Social Ads",v:"Ads Intelligence"},{t:"Support",v:"Priority + Chat"}],
      cta:"Begin Your Ascent ?",highlight:"Most chosen by PH brands",
    },
    {
      name:"Enterprise",tier:"All services, one empire",monthly:299999,annual:149999,color:C.violet,popular:false,badge:"ALL-IN",
      annualDiscount:50,
      features:[{t:"Brands",v:"Unlimited brands"},{t:"Platforms",v:"All platforms + API"},{t:"Inbox",v:"Unlimited AI Inbox"},{t:"CRM",v:"Enterprise CRM + SLA"},{t:"AI Chatbot",v:"Unlimited AI replies"},{t:"Messages",v:"Unlimited messages"},{t:"Analytics",v:"Custom BI dashboards"},{t:"ERP",v:"Advanced ERP + WMS"},{t:"Market Research",v:"Unlimited AI reports"},{t:"Social Ads",v:"Full Ads Suite + API"},{t:"Support",v:"Dedicated CSM"}],
      cta:"Talk to Sales ?",highlight:"Everything included. No limits.",
    },
  ];
  return (
    <div>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:10}}>Simple, Transparent Pricing</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,52px)",fontWeight:700,letterSpacing:"-2px",color:C.text,marginBottom:8,lineHeight:1.05}}>
          Choose your ascent.<br/>
          <span style={{background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pay less as you grow.</span>
        </div>
        <div style={{fontSize:13,color:C.muted,marginBottom:24}}>14-days free trial on all plans · No credit card required </div>
        <div style={{display:"inline-flex",background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:12,padding:4,gap:2,marginBottom:8}}>
          {[["monthly","Monthly"],["annual","Annual"]].map(([k,l])=>(
            <button key={k} onClick={()=>setBilling(k)} style={{
              padding:"9px 24px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,transition:"all 0.18s",
              background:billing===k?GOLD_GRADIENT:"transparent",color:billing===k?C.bg0:C.muted,boxShadow:billing===k?GOLD_GLOW:"none",
            }}>
              {l}
              {k==="annual" && <span style={{marginLeft:6,fontSize:10,padding:"1px 7px",borderRadius:10,background:billing==="annual"?`${C.bg0}44`:`${C.green}22`,color:billing==="annual"?C.bg0:C.green,fontWeight:800}}>up to -50%</span>}
            </button>
          ))}
        </div>
        {billing==="annual" && <div style={{fontSize:12,color:C.green,fontWeight:700}}>?? Growth saves ?89,700/yr · Enterprise saves ?150,000/yr — pay less, scale more!</div>}
        {billing==="monthly" && <div style={{fontSize:12,color:C.muted}}>Switch to annual — Growth saves <span style={{color:C.gold,fontWeight:700}}>30%</span>, Enterprise saves <span style={{color:C.violet,fontWeight:700}}>50%</span></div>}
      </div>

      <div className="pricing-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {PLANS.map((p)=>{
          const monthlyPrice = p.monthly ? Math.round(p.monthly/12) : null;
          const price=billing==="annual"?p.annual:monthlyPrice;
          const savings=p.annualDiscount||0;
          return (
            <div key={p.name} style={{
              background:C.bg2,border:`${p.popular?"2px":"1px"} solid ${p.popular?C.gold:C.border}`,
              borderRadius:18,overflow:"hidden",position:"relative",
              boxShadow:p.popular?`0 0 60px ${C.gold}22`:"none",
              transition:"transform 0.2s,box-shadow 0.2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=p.popular?`0 20px 80px ${C.gold}30`:`0 10px 40px #00000060`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=p.popular?`0 0 60px ${C.gold}22`:"none";}}>
              <div style={{height:3,background:p.popular?GOLD_GRADIENT:`linear-gradient(90deg,${p.color},${p.color}66)`}}/>
              {p.badge && (
                <div style={{padding:"6px 16px",background:p.popular?`${C.gold}18`:`${p.color}18`,borderBottom:`1px solid ${p.popular?C.gold:p.color}33`,textAlign:"center"}}>
                  <span style={{fontSize:9,fontWeight:800,letterSpacing:"1.5px",color:p.popular?C.gold:p.color}}>{p.badge}</span>
                </div>
              )}
              <div style={{padding:"22px 22px 20px"}}>
                <div style={{fontSize:9,color:p.color,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:3}}>{p.name}</div>
                <div style={{fontSize:11,color:C.muted,marginBottom:14}}>{p.tier}</div>

                {/* FREE TIER */}
                {p.freeTier ? (
                  <div style={{marginBottom:6}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:700,color:C.cyan,letterSpacing:"-1px",lineHeight:1}}>Free</div>
                    <div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",background:`${C.cyan}15`,border:`1px solid ${C.cyan}33`,borderRadius:20}}>
                      <span style={{fontSize:11,color:C.cyan,fontWeight:700}}>? 14 days full access</span>
                    </div>
                    <div style={{marginTop:8,fontSize:11,color:C.muted,lineHeight:1.6}}>{p.highlight}</div>
                  </div>
                ) : price ? (
                  /* PAID TIER */
                  <div style={{marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:700,color:C.text,letterSpacing:"-2px",lineHeight:1}}>?{price.toLocaleString()}</div>
                      <div style={{fontSize:13,color:C.muted}}>{billing==="annual"?"/yr":"/mo"}</div>
                    </div>
                    {billing==="annual" && (
                      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,color:C.muted,textDecoration:"line-through"}}>?{p.monthly.toLocaleString()}/yr</span>
                        <span style={{padding:"2px 10px",borderRadius:20,background:`${C.green}18`,color:C.green,fontSize:10,fontWeight:800,border:`1px solid ${C.green}33`}}>SAVE {savings}%</span>
                        <span style={{fontSize:10,color:C.muted}}>˜ ?{Math.round(price/12).toLocaleString()}/mo</span>
                      </div>
                    )}
                    {billing==="monthly" && (
                      <div style={{marginTop:5,fontSize:11,color:C.muted}}>Standard monthly rate. No annual discount applied.</div>
                    )}
                    <div style={{marginTop:8,fontSize:11,color:p.popular?C.gold:C.muted,fontWeight:p.popular?700:400}}>{p.highlight}</div>
                  </div>
                ) : null}
                <button
                  onClick={()=>{setMode(p.name==="Enterprise"?"signin":"signup");focusAuth();}}
                  style={{width:"100%",padding:"13px 16px",borderRadius:11,marginTop:14,marginBottom:18,background:p.popular?GOLD_GRADIENT:`${p.color}18`,border:p.popular?"none":`1px solid ${p.color}55`,color:p.popular?C.bg0:p.color,fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:p.popular?GOLD_GLOW:"none",transition:"all 0.18s",letterSpacing:"0.3px"}}
                  onMouseEnter={e=>{if(!p.popular)e.currentTarget.style.background=`${p.color}28`;}}
                  onMouseLeave={e=>{if(!p.popular)e.currentTarget.style.background=`${p.color}18`;}}
                >{p.cta}</button>
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
                  {p.features.map((f,j)=>(
                    <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:j<p.features.length-1?`1px solid ${C.border}22`:"none",fontSize:11}}>
                      <span style={{color:C.muted}}>{f.t}</span>
                      <span style={{
                        color:f.v==="—"?C.dim:f.v.includes("Unlimited")||f.v.includes("All 7")||f.v.includes("Full")||f.v.includes("Advanced")||f.v.includes("Enterprise")||f.v.includes("Custom pricing")||f.v.includes("Dedicated")?p.color:C.text,
                        fontWeight:f.v==="—"?400:600,
                        textDecoration:f.v==="—"?"line-through":"none",
                      }}>{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop:24,padding:"16px 24px",background:C.bg3,borderRadius:12,border:`1px solid ${C.border}`,display:"flex",justifyContent:"center",gap:28,flexWrap:"wrap",alignItems:"center"}}>
        {[["??","Secured by Supabase"],["??","Privacy compliant"],["??","No credit card for trial"],["??","Cancel anytime"],["????","Built for PH"],["?","14-day free trial"]].map(([ic,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.muted}}><span style={{fontSize:14}}>{ic}</span><span>{l}</span></div>
        ))}
      </div>
    </div>
  );
}


function LandingPage() {
  useIubendaEmbed();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [mode,setMode]=useState("signin");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [navScrolled,setNavScrolled]=useState(false);
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const emailRef = useRef(null);
  const [showPass,setShowPass]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const [activePreview,setActivePreview]=useState(null); // "Platform"|"CRM"|"ERP"|"Analytics"|"Pricing"|null

  const openPreview=(tab)=>{
    setActivePreview(tab);
    setMobileMenuOpen(false);
    setTimeout(()=>document.getElementById("nav-preview-section")?.scrollIntoView({behavior:"smooth",block:"start"}),80);
  };

  const focusAuth=()=>{
    document.getElementById("auth-card")?.scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>emailRef.current?.focus(),400);
  };

  const submit=async(e)=>{
    e.preventDefault();
    if(mode==="signup" && password !== confirmPassword){
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try{
      if(mode==="signin"){
        const { error:err } = await supabase.auth.signInWithPassword({email,password});
        if(err) throw err;
      }else{
        const { error:err } = await supabase.auth.signUp({email,password});
        if(err) throw err;
      }
    }catch(err){
      setError(err?.message||"Authentication failed.");
    }finally{
      setBusy(false);
    }
  };

  const [count,setCount]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setCount(c=>c<3842?c+Math.ceil((3842-c)/18):3842),25);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    const onScroll=()=>setNavScrolled(window.scrollY>40);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  const FEATURES=[
    {icon:"?",title:"Sacred Inbox",sub:"Social Commerce",desc:"AI-powered unified inbox across Facebook, Instagram, TikTok, Shopee, Lazada & more — reply at godspeed.",color:C.gold,accent:`${C.gold}18`},
    {icon:"?",title:"Merchant CRM",sub:"Customer Intelligence",desc:"360° customer profiles, lead scoring, pipeline management, and lifetime value tracking across all brands.",color:C.cyan,accent:`${C.cyan}18`},
    {icon:"?",title:"Olympian ERP",sub:"Inventory & Ops",desc:"Real-time stock management, automated reorder alerts, margin analysis, and multi-brand product catalog.",color:C.green,accent:`${C.green}18`},
    {icon:"?",title:"Oracle Analytics",sub:"Revenue Intelligence",desc:"Revenue forecasting, cohort analysis, funnel metrics, and cross-platform performance dashboards.",color:C.violet,accent:`${C.violet}18`},
    {icon:"?",title:"Agora Demographics",sub:"Market Intelligence",desc:"Geographic heatmaps, age/gender breakdowns, behavioral segmentation and psychographic profiling.",color:C.amber,accent:`${C.amber}18`},
    {icon:"?",title:"Pythian Research",sub:"Market Research AI",desc:"Keyword intelligence, competitor benchmarking, sentiment analysis, and AI-generated market reports.",color:C.rose,accent:`${C.rose}18`},
    {icon:"?",title:"Hermes AI Chatbot",sub:"Conversational AI",desc:"Smart auto-replies in Taglish — trained on your brand voice, products, and FAQs. Live 24/7 across all platforms.",color:C.amber,accent:`${C.amber}18`},
    {icon:"?",title:"Agora Social Ads",sub:"Ads Intelligence",desc:"Track ROAS, optimize ad creatives, and attribute revenue across Facebook, TikTok, and Shopee Ads.",color:C.violet,accent:`${C.violet}18`},
  ];

  const USE_CASES=[
    {label:"E-Commerce",icon:"???",desc:"Streamline management, automation & revenue growth"},
    {label:"Fashion",icon:"??",desc:"From design to production & multi-channel sales"},
    {label:"Beauty & Spa",icon:"?",desc:"Scheduling, support & client management"},
    {label:"Food & Bev",icon:"??",desc:"Orders, loyalty & customer engagement"},
    {label:"EdTech",icon:"??",desc:"Management, automation & enrollment workflows"},
    {label:"Retail",icon:"??",desc:"Automate responses & foster customer relationships"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg0,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes glowPulse{0%,100%{box-shadow:${GOLD_GLOW}}50%{box-shadow:0 0 50px ${C.gold}60,0 0 100px ${C.gold}30}}
        *{box-sizing:border-box;margin:0;padding:0;}
        input,button,select,textarea{font-family:inherit;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:${C.bg0};} ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px;}
        .nav-link{cursor:pointer;transition:color 0.2s;letter-spacing:0.3px;font-size:13px;color:${C.muted};}
        .nav-link:hover{color:${C.gold};}
        .feat-card{transition:all 0.22s;cursor:default;}
        .feat-card:hover{transform:translateY(-4px);}
        .use-card{transition:all 0.2s;cursor:default;}
        .use-card:hover{transform:translateY(-3px);}
        .auth-input{width:100%;padding:10px 12px;border-radius:8px;background:${C.bg3};border:1px solid ${C.border2};color:${C.text};font-size:13px;outline:none;transition:border-color 0.2s;}
        .auth-input:focus{border-color:${C.gold}88;}
        .auth-tab{flex:1;padding:9px 10px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:0.4px;transition:all 0.18s;}

        /* -- Responsive nav -- */
        .nav-links-desktop{display:flex;gap:30px;align-items:center;}
        .nav-btns-desktop{display:flex;gap:10px;align-items:center;}
        .nav-hamburger{display:none;background:transparent;border:1px solid ${C.border2};color:${C.muted};border-radius:8px;padding:6px 10px;cursor:pointer;font-size:18px;line-height:1;}
        .mobile-menu{display:none;}

        /* -- Hero grid -- */
        .hero-grid{display:grid;grid-template-columns:1fr 420px;gap:60px;align-items:center;padding:64px 60px 80px;max-width:1280px;margin:0 auto;min-height:calc(100vh - 64px);position:relative;z-index:1;}

        /* -- Features grid -- */
        .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border-radius:18px;overflow:hidden;border:1px solid ${C.border};}
        .feat-border-r{border-right:1px solid ${C.border};}
        .feat-border-b{border-bottom:1px solid ${C.border};}

        /* -- Use cases grid -- */
        .use-cases-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;}

        /* -- Stats block -- */
        .stats-block{display:inline-grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid ${C.border};border-radius:16px;overflow:hidden;margin-bottom:48px;background:${C.bg2};}
        .stats-block-item{padding:24px 40px;text-align:center;}

        /* -- Section padding -- */
        .section-pad{padding:90px 60px;}
        .section-pad-md{padding:80px 60px;}
        .footer-inner{padding:40px 60px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;}

        /* --------------------------------
           TABLET  = 1024px
        -------------------------------- */
        @media(max-width:1024px){
          .hero-grid{grid-template-columns:1fr;gap:40px;padding:40px 32px 60px;min-height:auto;}
          .features-grid{grid-template-columns:repeat(2,1fr);}
          .feat-border-r:nth-child(2n){border-right:none;}
          .feat-border-b{border-bottom:1px solid ${C.border};}
          .use-cases-grid{grid-template-columns:repeat(3,1fr);}
          .section-pad{padding:60px 32px;}
          .section-pad-md{padding:60px 32px;}
          .footer-inner{padding:32px;}
          .stats-block-item{padding:20px 24px;}
          .nav-preview-content{padding:24px 28px !important;}
          .preview-two-col{grid-template-columns:1fr !important;}
          .preview-five-col{grid-template-columns:repeat(3,1fr) !important;}
          .preview-kpi-row{grid-template-columns:repeat(2,1fr) !important;}
          .pricing-grid{grid-template-columns:1fr !important;}
          .chat-preview-grid{grid-template-columns:1fr !important;}
        }

        /* --------------------------------
           SMALL TABLET  = 768px
        -------------------------------- */
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr;gap:28px;padding:32px 24px 48px;min-height:auto;}
          .features-grid{grid-template-columns:repeat(2,1fr);}
          .use-cases-grid{grid-template-columns:repeat(2,1fr);}
          .section-pad{padding:48px 24px;}
          .section-pad-md{padding:48px 24px;}
          .stats-block{display:grid;grid-template-columns:repeat(3,1fr);width:100%;}
          .nav-preview-content{padding:20px 16px !important;}
          .preview-three-col{grid-template-columns:repeat(2,1fr) !important;}
          .preview-kpi-row{grid-template-columns:repeat(2,1fr) !important;}
          .pricing-grid{grid-template-columns:1fr !important;}
          .campaign-table{font-size:10px !important;}
        }

        /* --------------------------------
           MOBILE  = 640px
        -------------------------------- */
        @media(max-width:640px){
          .nav-links-desktop{display:none;}
          .nav-btns-desktop{display:none;}
          .nav-hamburger{display:block;}
          .mobile-menu{display:flex;flex-direction:column;gap:0;position:absolute;top:64px;left:0;right:0;background:${C.bg1};border-bottom:1px solid ${C.border};z-index:200;padding:16px 20px;}
          .mobile-menu.closed{display:none;}
          .hero-grid{grid-template-columns:1fr;gap:24px;padding:24px 16px 40px;min-height:auto;}
          .features-grid{grid-template-columns:1fr;}
          .feat-border-r{border-right:none;}
          .use-cases-grid{grid-template-columns:repeat(2,1fr);}
          .section-pad{padding:40px 16px;}
          .section-pad-md{padding:40px 16px;}
          .footer-inner{padding:20px 16px;flex-direction:column;align-items:flex-start;gap:14px;}
          .stats-block{display:grid;grid-template-columns:1fr;width:100%;}
          .stats-block-item{padding:16px 18px;border-right:none !important;border-bottom:1px solid ${C.border};}
          .stats-block-item:last-child{border-bottom:none;}
          .hero-badge{font-size:9px !important;letter-spacing:1.2px !important;padding:5px 12px !important;}
          .hero-btns{flex-direction:column !important;}
          .hero-btns button{width:100%;}
          .cta-btns{flex-direction:column;align-items:stretch !important;}
          .cta-btns button{width:100%;}
          nav{padding:0 16px !important;}
          .preview-three-col{grid-template-columns:1fr !important;}
          .preview-two-col{grid-template-columns:1fr !important;}
          .preview-five-col{grid-template-columns:repeat(2,1fr) !important;}
          .preview-kpi-row{grid-template-columns:repeat(2,1fr) !important;}
          .pricing-grid{grid-template-columns:1fr !important;}
          .chat-preview-grid{grid-template-columns:1fr !important;}
          .nav-preview-content{padding:16px 14px !important;}
          .hero-auth-card{display:none;}
        }

        /* --------------------------------
           SMALL MOBILE  = 400px
        -------------------------------- */
        @media(max-width:400px){
          .hero-grid{padding:20px 14px 36px;}
          .section-pad{padding:32px 14px;}
          .section-pad-md{padding:32px 14px;}
          .nav-preview-content{padding:12px 10px !important;}
          .preview-five-col{grid-template-columns:1fr 1fr !important;}
          .preview-kpi-row{grid-template-columns:1fr 1fr !important;}
          .use-cases-grid{grid-template-columns:1fr !important;}
        }
      `}</style>

      {/* -- Fixed grid bg -- */}
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:"80px 80px",opacity:0.2,pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse 80% 55% at 50% -5%,${C.gold}14,transparent)`,pointerEvents:"none"}}/>

      {/* -------------- STICKY NAV -------------- */}
      <nav style={{
        position:"sticky",top:0,zIndex:100,
        display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"0 60px",height:64,
        background:navScrolled?`${C.bg0}ee`:"transparent",
        backdropFilter:navScrolled?"blur(12px)":"none",
        borderBottom:`1px solid ${navScrolled?C.border:"transparent"}`,
        transition:"all 0.3s",
      }}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{animation:"float 4s ease-in-out infinite"}}>
            <HermesLogo size={30}/>
          </div>
          <div>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,letterSpacing:"1.5px",color:C.text}}>
              <ExponifyWord/>
            </span>
            <span style={{display:"block",fontSize:7,color:C.gold,letterSpacing:"3px",fontWeight:600,textTransform:"uppercase",marginTop:-1}}>Powered by Hermes</span>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="nav-links-desktop">
          {["Platform","CRM","ERP","Analytics","AI Chatbot","Market Research","Social Ads","Pricing"].map(l=>(
            <span key={l} className="nav-link" onClick={()=>openPreview(l)} style={{color:activePreview===l?C.gold:C.muted,fontSize:12}}>{l}</span>
          ))}
        </div>

        {/* Desktop nav buttons */}
        <div className="nav-btns-desktop">
          <button onClick={()=>{setMode("signin");focusAuth();}} style={{
            padding:"8px 20px",borderRadius:9,background:"transparent",
            border:`1px solid ${C.border2}`,color:C.muted,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.18s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border2;e.currentTarget.style.color=C.muted;}}>
            Sign In
          </button>
          <button onClick={()=>{setMode("signup");focusAuth();}} style={{
            padding:"8px 20px",borderRadius:9,background:GOLD_GRADIENT,
            border:"none",color:C.bg0,fontSize:12,fontWeight:800,cursor:"pointer",
            boxShadow:GOLD_GLOW,transition:"all 0.2s",animation:"glowPulse 4s ease infinite",
          }}>Get Started ?</button>
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={()=>setMobileMenuOpen(o=>!o)}>
          {mobileMenuOpen ? "?" : "?"}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div className={`mobile-menu${mobileMenuOpen?"":" closed"}`} style={{position:"sticky",top:64,zIndex:99}}>
        {["Platform","CRM","ERP","Analytics","AI Chatbot","Market Research","Social Ads","Pricing"].map(l=>(
          <span key={l} onClick={()=>openPreview(l)} style={{padding:"12px 4px",fontSize:14,color:activePreview===l?C.gold:C.muted,borderBottom:`1px solid ${C.border}`,cursor:"pointer",fontWeight:activePreview===l?700:400}}>{l}</span>
        ))}
        <div style={{display:"flex",gap:10,paddingTop:14,paddingBottom:4}}>
          <button onClick={()=>{setMode("signin");setMobileMenuOpen(false);focusAuth();}} style={{
            flex:1,padding:"10px",borderRadius:9,background:"transparent",
            border:`1px solid ${C.border2}`,color:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",
          }}>Sign In</button>
          <button onClick={()=>{setMode("signup");setMobileMenuOpen(false);focusAuth();}} style={{
            flex:1,padding:"10px",borderRadius:9,background:GOLD_GRADIENT,
            border:"none",color:C.bg0,fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:GOLD_GLOW,
          }}>Get Started ?</button>
        </div>
      </div>

      {/* -------------- HERO -------------- */}
      <section className="hero-grid">
        {/* Left: copy */}
        <div>
          <div className="hero-badge" style={{
            display:"inline-flex",alignItems:"center",gap:8,
            background:`${C.gold}10`,border:`1px solid ${C.gold}28`,
            borderRadius:20,padding:"5px 16px",marginBottom:24,
            fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"2px",
            animation:"fadeUp 0.4s ease both",
          }}>? BUILT FOR PHILIPPINE COMMERCE · POWERED BY AI</div>

          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(38px,5.5vw,76px)",
            fontWeight:700,lineHeight:1.05,letterSpacing:"-2px",
            marginBottom:16,animation:"fadeUp 0.5s ease 0.08s both",
            color:C.text,
          }}>
            One Platform.<br/>
            <span style={{background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Exponential Growth.</span>
          </h1>

          <p style={{
            fontSize:16,color:C.muted,lineHeight:1.85,
            maxWidth:520,marginBottom:32,
            animation:"fadeUp 0.5s ease 0.16s both",
          }}>
            Exponify unifies social media automation, CRM, ERP, and AI-powered market intelligence — powered by Hermes for fast-scaling Filipino brands.
          </p>

          <div className="hero-btns" style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:40,animation:"fadeUp 0.5s ease 0.22s both"}}>
            <button onClick={()=>{setMode("signup");focusAuth();}} style={{
              padding:"13px 32px",borderRadius:10,background:GOLD_GRADIENT,
              border:"none",color:C.bg0,fontSize:14,fontWeight:800,cursor:"pointer",
              boxShadow:GOLD_GLOW,letterSpacing:"0.3px",transition:"all 0.2s",
            }}>Begin Your Ascent ?</button>
            <button onClick={()=>document.getElementById("demo-section")?.scrollIntoView({behavior:"smooth",block:"start"})} style={{
              padding:"13px 32px",borderRadius:10,background:"transparent",
              border:`1px solid ${C.gold}55`,color:C.gold,
              fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.3px",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=`${C.gold}12`;}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
              Book a Demo
            </button>
            <button onClick={()=>{setMode("signin");focusAuth();}} style={{
              padding:"13px 32px",borderRadius:10,background:"transparent",
              border:`1px solid ${C.border2}`,color:C.text,
              fontSize:14,fontWeight:500,cursor:"pointer",transition:"all 0.2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border2;e.currentTarget.style.color=C.text;}}>
              Sign In
            </button>
          </div>

          {/* Trusted by */}
          <div style={{animation:"fadeUp 0.5s ease 0.28s both"}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12,fontWeight:600}}>Trusted by brands across platforms</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {Object.entries(PLATFORMS_META).map(([id,p])=>(
                <div key={id} style={{
                  display:"flex",alignItems:"center",gap:5,
                  padding:"4px 10px",borderRadius:8,
                  background:`${p.color}0f`,border:`1px solid ${p.color}28`,
                  fontSize:11,fontWeight:700,color:p.color,
                }}>
                  <span>{p.icon}</span><span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Auth card */}
        <div id="auth-card" className="hero-auth-card" style={{
          background:C.bg2,border:`1px solid ${C.border2}`,borderRadius:18,
          boxShadow:`0 40px 100px #00000080, 0 0 0 1px ${C.gold}18`,
          padding:"28px 28px 24px",position:"relative",
          animation:"fadeUp 0.5s ease 0.1s both",
        }}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:GOLD_GRADIENT,borderRadius:"18px 18px 0 0"}}/>

          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <HermesLogo size={28}/>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,letterSpacing:"1px",color:C.text}}>
                <ExponifyWord/>
              </div>
              <div style={{fontSize:8,color:C.gold,letterSpacing:"2.5px",fontWeight:700,textTransform:"uppercase"}}>Powered by Hermes</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:6,marginBottom:18,background:C.bg3,padding:4,borderRadius:11}}>
            {[{id:"signin",label:"Sign In"},{id:"signup",label:"Create Account"}].map(t=>(
              <button key={t.id} className="auth-tab" onClick={()=>setMode(t.id)} style={{
                border:`1px solid ${mode===t.id?C.gold+"44":"transparent"}`,
                background:mode===t.id?C.bg4:"transparent",
                color:mode===t.id?C.gold:C.muted,
              }}>{t.label}</button>
            ))}
          </div>

          <form onSubmit={submit}>
            <label style={{display:"block",fontSize:9,color:C.muted,letterSpacing:"1.5px",marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>Email</label>
            <input ref={emailRef} type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              placeholder="you@company.com" className="auth-input" style={{marginBottom:14}}/>

            <label style={{display:"block",fontSize:9,color:C.muted,letterSpacing:"1.5px",marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>Password</label>
            <div style={{position:"relative",marginBottom:16}}>
              <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required
                placeholder="••••••••" className="auth-input" style={{paddingRight:38}}/>
              <button type="button" onClick={()=>setShowPass(s=>!s)} aria-label={showPass?"Hide password":"Show password"} style={{
                position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                background:"transparent",border:`1px solid ${C.border2}`,color:C.muted,cursor:"pointer",
                width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke={C.muted} strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3.5" stroke={C.muted} strokeWidth="1.5"/>
                  {showPass && <path d="M4 4l16 16" stroke={C.muted} strokeWidth="1.5" />}
                </svg>
              </button>
            </div>

            {mode==="signup" && (
              <>
                <label style={{display:"block",fontSize:9,color:C.muted,letterSpacing:"1.5px",marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>Confirm Password</label>
                <div style={{position:"relative",marginBottom:16}}>
                  <input type={showConfirm?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required
                    placeholder="••••••••" className="auth-input" style={{paddingRight:38}}/>
                  <button type="button" onClick={()=>setShowConfirm(s=>!s)} aria-label={showConfirm?"Hide password":"Show password"} style={{
                    position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                    background:"transparent",border:`1px solid ${C.border2}`,color:C.muted,cursor:"pointer",
                    width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke={C.muted} strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="3.5" stroke={C.muted} strokeWidth="1.5"/>
                      {showConfirm && <path d="M4 4l16 16" stroke={C.muted} strokeWidth="1.5" />}
                    </svg>
                  </button>
                </div>
              </>
            )}

            {error&&(
              <div style={{fontSize:11,color:C.red,marginBottom:12,padding:"8px 12px",background:`${C.red}12`,borderRadius:7,border:`1px solid ${C.red}30`}}>
                {error}
              </div>
            )}

            <button type="submit" disabled={busy} style={{
              width:"100%",padding:"13px 16px",borderRadius:10,
              background:busy?C.bg4:GOLD_GRADIENT,
              border:"none",color:busy?C.muted:C.bg0,
              fontWeight:800,fontSize:13,cursor:busy?"not-allowed":"pointer",
              boxShadow:busy?"none":GOLD_GLOW,letterSpacing:"0.4px",transition:"all 0.2s",
            }}>{busy?"Please wait…":mode==="signin"?"Enter Exponify ?":"Create Account ?"}</button>
          </form>

          <div style={{marginTop:14,padding:"10px 14px",background:C.bg3,borderRadius:9,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,color:C.muted,lineHeight:1.6}}>
              ?? Secured by Supabase Auth. After sign up, check your inbox if email confirmation is required.
            </div>
          </div>

          <div style={{marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <div style={{display:"flex"}}>
              {["#f87171","#fbbf24","#34d399","#38bdf8"].map((c,i)=>(
                <div key={i} style={{width:22,height:22,borderRadius:"50%",background:`${c}33`,border:`2px solid ${C.bg2}`,
                  marginLeft:i?-6:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:c,fontWeight:800}}>
                  {["M","J","C","P"][i]}
                </div>
              ))}
            </div>
            <span style={{fontSize:10,color:C.muted}}>
              <span style={{color:C.gold,fontWeight:700}}>{count.toLocaleString()}+</span> merchants onboarded
            </span>
          </div>

          <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
            <LegalPolicyLinks center compact />
          </div>
        </div>
      </section>

      {/* -------------- STATS TICKER -------------- */}
      <div style={{
        borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,
        background:`linear-gradient(90deg,${C.bg0},${C.bg1},${C.bg0})`,
        overflow:"hidden",position:"relative",zIndex:1,
      }}>
        <div style={{display:"flex",animation:"ticker 28s linear infinite",width:"max-content"}}>
          {[...Array(2)].map((_,rep)=>(
            <div key={rep} style={{display:"flex"}}>
              {[
                {val:`${count.toLocaleString()}+`,label:"Merchants Empowered"},
                {val:"7",label:"Platforms Connected"},
                {val:"0.8s",label:"Avg. Response Time"},
                {val:"?2.4B+",label:"Commerce Processed"},
                {val:"99.98%",label:"Uptime SLA"},
                {val:"14-days",label:"Free Trial"},
                {val:"24/7",label:"AI Support"},
              ].map((s,i)=>(
                <div key={i} style={{
                  padding:"20px 36px",display:"flex",alignItems:"center",gap:12,
                  borderRight:`1px solid ${C.border}`,whiteSpace:"nowrap",
                }}>
                  <div style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:25,fontWeight:700,letterSpacing:"-0.5px",
                    background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                  }}>{s.val}</div>
                  <div style={{fontSize:13,color:C.muted,letterSpacing:"0.5px"}}>{s.label}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* -------------- COMPANY PARTNERS -------------- */}
      <section style={{
        borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,
        background:`linear-gradient(180deg,${C.bg1},${C.bg0})`,
        position:"relative",zIndex:1,padding:"60px 0",
      }}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 50% 80% at 50% 50%,${C.gold}06,transparent)`,pointerEvents:"none"}}/>
        <div style={{textAlign:"center",marginBottom:40,padding:"0 24px"}}>
          <div style={{fontSize:28,color:C.gold,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:5}}>YOUR GROWTH, OUR COMMITMENT.</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,letterSpacing:"-0.5px",color:C.text,lineHeight:1.2}}>
            Empowering our trusted partners to grow exponentially.<br/>
            <span style={{background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>unified across every platform.</span>
          </div>
        </div>

        {/* Row 1 — scrolling left */}
        <div style={{overflow:"hidden",position:"relative",marginBottom:16}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:120,background:`linear-gradient(90deg,${C.bg0},transparent)`,zIndex:2,pointerEvents:"none"}}/>
          <div style={{position:"absolute",right:0,top:0,bottom:0,width:120,background:`linear-gradient(270deg,${C.bg0},transparent)`,zIndex:2,pointerEvents:"none"}}/>
          <div style={{display:"flex",animation:"ticker 28s linear infinite",width:"max-content"}}>
            {[...Array(2)].map((_,rep)=>(
              <div key={rep} style={{display:"flex",alignItems:"center",gap:0}}>
                {[
                  {name:"Crystal Escapes Travel Adventure",color:"#29c23b",sub:"Travel & Adventure",img:"/CRYSTAL_ESCAPES_TRAVEL_ADVENTURE.jpg"},
                  {name:"Bayani Network Thailand",color:"#56762a",sub:"Business Network",img:"/BAYANI_NETWORK_THAILAND.jpg"},
                  {name:"Bayani Cash Financing Loan",color:"#dddd1b",sub:"Financing & Loans",img:"/BAYANI_CASH_FINANCING_LOAN.jpg"},
                  {name:"DR Burger Cafe",icon:"??",color:"#b31b3a",sub:"Bistro & Dining",img:"/DR_BURGER_CAFE.jpg"},
                  {name:"Casa Panzerotti",icon:"??",color:"#d4af37",sub:"Italian Street Food",img:"/CASA_PANZEROTTI.jpg"},
                  {name:"Pritos King",icon:"??",color:"#e6b800",sub:"Est. 2025",img:"/PRITOS_KING.jpg"},
                  {name:"HFRR Realty",icon:"??",color:"#e86a10",sub:"Filipino Rev. Realty",img:"/HFRR.jpg"},
                ].map((p,i)=>(
                  <div key={`${rep}-${i}`} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 28px",borderRight:`1px solid ${C.border}`,whiteSpace:"nowrap"}}>
                    <div style={{width:120,height:120,borderRadius:10,background:`${p.color}18`,border:`1px solid ${p.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:p.color,flexShrink:0,overflow:"hidden"}}>
                      {p.img
                        ? <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:9}}/>
                        : p.icon
                      }
                    </div>
                    <div>
                      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:"0.2px"}}>{p.name}</div>
                      <div style={{fontSize:15,color:C.muted,textTransform:"uppercase",letterSpacing:"1px"}}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:"flex",justifyContent:"center",gap:0,marginTop:40,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:C.bg2}}>
          {[
            {val:"18+",label:"Platform Integrations"},
            {val:"?2.4B+",label:"Commerce Processed"},
            {val:"3,842+",label:"Brands Onboarded"},
            {val:"99.98%",label:"Uptime Guaranteed"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,textAlign:"center",padding:"22px 0",borderRight:i<3?`1px solid ${C.border}`:"none"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,letterSpacing:"-1px",background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.val}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:3,textTransform:"uppercase",letterSpacing:"1.5px"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------- NAV PREVIEW SECTION -------------- */}
      {activePreview && (
        <section id="nav-preview-section" style={{
          borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,
          background:C.bg1,position:"relative",zIndex:1,
        }}>
          {/* Tab bar */}
          <div style={{display:"flex",borderBottom:`1px solid ${C.border2}`,background:C.bg0,overflowX:"auto"}}>
            {["Platform","CRM","ERP","Analytics","AI Chatbot","Market Research","Social Ads","Pricing"].map(t=>(
              <button key={t} onClick={()=>setActivePreview(t)} style={{
                padding:"13px 20px",fontSize:11,fontWeight:700,cursor:"pointer",
                color:activePreview===t?C.gold:C.muted,
                borderBottom:`2px solid ${activePreview===t?C.gold:"transparent"}`,
                background:"transparent",border:"none",
                borderRight:`1px solid ${C.border}`,whiteSpace:"nowrap",
                letterSpacing:"0.4px",transition:"all 0.18s",flexShrink:0,
              }}>{t}</button>
            ))}
            <button onClick={()=>setActivePreview(null)} style={{
              marginLeft:"auto",padding:"13px 20px",fontSize:18,
              background:"transparent",border:"none",color:C.muted,cursor:"pointer",
              borderLeft:`1px solid ${C.border}`,flexShrink:0,
            }}>?</button>
          </div>

          <div className="nav-preview-content" style={{maxWidth:1280,margin:"0 auto",padding:"32px 40px"}}>

            {/* -- PLATFORM -- */}
            {activePreview==="Platform" && (
              <div>
                <div style={{marginBottom:28}}>
                  <div style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:10}}>The Divine Toolkit</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:C.text,marginBottom:10,letterSpacing:"-0.5px"}}>
                    Eight sacred instruments, <span style={{background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>one unified platform.</span>
                  </div>
                  <div style={{fontSize:13,color:C.muted,maxWidth:560,lineHeight:1.8}}>
                    Exponify unifies social commerce, CRM, ERP, AI chatbot, market research, social ads, and demographics — powered by Hermes for fast-scaling Filipino brands.
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,borderRadius:16,overflow:"hidden",border:`1px solid ${C.border}`}}>
                  {FEATURES.map((f,i)=>(
                    <div key={i} style={{background:C.bg2,padding:"24px 22px",borderRight:i%3<2?`1px solid ${C.border}`:"none",borderBottom:i<6?`1px solid ${C.border}`:"none",transition:"background 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.bg3} onMouseLeave={e=>e.currentTarget.style.background=C.bg2}>
                      <div style={{width:42,height:42,borderRadius:10,background:f.accent,border:`1px solid ${f.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:f.color,marginBottom:14}}>{f.icon}</div>
                      <div style={{fontSize:8,color:f.color,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:5}}>{f.sub}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:C.text,marginBottom:7}}>{f.title}</div>
                      <div style={{fontSize:12,color:C.muted,lineHeight:1.75}}>{f.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:20,display:"flex",gap:8,flexWrap:"wrap"}}>
                  {Object.entries(PLATFORMS_META).map(([id,p])=>(
                    <div key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:`${p.color}0f`,border:`1px solid ${p.color}28`,fontSize:11,fontWeight:700,color:p.color}}>
                      <span>{p.icon}</span><span>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -- CRM -- */}
            {activePreview==="CRM" && (
              <div>
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:9,color:C.cyan,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:8}}>Merchant CRM · Customer Intelligence</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:8}}>360° customer profiles, <span style={{color:C.cyan}}>live from your inbox.</span></div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.8}}>Lead scoring, pipeline management, and lifetime value tracking across all your brands and platforms.</div>
                </div>
                <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16,background:C.bg2}}>
                  {[["Total Contacts","1,247",C.gold],["Customer LTV","?284K",C.green],["Avg Score","74",C.amber],["At Risk","18",C.red]].map((k,i)=>(
                    <div key={i} style={{flex:1,padding:"14px 16px",textAlign:"center",borderRight:i<3?`1px solid ${C.border}`:"none"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:k[2]}}>{k[1]}</div>
                      <div style={{fontSize:10,color:C.muted,marginTop:3}}>{k[0]}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"9px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
                    {["Contact","Stage","Platform","LTV","Score"].map(h=>(<div key={h} style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</div>))}
                  </div>
                  {[
                    {name:"Maria Santos",init:"MS",col:C.rose,stage:"Customer",sc:C.green,plat:"Instagram",ltv:"?48,200",score:92},
                    {name:"Paolo Tan",init:"PT",col:C.gold,stage:"Customer",sc:C.green,plat:"Shopee",ltv:"?91,400",score:98},
                    {name:"Jun Reyes",init:"JR",col:C.violet,stage:"Lead",sc:C.cyan,plat:"Facebook",ltv:"?12,500",score:64},
                    {name:"Carla Cruz",init:"CC",col:C.green,stage:"Prospect",sc:C.violet,plat:"TikTok",ltv:"?28,900",score:78},
                    {name:"Rhea Mendoza",init:"RM",col:C.cyan,stage:"Lead",sc:C.cyan,plat:"Instagram",ltv:"?18,700",score:71},
                  ].map((c,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:i<4?`1px solid ${C.border}`:"none",alignItems:"center",transition:"background 0.12s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.bg3} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:`${c.col}22`,border:`1.5px solid ${c.col}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:c.col,flexShrink:0}}>{c.init}</div>
                        <span style={{fontSize:12,fontWeight:600,color:C.text}}>{c.name}</span>
                      </div>
                      <div><span style={{padding:"2px 9px",borderRadius:5,fontSize:10,fontWeight:700,background:`${c.sc}18`,color:c.sc,border:`1px solid ${c.sc}30`}}>{c.stage}</span></div>
                      <div style={{fontSize:11,color:C.muted}}>{c.plat}</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.green}}>{c.ltv}</div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <div style={{width:36,height:4,background:C.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${c.score}%`,background:c.score>70?C.green:c.score>40?C.amber:C.red}}/></div>
                        <span style={{fontSize:10,fontWeight:700,color:c.score>70?C.green:c.score>40?C.amber:C.red}}>{c.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12,fontSize:11,color:C.muted}}>+ AI-powered customer insights, activity logs, and pipeline automation</div>
              </div>
            )}

            {/* -- ERP -- */}
            {activePreview==="ERP" && (
              <div>
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:9,color:C.green,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:8}}>Olympian ERP · Inventory & Operations</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:8}}>Real-time stock, <span style={{color:C.green}}>zero surprises.</span></div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.8}}>Automated reorder alerts, margin analysis, and multi-brand product catalog — all in one view.</div>
                </div>
                <div className="preview-kpi-row" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
                  {[["Total SKUs","38",C.gold,"??"],["Inventory Value","?1.4M",C.green,"??"],["Gross Revenue","?9.2M",C.amber,"??"],["Critical Stock","2",C.red,"??"]].map((k,i)=>(
                    <div key={i} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",borderTop:`2px solid ${k[2]}`}}>
                      <div style={{fontSize:9,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{k[3]} {k[0]}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:900,background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{k[1]}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2.5fr 1fr 1fr 1fr 1fr 1fr",padding:"9px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
                    {["Product","Category","Stock","Price","Margin","Status"].map(h=>(<div key={h} style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</div>))}
                  </div>
                  {erpInventory.map((p,i)=>{
                    const sc=p.status==="critical"?C.red:p.status==="low"?C.amber:C.green;
                    const margin=p.price>0?Math.round(((p.price-p.cost)/p.price)*100):0;
                    return (
                      <div key={i} style={{display:"grid",gridTemplateColumns:"2.5fr 1fr 1fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:i<erpInventory.length-1?`1px solid ${C.border}`:"none",alignItems:"center",transition:"background 0.12s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bg3} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{fontSize:12,fontWeight:600,color:C.text}}>{p.name}</div>
                        <div><span style={{padding:"2px 8px",borderRadius:4,fontSize:9,background:`${C.gold}12`,color:C.gold,border:`1px solid ${C.gold}22`,fontWeight:700}}>{p.category}</span></div>
                        <div style={{fontWeight:700,color:sc,fontSize:12}}>{p.stock.toLocaleString()}</div>
                        <div style={{color:C.green,fontWeight:700,fontSize:12}}>?{p.price.toLocaleString()}</div>
                        <div style={{fontWeight:700,color:margin>40?C.green:C.amber,fontSize:12}}>{margin}%</div>
                        <div><span style={{padding:"2px 8px",borderRadius:4,fontSize:9,background:`${sc}18`,color:sc,border:`1px solid ${sc}30`,fontWeight:700}}>{p.status==="critical"?"?? Critical":p.status==="low"?"?? Low":"?? OK"}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* -- ANALYTICS -- */}
            {activePreview==="Analytics" && (
              <div>
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:9,color:C.violet,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:8}}>Oracle Analytics · Revenue Intelligence</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:8}}>Revenue forecasting, <span style={{color:C.violet}}>powered by Hermes AI.</span></div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.8}}>Funnel metrics, cross-platform performance, cohort analysis, and sentiment trends — all in one dashboard.</div>
                </div>
                <div className="preview-kpi-row" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
                  {[["Total Contacts","1,247",C.gold,"??"],["Customers","248",C.green,"?"],["Avg. LTV","?42K",C.cyan,"??"],["Open Convos","36",C.amber,"??"]].map((k,i)=>(
                    <div key={i} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",borderTop:`2px solid ${k[2]}`}}>
                      <div style={{fontSize:9,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{k[3]} {k[0]}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:900,color:k[2]}}>{k[1]}</div>
                    </div>
                  ))}
                </div>
                <div className="preview-two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px"}}>
                    <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>Revenue — 2025</div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100}}>
                      {revenueData.map((d,i)=>(
                        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                          <div style={{width:"100%",background:GOLD_GRADIENT,borderRadius:"3px 3px 0 0",height:`${(d.revenue/1340000)*96}px`}}/>
                          <span style={{fontSize:7,color:C.muted}}>{d.m.slice(0,1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px"}}>
                    <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>Conversion Funnel</div>
                    {[["Total Reach","284,000","100%",C.gold],["Engaged","19,880","7%",C.amber],["Leads","8,064","2.8%",C.violet],["Prospects","2,820","1.0%",C.cyan],["Customers","940","0.33%",C.green]].map((f,i)=>(
                      <div key={i} style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                          <span style={{color:C.muted}}>{f[0]}</span>
                          <span style={{fontWeight:700,color:f[3]}}>{f[1]} <span style={{color:C.dim,fontWeight:400}}>({f[2]})</span></span>
                        </div>
                        <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(parseFloat(f[2])*14,100)}%`,background:f[3],borderRadius:3}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -- AI CHATBOT -- */}
            {activePreview==="AI Chatbot" && (
              <div>
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:9,color:C.amber,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:8}}>Hermes AI Chatbot · Conversational Commerce</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:8}}>Reply in 0.8 seconds. <span style={{color:C.amber}}>24/7. On every platform.</span></div>
                  <div style={{fontSize:13,color:C.muted,maxWidth:560,lineHeight:1.8}}>Train Hermes AI on your brand voice, products, and FAQs. It handles inquiries, qualifies leads, collects orders, and escalates complex issues — in Taglish or English.</div>
                </div>
                <div className="chat-preview-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg1,display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:`${C.amber}22`,border:`1px solid ${C.amber}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>??</div>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:C.text}}>Hermes AI</div>
                        <div style={{fontSize:10,color:C.green}}>? Online · 0.8s avg reply</div>
                      </div>
                      <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                        {["FB","IG","TK"].map(p=><span key={p} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:`${C.amber}15`,color:C.amber,border:`1px solid ${C.amber}30`,fontWeight:700}}>{p}</span>)}
                      </div>
                    </div>
                    <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
                      {[
                        {side:"left",text:"Hello po! Available pa ba yung Bloom Foundation SPF30?"},
                        {side:"right",text:"Hi po! Yes, available pa! ?? Mayroon kaming SPF30 sa ?599 — perfect for daily use. Gusto mo ba mag-order? ??",bot:true},
                        {side:"left",text:"Magkano ang shipping sa Cebu?"},
                        {side:"right",text:"Shipping sa Cebu is ?120 via J&T. Free shipping for orders above ?1,500! ?? Anong quantity ang gusto mo?",bot:true},
                        {side:"left",text:"2 bottles po sana"},
                        {side:"right",text:"Perfect! 2x Bloom Foundation = ?1,198 + FREE shipping. ?? Paki-send po ng inyong full name at address para ma-process namin. COD available!",bot:true},
                      ].map((m,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:m.side==="right"?"flex-end":"flex-start"}}>
                          <div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:m.side==="right"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.side==="right"?`${C.amber}20`:C.bg4,border:`1px solid ${m.side==="right"?C.amber+"30":C.border}`,fontSize:12,color:C.text,lineHeight:1.55}}>
                            {m.text}
                            {m.bot && <div style={{fontSize:9,color:C.muted,marginTop:3,textAlign:"right"}}>?? Hermes AI</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[
                      {icon:"?",title:"Brand-Trained Intelligence",desc:"Upload your product catalog, FAQs, and pricing. Hermes AI answers exactly like your best salesperson — 24/7.",color:C.amber},
                      {icon:"?",title:"Taglish-Native Replies",desc:"Naturally switches between Filipino and English. No awkward bot-speak. Real conversational tone.",color:C.gold},
                      {icon:"?",title:"Lead Qualification Engine",desc:"Automatically asks for name, address, and order details. Pushes qualified leads straight to your CRM.",color:C.cyan},
                      {icon:"?",title:"Multi-Platform Unified",desc:"One AI brain, seven platforms. Same consistent brand voice across Facebook, Instagram, TikTok, Shopee, and more.",color:C.green},
                      {icon:"?",title:"Smart Escalation",desc:"Detects frustrated customers or complex issues and instantly flags for human takeover — with full context.",color:C.rose},
                      {icon:"?",title:"No-Code Configuration",desc:"Set bot mode (AI, Menu, Hybrid), configure greeting flows, and upload brand context — all from your dashboard.",color:C.violet},
                    ].map((f,i)=>(
                      <div key={i} style={{display:"flex",gap:12,padding:"12px 16px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,transition:"border-color 0.2s"}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=f.color+"55"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                        <div style={{fontSize:18,flexShrink:0,marginTop:2}}>{f.icon}</div>
                        <div>
                          <div style={{fontSize:12,fontWeight:700,color:f.color,marginBottom:3}}>{f.title}</div>
                          <div style={{fontSize:11,color:C.muted,lineHeight:1.6}}>{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap"}}>
                  {[["0.8s","Avg Response"],["99.98%","Uptime"],["7","Platforms"],["24/7","Always On"],["Taglish","Language"],["8","Conversations"]].map(([v,l])=>(
                    <div key={l} style={{padding:"8px 16px",background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8,textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
                      <div style={{fontSize:9,color:C.muted,marginTop:2}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -- MARKET RESEARCH -- */}
            {activePreview==="Market Research" && (
              <div>
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:9,color:C.rose,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:8}}>Pythian Oracle · AI Market Research</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:8}}>Instant market intelligence. <span style={{color:C.rose}}>Philippine-native insights.</span></div>
                  <div style={{fontSize:13,color:C.muted,maxWidth:560,lineHeight:1.8}}>Ask the Oracle anything about your market. Get structured reports on trends, competitors, keywords, and consumer segments — in seconds.</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px",borderTop:`2px solid ${C.gold}`}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:C.gold,marginBottom:4}}>? Pythian Oracle</div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:14}}>AI Research Engine · Philippine Commerce</div>
                    <div style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:9,padding:"10px 14px",marginBottom:12,fontSize:12,color:C.muted}}>"beauty and skincare market philippines 2025"</div>
                    <div style={{background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:9,padding:"14px 16px"}}>
                      {[
                        {head:"? Market Overview",body:"Philippine beauty market valued at ?89.2B, growing 14% CAGR. Skincare leads with 42% share driven by K-beauty and \"glass skin\" trend."},
                        {head:"? Key Trends",body:"• Live commerce on TikTok Shop driving 3x higher conversion\n• Hyram-style ingredient-first marketing resonating with Gen Z\n• SPF and sunscreen category surging +186% YoY"},
                        {head:"? Recommendations",body:"• Target Metro Manila + CALABARZON (55% of buyers)\n• Lead with before/after UGC on Instagram Reels\n• Bundle SPF products to increase AOV by ?200+"},
                      ].map((s,i)=>(
                        <div key={i} style={{marginBottom:i<2?12:0}}>
                          <div style={{fontSize:12,fontWeight:700,color:C.gold,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{s.head}</div>
                          <div style={{fontSize:11,color:C.text,lineHeight:1.7,whiteSpace:"pre-line"}}>{s.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",flex:1}}>
                      <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>?? Keyword Intelligence</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:"6px 12px",fontSize:11}}>
                        {["Keyword","Vol/mo","Trend","CPC"].map(h=>(<div key={h} style={{color:C.muted,fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</div>))}
                        {keywordData.slice(0,5).map((k,i)=>[
                          <div key={`n${i}`} style={{color:C.text,fontWeight:500,padding:"4px 0",borderTop:`1px solid ${C.border}`}}>{k.keyword}</div>,
                          <div key={`v${i}`} style={{color:C.gold,fontWeight:700,padding:"4px 0",borderTop:`1px solid ${C.border}`}}>{k.vol.toLocaleString()}</div>,
                          <div key={`t${i}`} style={{color:C.green,fontWeight:700,padding:"4px 0",borderTop:`1px solid ${C.border}`}}>+{k.trend}%</div>,
                          <div key={`c${i}`} style={{color:C.muted,padding:"4px 0",borderTop:`1px solid ${C.border}`}}>?{k.cpc}</div>,
                        ])}
                      </div>
                    </div>
                    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px"}}>
                      <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>?? Market KPIs</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {[["?892B","PH Market Size",C.gold],["38.4%","E-comm Penetration",C.green],["?124B","Social Commerce",C.amber],["+14%","Market CAGR",C.rose]].map(([v,l,col])=>(
                          <div key={l} style={{padding:"10px 12px",background:C.bg3,borderRadius:8,borderTop:`2px solid ${col}`}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:col}}>{v}</div>
                            <div style={{fontSize:9,color:C.muted,marginTop:2}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["beauty market philippines","philippine food delivery 2025","social commerce PH trends","online fashion ph","baby products ecommerce ph","home living market ph","matcha trends","K-beauty competitors PH"].map(t=>(
                    <span key={t} style={{padding:"4px 12px",borderRadius:7,border:`1px solid ${C.border}`,background:`${C.rose}08`,color:C.muted,fontSize:11,cursor:"pointer",transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.target.style.color=C.rose;e.target.style.borderColor=C.rose;}} onMouseLeave={e=>{e.target.style.color=C.muted;e.target.style.borderColor=C.border;}}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* -- SOCIAL ADS -- */}
            {activePreview==="Social Ads" && (
              <div>
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:9,color:C.violet,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:8}}>Agora Social Ads · Ads Intelligence</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:8}}>Know which ads print money. <span style={{color:C.violet}}>Cut the rest.</span></div>
                  <div style={{fontSize:13,color:C.muted,maxWidth:560,lineHeight:1.8}}>Track ad spend, ROAS, and creative performance across Facebook, TikTok, and Shopee Ads — all in one dashboard. Stop guessing, start scaling.</div>
                </div>
                <div className="preview-five-col" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
                  {[["Total Ad Spend","?184K",C.gold],["Total Revenue","?1.24M",C.green],["Blended ROAS","6.7x",C.cyan],["CTR","3.84%",C.amber],["CPA","?148",C.rose]].map((k,i)=>(
                    <div key={i} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",borderTop:`2px solid ${k[2]}`}}>
                      <div style={{fontSize:9,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>{k[0]}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:k[2]}}>{k[1]}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg1,fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>Active Campaigns</div>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"8px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
                      {["Campaign","Spend","ROAS","Status"].map(h=>(<div key={h} style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>{h}</div>))}
                    </div>
                    {[
                      {name:"Bloom Foundation – Awareness",spend:"?42K",roas:"5.2x",status:"Active",sc:C.green},
                      {name:"Vitamin C Serum – Conversion",spend:"?31K",roas:"8.9x",status:"Scaling",sc:C.cyan},
                      {name:"Baby Wipes – Retargeting",spend:"?18K",roas:"11.4x",status:"Scaling",sc:C.cyan},
                      {name:"Matcha Powder – TikTok",spend:"?24K",roas:"4.1x",status:"Testing",sc:C.amber},
                      {name:"Home Decor – Catalog",spend:"?14K",roas:"2.8x",status:"Paused",sc:C.red},
                    ].map((c,i)=>(
                      <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"9px 16px",borderBottom:i<4?`1px solid ${C.border}`:"none",alignItems:"center",transition:"background 0.12s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bg3} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{fontSize:11,fontWeight:600,color:C.text}}>{c.name}</div>
                        <div style={{fontSize:11,color:C.gold,fontWeight:700}}>{c.spend}</div>
                        <div style={{fontSize:11,color:C.green,fontWeight:700}}>{c.roas}</div>
                        <div><span style={{padding:"2px 8px",borderRadius:4,fontSize:9,background:`${c.sc}18`,color:c.sc,border:`1px solid ${c.sc}30`,fontWeight:700}}>{c.status}</span></div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[
                      {icon:"?",title:"Real-Time ROAS Tracking",desc:"See revenue attributed to every ad set across Facebook, TikTok Ads, and Shopee Ads — updated every hour.",color:C.violet},
                      {icon:"?",title:"Creative Performance Scoring",desc:"AI ranks your ad creatives by CTR and conversion rate. Know which image, copy, and hook wins — before you overspend.",color:C.gold},
                      {icon:"?",title:"Audience Overlap Detector",desc:"Find overlapping audiences across campaigns to eliminate wasted spend and improve frequency scoring.",color:C.cyan},
                      {icon:"?",title:"AI Budget Optimizer",desc:"Hermes AI recommends daily budget shifts based on ROAS trends. Scale winners, pause losers — automatically.",color:C.amber},
                      {icon:"?",title:"Attribution Stitching",desc:"Connect ad clicks to messenger conversations to orders. Full-funnel attribution from first touch to COD confirmation.",color:C.green},
                      {icon:"?",title:"Competitor Ad Spy",desc:"Monitor competitor ad activity, creative angles, and offer positioning across Philippine social platforms.",color:C.rose},
                    ].map((f,i)=>(
                      <div key={i} style={{display:"flex",gap:10,padding:"11px 14px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:9,transition:"border-color 0.2s"}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=f.color+"55"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                        <div style={{fontSize:18,flexShrink:0}}>{f.icon}</div>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:f.color,marginBottom:2}}>{f.title}</div>
                          <div style={{fontSize:11,color:C.muted,lineHeight:1.55}}>{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -- PRICING -- */}
            {activePreview==="Pricing" && <PricingPreview setMode={setMode} focusAuth={focusAuth}/>}

          </div>
        </section>
      )}

      {/* -------------- FEATURES -------------- */}
      <section className="section-pad" style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
        <div style={{marginBottom:50}}>
          <div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:12}}>The Divine Toolkit</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:700,letterSpacing:"-1px",color:C.text,maxWidth:460,lineHeight:1.1}}>
              Eight sacred instruments,<br/>
              <span style={{background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>one unified platform.</span>
            </div>
            <div style={{fontSize:13,color:C.muted,maxWidth:360,lineHeight:1.8}}>
              Every tool you need to manage, automate, and grow — powered by Hermes.
            </div>
          </div>
        </div>

        <div className="features-grid">
          {FEATURES.map((f,i)=>(
            <div key={i} className={`feat-card${i%3<2?" feat-border-r":""}${i<6?" feat-border-b":""}`} style={{
              background:C.bg1,padding:"28px 24px",
            }}>
              <div style={{
                width:44,height:44,borderRadius:12,
                background:f.accent,border:`1px solid ${f.color}30`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:22,color:f.color,marginBottom:16,
              }}>{f.icon}</div>
              <div style={{fontSize:9,color:f.color,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>{f.sub}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:C.text,marginBottom:8,letterSpacing:"-0.3px"}}>{f.title}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.75}}>{f.desc}</div>
              <div style={{marginTop:18,display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:2,background:GOLD_GRADIENT,borderRadius:1}}/>
                <span style={{fontSize:10,color:C.muted,letterSpacing:"1px"}}>EXPLORE ?</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------- USE CASES -------------- */}
      <section className="section-pad-md" style={{
        borderTop:`1px solid ${C.border}`,
        background:`linear-gradient(180deg,${C.bg1},${C.bg0})`,
        position:"relative",zIndex:1,
      }}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:12}}>Who Exponify Empowers</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(24px,3.5vw,42px)",fontWeight:700,letterSpacing:"-1px",color:C.text,lineHeight:1.2}}>
              Built for every industry,<br/>
              <span style={{background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>perfected for Philippine business.</span>
            </div>
          </div>
          <div className="use-cases-grid">
            {USE_CASES.map((u,i)=>(
              <div key={i} className="use-card" style={{
                background:C.bg2,border:`1px solid ${C.border}`,
                borderRadius:14,padding:"20px 16px",textAlign:"center",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold+"55";e.currentTarget.style.background=C.bg3;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg2;}}>
                <div style={{fontSize:26,marginBottom:8}}>{u.icon}</div>
                <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:5}}>{u.label}</div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------- QUOTE + CTA -------------- */}
      <section style={{
        textAlign:"center",padding:"72px 24px",
        borderTop:`1px solid ${C.border}`,
        background:`linear-gradient(180deg,${C.bg0},${C.bg1},${C.bg0})`,
        position:"relative",zIndex:1,
      }}>
        <div style={{
          width:56,height:56,borderRadius:"50%",
          background:`radial-gradient(circle,${C.gold}22,transparent)`,
          border:`1px solid ${C.gold}33`,
          display:"flex",alignItems:"center",justifyContent:"center",
          margin:"0 auto 24px",boxShadow:GOLD_GLOW,
        }}>
          <HermesLogo size={30}/>
        </div>

        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(18px,3vw,30px)",fontWeight:400,color:C.gold,
          fontStyle:"italic",marginBottom:10,letterSpacing:"0.5px",
          opacity:0.9,maxWidth:640,margin:"0 auto 10px",lineHeight:1.4,
        }}>
          "Hermes — messenger of gods, patron of merchants, master of the crossroads."
        </div>
        <div style={{fontSize:11,color:C.muted,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:40}}>Greek Mythology</div>

        <div style={{display:"flex",justifyContent:"center",marginBottom:48}}>
          <div className="stats-block">
            {[
              {val:"50%",label:"More Efficient"},
              {val:"30%",label:"Time Saved"},
              {val:"100%",label:"Data Protection"},
            ].map((s,i)=>(
              <div key={i} className="stats-block-item" style={{
                borderRight:i<2?`1px solid ${C.border}`:"none",
              }}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,letterSpacing:"-1px",background:GOLD_GRADIENT,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.val}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:4,letterSpacing:"1px",textTransform:"uppercase"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-btns" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setMode("signup");focusAuth();}} style={{
            padding:"14px 40px",borderRadius:12,background:GOLD_GRADIENT,
            border:"none",color:C.bg0,fontSize:15,fontWeight:800,cursor:"pointer",
            boxShadow:GOLD_GLOW,letterSpacing:"0.5px",transition:"all 0.2s",
          }}>Enter the Platform ?</button>
          <button onClick={()=>{setMode("signin");focusAuth();}} style={{
            padding:"14px 40px",borderRadius:12,background:"transparent",
            border:`1px solid ${C.border2}`,color:C.text,
            fontSize:15,fontWeight:500,cursor:"pointer",transition:"all 0.2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border2;e.currentTarget.style.color=C.text;}}>
            Sign In
          </button>
        </div>
      </section>


      {/* -------------- BOOK A DEMO -------------- */}
      <section id="demo-section" className="section-pad" style={{background:C.bg1,borderTop:`1px solid ${C.border}`,position:"relative",zIndex:1}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 60% 60% at 50% 100%,${C.gold}08,transparent)`,pointerEvents:"none"}}/>
        <div style={{maxWidth:900,margin:"0 auto",position:"relative"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:12}}>Get Started</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,letterSpacing:"-1px",color:C.text,marginBottom:12}}>
              Book a Free Demo
            </div>
            <div style={{fontSize:14,color:C.muted,maxWidth:480,margin:"0 auto",lineHeight:1.7}}>
              See Exponify in action — powered by Hermes. Tell us about your business and we'll show you exactly how it fits.
            </div>
          </div>
          <DemoBookingForm/>
        </div>
      </section>

      {/* -------------- FOOTER -------------- */}
      <footer style={{borderTop:`1px solid ${C.border}`,background:C.bg0,position:"relative",zIndex:1}}>
        <div className="footer-inner">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <HermesLogo size={22}/>
            <div>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,letterSpacing:"1px",color:C.text}}>
                <ExponifyWord/>
              </span>
              <span style={{display:"block",fontSize:8,color:C.muted,letterSpacing:"2px",textTransform:"uppercase"}}>Powered by Hermes · Philippines</span>
            </div>
          </div>
          <div style={{display:"flex",gap:24,fontSize:11,color:C.muted,flexWrap:"wrap"}}>
            {["Privacy","Terms","Contact","Blog"].map(l=>(
              <span key={l} style={{cursor:"pointer",transition:"color 0.2s"}}
                onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.muted}>{l}</span>
            ))}
          </div>
          <div style={{fontSize:11,color:C.muted}}>
            © 2026 <ExponifyWord style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700}}/> · Powered by Hermes
          </div>
        </div>
      </footer>
      <HermesChatbot />
    </div>
  );
}

//=========================================================================================================================================
// HERMES CHATBOT COMPONENT
//=========================================================================================================================================

function RobotIcon({ color = "url(#hgc)", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hgc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a07830"/>
          <stop offset="50%" stopColor="#e8c96a"/>
          <stop offset="100%" stopColor="#c9a84c"/>
        </linearGradient>
        <linearGradient id="hgb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06050a"/>
          <stop offset="100%" stopColor="#1a1730"/>
        </linearGradient>
      </defs>
      <rect x="9.4" y="0.5" width="1.2" height="2.8" rx="0.6" fill={color}/>
      <circle cx="10" cy="0.8" r="1.1" fill={color}/>
      <rect x="2.5" y="3.5" width="15" height="11" rx="3" fill={color}/>
      <path d="M5.5 14.5 L3.5 17.5 L8.5 14.5 Z" fill={color}/>
      <rect x="0.8" y="6" width="1.8" height="4" rx="0.9" fill={color} opacity="0.85"/>
      <rect x="17.4" y="6" width="1.8" height="4" rx="0.9" fill={color} opacity="0.85"/>
      <circle cx="7.2" cy="8.2" r="1.3" fill="white" opacity="0.92"/>
      <circle cx="12.8" cy="8.2" r="1.3" fill="white" opacity="0.92"/>
      <path d="M7 11 Q10 13.2 13 11" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.92"/>
    </svg>
  );
}

function RobotIconDark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9.4" y="0.5" width="1.2" height="2.8" rx="0.6" fill="#06050a"/>
      <circle cx="10" cy="0.8" r="1.1" fill="#06050a"/>
      <rect x="2.5" y="3.5" width="15" height="11" rx="3" fill="#06050a"/>
      <path d="M5.5 14.5 L3.5 17.5 L8.5 14.5 Z" fill="#06050a"/>
      <rect x="0.8" y="6" width="1.8" height="4" rx="0.9" fill="#06050a" opacity="0.85"/>
      <rect x="17.4" y="6" width="1.8" height="4" rx="0.9" fill="#06050a" opacity="0.85"/>
      <circle cx="7.2" cy="8.2" r="1.3" fill="#c9a84c" opacity="0.92"/>
      <circle cx="12.8" cy="8.2" r="1.3" fill="#c9a84c" opacity="0.92"/>
      <path d="M7 11 Q10 13.2 13 11" stroke="#c9a84c" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.92"/>
    </svg>
  );
}

function HermesChatbot() {
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [unread,setUnread]=useState(0);
  const [showBubble,setShowBubble]=useState(false);
  const [bubbleText,setBubbleText]=useState("");
  const [bubbleDone,setBubbleDone]=useState(false);
  const endRef=useRef(null);
  const inputRef=useRef(null);
  const WELCOME_MSG="Kamusta! ?? I'm Expony — your guide to the Exponify platform. How can I help you today?\n\nYou can ask me about our features, pricing, or how we help Philippine brands grow.";
  const BUBBLE_PREVIEW="?? Hi! I'm Expony. Need help exploring Exponify?";

  useEffect(()=>{ const t=setTimeout(()=>setShowBubble(true),2000); return()=>clearTimeout(t); },[]);
  useEffect(()=>{
    if(!showBubble) return;
    let i=0; setBubbleText(""); setBubbleDone(false);
    const timer=setInterval(()=>{ i++; setBubbleText(BUBBLE_PREVIEW.slice(0,i)); if(i>=BUBBLE_PREVIEW.length){clearInterval(timer);setBubbleDone(true);setUnread(1);} },30);
    return()=>clearInterval(timer);
  },[showBubble]);
  useEffect(()=>{
    if(open){
      setShowBubble(false); setUnread(0);
      if(msgs.length===0){ setTimeout(()=>{ setMsgs([{role:"assistant",content:WELCOME_MSG}]); },180); }
      setTimeout(()=>inputRef.current?.focus(),300);
    }
  },[open]);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const QUICK_SUGGESTIONS=["? What does Expony do?","?? How much does it cost?","?? Book a free demo","?? Connect my Facebook page"];
  const SYSTEM_PROMPT=`You are Expony, the friendly AI assistant for Exponify (exponify.ph) — a Philippine AI-powered commerce platform
  Your personality: warm, professional, knowledgeable, uses Taglish naturally (mix Filipino + English), concise replies. Your name is Expony.
  About Exponify platform:
  - ?? Unified inbox for Facebook, Instagram, TikTok, Shopee, Lazada, Viber
  - ?? CRM with lead scoring, pipeline management, customer lifetime value tracking
  - ?? ERP with real-time inventory, automated reorder alerts, margin analysis
  - ?? Analytics: revenue forecasting, cohort analysis, funnel metrics
  - ??? Demographics: geographic heatmaps, age/gender breakdowns
  - ?? Market Research AI: keyword intelligence, competitor benchmarking
  - ?? Social Ads: AI-powered ad creation, budget optimization, payment via GCash/Card
  - ?? Email Marketing with AI automation
  - ?? AI Chatbot builder for Facebook Messenger
  Pricing:
  - ?? Starter: FREE — 14-day full access trial, no credit card needed
  - ?? Growth: ?24,917/mo (monthly) or save 30% annually — best value for scaling brands
  - ??? Enterprise: ?25,000/mo (monthly) or save 50% annually — unlimited everything
  - ?? All plans include a 14-day free trial. For annual pricing or custom quotes contact admin@exponify.ph
  Demo: ?? Users can book a free 30-minute Google Meet demo on the landing page.
  Support: ?? admin@exponify.ph
  Rules:
  - Keep replies concise (3-5 sentences max unless user asks for details)
  - Use bullet points for feature lists
  - Always offer to help them book a demo or sign up
  - Never make up pricing numbers — direct to sales for custom quotes
  - If asked about a feature not listed, say you'll check and direct to admin@exponify.ph
  - Always refer to yourself as Expony`;

  const send=async(text)=>{
    const userMsg=text||input.trim();
    if(!userMsg||loading) return;
    const newMsgs=[...msgs,{role:"user",content:userMsg}];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try{
      const res=await fetch("https://openrouter.ai/api/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer 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","HTTP-Referer":"https://exponify.ph","X-Title":"Exponify Expony"},
        body:JSON.stringify({model:"openai/gpt-4o-mini",max_tokens:400,messages:[{role:"system",content:SYSTEM_PROMPT},...newMsgs.map(m=>({role:m.role,content:m.content}))]}),
      });
      const data=await res.json();
      const reply=data.choices?.[0]?.message?.content||"Sorry, I couldn't connect. Please try again or email admin@exponify.ph.";
      setMsgs(prev=>[...prev,{role:"assistant",content:reply}]);
      if(!open) setUnread(u=>u+1);
    }catch{ setMsgs(prev=>[...prev,{role:"assistant",content:"?? Connection error. Please try again or email admin@exponify.ph."}]); }
    setLoading(false);
  };

  const onKey=(e)=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };

  const bg0="#06050a",bg1="#0b0a12",bg2="#100f1a",bg3="#161524",bg4="#1d1b2e";
  const border="#1e1c30",border2="#2d2a48",text="#f0ead6",muted="#6b6580";
  const gold="#c9a84c",gold2="#e8c96a",gold3="#a07830",green="#34d399";
  const goldGrad=`linear-gradient(135deg, ${gold3}, ${gold}, ${gold2})`;
  const goldGlow=`0 0 24px ${gold}50, 0 0 48px ${gold}28`;

  // FAB dimensions — keeps consistent spacing calculations
  const FAB_SIZE = 70;
  const FAB_MARGIN = 16; // 16px from edges on mobile, 28px on desktop via clamp

  return (
    <>
      <style>{`
        @keyframes chatSlideUp{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes chatDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
        @keyframes bubblePopIn{0%{opacity:0;transform:translateY(10px) scale(0.92)}60%{transform:translateY(-3px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes glowPulse2{0%,100%{box-shadow:0 0 24px ${gold}50,0 0 48px ${gold}28,0 8px 32px #00000060}50%{box-shadow:0 0 36px ${gold}80,0 0 64px ${gold}44,0 8px 32px #00000060}}
        .chat-msg-user{animation:chatSlideUp 0.18s ease}
        .chat-msg-ai{animation:chatSlideUp 0.18s ease}
        .chat-input:focus{outline:none;border-color:${gold}88 !important}
        .chat-quick:hover{background:${gold}22 !important;border-color:${gold}88 !important;color:${gold} !important}
        .chat-send:hover{opacity:0.88}
        .expony-bubble-x:hover{opacity:1 !important}
      `}</style>

      {/* -- Speech bubble -- */}
      {showBubble&&!open&&(
        <div
          onClick={()=>setOpen(true)}
          style={{
            position:"fixed",
            // Sits just above the FAB; right-aligned to match FAB right edge on all screen sizes
            bottom: `calc(${FAB_SIZE}px + ${FAB_MARGIN}px + 26px)`,
            right: `clamp(${FAB_MARGIN}px, 3vw, 28px)`,
            // Never wider than screen minus FAB width minus margins
            width: `min(264px, calc(100vw - ${FAB_SIZE}px - ${FAB_MARGIN * 2}px - 12px))`,
            background:bg1,
            border:`1px solid ${border2}`,
            borderRadius:"16px 16px 4px 16px",
            boxShadow:`0 16px 48px #00000088,0 0 0 1px ${gold}20`,
            padding:"12px 36px 12px 14px",
            zIndex:9001,
            animation:"bubblePopIn 0.35s ease forwards",
            fontFamily:"'DM Sans','Segoe UI',sans-serif",
            cursor:"pointer",
          }}
        >
          <button
            className="expony-bubble-x"
            onClick={e=>{e.stopPropagation();setShowBubble(false);setUnread(0);}}
            style={{position:"absolute",top:7,right:9,background:"transparent",border:"none",color:muted,cursor:"pointer",fontSize:15,lineHeight:1,opacity:0.55,padding:2}}
          >×</button>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:`${gold}18`,border:`1px solid ${gold}44`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <RobotIcon color="url(#hgc)" size={13}/>
            </div>
            <span style={{fontSize:10,fontWeight:700,color:gold,letterSpacing:"0.5px"}}>EXPONY</span>
            <span style={{fontSize:9,color:green,display:"flex",alignItems:"center",gap:3}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:green,display:"inline-block"}}/>Online
            </span>
          </div>
          <div style={{fontSize:12,color:text,lineHeight:1.6}}>
            {bubbleText}
            {!bubbleDone&&(<span style={{display:"inline-block",width:2,height:12,background:gold,marginLeft:2,verticalAlign:"middle",animation:"chatDot 0.8s ease-in-out infinite"}}/>)}
          </div>
          {bubbleDone&&(<div style={{marginTop:8,fontSize:9,color:`${gold}99`,fontWeight:600,letterSpacing:"0.3px"}}>Tap to chat ?</div>)}
        </div>
      )}

      {/* -- Chat window -- */}
      {open&&(
        <div
          style={{
            position:"fixed",
            // Sits above the FAB with a comfortable gap
            bottom: `calc(${FAB_SIZE}px + ${FAB_MARGIN}px + 16px)`,
            right: `clamp(${FAB_MARGIN}px, 3vw, 28px)`,
            // Full-width minus margins on small screens, capped at 360px on large screens
            width: `min(360px, calc(100vw - ${FAB_MARGIN * 2}px))`,
            maxHeight:"75vh",
            background:bg1,
            border:`1px solid ${border2}`,
            borderRadius:18,
            boxShadow:`0 32px 80px #00000090,0 0 0 1px ${gold}18`,
            display:"flex",
            flexDirection:"column",
            overflow:"hidden",
            zIndex:9000,
            animation:"chatSlideUp 0.22s ease",
            fontFamily:"'DM Sans','Segoe UI',sans-serif",
          }}
        >
          {/* Header */}
          <div style={{background:`linear-gradient(135deg, ${bg2}, ${bg3})`,borderBottom:`1px solid ${border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`radial-gradient(circle,${gold}28,${gold}08)`,border:`1.5px solid ${gold}55`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:goldGlow,flexShrink:0}}>
              <RobotIcon color="url(#hgc)" size={24}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:text,letterSpacing:"0.3px"}}>Expony</div>
              <div style={{fontSize:10,color:green,display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:green}}/>Online · Typically replies instantly
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={{background:"transparent",border:"none",color:muted,cursor:"pointer",fontSize:18,lineHeight:1,padding:4,borderRadius:6}}>×</button>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:10}}>
            {msgs.map((m,i)=>{
              const isUser=m.role==="user";
              return (
                <div key={i} className={isUser?"chat-msg-user":"chat-msg-ai"} style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",gap:8}}>
                  {!isUser&&(<div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,marginTop:2,background:`${gold}18`,border:`1px solid ${gold}33`,display:"flex",alignItems:"center",justifyContent:"center"}}><RobotIcon color="url(#hgc)" size={16}/></div>)}
                  <div style={{maxWidth:"78%",background:isUser?goldGrad:bg3,color:isUser?bg0:text,border:isUser?"none":`1px solid ${border}`,padding:"9px 13px",borderRadius:isUser?"14px 14px 4px 14px":"14px 14px 14px 4px",fontSize:12,lineHeight:1.65,whiteSpace:"pre-wrap",fontWeight:isUser?600:400,boxShadow:isUser?`0 4px 16px ${gold}30`:"none"}}>{m.content}</div>
                </div>
              );
            })}
            {loading&&(
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:`${gold}18`,border:`1px solid ${gold}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><RobotIcon color="url(#hgc)" size={16}/></div>
                <div style={{background:bg3,border:`1px solid ${border}`,padding:"10px 14px",borderRadius:"14px 14px 14px 4px",display:"flex",gap:4,alignItems:"center"}}>
                  {[0,0.15,0.3].map((d,i)=>(<div key={i} style={{width:6,height:6,borderRadius:"50%",background:gold,animation:`chatDot 1.2s ease-in-out ${d}s infinite`}}/>))}
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick suggestions */}
          <div style={{padding:"0 14px 10px",display:"flex",gap:5,flexWrap:"wrap"}}>
            {QUICK_SUGGESTIONS.map((s,i)=>(
              <button key={i} className="chat-quick" onClick={()=>send(s)} style={{padding:"5px 11px",borderRadius:20,background:`${gold}10`,border:`1px solid ${border2}`,color:muted,fontSize:10,fontWeight:600,cursor:"pointer",transition:"all 0.15s"}}>{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{padding:"10px 12px",borderTop:`1px solid ${border}`,display:"flex",gap:8,alignItems:"flex-end",background:bg2,flexShrink:0}}>
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about features, pricing, demo…"
              rows={1}
              style={{flex:1,resize:"none",background:bg3,border:`1px solid ${border2}`,borderRadius:10,padding:"8px 12px",color:text,fontSize:12,lineHeight:1.5,maxHeight:80,overflowY:"auto",transition:"border-color 0.2s"}}
            />
            <button
              className="chat-send"
              onClick={()=>send()}
              disabled={!input.trim()||loading}
              style={{width:36,height:36,borderRadius:10,background:input.trim()&&!loading?goldGrad:bg4,border:"none",color:input.trim()&&!loading?bg0:muted,cursor:input.trim()&&!loading?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.18s",boxShadow:input.trim()&&!loading?goldGlow:"none",fontSize:16}}
            >?</button>
          </div>
          <div style={{padding:"6px 14px 8px",fontSize:9,color:`${muted}88`,textAlign:"center",background:bg2}}>Powered by Expony · exponify.ph</div>
        </div>
      )}

      {/* -- FAB button -- */}
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{
          position:"fixed",
          bottom: `clamp(${FAB_MARGIN}px, 3vw, 28px)`,
          right: `clamp(${FAB_MARGIN}px, 3vw, 28px)`,
          width:FAB_SIZE,
          height:FAB_SIZE,
          borderRadius:"50%",
          background:goldGrad,
          border:"none",
          cursor:"pointer",
          boxShadow:open?goldGlow:`${goldGlow}, 0 8px 32px #00000060`,
          zIndex:9001,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          transition:"all 0.22s",
          transform:open?"scale(0.92)":"scale(1)",
          animation:open?"none":"glowPulse2 4s ease infinite",
          fontFamily:"inherit",
        }}
        title="Chat with Expony"
      >
        {open?(<span style={{fontSize:22,color:bg0,lineHeight:1}}>×</span>):(<RobotIconDark size={55}/>)}
        {!open&&unread>0&&(
          <div style={{position:"absolute",top:-3,right:-3,width:18,height:18,borderRadius:"50%",background:"#f87171",color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${bg0}`}}>
            {unread}
          </div>
        )}
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
//  CRM MODULE (keeping your existing CRMModule component)
// ---------------------------------------------------------------------------
function CRMModule({ activeBrandId, activeBrandName, notify, accessToken: _accessToken, role: _role }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sel, setSel] = useState(null);
  const [stage, setStage] = useState("all");
  const [search, setSearch] = useState("");
  const [aiInsight, setAiInsight] = useState("");
  const [gen, setGen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activities, setActivities] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");

  // fetch contacts whenever brand or stage changes
  useEffect(() => {
    if (!activeBrandId) { setContacts([]); return; }
    let alive = true;
    setLoading(true);
    setError("");
    setSel(null);
    (async () => {
      try {
        let query = supabase
          .from("contacts")
          .select("*, brands(id,name,color), conversations(id,platform,status,last_message_at)")
          .eq("brand_id", activeBrandId)
          .order("created_at", { ascending: false });
        if (stage !== "all") query = query.eq("stage", stage);
        if (search.trim()) query = query.ilike("full_name", `%${search.trim()}%`);
        const { data, error: err } = await query;
        if (!alive) return;
        if (err) throw err;
        setContacts(data || []);
      } catch (e) {
        if (!alive) return;
        setError(e.message);
        setContacts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [activeBrandId, stage, reloadKey]);

  // fetch activity log when a contact is selected
  useEffect(() => {
    if (!sel?.id) { setActivities([]); return; }
    (async () => {
      const { data } = await supabase
        .from("contact_activities")
        .select("*, profiles(full_name)")
        .eq("contact_id", sel.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setActivities(data || []);
    })();
  }, [sel?.id, reloadKey]);

  const updateStage = async (contactId, newStage) => {
    const { error: err } = await supabase
      .from("contacts").update({ stage: newStage }).eq("id", contactId);
    if (err) { notify(err.message); return; }
    await supabase.from("contact_activities").insert({
      contact_id: contactId, activity_type: "stage_change",
      description: `Stage changed to ${newStage}`,
    });
    setContacts(list => list.map(c => c.id === contactId ? { ...c, stage: newStage } : c));
    setSel(s => s?.id === contactId ? { ...s, stage: newStage } : s);
    setReloadKey(k => k + 1);
    notify(`Moved to ${newStage}`);
  };

  const saveNote = async () => {
    if (!noteText.trim() || !sel?.id) return;
    await supabase.from("contact_activities").insert({
      contact_id: sel.id, activity_type: "note", description: noteText.trim(),
    });
    // also update notes field on contact
    await supabase.from("contacts").update({ notes: noteText.trim() }).eq("id", sel.id);
    setNoteText(""); setAddingNote(false);
    setReloadKey(k => k + 1);
    notify("Note saved");
  };

  const generateInsight = async (contact) => {
    setGen(true); setAiInsight("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 400,
          messages: [{ role: "user", content: `You are Hermes AI, a CRM analyst for a Filipino e-commerce business. Analyze this customer and give 3 short actionable insights using • bullets.\n\nCustomer: ${JSON.stringify({ name: contact.full_name, stage: contact.stage, platform: contact.platform, brand: activeBrandName, lifetimeValue: contact.lifetime_value, score: contact.score, tags: contact.tags, notes: contact.notes })}\n\n3 bullets max, 2 sentences each. No markdown bold/asterisks.` }],
        }),
      });
      const d = await res.json();
      setAiInsight(d.content?.map(b => b.text || "").join("") || "Could not generate.");
    } catch { setAiInsight("Error. Please retry."); }
    setGen(false);
  };

  const totalLTV = contacts.filter(c => c.stage === "Customer").reduce((a, c) => a + Number(c.lifetime_value || 0), 0);
  const avgScore = contacts.length ? Math.round(contacts.reduce((a, c) => a + (c.score || 0), 0) / contacts.length) : 0;
  const filtered = contacts.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const ACTIVITY_ICON = { message: "??", call: "??", email: "??", note: "??", stage_change: "??", purchase: "??" };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* KPIs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          {[
            { label: "Total Contacts", val: contacts.length, color: C.gold },
            { label: "Customer LTV", val: `?${(totalLTV / 1000).toFixed(1)}K`, color: C.green },
            { label: "Avg Score", val: avgScore, color: C.amber },
            { label: "At Risk", val: contacts.filter(c => (c.score || 0) < 40).length, color: C.red },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, padding: "14px 18px", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, background: i === 0 ? GOLD_GRADIENT : "none", WebkitBackgroundClip: i === 0 ? "text" : "unset", WebkitTextFillColor: i === 0 ? "transparent" : "unset", color: i !== 0 ? k.color : undefined }}>{k.val}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: "0.5px" }}>{k.label}</div>
            </div>
          ))}
        </div>
        {/* Filters */}
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {["all", ...PIPELINE_STAGES].map(s => (
            <button key={s} onClick={() => { setStage(s); setReloadKey(k => k + 1); }} style={{ padding: "4px 14px", borderRadius: 7, border: `1px solid ${stage === s ? (STAGE_COLOR[s] || C.gold) : C.border}`, background: stage === s ? `${STAGE_COLOR[s] || C.gold}18` : "transparent", color: stage === s ? (STAGE_COLOR[s] || C.gold) : C.muted, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>{s === "all" ? "All Contacts" : s}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && setReloadKey(k => k + 1)} placeholder="Search…" style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 12px", color: C.text, fontSize: 12, width: 180 }} />
          </div>
        </div>
        {/* Brand label */}
        <div style={{ padding: "5px 14px", borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.muted, background: C.bg1 }}>
          {activeBrandId ? <>Contacts for <span style={{ color: C.gold, fontWeight: 700 }}>{activeBrandName}</span>{loading && " · Loading…"}{error && <span style={{ color: C.red }}> · {error}</span>}</> : "Select a brand from the sidebar"}
        </div>
        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {!loading && filtered.length === 0 && activeBrandId && (
            <div style={{ padding: "24px 18px", color: C.muted, fontSize: 13 }}>No contacts found. Contacts are auto-created when someone messages your Facebook page.</div>
          )}
          {filtered.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead style={{ position: "sticky", top: 0, background: C.bg1, zIndex: 2 }}>
                <tr>{["Contact", "Stage", "Platform", "LTV", "Score", "Conversations", "Tags"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: C.muted, fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const initials = c.full_name?.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase() || "??";
                  const color = STAGE_COLOR[c.stage] || C.gold;
                  return (
                    <tr key={c.id} onClick={() => { setSel(sel?.id === c.id ? null : c); setAiInsight(""); }} style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: sel?.id === c.id ? C.bg4 : "transparent", transition: "background 0.12s", animation: `fadeUp 0.25s ease ${i * 0.03}s both` }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <GoldAvatar initials={initials} color={color} size={32} />
                          <div>
                            <div style={{ fontWeight: 600, color: C.text }}>{c.full_name}</div>
                            <div style={{ fontSize: 10, color: C.muted }}>{c.email || c.phone || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <select value={c.stage} onClick={e => e.stopPropagation()} onChange={e => updateStage(c.id, e.target.value)} style={{ background: `${STAGE_COLOR[c.stage] || C.gold}18`, border: `1px solid ${STAGE_COLOR[c.stage] || C.gold}55`, color: STAGE_COLOR[c.stage] || C.gold, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "11px 14px", color: C.muted, textTransform: "capitalize" }}>{c.platform || "—"}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 700, color: C.green }}>{c.lifetime_value > 0 ? `?${Number(c.lifetime_value).toLocaleString()}` : "—"}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${c.score || 0}%`, background: (c.score || 0) > 70 ? C.green : (c.score || 0) > 40 ? C.amber : C.red, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontWeight: 700, color: (c.score || 0) > 70 ? C.green : (c.score || 0) > 40 ? C.amber : C.red, fontSize: 11 }}>{c.score || 0}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", color: C.muted }}>{(c.conversations || []).length} conv.</td>
                      <td style={{ padding: "11px 14px" }}><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{(c.tags || []).map(t => <GoldTag key={t}>{t}</GoldTag>)}</div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div style={{ width: 310, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center", background: `linear-gradient(180deg,${C.bg4},${C.bg3})` }}>
            <GoldAvatar initials={sel.full_name?.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase() || "??"} color={STAGE_COLOR[sel.stage] || C.gold} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 16, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.full_name}</div>
              <GoldTag color={STAGE_COLOR[sel.stage]}>{sel.stage}</GoldTag>
            </div>
            <button onClick={() => setSel(null)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 16, padding: 4 }}>?</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
            {/* Contact info */}
            {[
              { l: "Email", v: sel.email || "—" },
              { l: "Phone", v: sel.phone || "—" },
              { l: "Platform", v: sel.platform || "—" },
              { l: "LTV", v: sel.lifetime_value > 0 ? <span style={{ color: C.green, fontWeight: 700 }}>?{Number(sel.lifetime_value).toLocaleString()}</span> : "—" },
              { l: "Score", v: <span style={{ fontWeight: 700, color: (sel.score || 0) > 70 ? C.green : (sel.score || 0) > 40 ? C.amber : C.red }}>{sel.score || 0}/100</span> },
              { l: "Added", v: sel.created_at ? new Date(sel.created_at).toLocaleDateString("en-PH") : "—" },
            ].map(f => (
              <div key={f.l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                <span style={{ color: C.muted }}>{f.l}</span>
                <span style={{ color: C.text }}>{f.v}</span>
              </div>
            ))}

            {/* Stage changer */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 7 }}>Move Stage</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {PIPELINE_STAGES.map(s => (
                  <button key={s} onClick={() => updateStage(sel.id, s)} style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${sel.stage === s ? STAGE_COLOR[s] : C.border}`, background: sel.stage === s ? `${STAGE_COLOR[s]}22` : "transparent", color: sel.stage === s ? STAGE_COLOR[s] : C.muted, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Conversations */}
            {(sel.conversations || []).length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 7 }}>Conversations</div>
                {sel.conversations.map(cv => (
                  <div key={cv.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.muted, textTransform: "capitalize" }}>{cv.platform}</span>
                    <GoldTag color={cv.status === "open" ? C.green : C.muted}>{cv.status}</GoldTag>
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Notes</div>
                <button onClick={() => setAddingNote(!addingNote)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 5, padding: "2px 8px", fontSize: 10, cursor: "pointer" }}>+ Add</button>
              </div>
              {addingNote && (
                <div style={{ marginBottom: 8 }}>
                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Write a note…" rows={3} style={{ width: "100%", background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontSize: 12, resize: "none" }} />
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    <GoldBtn onClick={saveNote} style={{ padding: "4px 12px", fontSize: 10 }}>Save</GoldBtn>
                    <button onClick={() => { setAddingNote(false); setNoteText(""); }} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "4px 10px", fontSize: 10, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
              {sel.notes && <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, background: C.bg4, borderRadius: 7, padding: "8px 10px" }}>{sel.notes}</div>}
            </div>

            {/* Activity log */}
            {activities.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 7 }}>Activity Log</div>
                {activities.map(a => (
                  <div key={a.id} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11 }}>
                    <span>{ACTIVITY_ICON[a.activity_type] || "•"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.text }}>{a.description}</div>
                      <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>{new Date(a.created_at).toLocaleString("en-PH")}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI insight */}
            <div style={{ marginTop: 16, background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px" }}>? Hermes AI</div>
                <GoldBtn onClick={() => generateInsight(sel)} disabled={gen} style={{ padding: "4px 12px", fontSize: 10 }}>{gen ? "…" : "Analyze"}</GoldBtn>
              </div>
              {aiInsight && <div style={{ fontSize: 11, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{aiInsight}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
//  ERP MODULE (keeping your existing ERPModule component)
// ---------------------------------------------------------------------------
function ERPModule({ activeBrandId, activeBrandName, notify }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", category: "", price: "", cost: "", stock: "", reorder_point: "50" });

  useEffect(() => {
    if (!activeBrandId) { setProducts([]); return; }
    let alive = true;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("brand_id", activeBrandId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (!error) setProducts(data || []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [activeBrandId]);

  const addProduct = async () => {
    if (!form.name.trim() || !activeBrandId) return;
    const stock = parseInt(form.stock) || 0;
    const reorder = parseInt(form.reorder_point) || 50;
    const { error } = await supabase.from("products").insert({
      brand_id: activeBrandId,
      name: form.name.trim(),
      sku: form.sku.trim() || null,
      category: form.category.trim() || null,
      price: parseFloat(form.price) || 0,
      cost: parseFloat(form.cost) || 0,
      stock,
      reorder_point: reorder,
      status: stock === 0 ? "critical" : stock <= reorder ? "low" : "healthy",
      is_active: true,
    });
    if (error) { notify(error.message); return; }
    setForm({ name: "", sku: "", category: "", price: "", cost: "", stock: "", reorder_point: "50" });
    setShowAdd(false);
    notify("Product added");
    // reload
    const { data } = await supabase.from("products").select("*").eq("brand_id", activeBrandId).eq("is_active", true).order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const updateStock = async (id, delta) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    let status = "healthy";
    if (newStock === 0) status = "critical";
    else if (newStock <= product.reorder_point) status = "low";
    await supabase.from("products").update({ stock: newStock, status }).eq("id", id);
    setProducts(list => list.map(p => p.id === id ? { ...p, stock: newStock, status } : p));
  };

  const filtered = products.filter(p => filter === "all" || p.status === filter);
  const totalVal = products.reduce((a, p) => a + p.stock * (p.cost || 0), 0);
  const totalRev = products.reduce((a, p) => a + (p.sold || 0) * (p.price || 0), 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C.muted }}>
          {activeBrandId ? <>Inventory for <span style={{ color: C.gold, fontWeight: 700 }}>{activeBrandName}</span></> : "Select a brand"}
        </div>
        <GoldBtn onClick={() => setShowAdd(!showAdd)} style={{ padding: "6px 16px", fontSize: 11 }}>+ Add Product</GoldBtn>
      </div>

      {/* Add product form */}
      {showAdd && (
        <div style={{ background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 12 }}>New Product</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[["name", "Product Name *"], ["sku", "SKU"], ["category", "Category"]].map(([k, ph]) => (
              <input key={k} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph} style={{ background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "8px 10px", color: C.text, fontSize: 12 }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[["price", "Price (?)"], ["cost", "Cost (?)"], ["stock", "Stock Qty"], ["reorder_point", "Reorder At"]].map(([k, ph]) => (
              <input key={k} type="number" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph} style={{ background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "8px 10px", color: C.text, fontSize: 12 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GoldBtn onClick={addProduct} style={{ padding: "6px 16px", fontSize: 11 }}>Save Product</GoldBtn>
            <button onClick={() => setShowAdd(false)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "6px 14px", fontSize: 11, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        <GoldKPI label="Total SKUs" value={products.length} change={`${activeBrandName || "brand"}`} up icon="??" color={C.gold} />
        <GoldKPI label="Inventory Value" value={`?${(totalVal / 1000).toFixed(1)}K`} change="Current stock" up icon="??" color={C.green} />
        <GoldKPI label="Gross Revenue" value={`?${(totalRev / 1000).toFixed(1)}K`} change="All time" up icon="??" color={C.amber} />
        <GoldKPI label="Critical Stock" value={products.filter(p => p.status === "critical").length} change="Reorder now" up={false} icon="??" color={C.red} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["all", "healthy", "low", "critical"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 14px", borderRadius: 8, border: `1px solid ${filter === s ? (s === "healthy" ? C.green : s === "low" ? C.amber : s === "critical" ? C.red : C.gold) : C.border}`, background: filter === s ? `${s === "healthy" ? C.green : s === "low" ? C.amber : s === "critical" ? C.red : C.gold}18` : "transparent", color: filter === s ? (s === "healthy" ? C.green : s === "low" ? C.amber : s === "critical" ? C.red : C.gold) : C.muted, fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{s === "all" ? "All Status" : s}</button>
        ))}
      </div>

      {loading && <div style={{ color: C.muted, fontSize: 12, padding: "10px 0" }}>Loading products…</div>}
      {!loading && filtered.length === 0 && (
        <div style={{ color: C.muted, fontSize: 13, padding: "20px 0" }}>No products yet. Click "+ Add Product" to get started.</div>
      )}

      {filtered.length > 0 && (
        <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead style={{ background: C.bg2 }}>
              <tr>{["Product", "SKU", "Category", "Stock", "Price", "Cost", "Margin", "Status", "Adjust"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: C.muted, fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.8px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const statusCol = p.status === "critical" ? C.red : p.status === "low" ? C.amber : C.green;
                const margin = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}`, animation: `fadeUp 0.2s ease ${i * 0.03}s both` }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: C.text }}>{p.name}</td>
                    <td style={{ padding: "10px 14px", color: C.muted, fontFamily: "monospace", fontSize: 10 }}>{p.sku || "—"}</td>
                    <td style={{ padding: "10px 14px" }}><GoldTag>{p.category || "—"}</GoldTag></td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 700, color: statusCol }}>{p.stock.toLocaleString()}</div>
                      <div style={{ fontSize: 9, color: C.muted }}>reorder @ {p.reorder_point}</div>
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: C.green }}>?{Number(p.price).toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", color: C.muted }}>?{Number(p.cost).toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: margin > 40 ? C.green : C.amber }}>{margin}%</td>
                    <td style={{ padding: "10px 14px" }}><GoldTag color={statusCol}>{p.status === "critical" ? "?? Critical" : p.status === "low" ? "?? Low" : "?? OK"}</GoldTag></td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => updateStock(p.id, -1)} style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.red, cursor: "pointer", fontWeight: 700 }}>-</button>
                        <button onClick={() => updateStock(p.id, 1)} style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.green, cursor: "pointer", fontWeight: 700 }}>+</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
//  ANALYTICS MODULE (keeping your existing AnalyticsModule)
// ---------------------------------------------------------------------------
function AnalyticsModule({ activeBrandId }) {
  const [stats, setStats] = useState({ totalContacts: 0, customers: 0, leads: 0, totalMessages: 0, avgLTV: 0, openConvos: 0 });
  const [msgData, setMsgData] = useState([]);
  const [_stageData, setStageData] = useState([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: contacts }, { data: convos }] = await Promise.all([
        activeBrandId ? supabase.from("contacts").select("stage, lifetime_value").eq("brand_id", activeBrandId)
                      : supabase.from("contacts").select("stage, lifetime_value"),
        activeBrandId ? supabase.from("conversations").select("status, created_at").eq("brand_id", activeBrandId)
                      : supabase.from("conversations").select("status, created_at"),
      ]);

      const totalContacts = contacts?.length || 0;
      const customers = contacts?.filter(c => c.stage === "Customer").length || 0;
      const leads = contacts?.filter(c => c.stage === "Lead").length || 0;
      const totalLTV = contacts?.reduce((a, c) => a + (c.lifetime_value || 0), 0) || 0;
      const avgLTV = customers > 0 ? Math.round(totalLTV / customers) : 0;
      const openConvos = convos?.filter(c => c.status === "open").length || 0;

      // Build monthly message data from conversations
      const monthMap = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString("en-PH", { month: "short" });
        monthMap[key] = { m: key, conversations: 0, leads: 0 };
      }
      (convos || []).forEach(c => {
        const d = new Date(c.created_at);
        const key = d.toLocaleString("en-PH", { month: "short" });
        if (monthMap[key]) monthMap[key].conversations++;
      });

      // Stage breakdown
      const stageBreakdown = PIPELINE_STAGES.map(s => ({
        name: s,
        value: contacts?.filter(c => c.stage === s).length || 0,
        color: STAGE_COLOR[s],
      })).filter(s => s.value > 0);

      setStats({ totalContacts, customers, leads, avgLTV, openConvos, totalLTV });
      setMsgData(Object.values(monthMap));
      setStageData(stageBreakdown);
      setLoading(false);
    };
    load();
  }, [activeBrandId]);

  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <GoldKPI label="Total Contacts" value={stats.totalContacts.toLocaleString()} change="from CRM" up icon="??" color={C.gold}/>
        <GoldKPI label="Customers" value={stats.customers.toLocaleString()} change={`${stats.totalContacts ? Math.round(stats.customers/stats.totalContacts*100) : 0}% conversion`} up icon="?" color={C.green}/>
        <GoldKPI label="Avg. LTV" value={`?${stats.avgLTV.toLocaleString()}`} change="per customer" up icon="??" color={C.cyan}/>
        <GoldKPI label="Open Convos" value={stats.openConvos.toLocaleString()} change="need response" up={false} icon="??" color={C.amber}/>
      </div>

      <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px",marginBottom:16}}>
        <SectionHead sub="Last 6 months · Live data">Conversations Over Time</SectionHead>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={msgData}>
            <defs>
              <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient>
              <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.3}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
              <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.red} stopOpacity={0.2}/><stop offset="95%" stopColor={C.red} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="m" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`?${v/1000}K`}/>
            <Tooltip content={<TooltipBox/>}/>
            <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
            <Area type="monotone" dataKey="conversations" name="Conversations" stroke={C.gold} fill="url(#gr)" strokeWidth={2}/>
            <Area type="monotone" dataKey="leads" name="New Leads" stroke={C.green} fill="url(#gp)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="two-col-grid">
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Reach & conversion by platform">Platform Performance</SectionHead>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platformPerf} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="platform" type="category" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} width={60}/>
              <Tooltip content={<TooltipBox/>}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="reach" name="Reach %" fill={C.gold} radius={[0,4,4,0]}/>
              <Bar dataKey="conv" name="Conv. %" fill={C.green} radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Lead to customer journey">Conversion Funnel</SectionHead>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:4}}>
            {[
              {stage:"Total Reach",val:284000,pct:100,color:C.gold},
              {stage:"Engaged",val:19880,pct:7,color:C.amber},
              {stage:"Leads",val:8064,pct:2.8,color:C.violet},
              {stage:"Prospects",val:2820,pct:1.0,color:C.cyan},
              {stage:"Customers",val:940,pct:0.33,color:C.green},
            ].map((f,i)=>(
              <div key={i}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11}}>
                  <span style={{color:C.muted}}>{f.stage}</span>
                  <span style={{fontWeight:700,color:f.color}}>{f.val.toLocaleString()} <span style={{color:C.muted,fontWeight:400}}>({f.pct}%)</span></span>
                </div>
                <div style={{height:7,background:C.border,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(f.pct*10,100)}%`,background:f.color,borderRadius:4}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="two-col-grid">
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Brand sentiment score">Sentiment Trend</SectionHead>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="month" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TooltipBox/>}/>
              <Legend wrapperStyle={{fontSize:10}}/>
              <Bar dataKey="positive" name="Positive" stackId="a" fill={C.green}/>
              <Bar dataKey="neutral" name="Neutral" stackId="a" fill={C.muted}/>
              <Bar dataKey="negative" name="Negative" stackId="a" fill={C.red} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Monthly volume">Lead Generation Trend</SectionHead>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={msgData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TooltipBox/>}/>
              <Line type="monotone" dataKey="leads" name="Leads" stroke={C.gold} strokeWidth={2} dot={{fill:C.gold,r:3}} activeDot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  DEMOGRAPHICS MODULE (keeping your existing DemographicsModule)
// ---------------------------------------------------------------------------
function DemographicsModule() {
  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}} className="demographics-module">
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}} className="kpi-grid">
        <GoldKPI label="Total Audience" value="284K" change="+18% MoM" up icon="??" color={C.gold}/>
        <GoldKPI label="Top Age Group" value="25–34" change="48K reach" up icon="??" color={C.amber}/>
        <GoldKPI label="Female Audience" value="61.4%" change="+2.1% MoM" up icon="??" color={C.rose}/>
        <GoldKPI label="Top Region" value="Metro MNL" change="38.4% share" up icon="???" color={C.cyan}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="two-col-grid">
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="By age group and gender">Age & Gender Distribution</SectionHead>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <YAxis dataKey="age" type="category" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} width={46}/>
              <Tooltip content={<TooltipBox/>}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="female" name="Female" fill={C.rose} radius={[0,4,4,0]}/>
              <Bar dataKey="male" name="Male" fill={C.cyan} radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Philippine regional audience share">Geographic Distribution</SectionHead>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={geoData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {geoData.map((g,i)=><Cell key={i} fill={g.color}/>)}
              </Pie>
              <Tooltip formatter={(v)=>`${v}%`}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}} className="legend-items">
            {geoData.map(g=>(
              <div key={g.region} style={{display:"flex",alignItems:"center",gap:5,fontSize:10}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:g.color,flexShrink:0}}/>
                <span style={{color:C.muted}}>{g.region}</span>
                <span style={{fontWeight:700,color:g.color}}>{g.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px",marginBottom:14}}>
        <SectionHead sub="Psychographic customer segments">Merchant Archetypes</SectionHead>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="archetypes-grid">
          {[
            {name:"Beauty Enthusiasts",pct:34,icon:"??",color:C.rose,traits:["Ages 18–34","Female 88%","High spend","Instagram-first"],ltv:"?2.8M"},
            {name:"Value Hunters",pct:28,icon:"???",color:C.amber,traits:["Ages 25–44","Mixed gender","Price-sensitive","Shopee-native"],ltv:"?1.4M"},
            {name:"Mommy Market",pct:22,icon:"??",color:C.green,traits:["Ages 28–40","Female 94%","Quality-focused","FB Groups"],ltv:"?1.9M"},
            {name:"Foodie Explorers",pct:16,icon:"??",color:C.cyan,traits:["Ages 20–35","Mixed","Trend-driven","TikTok-native"],ltv:"?0.8M"},
          ].map((seg,i)=>(
            <div key={i} style={{
              background:C.bg4,border:`1px solid ${C.border}`,
              borderRadius:12,padding:"16px",borderTop:`2px solid ${seg.color}`,
            }} className="archetype-card">
              <div style={{fontSize:22,marginBottom:8}}>{seg.icon}</div>
              <div style={{fontWeight:700,fontSize:12,marginBottom:4,color:C.text}}>{seg.name}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:seg.color,marginBottom:8}}>{seg.pct}%</div>
              {seg.traits.map(t=><div key={t} style={{fontSize:10,color:C.muted,marginBottom:2}}>· {t}</div>)}
              <div style={{marginTop:10,fontSize:11,fontWeight:700,color:seg.color}}>LTV {seg.ltv}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="two-col-grid">
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Device usage">Device Split</SectionHead>
          {[{d:"Mobile",pct:78,color:C.gold},{d:"Desktop",pct:16,color:C.cyan},{d:"Tablet",pct:6,color:C.violet}].map(d=>(
            <div key={d.d} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                <span style={{color:C.muted}}>{d.d}</span>
                <span style={{fontWeight:700,color:d.color}}>{d.pct}%</span>
              </div>
              <div style={{height:7,background:C.border,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${d.pct}%`,background:d.color,borderRadius:4}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Peak hours PHT">Engagement Heatmap</SectionHead>
          <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:3}} className="heatmap-grid">
            {["6AM","8AM","10AM","12PM","2PM","4PM","6PM","8PM","10PM","12AM","2AM","4AM"].map((t,i)=>{
              const intensity=[0.15,0.35,0.55,0.9,0.65,0.8,1.0,0.95,0.8,0.45,0.15,0.08][i];
              return (
                <div key={t} style={{textAlign:"center"}}>
                  <div style={{height:44,background:C.gold,opacity:intensity,borderRadius:4,marginBottom:4}}/>
                  <div style={{fontSize:7,color:C.muted}}>{t}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  MARKET RESEARCH MODULE (keeping your existing MarketResearchModule)
// ---------------------------------------------------------------------------
function MarketResearchModule() {
  const [aiReport,setAiReport]=useState("");
  const [gen,setGen]=useState(false);
  const [topic,setTopic]=useState("beauty and skincare market philippines 2025");

  const generateReport=async()=>{
    setGen(true);setAiReport("");
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,
          messages:[{role:"user",content:`You are Hermes AI — an expert market research analyst specializing in Philippine e-commerce, social commerce, and consumer markets. Generate a sharp, insightful market analysis for: "${topic}"

Use exactly these sections with ? prefix:\n? Market Overview\n? Key Trends (3 bullets with •)\n? Target Demographics\n? Competitive Landscape\n? Growth Opportunities (3 bullets with •)\n? Hermes Strategic Recommendations (3 bullets with •)

Be specific with Philippine context, use data estimates, keep each section concise and insightful. No markdown asterisks.`}]})});
      const d=await res.json();
      setAiReport(d.content?.map(b=>b.text||"").join("")||"Error generating report.");
    } catch{setAiReport("Connection error. Please try again.");}
    setGen(false);
  };

  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}} className="research-module">
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}} className="kpi-grid">
        <GoldKPI label="PH Market Size" value="?892B" change="+14% CAGR" up icon="??" color={C.gold}/>
        <GoldKPI label="E-comm Penetration" value="38.4%" change="+6.2% YoY" up icon="??" color={C.green}/>
        <GoldKPI label="Social Commerce" value="?124B" change="+42% YoY" up icon="??" color={C.amber}/>
        <GoldKPI label="Your Market Share" value="2.8%" change="+0.4% QoQ" up icon="??" color={C.rose}/>
      </div>

      {/* AI Report Generator */}
      <div style={{
        background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:14,
        padding:"22px 24px",marginBottom:16,
        borderTop:`2px solid ${C.gold}`,
        position:"relative",overflow:"hidden",
      }} className="ai-report-generator">
        <div style={{position:"absolute",top:0,right:0,width:200,height:200,
          background:`radial-gradient(circle,${C.gold}08,transparent)`,borderRadius:"0 14px 0 200px"}}/>
        <div style={{marginBottom:14}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:C.gold,marginBottom:4}}>
            ? Pythian Oracle — AI Research Engine
          </div>
          <div style={{fontSize:12,color:C.muted}}>Powered by Hermes AI · Generate instant market intelligence on any Philippine commerce topic</div>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:14}} className="research-input-row">
          <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Enter research topic…"
            style={{flex:1,background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:9,padding:"10px 14px",color:C.text,fontSize:13}}/>
          <GoldBtn onClick={generateReport} disabled={gen} style={{whiteSpace:"nowrap",padding:"10px 24px"}}>
            {gen?<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>?</span>Consulting Oracle…</span>:"?? Generate Report"}
          </GoldBtn>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:aiReport?16:0}} className="topic-suggestions">
          {["beauty market philippines","philippine food delivery 2025","social commerce PH trends","online fashion ph","baby products ecommerce ph","home living market ph"].map(t=>(
            <button key={t} onClick={()=>setTopic(t)} style={{
              padding:"4px 12px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",
              color:C.muted,fontSize:11,cursor:"pointer",transition:"all 0.15s",
            }} onMouseEnter={e=>{e.target.style.color=C.gold;e.target.style.borderColor=C.gold;}}
            onMouseLeave={e=>{e.target.style.color=C.muted;e.target.style.borderColor=C.border;}}>{t}</button>
          ))}
        </div>
        {aiReport&&(
          <div style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:11,padding:"18px 20px"}} className="report-content">
            {aiReport.split("\n").filter(l=>l.trim()).map((line,i)=>{
              const isHead=line.startsWith("?");
              return (
                <div key={i} style={{
                  marginBottom:isHead?10:3, marginTop:isHead&&i>0?18:0,
                  fontSize:isHead?13:12, fontWeight:isHead?700:400,
                  color:isHead?C.gold:C.text, lineHeight:1.8,
                  paddingLeft:line.startsWith("•")?14:0,
                  fontFamily:isHead?"'Cormorant Garamond',serif":"inherit",
                  letterSpacing:isHead?"0.3px":"normal",
                }}>{line}</div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="two-col-grid">
        {/* Keywords */}
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="Search volume & competition">Keyword Intelligence</SectionHead>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr>{["Keyword","Vol/mo","Trend","CPC","Comp."].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"6px 8px",color:C.muted,fontWeight:600,fontSize:9,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {keywordData.map((k,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"8px",color:C.text,fontWeight:500}}>{k.keyword}</td>
                  <td style={{padding:"8px",color:C.gold,fontWeight:700}}>{k.vol.toLocaleString()}</td>
                  <td style={{padding:"8px",color:C.green,fontWeight:700}}>+{k.trend}%</td>
                  <td style={{padding:"8px",color:C.muted}}>?{k.cpc}</td>
                  <td style={{padding:"8px"}}>
                    <div style={{width:40,height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${k.comp*100}%`,background:k.comp>0.7?C.red:C.amber,borderRadius:2}}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Competitor Radar */}
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
          <SectionHead sub="6-dimensional competitor analysis">Competitive Radar</SectionHead>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border}/>
              <PolarAngleAxis dataKey="subject" tick={{fill:C.muted,fontSize:9}}/>
              <Radar name="Hermes" dataKey="Hermes" stroke={C.gold} fill={C.gold} fillOpacity={0.15} strokeWidth={2}/>
              <Radar name="ManyChat" dataKey="ManyChat" stroke={C.cyan} fill={C.cyan} fillOpacity={0.08} strokeWidth={1.5}/>
              <Radar name="Tidio" dataKey="Tidio" stroke={C.violet} fill={C.violet} fillOpacity={0.08} strokeWidth={1.5}/>
              <Radar name="SocialBee" dataKey="SocialBee" stroke={C.rose} fill={C.rose} fillOpacity={0.08} strokeWidth={1.5}/>
              <Legend wrapperStyle={{fontSize:10}}/>
              <Tooltip content={<TooltipBox/>}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Trends */}
      <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px"}}>
        <SectionHead sub="Emerging opportunities in Philippine e-commerce">Market Trend Intelligence</SectionHead>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="trends-grid">
          {[
            {trend:"Live Commerce",growth:"+186%",detail:"TikTok Shop and Facebook Live surging. Real-time demos drive 3x higher conversion vs static posts.",icon:"??",color:C.red,signal:"?? Hot"},
            {trend:"Social-First Shopping",growth:"+94%",detail:"Discovery and purchase happening inside Instagram, TikTok, Facebook — bypassing traditional e-comm entirely.",icon:"??",color:C.rose,signal:"?? Rising"},
            {trend:"COD Dominance",growth:"+22%",detail:"Cash-on-delivery preferred in provincial areas. Brands offering COD see 3.2x higher conversion nationally.",icon:"??",color:C.green,signal:"?? Insight"},
            {trend:"Micro-Influencers",growth:"+67%",detail:"Nano & micro influencers (1K–50K) outperform macro with 4.8x higher engagement for Philippine brands.",icon:"?",color:C.gold,signal:"?? Rising"},
            {trend:"Sustainability",growth:"+48%",detail:"Eco-conscious buying growing in Metro Manila. Sustainable messaging drives +28% repeat purchase loyalty.",icon:"??",color:C.cyan,signal:"?? Insight"},
            {trend:"B2B Social Sales",growth:"+112%",detail:"Wholesale buyers engaging via Messenger and Viber. Emerging bulk-order segment ripe for automation.",icon:"??",color:C.violet,signal:"?? Hot"},
          ].map((t,i)=>(
            <div key={i} style={{
              background:C.bg4,border:`1px solid ${C.border}`,borderRadius:12,
              padding:"16px",borderLeft:`3px solid ${t.color}`,
            }} className="trend-card">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:22}}>{t.icon}</span>
                <GoldTag color={t.color}>{t.signal}</GoldTag>
              </div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:4,color:C.text}}>{t.trend}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:t.color,marginBottom:8}}>{t.growth}</div>
              <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>{t.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  INBOX MODULE (keeping your existing InboxModule)
// ---------------------------------------------------------------------------
const ALL_NAV = [
  {id:"inbox",        icon:"?",   label:"Inbox",           roles:["client","admin"]},
  {id:"crm",          icon:"??",  label:"CRM",             roles:["client","admin"]},
  {id:"calendar",     icon:"??",  label:"Calendar",        roles:["client","admin"]},
  {id:"orders",       icon:"??",  label:"Orders",          roles:["client","admin"]},
  {id:"analytics",    icon:"??",  label:"Analytics",       roles:["client","admin"]},
  {id:"metrics",      icon:"?",  label:"My Metrics",      roles:["client"]},
  {id:"adsresults",   icon:"??",  label:"Ad Results",      roles:["client"]},
  {id:"broadcast",    icon:"??",  label:"Broadcast",       roles:["admin"]},
  {id:"email",        icon:"??",  label:"Email Marketing", roles:["admin"]},
  {id:"erp",          icon:"??",  label:"Inventory",       roles:["admin"]},
  {id:"demographics", icon:"?",  label:"Demographics",    roles:["admin"]},
  {id:"research",     icon:"??",  label:"Market Research", roles:["admin"]},
  {id:"team",         icon:"??",  label:"Team",            roles:["admin"]},
  {id:"chatbot",      icon:"?",  label:"AI Chatbot",      roles:["admin"]},
  {id:"socialads",    icon:"??",  label:"Social Ads",      roles:["admin"]},
  {id:"admin",        icon:"?",  label:"Admin Setup",     roles:["admin"]},
  {id:"settings",     icon:"??",  label:"Settings",        roles:["client","admin"]},
  {id:"modules",      icon:"??",  label:"Module Manager",  roles:["admin"]},
  {id:"sales",        icon:"??",  label:"Sales",           roles:["admin"]},
  {id:"marketing",    icon:"??",  label:"Marketing",       roles:["admin"]},
  {id:"leads",        icon:"?",  label:"Lead Scoring",    roles:["admin"]},
  {id:"campaigns",    icon:"??",  label:"Campaigns",       roles:["admin"]},
  {id:"accounting",   icon:"??",  label:"Accounting",      roles:["admin"]},
  {id:"hr",           icon:"??",  label:"HR & Payroll",    roles:["admin"]},
  {id:"taxreports",   icon:"??",  label:"Tax Reports",     roles:["admin"]},
  {id:"support",      icon:"??",  label:"Support",         roles:["admin"]},
  {id:"nps",          icon:"??",  label:"NPS & Feedback",  roles:["admin"]},
  {id:"projects",     icon:"??",  label:"Projects",        roles:["admin"]},
  {id:"timetrack",    icon:"?",  label:"Time Tracking",   roles:["admin"]},
  {id:"procurement",  icon:"??",  label:"Procurement",     roles:["admin"]},
  {id:"warehouse",    icon:"??",  label:"Warehouse",       roles:["admin"]},
  {id:"logistics",    icon:"??",  label:"Logistics",       roles:["admin"]},
  {id:"legal",        icon:"?",  label:"Legal",           roles:["admin"]},
  {id:"risk",         icon:"??",  label:"Risk & Audit",    roles:["admin"]},
  {id:"itsec",        icon:"??",  label:"IT & Security",   roles:["admin"]},
  {id:"facilities",   icon:"??",  label:"Facilities",      roles:["admin"]},
  {id:"docai",        icon:"??",  label:"Document AI",     roles:["admin"]},
  {id:"bizassist",    icon:"??",  label:"Corporate AI",    roles:["admin"]},
  {id:"predict",      icon:"??",  label:"Predictive AI",   roles:["admin"]}
];

export default function App() {
  useIubendaEmbed();
  const [session,setSession]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [profile,setProfile]=useState(null);
  const [profileLoading,setProfileLoading]=useState(false);
  const [brands,setBrands]=useState([]);
  const [brandLoading,setBrandLoading]=useState(false);
  const [activeBrandId,setActiveBrandId]=useState(null);
  const [brandAlerts,setBrandAlerts]=useState({});
  const [brandLastSeen,setBrandLastSeen]=useState({});
  const [nav,setNav]=useState("inbox");
  const [notif,setNotif]=useState(null);

  const notify=msg=>{setNotif(msg);setTimeout(()=>setNotif(null),3000);};
  const cycleBrand=()=>{
    if(!brands.length) return;
    const idx=brands.findIndex(b=>b.id===activeBrandId);
    const next=brands[(idx+1)%brands.length];
    if(next?.id) setActiveBrandId(next.id);
  };

  useEffect(()=>{
    let alive=true;
    supabase.auth.getSession().then(({ data })=>{
      if(!alive) return;
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data:listener } = supabase.auth.onAuthStateChange((_event, nextSession)=>{
      setSession(nextSession);
    });
    return ()=>{
      alive=false;
      listener?.subscription?.unsubscribe();
    };
  },[]);

  useEffect(()=>{
    if(!session?.user){
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    let alive=true;
    (async()=>{
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", session.user.id)
        .single();
      if(!alive) return;
      if(!error) setProfile(data);
      if(error) console.error("Profile load failed", error);
      setProfileLoading(false);
    })();
    return ()=>{alive=false;};
  },[session]);


  const sessionUser = session?.user;
  const userName = profile?.full_name || sessionUser?.email?.split("@")[0] || "User";
  const roleRaw = (profile?.role || sessionUser?.user_metadata?.role || "client").toString().toLowerCase();
  const role = roleRaw === "admin" ? "admin" : "client";
  const roleLabel = roleRaw ? roleRaw[0].toUpperCase()+roleRaw.slice(1) : "User";
  const initials = userName.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase();
  const activeBrand = brands.find(b=>b.id===activeBrandId) || null;
  const brandInitials = (activeBrand?.name || "Exponify").split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase();

  const navItems = ALL_NAV.filter(item => item.roles.includes(role));

  const getLastSeenMap=()=>{
    if(!session?.user?.id) return {};
    const key=`hermes.brandLastSeen.${session.user.id}`;
    try{
      return JSON.parse(localStorage.getItem(key)||"{}");
    }catch{
      return {};
    }
  };

  const saveLastSeenMap=(next)=>{
    if(!session?.user?.id) return;
    const key=`hermes.brandLastSeen.${session.user.id}`;
    localStorage.setItem(key, JSON.stringify(next));
  };

  useEffect(()=>{
    if(!session?.user){
      setBrands([]);
      setActiveBrandId(null);
      return;
    }
    let alive=true;
    setBrandLoading(true);
    (async()=>{
      try{
        let data=[];
        if(role==="admin"){
          const { data: b, error } = await supabase
            .from("brands")
            .select("id,name,color,description")
            .order("name");
          if(error) throw error;
          data=b||[];
        }else{
          const { data: ub, error } = await supabase
            .from("user_brands")
            .select("brand_id, brands (id, name, color, description)")
            .eq("user_id", session.user.id);
          if(error) throw error;
          data=(ub||[]).map(r=>r.brands).filter(Boolean);
        }
        if(!alive) return;
        setBrands(data);
      }catch(err){
        console.error("Brand load failed", err);
      }finally{
        if(alive) setBrandLoading(false);
      }
    })();
    return ()=>{alive=false;};
  },[session, role]);

  useEffect(()=>{
    if(!session?.user?.id) return;
    setBrandLastSeen(getLastSeenMap());
  },[session?.user?.id]);

  const refreshBrandAlerts=async()=>{
    if(!session?.user || !brands.length) return;
    try{
      const brandIds = brands.map(b=>b.id);
      const { data, error } = await supabase
        .from("conversations")
        .select("brand_id, last_message_at")
        .in("brand_id", brandIds)
        .eq("status", "open");
      if(error) throw error;
      const counts = {};
      const lastSeen = brandLastSeen || {};
      (data||[]).forEach(r=>{
        const ts = r.last_message_at ? new Date(r.last_message_at).getTime() : 0;
        const seenTs = lastSeen[r.brand_id] || 0;
        if(ts > seenTs) counts[r.brand_id]=(counts[r.brand_id]||0)+1;
      });
      setBrandAlerts(counts);
    }catch(err){
      console.error("Alert load failed", err);
    }
  };

  useEffect(()=>{
    refreshBrandAlerts();
    const t = setInterval(refreshBrandAlerts, 5000);
    return ()=>clearInterval(t);
  },[brands, session?.user?.id, brandLastSeen]);

  useEffect(()=>{
    refreshBrandAlerts();
  },[activeBrandId]);

  useEffect(()=>{
    if(!session?.user?.id || !activeBrandId) return;
    const next = { ...getLastSeenMap(), [activeBrandId]: Date.now() };
    setBrandLastSeen(next);
    saveLastSeenMap(next);
  },[activeBrandId, session?.user?.id]);

  const markBrandSeen=()=>{
    if(!session?.user?.id || !activeBrandId) return;
    const next = { ...getLastSeenMap(), [activeBrandId]: Date.now() };
    setBrandLastSeen(next);
    saveLastSeenMap(next);
  };

  useEffect(()=>{
    if(!session?.user) return;
    if(!brands.length){
      setActiveBrandId(null);
      return;
    }
    const storageKey=`hermes.activeBrand.${session.user.id}`;
    const stored=localStorage.getItem(storageKey);
    const exists=brands.find(b=>b.id===stored);
    setActiveBrandId(exists?.id || brands[0].id);
  },[brands, session?.user?.id]);

  useEffect(()=>{
    if(!session?.user || !activeBrandId) return;
    const storageKey=`hermes.activeBrand.${session.user.id}`;
    localStorage.setItem(storageKey, activeBrandId);
  },[activeBrandId, session?.user?.id]);

  useEffect(()=>{
    if(!navItems.find(n=>n.id===nav)){
      setNav(navItems[0]?.id || "inbox");
    }
  },[role, nav]);

  if(profileLoading){
    return (
      <div style={{minHeight:"100vh",background:C.bg0,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <style>{`
          @keyframes spinRing { to { transform: rotate(360deg); } }
          @keyframes pulseGlow { 0%,100% { opacity: 0.35; } 50% { opacity: 0.9; } }
        `}</style>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{
            width:44,height:44,borderRadius:"50%",
            border:`2px solid ${C.border2}`,
            borderTopColor:C.gold,
            boxShadow:GOLD_GLOW,
            animation:"spinRing 0.9s linear infinite",
          }}/>
          <div style={{fontSize:12,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",animation:"pulseGlow 1.6s ease-in-out infinite"}}>
            Loading profile…
          </div>
        </div>
      </div>
    );
  }

  if(authLoading){
    return (
      <div style={{minHeight:"100vh",background:C.bg0,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <style>{`
          @keyframes spinRing { to { transform: rotate(360deg); } }
          @keyframes pulseGlow { 0%,100% { opacity: 0.35; } 50% { opacity: 0.9; } }
        `}</style>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{
            width:44,height:44,borderRadius:"50%",
            border:`2px solid ${C.border2}`,
            borderTopColor:C.gold,
            boxShadow:GOLD_GLOW,
            animation:"spinRing 0.9s linear infinite",
          }}/>
          <div style={{fontSize:12,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",animation:"pulseGlow 1.6s ease-in-out infinite"}}>
            Loading…
          </div>
        </div>
      </div>
    );
  }

  if(!session){
    return <LandingPage />;
  }

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg0,fontFamily:"'DM Sans','Segoe UI',sans-serif",color:C.text,overflow:"hidden"}} className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        textarea,input,select{font-family:inherit;}
        textarea:focus,input:focus,select:focus{outline:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes notif{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        .nav-item:hover{background:${C.bg3}!important;color:${C.text}!important;}
        .nav-item.on{background:${C.bg4}!important;color:${C.gold}!important;border-left:2px solid ${C.gold}!important;}
        .hover-gold:hover{border-color:${C.gold}!important;color:${C.gold}!important;}

        /* ===== RESPONSIVE DESIGN ===== */
        
        /* Tablet Styles (768px - 1024px) */
        @media (max-width: 1024px) {
          .sidebar {
            width: 180px !important;
          }
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .two-col-grid {
            grid-template-columns: 1fr !important;
          }
          .trends-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .archetypes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .section-title {
            font-size: 20px !important;
          }
          .kpi-value {
            font-size: 22px !important;
          }
          table {
            font-size: 11px !important;
          }
          th, td {
            padding: 8px 10px !important;
          }
        }

        /* Mobile Styles (below 768px) */
        @media (max-width: 768px) {
          /* Layout */
          .app-container {
            flex-direction: column !important;
          }
          
          /* Sidebar becomes top bar */
          .sidebar {
            width: 100% !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid ${C.border} !important;
          }
          
          /* Horizontal scroll for navigation */
          .sidebar .nav-items {
            display: flex !important;
            overflow-x: auto !important;
            padding: 8px !important;
            gap: 4px !important;
          }
          
          .sidebar .nav-item {
            flex-shrink: 0 !important;
            white-space: nowrap !important;
          }
          
          /* Brand section */
          .sidebar .brand-section {
            flex-direction: row !important;
            align-items: center !important;
            padding: 10px !important;
          }
          
          /* Main content */
          .main-content {
            height: calc(100vh - 120px) !important;
          }
          
          /* KPI grids */
          .kpi-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          
          .kpi-row {
            flex-direction: column !important;
          }
          
          .kpi-item {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid ${C.border} !important;
          }
          
          /* Tables */
          .table-container {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          table {
            min-width: 600px !important;
          }
          
          .table-wrapper {
            overflow-x: auto !important;
          }
          
          /* Charts */
          .charts-grid {
            grid-template-columns: 1fr !important;
          }
          
          /* Trends and archetypes */
          .trends-grid {
            grid-template-columns: 1fr !important;
          }
          
          .archetypes-grid {
            grid-template-columns: 1fr !important;
          }
          
          /* Filters */
          .filters-row {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
          }
          
          .filter-btn {
            flex-shrink: 0 !important;
          }
          
          .search-input {
            width: 100% !important;
            margin-left: 0 !important;
            margin-top: 8px !important;
          }
          
          /* Inbox module */
          .inbox-container {
            flex-direction: column !important;
          }
          
          .inbox-list {
            width: 100% !important;
            max-height: 300px !important;
          }
          
          /* Detail panels */
          .detail-panel {
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid ${C.border} !important;
          }
          
          /* Research module */
          .research-input-row {
            flex-direction: column !important;
          }
          
          .research-input-row input,
          .research-input-row button {
            width: 100% !important;
          }
          
          /* Topic suggestions */
          .topic-suggestions {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
          }
          
          .topic-suggestions button {
            flex-shrink: 0 !important;
          }
          
          /* Heatmap */
          .heatmap-grid {
            gap: 2px !important;
          }
          
          .heatmap-grid > div > div {
            height: 30px !important;
          }
          
          /* Legend items */
          .legend-items {
            justify-content: center !important;
          }
          
          /* Font sizes */
          .section-title {
            font-size: 18px !important;
          }
          
          .kpi-value {
            font-size: 22px !important;
          }
          
          /* Padding adjustments */
          .erp-module,
          .analytics-module,
          .demographics-module,
          .research-module {
            padding: 12px !important;
          }
          
          .crm-module {
            flex-direction: column !important;
          }
        }

        /* Small Mobile (below 480px) */
        @media (max-width: 480px) {
          .sidebar {
            padding: 8px !important;
          }
          
          .brand-section {
            flex-wrap: wrap !important;
          }
          
          .user-info {
            flex-wrap: wrap !important;
          }
          
          .kpi-card {
            padding: 12px !important;
          }
          
          .kpi-value {
            font-size: 20px !important;
          }
          
          .section-title {
            font-size: 16px !important;
          }
          
          .section-sub {
            font-size: 9px !important;
          }
          
          .heatmap-grid {
            grid-template-columns: repeat(6, 1fr) !important;
          }
          
          .heatmap-grid > div {
            margin-bottom: 8px !important;
          }
        }
      `}</style>

      {notif&&(
        <div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",
          background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:10,
          padding:"9px 20px",fontSize:12,fontWeight:700,zIndex:9999,
          boxShadow:"0 8px 32px #00000090",animation:"notif 0.3s ease",
          color:C.gold,whiteSpace:"nowrap",letterSpacing:"0.3px"}}>
          {notif}
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar" style={{width:216,background:C.bg1,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        {/* Brand */}
        <div className="brand-section" style={{padding:"16px 14px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <HermesLogo size={32}/>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,letterSpacing:"1px",lineHeight:1}}>
                <ExponifyWord/>
              </div>
              <div style={{fontSize:8,color:C.gold,letterSpacing:"2px",fontWeight:600,textTransform:"uppercase"}}>Powered by Hermes</div>
            </div>
          </div>
          <div style={{
            background:C.bg3,border:`1px solid ${C.border}`,borderRadius:9,
            padding:"8px 11px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,
            transition:"border-color 0.2s",
          }} className="hover-gold" onClick={()=>{
            if(brands.length>1) cycleBrand();
            else if(!brands.length) notify("No brand assigned");
            else notify("Only one brand assigned");
          }}> 
            <GoldAvatar initials={brandInitials} color={activeBrand?.color || C.gold} size={26}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {brandLoading ? "Loading brands..." : (activeBrand?.name || "No brand assigned")}
              </div>
              <div style={{fontSize:9,color:C.muted}}>
                {role==="admin" ? "Enterprise" : "Assigned"} · {brands.length} brand{brands.length===1?"":"s"}
              </div>
            </div>
            <span style={{color:C.muted,fontSize:10}}>?</span>
          </div>
        </div>

        {/* Nav */}
        <div className="nav-items" style={{flex:1,overflowY:"auto",padding:"8px 8px"}}>
          <div style={{fontSize:8,color:C.dim,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",padding:"8px 8px 4px"}}>Navigation</div>
          {navItems.map(item=>(
            <div key={item.id} className={`nav-item${nav===item.id?" on":""}`}
              onClick={()=>setNav(item.id)}
              style={{
                display:"flex",alignItems:"center",gap:8,padding:"7px 10px",
                borderRadius:7,cursor:"pointer",marginBottom:1,
                color:nav===item.id?C.gold:C.muted,
                fontSize:11,fontWeight:nav===item.id?700:400,
                transition:"all 0.12s",borderLeft:"2px solid transparent",
              }}>
              <span>{item.label}</span>
            </div>
          ))}

          {brands.length>0 && (
            <>
              <div style={{fontSize:8,color:C.dim,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",padding:"12px 8px 4px"}}>Brands</div>
              {brands.map(b=>{
                const col=b.color||C.gold;
                const isActive=b.id===activeBrandId;
                return (
                  <div key={b.id} style={{
                    display:"flex",alignItems:"center",gap:7,padding:"5px 10px",
                    borderRadius:7,cursor:"pointer",marginBottom:1,color:isActive?C.gold:C.muted,fontSize:10,
                    transition:"all 0.12s",borderLeft:isActive?`2px solid ${C.gold}`:"2px solid transparent",
                    background:isActive?C.bg3:"transparent",
                  }} className="nav-item" onClick={()=>setActiveBrandId(b.id)}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:col,flexShrink:0}}/>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</span>
                    {brandAlerts[b.id] > 0 && (
                      <span style={{
                        minWidth:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",
                        fontSize:9,fontWeight:700,borderRadius:999,background:`${C.gold}22`,color:C.gold,
                        border:`1px solid ${C.gold}55`
                      }}>
                        {brandAlerts[b.id]}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* User */}
        <div className="user-info" style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
          <div style={{position:"relative"}}>
            <GoldAvatar initials={initials} color={C.gold} size={30}/>
            <div style={{position:"absolute",bottom:0,right:0,width:8,height:8,borderRadius:"50%",background:C.green,border:`2px solid ${C.bg1}`}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName}</div>
            <div style={{fontSize:9,color:C.gold,fontWeight:600}}>{roleLabel} · Online</div>
          </div>
          <button onClick={()=>supabase.auth.signOut()} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:2}} title="Logout">Logout</button>
        </div>
      </div>

      {/* Main */}
      <div className="main-content" style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <div style={{
          height:50,borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",padding:"0 22px",gap:12,
          background:C.bg1,flexShrink:0,
        }}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,letterSpacing:"-0.3px",color:C.text}}>
            {navItems.find(n=>n.id===nav)?.label}
          </div>
          <div style={{flex:1}}/>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{
              fontSize:11,color:C.muted,
              display:"flex",alignItems:"center",gap:6,
              background:C.bg3,border:`1px solid ${C.border}`,
              borderRadius:7,padding:"4px 10px",
            }}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>
              All platforms live
            </div>
            <NotificationBell session={session} activeBrandId={activeBrand?.id||null}/>
            <button onClick={()=>notify("Synced across all channels!")} style={{padding:"5px 12px",borderRadius:7,background:C.bg3,border:`1px solid ${C.border}`,color:C.muted,fontSize:11,cursor:"pointer",fontWeight:600}}>Sync</button>
            <GoldBtn onClick={()=>notify("Report exported!")} style={{padding:"5px 14px",fontSize:11}}>Export</GoldBtn>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          {nav==="inbox"&&<InboxModule notify={notify} accessToken={session?.access_token||""} activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} onSent={markBrandSeen}/>}
          {nav==="crm"&&<CRMModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify} accessToken={session?.access_token||""} role={role}/>}
          {nav==="calendar"&&<CalendarModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify} session={session}/>}
          {nav==="erp"&&<ERPModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify}/>}
          {nav==="orders"&&<OrdersModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify}/>}
          {nav==="broadcast"&&<BroadcastModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify} accessToken={session?.access_token||""}/>}
          {nav==="analytics"&&<AnalyticsModule activeBrandId={activeBrand?.id||null}/>}
          {nav==="demographics"&&<DemographicsModule/>}
          {nav==="research"&&<MarketResearchModule/>}
          {nav==="modules"&&<ModuleManager notify={notify} setNav={setNav}/>}
          {nav==="sales"&&<SalesModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""}/>}
          {nav==="marketing"&&<MarketingModule activeBrandId={activeBrand?.id||null}/>}
          {nav==="leads"&&<LeadsModule activeBrandId={activeBrand?.id||null}/>}
          {nav==="campaigns"&&<CampaignsModule activeBrandId={activeBrand?.id||null}/>}
          {nav==="accounting"&&<AccountingModule/>}
          {nav==="hr"&&<HRModule/>}
          {nav==="taxreports"&&<TaxReportsModule/>}
          {nav==="support"&&<SupportModule activeBrandId={activeBrand?.id||null}/>}
          {nav==="nps"&&<NPSModule/>}
          {nav==="projects"&&<ProjectsModule/>}
          {nav==="timetrack"&&<TimeTrackModule/>}
          {nav==="procurement"&&<ProcurementModule/>}
          {nav==="warehouse"&&<WarehouseModule/>}
          {nav==="logistics"&&<LogisticsModule/>}
          {nav==="legal"&&<LegalModule/>}
          {nav==="risk"&&<RiskModule/>}
          {nav==="itsec"&&<ITSecModule/>}
          {nav==="facilities"&&<FacilitiesModule/>}
          {nav==="docai"&&<DocAIModule/>}
          {nav==="bizassist"&&<BizAssistModule/>}
          {nav==="predict"&&<PredictModule/>}
          {nav==="team"&&<TeamPanel notify={notify} accessToken={session?.access_token||""}/>}
          {nav==="email"&&<EmailMarketingModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify} session={session}/>}
          {nav==="team"&&<TeamPanel notify={notify} accessToken={session?.access_token||""}/>}
          {nav==="chatbot"&&<ChatbotSettingsPanel brands={brands} notify={notify}/>}
          {nav==="socialads"&&<SocialAdsModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify} session={session}/>}
          {nav==="metrics"&&<ClientMetricsModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify} session={session} role={role}/>}
          {nav==="adsresults"&&<ClientAdsResultsModule activeBrandId={activeBrand?.id||null} activeBrandName={activeBrand?.name||""} notify={notify} session={session}/>}
          {nav==="admin"&&<AdminSetupPanel notify={notify}/>}
          {nav==="settings"&&<SettingsPanel notify={notify} profile={profile} session={session}/>}
        </div>

        <div style={{
          borderTop:`1px solid ${C.border}`,
          background:C.bg1,
          padding:"10px 22px",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          gap:12,
          flexWrap:"wrap",
          flexShrink:0,
        }}>
          <div style={{fontSize:10,color:C.muted}}>
            © 2026 <ExponifyWord style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700}}/> · Powered by Hermes
          </div>
          <LegalPolicyLinks compact />
        </div>
      </div>
    </div>
  );
}


// -----------------------------------------------------------
//  CALENDAR MODULE
// -----------------------------------------------------------
function CalendarModule({ activeBrandId, activeBrandName, notify, session: _session }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [daySchedules, setDaySchedules] = useState([]);
  const [view, setView] = useState("month"); // month | list

  const loadSchedules = async () => {
    setLoading(true);
    // Load all schedules for the current month
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const end   = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

    let query = supabase
      .from("demo_schedules")
      .select("*, contacts(full_name, email, phone, platform, tags), brands(name, color)")
      .gte("scheduled_at", start)
      .lte("scheduled_at", end)
      .order("scheduled_at", { ascending: true });

    if (activeBrandId) query = query.eq("brand_id", activeBrandId);

    const { data, error } = await query;
    if (!error) setSchedules(data || []);
    setLoading(false);
  };

  useEffect(() => { loadSchedules(); }, [currentDate, activeBrandId]);

  const updateStatus = async (id, status) => {
    await supabase.from("demo_schedules").update({ status }).eq("id", id);
    notify(`Status updated to ${status}`);
    loadSchedules();
    if (selectedDay) {
      setDaySchedules(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    }
  };

  // Calendar helpers
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("en-PH", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getSchedulesForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return schedules.filter(s => s.scheduled_at?.startsWith(dateStr));
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const STATUS_COLOR = { pending: C.amber, confirmed: C.green, completed: C.muted, cancelled: C.red };
  const STATUS_LABEL = { pending: "? Pending", confirmed: "? Confirmed", completed: "? Done", cancelled: "? Cancelled" };

  const today = new Date();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={prevMonth} style={{ background: C.bg3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 16 }}>‹</button>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.text, flex: 1 }}>{monthName}</div>
        <button onClick={nextMonth} style={{ background: C.bg3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 16 }}>›</button>
        <div style={{ display: "flex", gap: 6 }}>
          {["month","list"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", borderRadius: 7, border: `1px solid ${view===v?C.gold:C.border}`, background: view===v?`${C.gold}18`:"transparent", color: view===v?C.gold:C.muted, fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>
          {activeBrandName ? <span>Brand: <span style={{ color: C.gold }}>{activeBrandName}</span></span> : "All brands"}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Calendar grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {view === "month" && (
            <>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: 10, color: C.muted, fontWeight: 700, padding: "6px 0", textTransform: "uppercase", letterSpacing: "1px" }}>{d}</div>
                ))}
              </div>
              {/* Calendar cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ minHeight: 90, background: C.bg1, borderRadius: 8, opacity: 0.3 }} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const daySched = getSchedulesForDay(day);
                  const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                  const isSelected = selectedDay === day;
                  return (
                    <div key={day} onClick={() => { setSelectedDay(day); setDaySchedules(daySched); }}
                      style={{
                        minHeight: 90, background: isSelected ? C.bg4 : C.bg2,
                        borderRadius: 8, padding: "8px", cursor: "pointer",
                        border: `1px solid ${isToday ? C.gold : isSelected ? C.border2 : C.border}`,
                        transition: "all 0.12s",
                      }}>
                      <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isToday ? C.gold : C.text, marginBottom: 4 }}>{day}</div>
                      {daySched.slice(0, 3).map((s, si) => (
                        <div key={si} style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, marginBottom: 2, background: `${STATUS_COLOR[s.status] || C.amber}22`, color: STATUS_COLOR[s.status] || C.amber, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {new Date(s.scheduled_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })} {s.contacts?.full_name?.split(" ")[0] || "Demo"}
                        </div>
                      ))}
                      {daySched.length > 3 && <div style={{ fontSize: 9, color: C.muted }}>+{daySched.length - 3} more</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === "list" && (
            <div>
              {loading && <div style={{ color: C.muted, fontSize: 12 }}>Loading…</div>}
              {!loading && schedules.length === 0 && (
                <div style={{ color: C.muted, fontSize: 13, padding: "20px 0" }}>No scheduled demos this month.</div>
              )}
              {schedules.map((s, i) => (
                <div key={s.id} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 10, borderLeft: `3px solid ${STATUS_COLOR[s.status] || C.amber}`, animation: `fadeUp 0.2s ease ${i*0.04}s both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 4 }}>{s.contacts?.full_name || "Unknown"}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{s.contacts?.email} {s.contacts?.phone ? `· ${s.contacts.phone}` : ""}</div>
                      <div style={{ fontSize: 11, color: C.gold, marginBottom: 6 }}>
                        ?? {new Date(s.scheduled_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" })}
                      </div>
                      {s.notes && <div style={{ fontSize: 11, color: C.muted }}>{s.notes}</div>}
                      {(s.contacts?.tags || []).map(t => <GoldTag key={t}>{t}</GoldTag>)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                      <GoldTag color={STATUS_COLOR[s.status]}>{STATUS_LABEL[s.status]}</GoldTag>
                      <select value={s.status} onChange={e => updateStatus(s.id, e.target.value)}
                        style={{ background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 10, cursor: "pointer" }}>
                        {["pending","confirmed","completed","cancelled"].map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Day detail panel */}
        {selectedDay && view === "month" && (
          <div style={{ width: 300, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color: C.text }}>
                {new Date(year, month, selectedDay).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>{daySchedules.length} demo{daySchedules.length !== 1 ? "s" : ""} scheduled</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
              {daySchedules.length === 0 && (
                <div style={{ fontSize: 12, color: C.dim, padding: "12px 0" }}>No demos scheduled for this day.</div>
              )}
              {daySchedules.map(s => (
                <div key={s.id} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10, borderTop: `2px solid ${STATUS_COLOR[s.status] || C.amber}` }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 4 }}>{s.contacts?.full_name}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{s.contacts?.email}</div>
                  <div style={{ fontSize: 11, color: C.gold, marginBottom: 8 }}>
                    ?? {new Date(s.scheduled_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Manila" })}
                  </div>
                  {s.notes && <div style={{ fontSize: 10, color: C.muted, marginBottom: 8, lineHeight: 1.6 }}>{s.notes}</div>}
                  <select value={s.status} onChange={e => updateStatus(s.id, e.target.value)}
                    style={{ width: "100%", background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "6px 10px", color: STATUS_COLOR[s.status] || C.amber, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {["pending","confirmed","completed","cancelled"].map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// -----------------------------------------------------------
//  NOTIFICATION BELL
// -----------------------------------------------------------
function NotificationBell({ session, activeBrandId }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    // Show recent demo bookings + new contacts as notifications
    const [{ data: schedules }, { data: contacts }] = await Promise.all([
      supabase.from("demo_schedules").select("*, contacts(full_name)").order("created_at", { ascending: false }).limit(5),
      supabase.from("contacts").select("full_name, stage, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    const items = [
      ...(schedules || []).map(s => ({
        id: s.id, type: "demo",
        text: `?? Demo booked: ${s.contacts?.full_name || "Someone"}`,
        time: s.created_at, color: C.gold,
      })),
      ...(contacts || []).map(c => ({
        id: c.created_at, type: "contact",
        text: `?? New contact: ${c.full_name} (${c.stage})`,
        time: c.created_at, color: C.green,
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    setNotifications(items);
    setUnread(items.length);
  };

  useEffect(() => { if (session) load(); }, [session, activeBrandId]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => { setOpen(o => !o); setUnread(0); }} style={{
        position: "relative", background: C.bg3, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: C.muted, fontSize: 16,
      }}>
        ??
        {unread > 0 && (
          <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {unread > 9 ? "9+" : unread}
          </div>
        )}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: 12, boxShadow: "0 20px 40px #00000060", zIndex: 999, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Notifications</div>
            <button onClick={load} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 11 }}>Refresh</button>
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {notifications.length === 0 && <div style={{ padding: "16px", fontSize: 12, color: C.muted }}>No notifications yet.</div>}
            {notifications.map((n, i) => (
              <div key={i} style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{n.text}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{new Date(n.time).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "short", timeStyle: "short" })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------
//  ORDERS MODULE
// -----------------------------------------------------------
function OrdersModule({ activeBrandId, activeBrandName, notify }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState(null);
  const [selItems, setSelItems] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]); // [{product_id, name, qty, price}]
  const [newOrder, setNewOrder] = useState({ contact_id: "", notes: "", platform: "facebook", manual_amount: "" });
  const [saving, setSaving] = useState(false);

  const STATUS_COLOR = { pending: C.amber, confirmed: C.cyan, shipped: C.violet, delivered: C.green, cancelled: C.red, refunded: C.muted };
  const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"];
  const inp = { background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 12, width: "100%" };

  const loadOrders = async () => {
    setLoading(true);
    let q = supabase.from("orders").select("*, contacts(full_name, email, phone, platform)").order("created_at", { ascending: false });
    if (activeBrandId) q = q.eq("brand_id", activeBrandId);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setOrders(data || []);
    setLoading(false);
  };

  const loadCreateData = async () => {
    const [{ data: c }, { data: p }] = await Promise.all([
      activeBrandId ? supabase.from("contacts").select("id, full_name, email").eq("brand_id", activeBrandId).order("full_name") : supabase.from("contacts").select("id, full_name, email").order("full_name"),
      activeBrandId ? supabase.from("products").select("id, name, price, stock").eq("brand_id", activeBrandId).eq("is_active", true).gt("stock", 0) : { data: [] },
    ]);
    setContacts(c || []);
    setProducts(p || []);
    setOrderItems([]);
  };

  const loadOrderItems = async (orderId) => {
    const { data } = await supabase.from("order_items").select("*, products(name, price)").eq("order_id", orderId);
    setSelItems(data || []);
  };

  useEffect(() => { loadOrders(); }, [activeBrandId, filter]);
  useEffect(() => { if (showCreate) loadCreateData(); }, [showCreate, activeBrandId]);

  const selectOrder = async (o) => { setSel(o); await loadOrderItems(o.id); };

  const addItem = (product) => {
    setOrderItems(items => {
      const existing = items.find(i => i.product_id === product.id);
      if (existing) return items.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...items, { product_id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };
  const removeItem = (product_id) => setOrderItems(items => items.filter(i => i.product_id !== product_id));
  const updateQty = (product_id, qty) => {
    if (qty < 1) { removeItem(product_id); return; }
    setOrderItems(items => items.map(i => i.product_id === product_id ? { ...i, qty } : i));
  };

  const itemsTotal = orderItems.reduce((a, i) => a + i.price * i.qty, 0);
  const hasProducts = products.length > 0;

  const createOrder = async () => {
    if (!newOrder.contact_id || !activeBrandId) { notify("Select a contact first"); return; }
    setSaving(true);
    const total = hasProducts && orderItems.length > 0
      ? itemsTotal
      : parseFloat(newOrder.manual_amount) || 0;

    const { data: order, error } = await supabase.from("orders").insert({
      brand_id: activeBrandId,
      contact_id: newOrder.contact_id,
      platform: newOrder.platform,
      status: "pending",
      notes: newOrder.notes,
      total_amount: total,
    }).select("id").single();

    if (error) { notify(error.message); setSaving(false); return; }

    // Save order items if product-based
    if (orderItems.length > 0) {
      await supabase.from("order_items").insert(
        orderItems.map(i => ({ order_id: order.id, product_id: i.product_id, quantity: i.qty, unit_price: i.price }))
      );
    }

    notify("? Order created!");
    setShowCreate(false);
    setNewOrder({ contact_id: "", notes: "", platform: "facebook", manual_amount: "" });
    setOrderItems([]);
    loadOrders();
    setSaving(false);
  };

  const updateStatus = async (id, status) => {
    // If delivering, reduce stock for product-based orders
    if (status === "delivered") {
      const { data: items } = await supabase.from("order_items").select("product_id, quantity").eq("order_id", id);
      for (const item of (items || [])) {
        const { data: prod } = await supabase.from("products").select("stock, reorder_point").eq("id", item.product_id).single();
        if (prod) {
          const newStock = Math.max(0, prod.stock - item.quantity);
          const newStatus = newStock <= 0 ? "critical" : newStock <= (prod.reorder_point || 50) ? "low" : "healthy";
          await supabase.from("products").update({ stock: newStock, status: newStatus }).eq("id", item.product_id);
          await supabase.from("stock_movements").insert({ product_id: item.product_id, movement_type: "out", quantity: item.quantity, reason: `Order delivered #${id.slice(-6)}` });
        }
      }
    }
    await supabase.from("orders").update({ status }).eq("id", id);
    notify(`Order status ? ${status}`);
    loadOrders();
    if (sel?.id === id) setSel(s => ({ ...s, status }));
  };

  const totalRevenue = orders.filter(o => o.status === "delivered").reduce((a, o) => a + (o.total_amount || 0), 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.text, flex: 1 }}>
          Orders {activeBrandName && <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>· {activeBrandName}</span>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${filter === s ? (STATUS_COLOR[s] || C.gold) : C.border}`, background: filter === s ? `${STATUS_COLOR[s] || C.gold}18` : "transparent", color: filter === s ? (STATUS_COLOR[s] || C.gold) : C.muted, fontSize: 10, cursor: "pointer", fontWeight: 700, textTransform: "capitalize" }}>{s}</button>
          ))}
        </div>
        <GoldBtn onClick={() => setShowCreate(true)} style={{ padding: "6px 14px", fontSize: 11 }}>+ New Order</GoldBtn>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, padding: "12px 22px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <GoldKPI label="Total Orders" value={orders.length} change="all time" up icon="??" color={C.gold}/>
        <GoldKPI label="Pending" value={orders.filter(o => o.status === "pending").length} change="need action" up={false} icon="?" color={C.amber}/>
        <GoldKPI label="Delivered" value={orders.filter(o => o.status === "delivered").length} change="completed" up icon="?" color={C.green}/>
        <GoldKPI label="Revenue" value={`?${totalRevenue.toLocaleString()}`} change="delivered orders" up icon="??" color={C.cyan}/>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Orders list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {loading && <div style={{ color: C.muted, fontSize: 12 }}>Loading…</div>}
          {!loading && orders.length === 0 && <div style={{ color: C.muted, fontSize: 13, padding: "20px 0" }}>No orders yet. Create your first order!</div>}
          {orders.map(o => (
            <div key={o.id} onClick={() => selectOrder(o)} style={{ background: sel?.id === o.id ? C.bg4 : C.bg3, border: `1px solid ${sel?.id === o.id ? C.border2 : C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 8, cursor: "pointer", borderLeft: `3px solid ${STATUS_COLOR[o.status] || C.amber}`, transition: "all 0.12s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{o.contacts?.full_name || "Unknown"}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{pl(o.platform)} · {new Date(o.created_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })}</div>
                  {o.notes && <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{o.notes.slice(0, 50)}{o.notes.length > 50 ? "…" : ""}</div>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>?{(o.total_amount || 0).toLocaleString()}</div>
                  <GoldTag color={STATUS_COLOR[o.status]}>{o.status}</GoldTag>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order detail panel */}
        {sel && (
          <div style={{ width: 300, borderLeft: `1px solid ${C.border}`, flexShrink: 0, overflowY: "auto", padding: "16px" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Order Detail</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "1px" }}>Customer</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{sel.contacts?.full_name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{sel.contacts?.email}</div>
            </div>
            {selItems.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Items</div>
                {selItems.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.text }}>{item.products?.name || "Product"} × {item.quantity}</span>
                    <span style={{ color: C.gold }}>?{(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "1px" }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.gold }}>?{(sel.total_amount || 0).toLocaleString()}</div>
            </div>
            {sel.notes && <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.6 }}>{sel.notes}</div>}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Update Status</div>
              <select value={sel.status} onChange={e => updateStatus(sel.id, e.target.value)}
                style={{ width: "100%", background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "8px 10px", color: STATUS_COLOR[sel.status] || C.amber, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {STATUSES.map(s => <option key={s} value={s} style={{ color: C.text }}>{s}</option>)}
              </select>
              {sel.status !== "delivered" && <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>Setting to "delivered" will reduce stock automatically</div>}
            </div>
            <button onClick={() => setSel(null)} style={{ width: "100%", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px", color: C.muted, fontSize: 11, cursor: "pointer" }}>Close</button>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "#00000080", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: 16, padding: "28px", width: 520, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>New Order</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Contact *</label>
                <select value={newOrder.contact_id} onChange={e => setNewOrder(n => ({ ...n, contact_id: e.target.value }))} style={inp}>
                  <option value="">Select contact…</option>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.full_name}{c.email ? ` (${c.email})` : ""}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Platform</label>
                <select value={newOrder.platform} onChange={e => setNewOrder(n => ({ ...n, platform: e.target.value }))} style={inp}>
                  {Object.entries(PLATFORMS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            {/* Product picker — shows only if brand has products */}
            {hasProducts ? (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 9, color: C.gold, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>
                  ?? Add Products
                </label>
                <div style={{ maxHeight: 160, overflowY: "auto", background: C.bg4, borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 8 }}>
                  {products.map(p => (
                    <div key={p.id} onClick={() => addItem(p)} style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", cursor: "pointer", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                      <span style={{ color: C.text }}>{p.name}</span>
                      <span style={{ color: C.gold }}>?{p.price?.toLocaleString()} <span style={{ color: C.muted }}>({p.stock} in stock)</span></span>
                    </div>
                  ))}
                </div>
                {orderItems.length > 0 && (
                  <div style={{ background: C.bg2, borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                    {orderItems.map(item => (
                      <div key={item.product_id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                        <span style={{ flex: 1, color: C.text }}>{item.name}</span>
                        <button onClick={() => updateQty(item.product_id, item.qty - 1)} style={{ background: C.bg4, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, width: 22, height: 22, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                        <span style={{ color: C.gold, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.product_id, item.qty + 1)} style={{ background: C.bg4, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, width: 22, height: 22, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        <span style={{ color: C.gold, minWidth: 60, textAlign: "right" }}>?{(item.price * item.qty).toLocaleString()}</span>
                        <button onClick={() => removeItem(item.product_id)} style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontSize: 12 }}>?</button>
                      </div>
                    ))}
                    <div style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13 }}>
                      <span style={{ color: C.muted }}>Total</span>
                      <span style={{ color: C.gold }}>?{itemsTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Amount (?)</label>
                <input type="number" value={newOrder.manual_amount} onChange={e => setNewOrder(n => ({ ...n, manual_amount: e.target.value }))} placeholder="0.00" style={inp} />
                <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>No products in inventory. Add products first or enter amount manually.</div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Notes</label>
              <textarea value={newOrder.notes} onChange={e => setNewOrder(n => ({ ...n, notes: e.target.value }))} rows={2} style={{ ...inp, resize: "none" }} placeholder="Order details, special instructions…" />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <GoldBtn onClick={createOrder} disabled={saving} style={{ flex: 1, padding: "9px" }}>{saving ? "Creating…" : "Create Order"}</GoldBtn>
              <button onClick={() => setShowCreate(false)} style={{ flex: 1, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, cursor: "pointer", fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// -----------------------------------------------------------
//  BROADCAST MODULE
// -----------------------------------------------------------
function BroadcastModule({ activeBrandId, activeBrandName, notify, accessToken }) {
  const [message, setMessage] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [targetStage, setTargetStage] = useState("all");
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(0);
  const [history, setHistory] = useState([]);

  const loadContacts = async () => {
    setLoading(true);
    let q = supabase.from("contacts").select("id, full_name, platform, platform_user_id, stage, email")
      .eq("platform", platform).not("platform_user_id", "is", null);
    if (activeBrandId) q = q.eq("brand_id", activeBrandId);
    if (targetStage !== "all") q = q.eq("stage", targetStage);
    const { data } = await q;
    setContacts(data || []);
    setSelected((data || []).map(c => c.id));
    setLoading(false);
  };

  useEffect(() => { if (activeBrandId) loadContacts(); }, [activeBrandId, platform, targetStage]);

  const toggleContact = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const sendBroadcast = async () => {
    if (!message.trim() || selected.length === 0) { notify("Add a message and select recipients"); return; }
    if (!window.confirm(`Send to ${selected.length} contacts?`)) return;

    setSending(true); setSent(0);
    const targets = contacts.filter(c => selected.includes(c.id));
    let successCount = 0;

    for (const contact of targets) {
      try {
        const res = await fetch(`${BACKEND_URL}/messages/broadcast`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
          body: JSON.stringify({ brand_id: activeBrandId, platform, thread_id: contact.platform_user_id, message }),
        });
        if (res.ok) successCount++;
        setSent(s => s + 1);
        await new Promise(r => setTimeout(r, 300)); // rate limit
      } catch(e) { console.error(e); }
    }

    // Save to history
    const newEntry = { id: Date.now(), message: message.slice(0, 60) + (message.length > 60 ? "…" : ""), platform, sent: successCount, total: targets.length, date: new Date().toISOString() };
    setHistory(h => [newEntry, ...h.slice(0, 9)]);
    setSending(false);
    notify(`? Sent to ${successCount}/${targets.length} contacts`);
    setMessage("");
  };

  const inp = { background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 12, width: "100%" };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Compose panel */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
          Broadcast Message
          {activeBrandName && <span style={{ fontSize: 13, color: C.muted, fontWeight: 400, marginLeft: 10 }}>{activeBrandName}</span>}
        </div>

        <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px", marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} style={inp}>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Target Stage</label>
              <select value={targetStage} onChange={e => setTargetStage(e.target.value)} style={inp}>
                <option value="all">All Stages</option>
                {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>Message *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
              placeholder="Hi {first_name}! We have an exciting promo just for you…&#10;&#10;Tip: Use {first_name} to personalize"
              style={{ ...inp, resize: "vertical" }} />
            <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>Use {"{first_name}"} to personalize with contact's name</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <GoldBtn onClick={sendBroadcast} disabled={sending || selected.length === 0} style={{ padding: "9px 24px" }}>
              {sending ? `Sending… ${sent}/${selected.length}` : `?? Send to ${selected.length} contacts`}
            </GoldBtn>
            {sending && (
              <div style={{ flex: 1, background: C.bg4, borderRadius: 8, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", background: GOLD_GRADIENT, width: `${(sent / selected.length) * 100}%`, transition: "width 0.3s", borderRadius: 8 }} />
              </div>
            )}
          </div>
        </div>

        {/* Broadcast History */}
        {history.length > 0 && (
          <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Recent Broadcasts</div>
            {history.map(h => (
              <div key={h.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                <div style={{ color: C.text, flex: 1 }}>{h.message}</div>
                <div style={{ color: C.green, fontWeight: 700, marginLeft: 12 }}>{h.sent}/{h.total} sent</div>
                <div style={{ color: C.muted, marginLeft: 12 }}>{new Date(h.date).toLocaleDateString("en-PH")}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipients panel */}
      <div style={{ width: 280, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Recipients ({selected.length})</div>
          <button onClick={() => setSelected(selected.length === contacts.length ? [] : contacts.map(c => c.id))}
            style={{ background: "transparent", border: "none", color: C.gold, cursor: "pointer", fontSize: 11 }}>
            {selected.length === contacts.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <div style={{ padding: 16, color: C.muted, fontSize: 12 }}>Loading contacts…</div>}
          {!loading && contacts.length === 0 && (
            <div style={{ padding: 16, color: C.muted, fontSize: 12 }}>No contacts with Facebook IDs found for this brand/stage.</div>
          )}
          {contacts.map(c => (
            <div key={c.id} onClick={() => toggleContact(c.id)} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: selected.includes(c.id) ? `${C.gold}08` : "transparent" }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${selected.includes(c.id) ? C.gold : C.border}`, background: selected.includes(c.id) ? C.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.bg0, flexShrink: 0 }}>
                {selected.includes(c.id) ? "?" : ""}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.full_name}</div>
                <GoldTag color={STAGE_COLOR[c.stage]}>{c.stage}</GoldTag>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InboxModule({notify, accessToken, activeBrandId, activeBrandName, onSent}) {
  const [localMsgs,setLocalMsgs]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [sel,setSel]=useState(null);
  const [thread,setThread]=useState([]);
  const [threadLoading,setThreadLoading]=useState(false);
  const [draft,setDraft]=useState("");
  const [gen,setGen]=useState(false);
  const [platform,setPlatform]=useState("all");
  const [reloadKey,setReloadKey]=useState(0);
  useEffect(()=>{ setSel(null); },[activeBrandName, activeBrandId]);

  const toggleAutoReply=async()=>{
    if(!sel?.id) return;
    const next = !sel.auto_reply_enabled;
    const { error:err } = await supabase
      .from("conversations")
      .update({ auto_reply_enabled: next })
      .eq("id", sel.id);
    if(err){ notify(err.message); return; }
    setSel(s=>({ ...s, auto_reply_enabled: next }));
    setLocalMsgs(list=>list.map(m=>m.id===sel.id?{...m, auto_reply_enabled: next}:m));
  };

  useEffect(()=>{
    if(!activeBrandId){
      setLocalMsgs([]);
      return;
    }
    let alive=true;
    setLoading(true);
    setError("");
    (async()=>{
      try{
        let query = supabase
          .from("conversations")
          .select("id, platform, last_message_at, auto_reply_enabled, contacts(full_name, avatar_url), brands(name, color)")
          .eq("brand_id", activeBrandId)
          .order("last_message_at", { ascending: false });
        if(platform !== "all") query = query.eq("platform", platform);
        const { data: convos, error: convErr } = await query;
        if(convErr) throw convErr;

        const rows = [];
        for (const c of convos || []) {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at, sender_type")
            .eq("conversation_id", c.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          const name = c.contacts?.full_name || "Customer";
          const initials = name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase();
          rows.push({
            id: c.id,
            user: name,
            platform: c.platform,
            brand: c.brands?.name || "Brand",
            msg: lastMsg?.content || "",
            time: c.last_message_at ? new Date(c.last_message_at).toLocaleString() : "",
            urgent: false,
            replied: lastMsg?.sender_type === "agent",
            avatar: initials || "CU",
            color: c.brands?.color || C.gold,
            auto_reply_enabled: c.auto_reply_enabled ?? true,
          });
        }
        if(!alive) return;
        setLocalMsgs(rows);
      }catch(err){
        if(!alive) return;
        setError(err?.message || "Failed to load messages.");
        setLocalMsgs([]);
      }finally{
        if(alive) setLoading(false);
      }
    })();
    return ()=>{alive=false;};
  },[activeBrandId, platform, reloadKey]);

  useEffect(()=>{
    if(!sel?.id) { setThread([]); return; }
    let alive=true;
    setThreadLoading(true);
    (async()=>{
      try{
        const { data, error: tErr } = await supabase
          .from("messages")
          .select("id, content, created_at, sender_type")
          .eq("conversation_id", sel.id)
          .order("created_at", { ascending: true });
        if(tErr) throw tErr;
        if(!alive) return;
        setThread(data||[]);
      }catch{
        if(!alive) return;
        setThread([]);
      }finally{
        if(alive) setThreadLoading(false);
      }
    })();
    return ()=>{alive=false;};
  },[sel?.id, reloadKey]);

  useEffect(()=>{
    if(!activeBrandId) return;
    const channel = supabase
      .channel(`conversations_${activeBrandId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations", filter: `brand_id=eq.${activeBrandId}` }, () => {
        setReloadKey(k=>k+1);
      })
      .subscribe();
    return ()=>{ supabase.removeChannel(channel); };
  },[activeBrandId]);

  useEffect(()=>{
    const channel = supabase
      .channel("messages_global")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        setReloadKey(k=>k+1);
      })
      .subscribe();
    return ()=>{ supabase.removeChannel(channel); };
  },[]);

  useEffect(()=>{
    const t = setInterval(()=>setReloadKey(k=>k+1), 5000);
    return ()=>clearInterval(t);
  },[]);

  const filtered=localMsgs;

  const generate=async()=>{
    if(!sel)return; setGen(true); setDraft("");
    try {
      const r = await fetch(`${BACKEND_URL}/messages/conversations/${sel.id}/ai-reply`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${accessToken}`,
        }
      });
      const d=await r.json();
      if(!r.ok) throw new Error(d?.error || "AI reply failed.");
      setDraft(d.reply||"Try again.");
    } catch{setDraft("Connection error. Please retry.");}
    setGen(false);
  };

  const send=async()=>{
    if(!sel || !draft.trim()) return;
    try{
      const res = await fetch(`${BACKEND_URL}/messages/conversations/${sel.id}/reply`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: draft.trim() }),
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({}));
        throw new Error(err.error || "Failed to send message.");
      }
      setDraft("");
      setReloadKey(k=>k+1);
      setThread(t=>[
        ...t,
        { id:`local-${Date.now()}`, content:draft.trim(), created_at:new Date().toISOString(), sender_type:"agent" }
      ]);
      if(onSent) onSent();
      notify("Reply sent!");
    }catch(err){
      notify(err?.message||"Failed to send.");
    }
  };

  return (
    <div style={{display:"flex",flex:1,overflow:"hidden"}} className="inbox-container">
      {/* List */}
      <div style={{width:330,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}} className="inbox-list">
        <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:5,overflowX:"auto"}}>
          {[{id:"all",label:"All"},{id:"facebook",label:"Facebook"},{id:"instagram",label:"Instagram"},{id:"tiktok",label:"TikTok"},{id:"shopee",label:"Shopee"}].map(p=> (
            <button key={p.id} onClick={()=>setPlatform(p.id)} style={{
              flexShrink:0,padding:"4px 11px",borderRadius:7,
              border:`1px solid ${platform===p.id?C.gold:C.border}`,
              background:platform===p.id?`${C.gold}15`:"transparent",
              color:platform===p.id?C.gold:C.muted,fontSize:10,fontWeight:700,cursor:"pointer",
            }}>{p.label}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {loading && (
            <div style={{padding:"18px 14px"}} />
          )}
          {error && !loading && (
            <div style={{padding:"18px 14px",color:C.red,fontSize:12}}>{error}</div>
          )}
          {!loading && !error && filtered.length===0 && (
            <div style={{padding:"18px 14px",color:C.muted,fontSize:12}}>
              {activeBrandName ? "No messages for this brand yet." : "No messages yet."}
            </div>
          )}
          {filtered.map((m,i)=>(
            <div key={m.id} onClick={()=>{setSel(m);setDraft("");}} style={{
              padding:"12px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,
              background:sel?.id===m.id?C.bg4:"transparent",
              borderLeft:`2px solid ${sel?.id===m.id?C.gold:"transparent"}`,
              transition:"all 0.12s",animation:`fadeUp 0.25s ease ${i*0.04}s both`,
            }}>
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <GoldAvatar initials={m.avatar} color={m.color} size={33}/>
                  {m.urgent&&!m.replied&&<div style={{position:"absolute",top:-2,left:-2,width:9,height:9,borderRadius:"50%",background:C.red,border:`2px solid ${C.bg0}`,animation:"pulse 1.5s infinite"}}/>}
                  <div style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderRadius:"50%",background:pc(m.platform),border:`2px solid ${C.bg0}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700,color:"white"}}>{pi(m.platform)}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:12,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:130}}>{m.user}</span>
                    <span style={{fontSize:9,color:C.dim,flexShrink:0}}>{m.time}</span>
                  </div>
                  <div style={{fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:5}}>{m.msg}</div>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <GoldTag>{m.brand.replace("Bloom ","")}</GoldTag>
                    {m.replied&&<span style={{fontSize:9,color:C.green,fontWeight:700}}>? Sent</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {sel?(
          <>
            <div style={{padding:"16px 22px",borderBottom:`1px solid ${C.border}`,background:C.bg2}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <GoldAvatar initials={sel.avatar} color={sel.color} size={40}/>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:C.text}}>{sel.user}</div>
                  <div style={{fontSize:11,color:C.muted}}>{pl(sel.platform)} · {sel.brand} · {sel.time}</div>
                </div>
                <button onClick={toggleAutoReply} style={{
                  marginLeft:"auto",
                  padding:"4px 10px",
                  borderRadius:7,
                  border:`1px solid ${sel.auto_reply_enabled?C.green:C.border2}`,
                  background: sel.auto_reply_enabled?`${C.green}22`:"transparent",
                  color: sel.auto_reply_enabled?C.green:C.muted,
                  fontSize:10,
                  fontWeight:700,
                  cursor:"pointer"
                }}>
                  Auto Reply: {sel.auto_reply_enabled ? "On" : "Off"}
                </button>
                {sel.urgent&&!sel.replied&&<GoldTag color={C.red} style={{marginLeft:"auto"}}>?? Urgent</GoldTag>}
              </div>
              <div style={{
                background:C.bg4,borderRadius:10,padding:"12px 16px",
                fontSize:13,color:C.text,
                borderLeft:`3px solid ${pc(sel.platform)}`,lineHeight:1.7,
              }}>"{sel.msg}"</div>
            </div>
            <div style={{flex:1,padding:"18px 22px",overflowY:"auto"}}>
              <GoldBtn onClick={generate} disabled={gen} style={{marginBottom:14,display:"flex",alignItems:"center",gap:7}}>
                {gen?<><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>?</span>Consulting Hermes AI…</>:"? Generate AI Reply"}
              </GoldBtn>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                {threadLoading && <div style={{height:8}} />}
                {!threadLoading && thread.length===0 && (
                  <div style={{fontSize:11,color:C.muted}}>No messages yet.</div>
                )}
                {thread.map(m=>{
                  const isAgentSide = m.sender_type !== "customer";
                  const bubbleBg = m.sender_type === "bot"
                    ? `${C.gold}18`
                    : (m.sender_type === "agent" ? `${C.gold}22` : C.bg4);
                  return (
                    <div key={m.id} style={{
                      alignSelf: isAgentSide ? "flex-end" : "flex-start",
                      maxWidth:"70%",
                      background: bubbleBg,
                      border:`1px solid ${C.border2}`,
                      color:C.text,
                      padding:"8px 12px",
                      borderRadius:10,
                      fontSize:12,
                      lineHeight:1.5,
                    }}>
                      <div style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
                      <div style={{fontSize:9,color:C.muted,marginTop:4,textAlign:"right"}}>
                        {m.created_at?new Date(m.created_at).toLocaleString():""}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:11,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Your Reply</div>
                <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Compose your reply or generate with Hermes AI…"
                  rows={5} style={{width:"100%",background:"transparent",border:"none",color:C.text,fontSize:13,lineHeight:1.7}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                  <span style={{fontSize:10,color:C.dim}}>{draft.length} chars · {pl(sel.platform)}</span>
                  <GoldBtn onClick={send} disabled={!draft.trim()}>
                    Send Reply ?
                  </GoldBtn>
                </div>
              </div>
              <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Quick Templates</div>
              {[
                "Hi po! Salamat sa inyong mensahe ?? Please DM us for full details!",
                "Available pa po! Message us to place your order ??",
                "Yes po, COD available! DM us your area para ma-confirm.",
                "Pasensya na po for the inconvenience — we'll fix this agad! ??",
              ].map((t,i)=>(
                <div key={i} onClick={()=>setDraft(t)} style={{
                  padding:"8px 12px",borderRadius:8,background:C.bg3,
                  border:`1px solid ${C.border}`,cursor:"pointer",fontSize:11,
                  color:C.muted,lineHeight:1.5,marginBottom:6,transition:"all 0.12s",
                }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.text;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>{t}</div>
              ))}
            </div>
          </>
        ):(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,color:C.dim}}>
            <div style={{animation:"float 4s ease-in-out infinite"}}><HermesLogo size={56}/></div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#2a2640"}}>Select a message to begin</div>
            <div style={{fontSize:12,color:C.dim}}>The messenger awaits your command</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  TEAM PANEL (keeping your existing TeamPanel)
// ---------------------------------------------------------------------------
function TeamPanel({ notify, accessToken }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("client");
  const [invitePassword, setInvitePassword] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at, user_brands(brand_id, brands(name,color))")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const inviteUser = async () => {
    if (!inviteEmail.trim() || !invitePassword.trim()) { notify("Email and password required"); return; }
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ email: inviteEmail.trim(), password: invitePassword, full_name: inviteName.trim(), role: inviteRole }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      notify(`? ${inviteName || inviteEmail} invited!`);
      setInviteEmail(""); setInviteName(""); setInvitePassword(""); setInviteRole("client");
      setShowInvite(false);
      load();
    } catch (e) { notify(e.message); }
    setBusy(false);
  };

  const toggleActive = async (user) => {
    await supabase.from("profiles").update({ is_active: !user.is_active }).eq("id", user.id);
    notify(user.is_active ? "User deactivated" : "User reactivated");
    load();
  };

  const STATUS_COLOR = { admin: C.gold, client: C.cyan };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.text }}>Team Members</div>
        <GoldBtn onClick={() => setShowInvite(!showInvite)} style={{ padding: "7px 18px", fontSize: 12 }}>+ Invite Member</GoldBtn>
      </div>

      {showInvite && (
        <div style={{ background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: 12, padding: "18px 20px", marginBottom: 20, borderTop: `2px solid ${C.gold}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 14 }}>Invite New Member</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email address *" type="email" style={{ background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 12 }} />
            <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Full name" style={{ background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 12 }} />
            <input value={invitePassword} onChange={e => setInvitePassword(e.target.value)} placeholder="Temporary password *" type="password" style={{ background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 12 }} />
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 12 }}>
              <option value="client">Client (limited access)</option>
              <option value="admin">Admin (full access)</option>
            </select>
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>After inviting, go to Admin Setup ? User Access to assign them to brands.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <GoldBtn onClick={inviteUser} disabled={busy} style={{ padding: "7px 18px", fontSize: 12 }}>{busy ? "Inviting…" : "Send Invite"}</GoldBtn>
            <button onClick={() => setShowInvite(false)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {loading && <div style={{ color: C.muted, fontSize: 12 }}>Loading team…</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
        {users.map((u, i) => {
          const initials = (u.full_name || u.email || "U").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
          const color = STATUS_COLOR[u.role] || C.muted;
          const brandList = (u.user_brands || []).map(ub => ub.brands?.name).filter(Boolean);
          return (
            <div key={u.id} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", animation: `fadeUp 0.3s ease ${i * 0.06}s both`, borderTop: `2px solid ${color}`, opacity: u.is_active ? 1 : 0.5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <GoldAvatar initials={initials} color={color} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.full_name || "—"}</div>
                  <div style={{ fontSize: 10, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                </div>
                <GoldTag color={color}>{u.role}</GoldTag>
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>
                {brandList.length > 0 ? brandList.join(", ") : "No brands assigned"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 10, color: u.is_active ? C.green : C.red }}>? {u.is_active ? "Active" : "Inactive"}</span>
                <button onClick={() => toggleActive(u)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer" }}>{u.is_active ? "Deactivate" : "Reactivate"}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  ADMIN SETUP PANEL (keeping your existing AdminSetupPanel)
// ---------------------------------------------------------------------------
// ------------------------------------------------------------
//  CHATBOT SETTINGS PANEL — per-brand bot config
// ------------------------------------------------------------
function ChatbotSettingsPanel({ brands, notify }) {
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Menu buttons state
  const [menuButtons, setMenuButtons] = useState([]);
  const [newBtnTitle, setNewBtnTitle] = useState("");
  const [newBtnPayload, setNewBtnPayload] = useState("");
  const [newBtnReply, setNewBtnReply] = useState("");
  const [newBtnImage, setNewBtnImage] = useState("");
  const [newBtnUrl, setNewBtnUrl] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);

  const uploadMenuImage = async (file) => {
    if (!file) return;
    setUploadingImg(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `menu-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("menu-images")
        .upload(fileName, file, { upsert: true, contentType: file.type });
      if (error) { notify(`? Upload failed: ${error.message}`); setUploadingImg(false); return; }
      const { data: urlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);
      setNewBtnImage(urlData.publicUrl);
      notify("? Image uploaded!");
    } catch (e) {
      notify(`? ${e.message}`);
    }
    setUploadingImg(false);
  };

  const loadSettings = async (brandId) => {
    if (!brandId) return;
    setLoading(true);
    const { data } = await supabase
      .from("brand_ai_settings")
      .select("*")
      .eq("brand_id", brandId)
      .maybeSingle();

    const defaults = {
      brand_id: brandId,
      bot_mode: "ai",
      greeting_message: "Hi! ?? How can we help you today?",
      menu_prompt: "What can we help you with? ??",
      menu_buttons: [
        { title: "?? Contact", payload: "CONTACT", reply_text: "" },
        { title: "?? Inquire", payload: "INQUIRE", reply_text: "" },
        { title: "?? AI Demo", payload: "AI_DEMO", reply_text: "" },
      ],
      system_prompt: "",
      model: "openai/gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 250,
      contact_message: "",
      inquire_thankyou: "",
      ai_start_message: "",
      welcome_card_enabled: false,
      welcome_card_image: "",
      welcome_card_title: "Book a Free Demo",
      welcome_card_subtitle: "See how Hermes can transform your business messaging.",
      welcome_card_btn_title: "Visit Website ?",
      welcome_card_btn_url: "https://hermes-rymg.onrender.com",
    };

    const cfg = data || defaults;
    setSettings(cfg);
    setMenuButtons(cfg.menu_buttons || defaults.menu_buttons);
    setLoading(false);
  };

  useEffect(() => { loadSettings(selectedBrandId); }, [selectedBrandId]);

  const saveSettings = async () => {
    if (!selectedBrandId || !settings) return;
    setSaving(true);

    // Only send known writable columns — never spread full settings object
    // as it may contain read-only fields like updated_at that Supabase rejects
    const payload = {
      brand_id:         selectedBrandId,
      bot_mode:         settings.bot_mode         || "ai",
      greeting_message: settings.greeting_message || "",
      menu_prompt:      settings.menu_prompt       || "",
      menu_buttons:     menuButtons,
      system_prompt:    settings.system_prompt     || null,
      model:            settings.model             || "openai/gpt-4o-mini",
      temperature:      settings.temperature       ?? 0.4,
      max_tokens:       settings.max_tokens        || 250,
      contact_message:  settings.contact_message   || null,
      inquire_thankyou: settings.inquire_thankyou  || null,
      ai_start_message:       settings.ai_start_message       || null,
      welcome_card_enabled:   settings.welcome_card_enabled   || false,
      welcome_card_image:     settings.welcome_card_image     || null,
      welcome_card_title:     settings.welcome_card_title     || null,
      welcome_card_subtitle:  settings.welcome_card_subtitle  || null,
      welcome_card_btn_title: settings.welcome_card_btn_title || null,
      welcome_card_btn_url:   settings.welcome_card_btn_url   || null,
    };

    const { error } = await supabase
      .from("brand_ai_settings")
      .upsert(payload, { onConflict: "brand_id" });

    setSaving(false);
    if (error) {
      console.error("Save error:", error);
      notify(`? Save failed: ${error.message}`);
    } else {
      notify("? Chatbot settings saved!");
    }
  };

  const addButton = () => {
    if (!newBtnTitle.trim()) return;
    const btn = {
      title: newBtnTitle.trim(),
      payload: newBtnPayload.trim() || newBtnTitle.trim().toUpperCase().replace(/\s+/g, "_"),
      reply_text: newBtnReply.trim(),
      image_url: newBtnImage.trim() || undefined,
      url: newBtnUrl.trim() || undefined,
    };
    setMenuButtons(b => [...b, btn]);
    setNewBtnTitle(""); setNewBtnPayload(""); setNewBtnReply(""); setNewBtnImage(""); setNewBtnUrl("");
    notify("Button added — save to apply");
  };

  const removeButton = (i) => setMenuButtons(b => b.filter((_, idx) => idx !== i));
  const moveButton = (i, dir) => {
    const arr = [...menuButtons];
    const to = i + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[i], arr[to]] = [arr[to], arr[i]];
    setMenuButtons(arr);
  };

  const BOT_MODES = [
    { val: "ai",           label: "?? Pure AI",           desc: "AI replies to every message using brand context" },
    { val: "menu",         label: "?? Menu Only",          desc: "Show buttons only, no AI" },
    { val: "ai_with_menu", label: "?? + ?? AI with Menu",  desc: "AI replies then shows menu buttons" },
    { val: "off",          label: "? Off",                 desc: "Save messages but don't auto-reply" },
  ];

  const inp = { background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 12, width: "100%" };

  return (
    <div>
      {/* Brand selector */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Select Brand to Configure</label>
        <select value={selectedBrandId} onChange={e => setSelectedBrandId(e.target.value)} style={{ ...inp, width: 280 }}>
          <option value="">— Choose a brand —</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {!selectedBrandId && (
        <div style={{ fontSize: 12, color: C.dim, padding: "12px 0" }}>Select a brand above to configure its chatbot.</div>
      )}

      {selectedBrandId && loading && (
        <div style={{ fontSize: 12, color: C.muted }}>Loading settings…</div>
      )}

      {selectedBrandId && settings && !loading && (
        <div>
          {/* Bot Mode */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Bot Mode</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
              {BOT_MODES.map(m => (
                <div key={m.val} onClick={() => setSettings(s => ({ ...s, bot_mode: m.val }))} style={{
                  padding: "10px 14px", borderRadius: 9, cursor: "pointer",
                  border: `1px solid ${settings.bot_mode === m.val ? C.gold : C.border}`,
                  background: settings.bot_mode === m.val ? `${C.gold}14` : C.bg4,
                  transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: settings.bot_mode === m.val ? C.gold : C.text, marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Greeting & prompts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Greeting Message</label>
              <textarea value={settings.greeting_message || ""} onChange={e => setSettings(s => ({ ...s, greeting_message: e.target.value }))} rows={2} style={{ ...inp, resize: "none" }} placeholder="Hi! ?? How can we help?" />
            </div>
            <div>
              <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Menu Prompt (above buttons)</label>
              <textarea value={settings.menu_prompt || ""} onChange={e => setSettings(s => ({ ...s, menu_prompt: e.target.value }))} rows={2} style={{ ...inp, resize: "none" }} placeholder="What can we help you with? ??" />
            </div>
          </div>

          {/* AI Settings */}
          {(settings.bot_mode === "ai" || settings.bot_mode === "ai_with_menu") && (
            <div style={{ marginBottom: 16, background: C.bg4, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>AI Configuration</div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>
                  System Prompt (overrides brand context if filled)
                </label>
                <textarea value={settings.system_prompt || ""} onChange={e => setSettings(s => ({ ...s, system_prompt: e.target.value }))} rows={4} style={{ ...inp, resize: "vertical" }} placeholder="You are a customer service agent for [Business Name]. You sell [products]. Prices: [list]. Reply in Taglish. Be warm and helpful." />
                <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>Leave blank to use Brand Context documents instead.</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>AI Model</label>
                  <select value={settings.model || "openai/gpt-4o-mini"} onChange={e => setSettings(s => ({ ...s, model: e.target.value }))} style={inp}>
                    <option value="openai/gpt-4o-mini">GPT-4o Mini (fast, cheap)</option>
                    <option value="openai/gpt-4o">GPT-4o (smarter)</option>
                    <option value="anthropic/claude-haiku">Claude Haiku (fast)</option>
                    <option value="anthropic/claude-sonnet-4">Claude Sonnet (best)</option>
                    <option value="google/gemini-flash-1.5">Gemini Flash (fast)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Temperature (0-1)</label>
                  <input type="number" min="0" max="1" step="0.1" value={settings.temperature ?? 0.4} onChange={e => setSettings(s => ({ ...s, temperature: parseFloat(e.target.value) }))} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Max Tokens</label>
                  <input type="number" min="50" max="1000" step="50" value={settings.max_tokens || 250} onChange={e => setSettings(s => ({ ...s, max_tokens: parseInt(e.target.value) }))} style={inp} />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>AI Start Message (when user triggers AI mode)</label>
                <input value={settings.ai_start_message || ""} onChange={e => setSettings(s => ({ ...s, ai_start_message: e.target.value }))} style={inp} placeholder="Hi! ?? Tell us about your business and we'll help right away!" />
              </div>
            </div>
          )}

          {/* Menu Buttons */}
          {(settings.bot_mode === "menu" || settings.bot_mode === "ai_with_menu") && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
                Menu Buttons <span style={{ color: C.dim, fontWeight: 400 }}>({menuButtons.length}/13 max)</span>
              </div>

              {/* Existing buttons */}
              {menuButtons.map((btn, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", background: C.bg4, borderRadius: 8, marginBottom: 6, border: `1px solid ${C.border}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{btn.title}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>
                      payload: {btn.payload}
                      {btn.reply_text && <span style={{ color: C.cyan }}> · has reply</span>}
                      {btn.image_url && <span style={{ color: C.violet }}> · has image</span>}
                      {btn.url && <span style={{ color: C.amber }}> · ?? has url</span>}
                    </div>
                  </div>
                  <button onClick={() => moveButton(i, -1)} disabled={i === 0} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontSize: 12 }}>?</button>
                  <button onClick={() => moveButton(i, 1)} disabled={i === menuButtons.length - 1} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontSize: 12 }}>?</button>
                  <button onClick={() => removeButton(i)} style={{ background: "transparent", border: `1px solid ${C.red}55`, color: C.red, borderRadius: 5, padding: "2px 8px", cursor: "pointer", fontSize: 11 }}>?</button>
                </div>
              ))}

              {/* Add new button */}
              <div style={{ background: C.bg4, border: `1px dashed ${C.border2}`, borderRadius: 10, padding: "14px", marginTop: 10 }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "1px" }}>Add New Button</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4 }}>Button Label * (max 20 chars)</label>
                    <input value={newBtnTitle} onChange={e => setNewBtnTitle(e.target.value)} maxLength={20} placeholder="e.g. ??? Our Products" style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4 }}>Payload (auto-set if blank)</label>
                    <input value={newBtnPayload} onChange={e => setNewBtnPayload(e.target.value)} placeholder="e.g. PRODUCTS" style={inp} />
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4 }}>Reply Text (what to send when tapped)</label>
                  <textarea value={newBtnReply} onChange={e => setNewBtnReply(e.target.value)} rows={2} placeholder="e.g. Here are our products! ??? We have cakes starting at ?350..." style={{ ...inp, resize: "none" }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4 }}>Image (optional — sends photo before reply text)</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{
                      padding: "8px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                      background: uploadingImg ? C.bg4 : `${C.violet}22`,
                      border: `1px solid ${C.violet}55`, color: uploadingImg ? C.muted : C.violet,
                      cursor: uploadingImg ? "not-allowed" : "pointer", whiteSpace: "nowrap",
                    }}>
                      {uploadingImg ? "Uploading…" : "?? Upload Image"}
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={e => uploadMenuImage(e.target.files?.[0])}
                        disabled={uploadingImg} />
                    </label>
                    <input value={newBtnImage} onChange={e => setNewBtnImage(e.target.value)}
                      placeholder="or paste image URL directly"
                      style={{ ...inp, flex: 1 }} />
                  </div>
                  {newBtnImage && (
                    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={newBtnImage} alt="preview" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: `1px solid ${C.border}` }} />
                      <div style={{ fontSize: 10, color: C.green }}>? Image ready</div>
                      <button onClick={() => setNewBtnImage("")} style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontSize: 11 }}>? Remove</button>
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4 }}>Website URL (optional — opens link when tapped instead of reply text)</label>
                  <input value={newBtnUrl} onChange={e => setNewBtnUrl(e.target.value)}
                    placeholder="e.g. https://yourwebsite.com/book-demo"
                    style={inp} />
                  <div style={{ fontSize: 9, color: C.dim, marginTop: 3 }}>If set, button opens this URL in browser. Use for Book a Demo, View Website, etc.</div>
                </div>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 8 }}>
                  Special payloads: <span style={{ color: C.cyan }}>CONTACT</span> (collect phone), <span style={{ color: C.cyan }}>INQUIRE</span> (lead form), <span style={{ color: C.cyan }}>AI_DEMO</span> (AI conversation)
                </div>
                <GoldBtn onClick={addButton} style={{ padding: "6px 16px", fontSize: 11 }}>+ Add Button</GoldBtn>
              </div>
            </div>
          )}

          {/* Flow customization */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Contact Flow Message</label>
              <textarea value={settings.contact_message || ""} onChange={e => setSettings(s => ({ ...s, contact_message: e.target.value }))} rows={2} style={{ ...inp, resize: "none" }} placeholder="Sure! Please share your phone number and we'll reach out ??" />
            </div>
            <div>
              <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Inquire Thank-You Message</label>
              <textarea value={settings.inquire_thankyou || ""} onChange={e => setSettings(s => ({ ...s, inquire_thankyou: e.target.value }))} rows={2} style={{ ...inp, resize: "none" }} placeholder="? Salamat! We'll reach out within 24 hours ??" />
            </div>
          </div>

          {/* Welcome Card Section */}
          <div style={{ marginBottom: 16, background: C.bg4, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>?? Welcome Card (shown on first message)</div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted, cursor: "pointer" }}>
                <input type="checkbox" checked={settings.welcome_card_enabled || false}
                  onChange={e => setSettings(s => ({ ...s, welcome_card_enabled: e.target.checked }))} />
                Enable
              </label>
            </div>
            {settings.welcome_card_enabled && (
              <div>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 10, lineHeight: 1.6 }}>
                  When someone first messages your page, the bot will send a card with your landing page image and a button linking to your website — before any text reply.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Card Title</label>
                    <input value={settings.welcome_card_title || ""} onChange={e => setSettings(s => ({ ...s, welcome_card_title: e.target.value }))} placeholder="Book a Free Demo" style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Button Text</label>
                    <input value={settings.welcome_card_btn_title || ""} onChange={e => setSettings(s => ({ ...s, welcome_card_btn_title: e.target.value }))} placeholder="Visit Website ?" style={inp} />
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Card Subtitle</label>
                  <input value={settings.welcome_card_subtitle || ""} onChange={e => setSettings(s => ({ ...s, welcome_card_subtitle: e.target.value }))} placeholder="See how Hermes can transform your business messaging." style={inp} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Button URL (your website)</label>
                  <input value={settings.welcome_card_btn_url || ""} onChange={e => setSettings(s => ({ ...s, welcome_card_btn_url: e.target.value }))} placeholder="https://yourwebsite.com" style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 9, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Landing Page Image</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ padding: "8px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: `${C.violet}22`, border: `1px solid ${C.violet}55`, color: C.violet, cursor: "pointer", whiteSpace: "nowrap" }}>
                      ?? Upload Image
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const ext = file.name.split(".").pop();
                          const fileName = `welcome-card-${Date.now()}.${ext}`;
                          const { error } = await supabase.storage.from("menu-images").upload(fileName, file, { upsert: true, contentType: file.type });
                          if (error) { notify(`? ${error.message}`); return; }
                          const { data: urlData } = supabase.storage.from("menu-images").getPublicUrl(fileName);
                          setSettings(s => ({ ...s, welcome_card_image: urlData.publicUrl }));
                          notify("? Image uploaded!");
                        }} />
                    </label>
                    <input value={settings.welcome_card_image || ""} onChange={e => setSettings(s => ({ ...s, welcome_card_image: e.target.value }))} placeholder="or paste image URL" style={{ ...inp, flex: 1 }} />
                  </div>
                  {settings.welcome_card_image && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={settings.welcome_card_image} alt="preview" style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 6, border: `1px solid ${C.border}` }} />
                      <div style={{ fontSize: 10, color: C.green }}>? Image ready</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <GoldBtn onClick={saveSettings} disabled={saving} style={{ padding: "9px 24px", fontSize: 12 }}>
              {saving ? "Saving…" : "?? Save Chatbot Settings"}
            </GoldBtn>
            <button onClick={async () => {
              if (!selectedBrandId) { notify("Select a brand first"); return; }
              if (!window.confirm("Reset all conversation states for this brand? The bot will greet everyone fresh on their next message.")) return;
              const { error } = await supabase
                .from("conversations")
                .update({ metadata: {} })
                .eq("brand_id", selectedBrandId)
                .eq("platform", "facebook");
              if (error) notify(`? ${error.message}`);
              else notify("? Conversations reset! Bot will greet fresh on next message.");
            }} style={{
              padding: "9px 18px", borderRadius: 10, fontSize: 12, cursor: "pointer", fontWeight: 600,
              background: "transparent", border: `1px solid ${C.amber}55`, color: C.amber,
              transition: "all 0.15s",
            }}>
              ?? Reset Conversations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function AdminSetupPanel({notify}) {
  const [brands,setBrands]=useState([]);
  const [users,setUsers]=useState([]);
  const [connections,setConnections]=useState([]);
  const [assignments,setAssignments]=useState([]);
  const [contexts,setContexts]=useState([]);
  const [rules,setRules]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const [brandName,setBrandName]=useState("");
  const [brandDesc,setBrandDesc]=useState("");
  const [brandColor,setBrandColor]=useState("#c9a84c");
  const [editBrandId,setEditBrandId]=useState("");
  const [editBrandName,setEditBrandName]=useState("");
  const [editBrandDesc,setEditBrandDesc]=useState("");
  const [editBrandColor,setEditBrandColor]=useState("#c9a84c");

  const [assignUserId,setAssignUserId]=useState("");
  const [assignBrandId,setAssignBrandId]=useState("");

  const [roleUserId,setRoleUserId]=useState("");
  const [roleValue,setRoleValue]=useState("client");

  const [fbBrandId,setFbBrandId]=useState("");
  const [fbPageId,setFbPageId]=useState("");
  const [fbAccessToken,setFbAccessToken]=useState("");

  const [ctxBrandId,setCtxBrandId]=useState("");
  const [ctxTitle,setCtxTitle]=useState("");
  const [ctxContent,setCtxContent]=useState("");
  const [ctxFileName,setCtxFileName]=useState("");

  const [ruleBrandId,setRuleBrandId]=useState("");
  const [rulePlatform,setRulePlatform]=useState("facebook");
  const [ruleTrigger,setRuleTrigger]=useState("all");
  const [ruleKeywords,setRuleKeywords]=useState("");
  const [ruleTemplate,setRuleTemplate]=useState("");
  const [ruleUseAi,setRuleUseAi]=useState(true);
  const [ruleActive,setRuleActive]=useState(true);


  const loadAll=async()=>{
    setLoading(true);
    setError("");
    try{
      const [b,u,c]=await Promise.all([
        supabase.from("brands").select("id,name,color,description").order("name"),
        supabase.from("profiles").select("id,full_name,email,role").order("full_name"),
        supabase.from("platform_connections").select("id,brand_id,platform,page_id,is_active,created_at").order("created_at",{ascending:false}),
      ]);
      const { data: ub, error: ubErr } = await supabase
        .from("user_brands")
        .select("id, user_id, brand_id, profiles(full_name,email), brands(name)")
        .order("id", { ascending: false });
      const { data: bc, error: bcErr } = await supabase
        .from("brand_contexts")
        .select("id, brand_id, title, content, source_type, created_at")
        .order("created_at", { ascending: false });
      const { data: ar, error: arErr } = await supabase
        .from("auto_reply_rules")
        .select("id, brand_id, platform, trigger_type, keywords, reply_template, use_ai, is_active, created_at")
        .order("created_at", { ascending: false });
      if(ubErr) throw ubErr;
      if(bcErr) throw bcErr;
      if(arErr) throw arErr;
      if(b.error) throw b.error;
      if(u.error) throw u.error;
      if(c.error) throw c.error;
      setBrands(b.data||[]);
      setUsers(u.data||[]);
      setConnections(c.data||[]);
      setAssignments(ub||[]);
      setContexts(bc||[]);
      setRules(ar||[]);
    }catch(err){
      setError(err?.message||"Failed to load admin data.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{loadAll();},[]);

  const createBrand=async()=>{
    if(!brandName.trim()) return;
    const { error:err } = await supabase
      .from("brands")
      .insert({name:brandName.trim(),description:brandDesc.trim()||null,color:brandColor});
    if(err){setError(err.message);return;}
    setBrandName("");setBrandDesc("");setBrandColor("#c9a84c");
    notify("Brand created");
    loadAll();
  };

  const startEditBrand=(b)=>{
    setEditBrandId(b.id);
    setEditBrandName(b.name||"");
    setEditBrandDesc(b.description||"");
    setEditBrandColor(b.color||"#c9a84c");
  };

  const cancelEditBrand=()=>{
    setEditBrandId("");
    setEditBrandName("");
    setEditBrandDesc("");
    setEditBrandColor("#c9a84c");
  };

  const updateBrand=async()=>{
    if(!editBrandId||!editBrandName.trim()) return;
    const { error:err } = await supabase
      .from("brands")
      .update({
        name: editBrandName.trim(),
        description: editBrandDesc.trim()||null,
        color: editBrandColor,
      })
      .eq("id", editBrandId);
    if(err){setError(err.message);return;}
    notify("Brand updated");
    cancelEditBrand();
    loadAll();
  };

  const deleteBrand=async(id)=>{
    if(!id) return;
    const confirmDelete = window.confirm("Delete this brand? This will also remove its conversations, contacts, messages, and user access.");
    if(!confirmDelete) return;
    const { error:err } = await supabase
      .from("brands")
      .delete()
      .eq("id", id);
    if(err){setError(err.message);return;}
    notify("Brand deleted");
    if(editBrandId===id) cancelEditBrand();
    loadAll();
  };

  const assignBrand=async()=>{
    if(!assignUserId||!assignBrandId) return;
    const { error:err } = await supabase
      .from("user_brands")
      .insert({user_id:assignUserId,brand_id:assignBrandId});
    if(err){setError(err.message);return;}
    notify("User assigned to brand");
    loadAll();
  };

  const updateRole=async()=>{
    if(!roleUserId) return;
    const { error:err } = await supabase
      .from("profiles")
      .update({role:roleValue})
      .eq("id", roleUserId);
    if(err){setError(err.message);return;}
    notify("Role updated");
    loadAll();
  };

  const connectFacebook=async()=>{
    if(!fbBrandId||!fbPageId||!fbAccessToken) return;
    const { error:err } = await supabase
      .from("platform_connections")
      .insert({brand_id:fbBrandId,platform:"facebook",page_id:fbPageId,access_token:fbAccessToken});
    if(err){setError(err.message);return;}
    setFbBrandId("");setFbPageId("");setFbAccessToken("");
    notify("Facebook connection saved");
    loadAll();
  };

  const brandNameById=(id)=>brands.find(b=>b.id===id)?.name||"Unknown";
  const unassignBrand=async(id)=>{
    if(!id) return;
    const { error:err } = await supabase
      .from("user_brands")
      .delete()
      .eq("id", id);
    if(err){setError(err.message);return;}
    notify("User unassigned from brand");
    loadAll();
  };

  const handleContextFile=async(file)=>{
    if(!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if(!["txt","md","csv","pdf"].includes(ext)){
      setError("Only .txt, .md, .csv, or .pdf files are supported for context.");
      return;
    }
    setError("");
    setCtxFileName(file.name);
    if(!ctxTitle) setCtxTitle(file.name);
    try{
      let text = "";
      if(ext === "pdf"){
        const [{ default: pdfjsLib }, workerModule] = await Promise.all([
          import("pdfjs-dist/legacy/build/pdf"),
          import("pdfjs-dist/legacy/build/pdf.worker?url"),
        ]);
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default || workerModule;
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const pages = pdf.numPages || 0;
        for(let i=1;i<=pages;i++){
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = (content.items || []).map(it=>it.str).join(" ");
          text += pageText + "\n";
        }
      }else{
        text = await file.text();
      }
      const maxLen = 20000;
      if(text.length > maxLen){
        text = text.slice(0, maxLen);
        setError("Context too long; trimmed to 20,000 characters.");
      }
      setCtxContent(text.trim());
    }catch{
      setError("Failed to read file.");
    }
  };

  const saveContext=async()=>{
    if(!ctxBrandId || !ctxContent.trim()) return;
    const { error:err } = await supabase
      .from("brand_contexts")
      .insert({
        brand_id: ctxBrandId,
        title: ctxTitle.trim()||null,
        content: ctxContent.trim(),
        source_type: ctxFileName ? "file" : "text",
      });
    if(err){setError(err.message);return;}
    setCtxTitle(""); setCtxContent(""); setCtxFileName("");
    notify("Brand context saved");
    loadAll();
  };

  const deleteContext=async(id)=>{
    if(!id) return;
    const { error:err } = await supabase
      .from("brand_contexts")
      .delete()
      .eq("id", id);
    if(err){setError(err.message);return;}
    notify("Context deleted");
    loadAll();
  };

  const saveRule=async()=>{
    if(!ruleBrandId) return;
    const keywords = ruleKeywords
      .split(",")
      .map(k=>k.trim())
      .filter(Boolean);
    const { error:err } = await supabase
      .from("auto_reply_rules")
      .insert({
        brand_id: ruleBrandId,
        platform: rulePlatform || null,
        trigger_type: ruleTrigger,
        keywords,
        reply_template: ruleTemplate,
        use_ai: ruleUseAi,
        is_active: ruleActive,
      });
    if(err){setError(err.message);return;}
    setRuleBrandId("");
    setRulePlatform("facebook");
    setRuleTrigger("all");
    setRuleKeywords("");
    setRuleTemplate("");
    setRuleUseAi(true);
    setRuleActive(true);
    notify("Auto-reply rule saved");
    loadAll();
  };

  const toggleRuleActive=async(rule)=>{
    const { error:err } = await supabase
      .from("auto_reply_rules")
      .update({ is_active: !rule.is_active })
      .eq("id", rule.id);
    if(err){setError(err.message);return;}
    loadAll();
  };

  const deleteRule=async(id)=>{
    if(!id) return;
    const { error:err } = await supabase
      .from("auto_reply_rules")
      .delete()
      .eq("id", id);
    if(err){setError(err.message);return;}
    notify("Rule deleted");
    loadAll();
  };

  

  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:C.text}}>Admin Setup</div>
        <GoldBtn onClick={loadAll} style={{padding:"6px 14px",fontSize:11}}>Refresh</GoldBtn>
      </div>

      {error&&<div style={{marginBottom:12,color:C.red,fontSize:12}}>{error}</div>}
      {loading&&<div style={{marginBottom:12,color:C.muted,fontSize:12}}>Loading...</div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>
          <SectionHead sub="Create and manage brands">Brands</SectionHead>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <input value={brandName} onChange={e=>setBrandName(e.target.value)} placeholder="Brand name"
              style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}/>
            <input value={brandColor} onChange={e=>setBrandColor(e.target.value)} placeholder="#c9a84c"
              style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}/>
          </div>
          <input value={brandDesc} onChange={e=>setBrandDesc(e.target.value)} placeholder="Description"
            style={{width:"100%",background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text,marginBottom:10}}/>
          <GoldBtn onClick={createBrand} style={{padding:"6px 14px",fontSize:11}}>Add Brand</GoldBtn>
          {editBrandId && (
            <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:6}}>Edit brand</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <input value={editBrandName} onChange={e=>setEditBrandName(e.target.value)} placeholder="Brand name"
                  style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}/>
                <input value={editBrandColor} onChange={e=>setEditBrandColor(e.target.value)} placeholder="#c9a84c"
                  style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}/>
              </div>
              <input value={editBrandDesc} onChange={e=>setEditBrandDesc(e.target.value)} placeholder="Description"
                style={{width:"100%",background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text,marginBottom:10}}/>
              <div style={{display:"flex",gap:8}}>
                <GoldBtn onClick={updateBrand} style={{padding:"6px 14px",fontSize:11}}>Save</GoldBtn>
                <GoldBtn onClick={cancelEditBrand} style={{padding:"6px 14px",fontSize:11,background:C.bg4,color:C.text,border:`1px solid ${C.border2}`,boxShadow:"none"}}>Cancel</GoldBtn>
              </div>
            </div>
          )}
          <div style={{marginTop:14,maxHeight:200,overflowY:"auto"}}>
            {brands.map(b=>(
              <div key={b.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:b.color}}/>
                <div style={{fontSize:12,color:C.text}}>{b.name}</div>
                <div style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{b.description||""}</div>
                <button onClick={()=>startEditBrand(b)} style={{
                  marginLeft:8,padding:"3px 8px",borderRadius:6,border:`1px solid ${C.border2}`,
                  background:"transparent",color:C.muted,fontSize:10,cursor:"pointer"
                }}>Edit</button>
                <button onClick={()=>deleteBrand(b.id)} style={{
                  marginLeft:6,padding:"3px 8px",borderRadius:6,border:`1px solid ${C.red}55`,
                  background:"transparent",color:C.red,fontSize:10,cursor:"pointer"
                }}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>
          <SectionHead sub="Assign users to brands">User Access</SectionHead>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <select value={assignUserId} onChange={e=>setAssignUserId(e.target.value)}
              style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
              <option value="">Select user</option>
              {users.map(u=>(
                <option key={u.id} value={u.id}>{u.full_name||u.email}</option>
              ))}
            </select>
            <select value={assignBrandId} onChange={e=>setAssignBrandId(e.target.value)}
              style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
              <option value="">Select brand</option>
              {brands.map(b=>(
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <GoldBtn onClick={assignBrand} style={{padding:"6px 14px",fontSize:11}}>Assign Brand</GoldBtn>

          <div style={{marginTop:14,maxHeight:160,overflowY:"auto"}}>
            {assignments.map(a=>(
              <div key={a.id} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{fontSize:11,color:C.text}}>{a.profiles?.full_name||a.profiles?.email||"User"}</div>
                <div style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{a.brands?.name||"Brand"}</div>
                <button onClick={()=>unassignBrand(a.id)} style={{
                  marginLeft:6,padding:"3px 8px",borderRadius:6,border:`1px solid ${C.red}55`,
                  background:"transparent",color:C.red,fontSize:10,cursor:"pointer"
                }}>Remove</button>
              </div>
            ))}
            {assignments.length===0 && (
              <div style={{fontSize:11,color:C.muted,padding:"6px 0"}}>No assignments yet.</div>
            )}
          </div>

          <div style={{marginTop:16}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:6}}>Update role</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 120px",gap:10,marginBottom:10}}>
              <select value={roleUserId} onChange={e=>setRoleUserId(e.target.value)}
                style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
                <option value="">Select user</option>
                {users.map(u=>(
                  <option key={u.id} value={u.id}>{u.full_name||u.email}</option>
                ))}
              </select>
              <select value={roleValue} onChange={e=>setRoleValue(e.target.value)}
                style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
                <option value="client">client</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <GoldBtn onClick={updateRole} style={{padding:"6px 14px",fontSize:11}}>Update Role</GoldBtn>
          </div>
        </div>
      </div>

      <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>
        <SectionHead sub="Connect Facebook for a brand">Facebook Connection</SectionHead>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <select value={fbBrandId} onChange={e=>setFbBrandId(e.target.value)}
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
            <option value="">Select brand</option>
            {brands.map(b=>(
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <input value={fbPageId} onChange={e=>setFbPageId(e.target.value)} placeholder="Facebook Page ID"
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}/>
        </div>
        <input value={fbAccessToken} onChange={e=>setFbAccessToken(e.target.value)} placeholder="Access token"
          style={{width:"100%",background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text,marginBottom:10}}/>
        <GoldBtn onClick={connectFacebook} style={{padding:"6px 14px",fontSize:11}}>Save Connection</GoldBtn>

        <div style={{marginTop:14,maxHeight:220,overflowY:"auto"}}>
          {connections.map(c=>(
            <div key={c.id} style={{display:"flex",gap:10,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.text,fontWeight:600}}>{brandNameById(c.brand_id)}</div>
              <div style={{fontSize:10,color:C.muted}}>{c.platform}</div>
              <div style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>Page {c.page_id}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginTop:14}}>
        <SectionHead sub="Upload or paste brand context for AI replies">Brand Context</SectionHead>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <select value={ctxBrandId} onChange={e=>setCtxBrandId(e.target.value)}
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
            <option value="">Select brand</option>
            {brands.map(b=>(
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <input value={ctxTitle} onChange={e=>setCtxTitle(e.target.value)} placeholder="Title (optional)"
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}/>
        </div>
        <textarea value={ctxContent} onChange={e=>setCtxContent(e.target.value)} placeholder="Paste context here (FAQs, pricing, policies, tone)..."
          rows={5} style={{width:"100%",background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text,marginBottom:10}}/>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
          <input type="file" accept=".txt,.md,.csv,.pdf" onChange={e=>handleContextFile(e.target.files?.[0])}
            style={{color:C.muted,fontSize:11}}/>
          {ctxFileName && <span style={{fontSize:10,color:C.muted}}>{ctxFileName}</span>}
        </div>
        <GoldBtn onClick={saveContext} style={{padding:"6px 14px",fontSize:11}}>Save Context</GoldBtn>

        <div style={{marginTop:14,maxHeight:220,overflowY:"auto"}}>
          {contexts.map(c=>(
            <div key={c.id} style={{display:"flex",gap:10,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.text,fontWeight:600}}>{brandNameById(c.brand_id)}</div>
              <div style={{fontSize:10,color:C.muted}}>{c.title||c.source_type}</div>
              <div style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{(c.content||"").slice(0,40)}...</div>
              <button onClick={()=>deleteContext(c.id)} style={{
                marginLeft:6,padding:"3px 8px",borderRadius:6,border:`1px solid ${C.red}55`,
                background:"transparent",color:C.red,fontSize:10,cursor:"pointer"
              }}>Delete</button>
            </div>
          ))}
          {contexts.length===0 && (
            <div style={{fontSize:11,color:C.muted,padding:"6px 0"}}>No context yet.</div>
          )}
        </div>
      </div>

      <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginTop:14}}>
        <SectionHead sub="Create auto-reply rules per brand">Auto Reply Rules</SectionHead>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <select value={ruleBrandId} onChange={e=>setRuleBrandId(e.target.value)}
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
            <option value="">Select brand</option>
            {brands.map(b=>(
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select value={rulePlatform} onChange={e=>setRulePlatform(e.target.value)}
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
            {["facebook","instagram","tiktok","shopee","lazada","viber","twitter",""].map(p=>(
              <option key={p||"all"} value={p}>{p||"All platforms"}</option>
            ))}
          </select>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <select value={ruleTrigger} onChange={e=>setRuleTrigger(e.target.value)}
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}>
            {["all","keyword","greeting","order","complaint"].map(t=>(
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input value={ruleKeywords} onChange={e=>setRuleKeywords(e.target.value)} placeholder="Keywords (comma separated)"
            style={{background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text}}/>
        </div>
        <textarea value={ruleTemplate} onChange={e=>setRuleTemplate(e.target.value)} placeholder="Reply template (use {{first_name}}, {{brand}})"
          rows={3} style={{width:"100%",background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 10px",color:C.text,marginBottom:10}}/>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
          <label style={{fontSize:11,color:C.muted,display:"flex",alignItems:"center",gap:6}}>
            <input type="checkbox" checked={ruleUseAi} onChange={e=>setRuleUseAi(e.target.checked)}/>
            Use AI
          </label>
          <label style={{fontSize:11,color:C.muted,display:"flex",alignItems:"center",gap:6}}>
            <input type="checkbox" checked={ruleActive} onChange={e=>setRuleActive(e.target.checked)}/>
            Active
          </label>
          <GoldBtn onClick={saveRule} style={{padding:"6px 14px",fontSize:11}}>Save Rule</GoldBtn>
        </div>

        <div style={{marginTop:8,maxHeight:240,overflowY:"auto"}}>
          {rules.map(r=>(
            <div key={r.id} style={{display:"flex",gap:10,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.text,fontWeight:600}}>{brandNameById(r.brand_id)}</div>
              <div style={{fontSize:10,color:C.muted}}>{r.platform||"all"}</div>
              <div style={{fontSize:10,color:C.muted}}>{r.trigger_type}</div>
              <div style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{r.is_active?"active":"off"}</div>
              <button onClick={()=>toggleRuleActive(r)} style={{
                marginLeft:6,padding:"3px 8px",borderRadius:6,border:`1px solid ${C.border2}`,
                background:"transparent",color:C.muted,fontSize:10,cursor:"pointer"
              }}>{r.is_active?"Disable":"Enable"}</button>
              <button onClick={()=>deleteRule(r.id)} style={{
                marginLeft:6,padding:"3px 8px",borderRadius:6,border:`1px solid ${C.red}55`,
                background:"transparent",color:C.red,fontSize:10,cursor:"pointer"
              }}>Delete</button>
            </div>
          ))}
          {rules.length===0 && (
            <div style={{fontSize:11,color:C.muted,padding:"6px 0"}}>No rules yet.</div>
          )}
        </div>
      </div>


      {/* -- CHATBOT SETTINGS PER BRAND ------------------- */}
      <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginTop:14}}>
        <SectionHead sub="Configure chatbot behavior per brand">Chatbot Settings</SectionHead>
        <ChatbotSettingsPanel brands={brands} notify={notify}/>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
//  SETTINGS PANEL (keeping your existing SettingsPanel)
// ---------------------------------------------------------------------------
function SettingsPanel({ notify, profile, session }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    setFullName(profile?.full_name || "");
  }, [profile]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("platform_connections")
        .select("id, platform, page_id, is_active, brand_id, brands(name)")
        .order("created_at", { ascending: false });
      setConnections(data || []);
    })();
  }, []);

  const saveName = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName.trim() }).eq("id", session.user.id);
    setSaving(false);
    if (error) notify(error.message);
    else notify("? Name updated! Refresh to see changes.");
  };

  const toggleConnection = async (conn) => {
    await supabase.from("platform_connections").update({ is_active: !conn.is_active }).eq("id", conn.id);
    setConnections(list => list.map(c => c.id === conn.id ? { ...c, is_active: !c.is_active } : c));
    notify(conn.is_active ? "Connection disabled" : "Connection enabled");
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      <div style={{ maxWidth: 600 }}>
        {/* Profile */}
        <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", borderTop: `2px solid ${C.gold}`, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 16 }}>Your Profile</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 9, color: C.gold, fontWeight: 700, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "1.5px" }}>Display Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: "100%", background: C.bg4, border: `1px solid ${C.border2}`, borderRadius: 9, padding: "9px 14px", color: C.text, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "1.5px" }}>Email</label>
            <input value={session?.user?.email || ""} disabled style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 14px", color: C.muted, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 9, color: C.muted, fontWeight: 700, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "1.5px" }}>Role</label>
            <input value={profile?.role || "—"} disabled style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 14px", color: C.muted, fontSize: 13 }} />
          </div>
          <GoldBtn onClick={saveName} disabled={saving}>{saving ? "Saving…" : "Save Name"}</GoldBtn>
        </div>

        {/* Platform Connections */}
        <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>Connected Platforms</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Add platform connections in Admin Setup ? Facebook Connection.</div>
          {connections.length === 0 && <div style={{ fontSize: 12, color: C.dim }}>No platform connections yet.</div>}
          {connections.map(conn => (
            <div key={conn.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: conn.is_active ? C.green : C.muted, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, textTransform: "capitalize" }}>{conn.platform} — {conn.brands?.name || "Unknown brand"}</div>
                <div style={{ fontSize: 10, color: C.muted }}>Page ID: {conn.page_id}</div>
              </div>
              <button onClick={() => toggleConnection(conn)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "4px 10px", fontSize: 10, cursor: "pointer" }}>{conn.is_active ? "Disable" : "Enable"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmailMarketingModule({ activeBrandId, activeBrandName, notify, session: _session }) {
  const [tab,setTab]=useState("campaigns");
  const [campaigns,setCampaigns]=useState([]);
  const [loadingC,setLoadingC]=useState(false);
  const [selectedCampaign,setSelectedCampaign]=useState(null);
  const [subject,setSubject]=useState("");
  const [fromName,setFromName]=useState("");
  const [fromEmail,setFromEmail]=useState("hello@exponify.ph");
  const [selectedListId,setSelectedListId]=useState("");
  const [bodyHtml,setBodyHtml]=useState("");
  const [scheduleMode,setScheduleMode]=useState("now");
  const [scheduleAt,setScheduleAt]=useState("");
  const [sendBusy,setSendBusy]=useState(false);
  const [aiDrafting,setAiDrafting]=useState(false);
  const [aiAnalyzing,setAiAnalyzing]=useState(false);
  const [aiTargetResult,setAiTargetResult]=useState(null);
  const [campaignGoal,setCampaignGoal]=useState("conversions");
  const [industryCtx,setIndustryCtx]=useState("beauty_skincare");
  const [automationRunning,setAutomationRunning]=useState(false);
  const [automationLog,setAutomationLog]=useState([]);
  const [lists,setLists]=useState([]);
  const [newSubEmail,setNewSubEmail]=useState("");
  const [newSubName,setNewSubName]=useState("");
  const [newSubCompany,setNewSubCompany]=useState("");
  const [newSubListId,setNewSubListId]=useState("");
  const [addingContact,setAddingContact]=useState(false);
  const GOALS=[{id:"conversions",label:"Drive Sales"},{id:"leads",label:"Generate Leads"},{id:"reengagement",label:"Re-engage Cold Contacts"},{id:"awareness",label:"Brand Awareness"},{id:"retention",label:"Customer Retention"}];
  const INDUSTRIES=[{id:"beauty_skincare",label:"Beauty & Skincare"},{id:"food_beverage",label:"Food & Beverage"},{id:"home_living",label:"Home & Living"},{id:"fashion",label:"Fashion"},{id:"baby_kids",label:"Baby & Kids"},{id:"health_wellness",label:"Health & Wellness"},{id:"tech_ecommerce",label:"Tech / E-commerce"}];

  const mockCampaigns=[
    {id:"ec1",name:"Q2 Partner Launch",status:"sent",subject:"Exclusive Partnership Opportunity ??",list_name:"Enterprise Leads PH",recipients:342,open_rate:58.4,click_rate:22.1,revenue_attributed:128400,sent_at:"2026-03-18T10:00:00Z",target_segment:"Enterprise decision-makers 35-50",ai_score:94},
    {id:"ec2",name:"SME Onboarding — Week 1",status:"sent",subject:"Welcome to Exponify — Your Growth Starts Now",list_name:"SME Philippines",recipients:891,open_rate:71.2,click_rate:34.5,revenue_attributed:245000,sent_at:"2026-03-15T09:00:00Z",target_segment:"SME owners 28-45, Metro Manila",ai_score:88},
    {id:"ec3",name:"Distributor Network Invite",status:"scheduled",subject:"Join the Exponify Distributor Network",list_name:"Distributors",recipients:128,open_rate:null,click_rate:null,revenue_attributed:null,sent_at:"2026-03-25T08:00:00Z",target_segment:"FMCG distributors, nationwide",ai_score:91},
    {id:"ec4",name:"Beauty Report 2026",status:"draft",subject:"[B2B Report] PH Beauty Market 2026",list_name:"",recipients:0,open_rate:null,click_rate:null,revenue_attributed:null,sent_at:null,target_segment:"TBD — AI targeting pending",ai_score:null},
    {id:"ec5",name:"Re-engagement: Cold Leads",status:"sent",subject:"We miss you — Here's what's new",list_name:"Cold Leads",recipients:214,open_rate:29.3,click_rate:8.7,revenue_attributed:31200,sent_at:"2026-03-10T14:00:00Z",target_segment:"Cold leads 90d+, all industries",ai_score:72},
  ];
  const mockLists=[
    {id:"el1",name:"Enterprise Leads PH",count:342,industry:"Multi-brand Retail",avg_open:58,best_time:"Tue 10AM"},
    {id:"el2",name:"SME Philippines",count:891,industry:"SME / E-commerce",avg_open:71,best_time:"Wed 9AM"},
    {id:"el3",name:"Distributors",count:128,industry:"FMCG Distribution",avg_open:63,best_time:"Mon 8AM"},
    {id:"el4",name:"Cold Leads",count:214,industry:"Mixed",avg_open:29,best_time:"Thu 2PM"},
    {id:"el5",name:"Resellers PH",count:476,industry:"Retail Resellers",avg_open:44,best_time:"Fri 11AM"},
  ];
  useEffect(()=>{
    setFromName(activeBrandName||"Exponify"); setLoadingC(true);
    supabase.from("email_campaigns").select("*").eq("brand_id",activeBrandId||"").order("created_at",{ascending:false}).then(({data,error})=>{setCampaigns(!error&&data?.length?data:mockCampaigns);setLoadingC(false);}).catch(()=>{setCampaigns(mockCampaigns);setLoadingC(false);});
    supabase.from("email_lists").select("*").order("name").then(({data,error})=>{const d=!error&&data?.length?data:mockLists;setLists(d);if(d[0])setNewSubListId(d[0].id);}).catch(()=>{setLists(mockLists);setNewSubListId(mockLists[0].id);});
  },[activeBrandId]);

  const statusColor=s=>({sent:C.green,scheduled:C.amber,draft:C.muted,failed:C.red}[s]||C.muted);
  const statusLabel=s=>({sent:"? Sent",scheduled:"? Scheduled",draft:"? Draft",failed:"? Failed"}[s]||s);
  const totalSent=campaigns.filter(c=>c.status==="sent").reduce((a,c)=>a+(c.recipients||0),0);
  const avgOpen=(()=>{const s=campaigns.filter(c=>c.open_rate);return s.length?(s.reduce((a,c)=>a+c.open_rate,0)/s.length).toFixed(1):"—";})();
  const avgClick=(()=>{const s=campaigns.filter(c=>c.click_rate);return s.length?(s.reduce((a,c)=>a+c.click_rate,0)/s.length).toFixed(1):"—";})();
  const totalRevenue=campaigns.filter(c=>c.revenue_attributed).reduce((a,c)=>a+(c.revenue_attributed||0),0);

  const aiAnalyzeTarget=async()=>{
    setAiAnalyzing(true);setAiTargetResult(null);
    try{
      const {data:contacts}=await supabase.from("contacts").select("stage,platform,tags,lifetime_value,score").eq("brand_id",activeBrandId||"").limit(200);
      const crmSummary=contacts?.length?`CRM data: ${contacts.length} contacts. Stages: ${[...new Set(contacts.map(c=>c.stage))].join(", ")}. Top platforms: ${[...new Set(contacts.map(c=>c.platform).filter(Boolean))].slice(0,3).join(", ")}. Avg LTV: ?${Math.round((contacts.reduce((a,c)=>a+(c.lifetime_value||0),0))/Math.max(contacts.length,1)).toLocaleString()}.`:"CRM data: using Philippine market benchmarks.";
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:`You are an AI email marketing strategist for ${activeBrandName||"Exponify"}, a Philippine B2B commerce platform.\n\nContext:\n- Industry: ${INDUSTRIES.find(i=>i.id===industryCtx)?.label||industryCtx}\n- Campaign Goal: ${GOALS.find(g=>g.id===campaignGoal)?.label||campaignGoal}\n- ${crmSummary}\n\nAnalyze and output a smart target market strategy. Return ONLY valid JSON (no markdown, no explanation outside JSON):\n{\n  "primary_segment": "string",\n  "age_range": "e.g. 28-45",\n  "gender_split": "e.g. 65% Female, 35% Male",\n  "top_locations": ["Metro Manila","CALABARZON","Central Luzon"],\n  "best_send_time": "e.g. Tuesday 10:00 AM",\n  "recommended_list": "name of best list",\n  "subject_line_tips": ["tip1","tip2","tip3"],\n  "personalization_tokens": ["{{first_name}}","{{company}}","{{industry}}"],\n  "predicted_open_rate": "e.g. 62-68%",\n  "predicted_ctr": "e.g. 24-30%",\n  "predicted_revenue": "e.g. ?85,000-?120,000",\n  "campaign_type": "e.g. Drip sequence (3 emails over 7 days)",\n  "reasoning": "2-3 sentence explanation"\n}`}]})});
      const data=await resp.json();const raw=data.content?.[0]?.text||"";const jsonMatch=raw.match(/\{[\s\S]*\}/);
      if(jsonMatch)setAiTargetResult(JSON.parse(jsonMatch[0]));else setAiTargetResult({error:"Could not parse AI response."});
    }catch{setAiTargetResult({primary_segment:"Philippine SME owners and brand managers aged 28-45",age_range:"28-45",gender_split:"58% Female, 42% Male",top_locations:["Metro Manila","CALABARZON","Cebu City"],best_send_time:"Tuesday 10:00 AM PH time",recommended_list:"SME Philippines",subject_line_tips:["Use their company name in subject","Include a specific ? value proposition","Ask a pain-point question"],personalization_tokens:["{{first_name}}","{{company}}","{{industry}}"],predicted_open_rate:"58-65%",predicted_ctr:"22-28%",predicted_revenue:"?95,000-?140,000",campaign_type:"Welcome sequence (3 emails over 5 days)",reasoning:"Based on your CRM data and PH B2B benchmarks, SME owners in Metro Manila respond best to value-led emails with clear ROI messaging."});}
    setAiAnalyzing(false);
  };

  const aiDraftEmail=async()=>{
    if(!subject.trim()){notify("Enter a subject line first");return;}setAiDrafting(true);
    const targetCtx=aiTargetResult?`Target: ${aiTargetResult.primary_segment}. Send time: ${aiTargetResult.best_send_time}. Personalize with: ${aiTargetResult.personalization_tokens?.join(", ")}.`:`Target: Philippine B2B brands. Goal: ${GOALS.find(g=>g.id===campaignGoal)?.label}.`;
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Write a high-converting B2B email for ${activeBrandName||"Exponify"} (exponify.ph), a Philippine AI-powered commerce platform.\n\nSubject: ${subject}\n${targetCtx}\nGoal: ${GOALS.find(g=>g.id===campaignGoal)?.label||"Drive conversions"}\nIndustry context: ${INDUSTRIES.find(i=>i.id===industryCtx)?.label}\n\nRequirements:\n- Professional yet warm Filipino business tone\n- 3-4 focused paragraphs with clear value proposition\n- Use {{first_name}} and {{company}} personalization\n- Include specific PH market context\n- End with this CTA button HTML: <div style="text-align:center;margin:28px 0"><a href="https://exponify.ph" style="background:#c9a84c;color:#06050a;padding:14px 40px;border-radius:9px;font-weight:800;text-decoration:none;display:inline-block;font-size:14px;letter-spacing:.3px">Get Started on Exponify ?</a></div>\n- Return ONLY clean HTML body (p tags, no html/head/body wrapper)`}]})});
      const data=await resp.json();const text=data.content?.[0]?.text||"";setBodyHtml(text);notify("? AI email drafted with smart targeting!");
    }catch{notify("? AI draft failed");}
    setAiDrafting(false);
  };

  const runAutomation=async()=>{
    setAutomationRunning(true);setAutomationLog([]);
    const log=(msg,type="info")=>setAutomationLog(prev=>[...prev,{msg,type,time:new Date().toLocaleTimeString("en-PH")}]);
    log("?? AI automation started...");await new Promise(r=>setTimeout(r,600));
    log("?? Analyzing your CRM contacts and engagement patterns...");await aiAnalyzeTarget();await new Promise(r=>setTimeout(r,800));log("? Target market identified","success");
    log("?? Generating personalized email content...");if(!subject)setSubject(`${activeBrandName||"Exponify"} — Exclusive Offer for ${GOALS.find(g=>g.id===campaignGoal)?.label||"Your Brand"}`);await new Promise(r=>setTimeout(r,400));await aiDraftEmail();await new Promise(r=>setTimeout(r,600));log("? Email content generated with AI","success");
    log("?? Selecting optimal recipient list...");await new Promise(r=>setTimeout(r,500));const bestList=lists.reduce((best,l)=>(l.count>(best?.count||0))?l:best,null);if(bestList){setSelectedListId(bestList.id);log(`? Selected: ${bestList.name} (${bestList.count} contacts)`,"success");}
    log("? Scheduling at optimal send time...");await new Promise(r=>setTimeout(r,400));setScheduleMode("schedule");const next=new Date();next.setDate(next.getDate()+((9-next.getDay())%7||7));next.setHours(10,0,0,0);setScheduleAt(next.toISOString().slice(0,16));log(`? Scheduled: ${next.toLocaleDateString("en-PH",{weekday:"long",month:"short",day:"numeric"})} at 10:00 AM`,"success");
    log("?? Campaign ready! Click 'Send Campaign' to deploy.","success");setAutomationRunning(false);notify("? AI automation complete! Review and send.");
  };

  const sendCampaign=async()=>{
    if(!subject.trim()){notify("Subject is required");return;}if(!bodyHtml.trim()){notify("Email body is required");return;}if(!selectedListId){notify("Select a recipient list");return;}
    setSendBusy(true);const list=lists.find(l=>l.id===selectedListId);
    const newC={id:`ec${Date.now()}`,name:subject,status:scheduleMode==="now"?"sent":"scheduled",subject,list_name:list?.name||"",recipients:list?.count||0,open_rate:null,click_rate:null,revenue_attributed:null,sent_at:scheduleMode==="now"?new Date().toISOString():scheduleAt,target_segment:aiTargetResult?.primary_segment||"",ai_score:aiTargetResult?89:null};
    try{await supabase.from("email_campaigns").insert({brand_id:activeBrandId,name:subject,subject,body_html:bodyHtml,from_name:fromName,from_email:fromEmail,list_id:selectedListId,status:newC.status,recipients:list?.count||0,scheduled_at:scheduleMode==="schedule"?scheduleAt:null,sent_at:scheduleMode==="now"?new Date().toISOString():null});}catch{/* ignore persistence errors while using local fallback */}
    await new Promise(r=>setTimeout(r,700));setCampaigns(p=>[newC,...p]);setSendBusy(false);
    notify(scheduleMode==="now"?`? Sent to ${(list?.count||0).toLocaleString()} contacts!`:`? Scheduled for ${new Date(scheduleAt).toLocaleDateString("en-PH",{month:"short",day:"numeric"})}`);
    setTab("campaigns");setSubject("");setBodyHtml("");setAiTargetResult(null);setAutomationLog([]);
  };

  const saveDraft=()=>{if(!subject.trim()){notify("Enter a subject to save");return;}setCampaigns(p=>[{id:`ed${Date.now()}`,name:subject,status:"draft",subject,list_name:"",recipients:0,open_rate:null,click_rate:null,revenue_attributed:null,sent_at:null,target_segment:aiTargetResult?.primary_segment||"",ai_score:null},...p]);notify("?? Draft saved!");setTab("campaigns");};

  const addSubscriber=async()=>{
    if(!newSubEmail.trim()){notify("Email is required");return;}setAddingContact(true);
    const list=lists.find(l=>l.id===newSubListId);
    try{await supabase.from("email_subscribers").insert({brand_id:activeBrandId,list_id:newSubListId,email:newSubEmail.trim().toLowerCase(),first_name:newSubName.split(" ")[0]||"",company:newSubCompany});}catch{/* ignore persistence errors while using local fallback */}
    if(list)setLists(p=>p.map(l=>l.id===newSubListId?{...l,count:(l.count||0)+1}:l));
    notify(`? ${newSubEmail} added to ${list?.name||"list"}!`);
    setNewSubEmail("");setNewSubName("");setNewSubCompany("");setAddingContact(false);
  };

  const TABS=[{id:"campaigns",label:"Campaigns"},{id:"automate",label:"? AI Automate"},{id:"compose",label:"Compose"},{id:"lists",label:"Lists"},{id:"analytics",label:"Analytics"}];
  const inp=(x={})=>({background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:9,padding:"9px 14px",color:C.text,fontSize:12,width:"100%",...x});
  const Lbl=({children,col})=><label style={{fontSize:9,color:col||C.gold,fontWeight:700,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1.5px"}}>{children}</label>;

  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20}}>
        {[{label:"Total Sent",val:totalSent.toLocaleString(),col:C.gold,icon:"??"},{label:"Avg Open Rate",val:`${avgOpen}%`,col:C.green,icon:"??"},{label:"Avg Click Rate",val:`${avgClick}%`,col:C.cyan,icon:"?"},{label:"Revenue Attr.",val:`?${(totalRevenue/1000).toFixed(0)}K`,col:C.violet,icon:"??"},{label:"AI Campaigns",val:campaigns.filter(c=>c.ai_score).length.toString(),col:C.rose,icon:"?"}].map(k=>(
          <div key={k.label} style={{background:C.bg3,border:`1px solid ${C.border}`,borderTop:`2px solid ${k.col}`,borderRadius:11,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>{k.icon} {k.label}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:k.col,lineHeight:1}}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:4,borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
        {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 16px",background:"transparent",border:"none",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent",color:tab===t.id?C.gold:C.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.label}</button>))}
      </div>

      {tab==="campaigns"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700}}>All Campaigns</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setTab("automate")} style={{padding:"7px 16px",borderRadius:9,border:`1px solid ${C.gold}44`,background:`${C.gold}12`,color:C.gold,fontSize:12,fontWeight:700,cursor:"pointer"}}>? AI Automate</button>
              <GoldBtn onClick={()=>setTab("compose")}>+ New Campaign</GoldBtn>
            </div>
          </div>
          {loadingC&&<div style={{color:C.muted,padding:20,fontSize:12}}>Loading…</div>}
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:C.bg2}}>{["Campaign","Status","Segment","Recipients","Open","Click","Revenue","AI Score"].map(h=>(<th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</th>))}</tr></thead>
              <tbody>
                {campaigns.map(c=>(<tr key={c.id} onClick={()=>setSelectedCampaign(c===selectedCampaign?null:c)} style={{borderTop:`1px solid ${C.border}`,cursor:"pointer",background:selectedCampaign?.id===c.id?C.bg4:"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg4} onMouseLeave={e=>e.currentTarget.style.background=selectedCampaign?.id===c.id?C.bg4:"transparent"}>
                  <td style={{padding:"10px 12px"}}><div style={{fontWeight:600,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div><div style={{fontSize:9,color:C.muted,marginTop:2,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.subject}</div></td>
                  <td style={{padding:"10px 12px"}}><span style={{padding:"2px 7px",borderRadius:5,background:`${statusColor(c.status)}22`,color:statusColor(c.status),fontSize:9,fontWeight:700}}>{statusLabel(c.status)}</span></td>
                  <td style={{padding:"10px 12px",fontSize:10,color:C.muted,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.target_segment||"—"}</td>
                  <td style={{padding:"10px 12px",fontWeight:600}}>{c.recipients>0?c.recipients.toLocaleString():"—"}</td>
                  <td style={{padding:"10px 12px",color:c.open_rate?C.green:C.dim,fontWeight:600}}>{c.open_rate?`${c.open_rate}%`:"—"}</td>
                  <td style={{padding:"10px 12px",color:c.click_rate?C.cyan:C.dim,fontWeight:600}}>{c.click_rate?`${c.click_rate}%`:"—"}</td>
                  <td style={{padding:"10px 12px",color:c.revenue_attributed?C.gold:C.dim,fontWeight:600}}>{c.revenue_attributed?`?${(c.revenue_attributed/1000).toFixed(0)}K`:"—"}</td>
                  <td style={{padding:"10px 12px"}}>{c.ai_score?<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:28,height:5,background:C.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${c.ai_score}%`,background:c.ai_score>85?C.green:c.ai_score>70?C.amber:C.red,borderRadius:3}}/></div><span style={{fontSize:10,fontWeight:700,color:c.ai_score>85?C.green:c.ai_score>70?C.amber:C.red}}>{c.ai_score}</span></div>:<span style={{color:C.dim,fontSize:10}}>—</span>}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
          {selectedCampaign&&(<div style={{marginTop:14,background:C.bg3,border:`1px solid ${C.gold}44`,borderRadius:12,padding:"16px 18px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:C.gold}}>{selectedCampaign.name}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{selectedCampaign.subject}</div>{selectedCampaign.target_segment&&<div style={{fontSize:10,color:C.cyan,marginTop:3}}>?? {selectedCampaign.target_segment}</div>}</div><button onClick={()=>setSelectedCampaign(null)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>{[{label:"Recipients",val:selectedCampaign.recipients?.toLocaleString()||"0"},{label:"Open Rate",val:selectedCampaign.open_rate?`${selectedCampaign.open_rate}%`:"Pending"},{label:"Click Rate",val:selectedCampaign.click_rate?`${selectedCampaign.click_rate}%`:"Pending"},{label:"Revenue",val:selectedCampaign.revenue_attributed?`?${(selectedCampaign.revenue_attributed/1000).toFixed(0)}K`:"—"},{label:"AI Score",val:selectedCampaign.ai_score||"—"}].map(m=>(<div key={m.label} style={{background:C.bg2,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:3}}>{m.label}</div><div style={{fontSize:14,fontWeight:700}}>{m.val}</div></div>))}</div></div>)}
        </div>
      )}

      {tab==="automate"&&(
        <div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,marginBottom:4}}>? AI Campaign Automation</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:18}}>Claude analyzes your CRM data, identifies your ideal target market, writes the email, selects the best list, and schedules at peak open times — automatically.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",borderTop:`2px solid ${C.gold}`}}>
              <Lbl>Campaign Goal</Lbl>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {GOALS.map(g=>(<button key={g.id} onClick={()=>setCampaignGoal(g.id)} style={{padding:"8px 10px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700,textAlign:"left",border:`1px solid ${campaignGoal===g.id?C.gold:C.border}`,background:campaignGoal===g.id?`${C.gold}18`:"transparent",color:campaignGoal===g.id?C.gold:C.muted}}>{g.label}</button>))}
              </div>
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}>
              <Lbl>Industry Context</Lbl>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {INDUSTRIES.map(i=>(<button key={i.id} onClick={()=>setIndustryCtx(i.id)} style={{padding:"7px 10px",borderRadius:8,cursor:"pointer",fontSize:10,fontWeight:600,textAlign:"left",border:`1px solid ${industryCtx===i.id?C.violet:C.border}`,background:industryCtx===i.id?`${C.violet}18`:"transparent",color:industryCtx===i.id?C.violet:C.muted}}>{i.label}</button>))}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <button onClick={aiAnalyzeTarget} disabled={aiAnalyzing} style={{padding:"10px 20px",borderRadius:9,border:`1px solid ${C.cyan}44`,background:`${C.cyan}12`,color:aiAnalyzing?C.muted:C.cyan,fontSize:12,fontWeight:700,cursor:aiAnalyzing?"not-allowed":"pointer"}}>{aiAnalyzing?"? Analyzing…":"?? Analyze Target Market"}</button>
            <GoldBtn onClick={runAutomation} disabled={automationRunning} style={{padding:"10px 24px"}}>{automationRunning?"? Running Automation…":"? Run Full Automation"}</GoldBtn>
          </div>
          {automationLog.length>0&&(<div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:16,fontFamily:"monospace",fontSize:11}}>{automationLog.map((l,i)=>(<div key={i} style={{color:l.type==="success"?C.green:C.text,marginBottom:3,display:"flex",gap:8}}><span style={{color:C.muted,flexShrink:0}}>{l.time}</span><span>{l.msg}</span></div>))}{automationRunning&&<div style={{color:C.gold,marginTop:4,animation:"pulse 1s ease-in-out infinite"}}>? Processing…</div>}</div>)}
          {aiTargetResult&&!aiTargetResult.error&&(
            <div style={{background:C.bg3,border:`1px solid ${C.gold}44`,borderRadius:12,padding:"18px 20px",borderTop:`2px solid ${C.gold}`}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:C.gold,marginBottom:14}}>? AI Target Market Analysis</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                {[{label:"Primary Segment",val:aiTargetResult.primary_segment,col:C.gold},{label:"Age Range",val:aiTargetResult.age_range,col:C.cyan},{label:"Gender Split",val:aiTargetResult.gender_split,col:C.violet},{label:"Best Send Time",val:aiTargetResult.best_send_time,col:C.green},{label:"Predicted Open Rate",val:aiTargetResult.predicted_open_rate,col:C.green},{label:"Predicted Revenue",val:aiTargetResult.predicted_revenue,col:C.gold}].map(m=>(<div key={m.label} style={{background:C.bg4,borderRadius:9,padding:"11px 13px",border:`1px solid ${C.border}`}}><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>{m.label}</div><div style={{fontSize:12,fontWeight:700,color:m.col}}>{m.val}</div></div>))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div><div style={{fontSize:10,color:C.gold,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Top Locations</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{aiTargetResult.top_locations?.map(l=>(<span key={l} style={{padding:"3px 9px",borderRadius:6,background:`${C.cyan}18`,color:C.cyan,fontSize:10,border:`1px solid ${C.cyan}33`}}>{l}</span>))}</div></div>
                <div><div style={{fontSize:10,color:C.gold,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Subject Line Tips</div>{aiTargetResult.subject_line_tips?.map((t,i)=>(<div key={i} style={{fontSize:10,color:C.muted,marginBottom:3}}>• {t}</div>))}</div>
              </div>
              {aiTargetResult.reasoning&&(<div style={{background:C.bg4,borderRadius:9,padding:"11px 13px",fontSize:11,color:C.text,lineHeight:1.7,borderLeft:`3px solid ${C.gold}`}}><span style={{color:C.gold,fontWeight:700}}>AI Reasoning: </span>{aiTargetResult.reasoning}</div>)}
              <div style={{marginTop:14}}><GoldBtn onClick={()=>setTab("compose")} style={{padding:"9px 20px"}}>Use This Targeting ? Compose</GoldBtn></div>
            </div>
          )}
        </div>
      )}

      {tab==="compose"&&(
        <div style={{maxWidth:780}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,marginBottom:18}}>Compose Campaign</div>
          {aiTargetResult&&(<div style={{background:`${C.gold}10`,border:`1px solid ${C.gold}33`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:C.gold,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>?</span><span>AI targeting active: <strong>{aiTargetResult.primary_segment}</strong> — Best send: {aiTargetResult.best_send_time}</span></div>)}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><Lbl>From Name</Lbl><input style={inp()} value={fromName} onChange={e=>setFromName(e.target.value)} placeholder="Exponify Business"/></div>
            <div><Lbl>From Email</Lbl><input style={inp()} value={fromEmail} onChange={e=>setFromEmail(e.target.value)} placeholder="hello@exponify.ph"/></div>
          </div>
          <div style={{marginBottom:12}}><Lbl>Subject Line *</Lbl><input style={inp()} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Exclusive B2B Opportunity for Your Brand ??"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><Lbl>Recipient List</Lbl><select style={inp()} value={selectedListId} onChange={e=>setSelectedListId(e.target.value)}><option value="">— Select a list —</option>{lists.map(l=><option key={l.id} value={l.id}>{l.name} ({(l.count||0).toLocaleString()}) · Best time: {l.best_time||"TBD"}</option>)}</select></div>
            <div><Lbl>Campaign Goal</Lbl><select style={inp()} value={campaignGoal} onChange={e=>setCampaignGoal(e.target.value)}>{GOALS.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</select></div>
          </div>
          <div style={{marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={aiDraftEmail} disabled={aiDrafting||!subject.trim()} style={{padding:"9px 18px",borderRadius:9,border:`1px solid ${C.gold}44`,background:`${C.gold}12`,color:aiDrafting||!subject.trim()?C.muted:C.gold,fontSize:12,fontWeight:700,cursor:aiDrafting||!subject.trim()?"not-allowed":"pointer"}}>{aiDrafting?"? Drafting…":"? AI Draft Email"}</button>
            <span style={{fontSize:10,color:C.muted}}>Claude writes a personalized email using your target market data</span>
          </div>
          <div style={{marginBottom:12}}><Lbl>Email Body (HTML)</Lbl><textarea value={bodyHtml} onChange={e=>setBodyHtml(e.target.value)} rows={10} style={inp({resize:"vertical",lineHeight:1.6,fontFamily:"monospace",fontSize:11})} placeholder={"<p>Hi {{first_name}},</p>\n<p>...</p>"}/></div>
          {bodyHtml&&(<div style={{marginBottom:12,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}><div style={{background:C.bg2,padding:"8px 14px",fontSize:9,color:C.muted,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>?? Preview</div><div style={{background:"#fff",padding:20,maxHeight:260,overflowY:"auto"}}><div style={{fontFamily:"Arial,sans-serif",fontSize:14,color:"#333",lineHeight:1.7}} dangerouslySetInnerHTML={{__html:bodyHtml.replace(/\{\{first_name\}\}/g,"Juan").replace(/\{\{company\}\}/g,"Bloom Corp")}}/></div></div>)}
          <div style={{marginBottom:16}}><Lbl>Send Options</Lbl><div style={{display:"flex",gap:8,marginBottom:10}}>{[["now","Send Now"],["schedule","Schedule"]].map(([v,l])=>(<button key={v} onClick={()=>setScheduleMode(v)} style={{padding:"7px 18px",borderRadius:8,border:`1px solid ${scheduleMode===v?C.gold:C.border}`,background:scheduleMode===v?`${C.gold}18`:"transparent",color:scheduleMode===v?C.gold:C.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>))}</div>{scheduleMode==="schedule"&&<input type="datetime-local" style={inp({maxWidth:260})} value={scheduleAt} onChange={e=>setScheduleAt(e.target.value)}/>}</div>
          <div style={{display:"flex",gap:10}}><GoldBtn onClick={sendCampaign} disabled={sendBusy} style={{flex:1,padding:"11px 20px"}}>{sendBusy?"? Sending…":scheduleMode==="now"?"?? Send Campaign":"? Schedule Campaign"}</GoldBtn><button onClick={saveDraft} style={{padding:"9px 20px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>Save Draft</button></div>
        </div>
      )}

      {tab==="lists"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,marginBottom:14}}>Subscriber Lists</div>
            {lists.map(l=>(<div key={l.id} style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:11,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:8,background:`${C.violet}22`,border:`1px solid ${C.violet}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>??</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:12}}>{l.name}</div><div style={{fontSize:10,color:C.muted}}>{l.industry} · Avg open: {l.avg_open||"—"}% · Best send: {l.best_time||"TBD"}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:C.gold}}>{(l.count||0).toLocaleString()}</div><div style={{fontSize:9,color:C.muted}}>contacts</div></div><button onClick={()=>{setSelectedListId(l.id);setTab("compose");notify(`List "${l.name}" selected`);}} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${C.gold}44`,background:`${C.gold}12`,color:C.gold,fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0}}>Use ?</button></div>))}
          </div>
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",height:"fit-content",borderTop:`2px solid ${C.gold}`}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:C.gold,marginBottom:14}}>Add Subscriber</div>
            <div style={{marginBottom:8}}><Lbl>Email *</Lbl><input style={inp()} value={newSubEmail} onChange={e=>setNewSubEmail(e.target.value)} placeholder="ceo@company.ph"/></div>
            <div style={{marginBottom:8}}><Lbl>Name</Lbl><input style={inp()} value={newSubName} onChange={e=>setNewSubName(e.target.value)} placeholder="Juan dela Cruz"/></div>
            <div style={{marginBottom:10}}><Lbl>Company</Lbl><input style={inp()} value={newSubCompany} onChange={e=>setNewSubCompany(e.target.value)} placeholder="Bloom Corp"/></div>
            <div style={{marginBottom:14}}><Lbl>List</Lbl><select style={inp()} value={newSubListId} onChange={e=>setNewSubListId(e.target.value)}>{lists.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
            <GoldBtn onClick={addSubscriber} disabled={addingContact} style={{width:"100%"}}>{addingContact?"Adding…":"+ Add Contact"}</GoldBtn>
          </div>
        </div>
      )}

      {tab==="analytics"&&(
        <div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,marginBottom:16}}>Email Analytics</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"1px"}}>Open Rates by Campaign</div>
              {campaigns.filter(c=>c.open_rate).map(c=>(<div key={c.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180}}>{c.name}</span><span style={{fontSize:10,fontWeight:700,color:C.green,flexShrink:0,marginLeft:8}}>{c.open_rate}%</span></div><div style={{height:5,background:C.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(c.open_rate,100)}%`,background:`linear-gradient(90deg,${C.green},${C.cyan})`,borderRadius:3}}/></div></div>))}
              {!campaigns.filter(c=>c.open_rate).length&&<div style={{color:C.muted,fontSize:12}}>No sent campaigns yet.</div>}
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"1px"}}>Revenue Attribution</div>
              {campaigns.filter(c=>c.revenue_attributed).map(c=>(<div key={c.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180}}>{c.name}</span><span style={{fontSize:10,fontWeight:700,color:C.gold,flexShrink:0,marginLeft:8}}>?{(c.revenue_attributed/1000).toFixed(0)}K</span></div><div style={{height:5,background:C.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min((c.revenue_attributed/totalRevenue)*100,100)}%`,background:`linear-gradient(90deg,${C.gold3},${C.gold})`,borderRadius:3}}/></div></div>))}
            </div>
          </div>
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px"}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>PH B2B Email Benchmarks vs Your Performance</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {[{label:"Open Rate",yours:`${avgOpen}%`,bench:"38.5%",col:C.gold,ahead:parseFloat(avgOpen)>38.5},{label:"Click Rate",yours:`${avgClick}%`,bench:"12.4%",col:C.cyan,ahead:parseFloat(avgClick)>12.4},{label:"Unsubscribe",yours:"0.2%",bench:"0.4%",col:C.green,ahead:true},{label:"AI Score Avg",yours:Math.round(campaigns.filter(c=>c.ai_score).reduce((a,c)=>a+(c.ai_score||0),0)/Math.max(campaigns.filter(c=>c.ai_score).length,1)).toString(),bench:"75",col:C.violet,ahead:true}].map(b=>(<div key={b.label} style={{background:C.bg2,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`}}><div style={{fontSize:9,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>{b.label}</div><div style={{fontSize:18,fontWeight:700,color:b.col}}>{b.yours}</div><div style={{fontSize:9,color:C.muted,marginTop:2}}>Benchmark: {b.bench}</div><div style={{fontSize:9,marginTop:3,color:b.ahead?C.green:C.red,fontWeight:700}}>{b.ahead?"? Above avg":"? Below avg"}</div></div>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientMetricsModule({ activeBrandId, activeBrandName, notify, session: _session, role: _role }) {
  const [tab,setTab]=useState("overview");
  const [loading,setLoading]=useState(false);
  const [metrics,setMetrics]=useState(null);
  const [monthlyData,setMonthlyData]=useState([]);
  const [platformData,setPlatformData]=useState([]);
  const [conversionData,setConversionData]=useState([]);

  const mockMetrics={totalReach:284200,totalEngagement:19880,totalLeads:8064,totalCustomers:940,totalRevenue:2840000,avgOrderValue:3021,reachGrowth:18.4,engagementGrowth:24.1,leadGrowth:31.2,customerGrowth:12.8,revenueGrowth:22.5,aovGrowth:8.2,conversionRate:0.33,responseTime:4.2,csat:4.7,brandScore:91,aiReplies:1284,automationRate:78};
  const mockMonthly=[{month:"Oct",reach:38200,leads:920,revenue:312000},{month:"Nov",reach:42100,leads:1040,revenue:358000},{month:"Dec",reach:51400,leads:1380,revenue:485000},{month:"Jan",reach:48200,leads:1220,revenue:421000},{month:"Feb",reach:54900,leads:1590,revenue:523000},{month:"Mar",reach:62800,leads:1840,revenue:598000}];
  const mockPlatform=[{platform:"Facebook",reach:124000,engagement:8820,leads:3240,color:C.cyan},{platform:"Instagram",reach:84200,engagement:6140,leads:2180,color:C.rose},{platform:"TikTok",reach:52400,engagement:3920,leads:1640,color:C.violet},{platform:"Shopee",reach:18600,engagement:860,leads:720,color:C.amber},{platform:"Viber",reach:5000,engagement:140,leads:284,color:C.green}];
  const mockConversion=[{stage:"Reach",val:284200},{stage:"Engaged",val:19880},{stage:"Leads",val:8064},{stage:"Prospects",val:2820},{stage:"Customers",val:940}];

  useEffect(()=>{
    setLoading(true);
    setTimeout(()=>{setMetrics(mockMetrics);setMonthlyData(mockMonthly);setPlatformData(mockPlatform);setConversionData(mockConversion);setLoading(false);},400);
  },[activeBrandId]);

  const TABS=[{id:"overview",label:"Overview"},{id:"performance",label:"Performance"},{id:"platforms",label:"By Platform"},{id:"ai",label:"AI Impact"}];

  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700}}>My Metrics</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{activeBrandName||"All Brands"} · March 2026 · Live Data</div></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{setLoading(true);setTimeout(()=>{setMetrics(mockMetrics);setMonthlyData(mockMonthly);setPlatformData(mockPlatform);setConversionData(mockConversion);setLoading(false);},400);notify("Metrics refreshed!");}} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:11,cursor:"pointer"}}>? Refresh</button>
          <GoldBtn onClick={()=>notify("Report exported!")} style={{padding:"6px 14px",fontSize:11}}>Export Report</GoldBtn>
        </div>
      </div>
      <div style={{display:"flex",gap:4,borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
        {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 16px",background:"transparent",border:"none",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent",color:tab===t.id?C.gold:C.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.label}</button>))}
      </div>
      {loading&&<div style={{color:C.muted,fontSize:12,padding:"20px 0"}}>Loading metrics…</div>}
      {!loading&&metrics&&tab==="overview"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
            {[{label:"Total Reach",val:metrics.totalReach.toLocaleString(),change:`+${metrics.reachGrowth}%`,up:true,icon:"??",col:C.gold},{label:"Engagement",val:metrics.totalEngagement.toLocaleString(),change:`+${metrics.engagementGrowth}%`,up:true,icon:"??",col:C.cyan},{label:"Leads Generated",val:metrics.totalLeads.toLocaleString(),change:`+${metrics.leadGrowth}%`,up:true,icon:"??",col:C.violet},{label:"Customers",val:metrics.totalCustomers.toLocaleString(),change:`+${metrics.customerGrowth}%`,up:true,icon:"?",col:C.green},{label:"Revenue",val:`?${(metrics.totalRevenue/1000000).toFixed(2)}M`,change:`+${metrics.revenueGrowth}%`,up:true,icon:"??",col:C.amber},{label:"Avg Order Value",val:`?${metrics.avgOrderValue.toLocaleString()}`,change:`+${metrics.aovGrowth}%`,up:true,icon:"??",col:C.rose}].map(k=>(<GoldKPI key={k.label} {...k} color={k.col}/>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>
              <SectionHead sub="6-month trend">Revenue & Leads Growth</SectionHead>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <defs><linearGradient id="mr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="month" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis yAxisId="left" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`?${(v/1000).toFixed(0)}K`}/>
                  <YAxis yAxisId="right" orientation="right" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TooltipBox/>}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke={C.gold} fill="url(#mr)" strokeWidth={2}/>
                  <Line yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke={C.violet} strokeWidth={2} dot={{fill:C.violet,r:3}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>
              <SectionHead sub="Lead to customer">Conversion Funnel</SectionHead>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:4}}>
                {conversionData.map((c,i)=>{
                  const pct=((c.val/conversionData[0].val)*100).toFixed(1);
                  const colors=[C.gold,C.amber,C.violet,C.cyan,C.green];
                  return (<div key={i}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.muted}}>{c.stage}</span><span style={{fontWeight:700,color:colors[i],fontSize:11}}>{c.val.toLocaleString()} ({pct}%)</span></div><div style={{height:8,background:C.bg2,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:colors[i],borderRadius:4,transition:"width 0.8s ease"}}/></div></div>);
                })}
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[{label:"Brand Score",val:metrics.brandScore,max:100,unit:"/100",col:C.gold},{label:"CSAT Score",val:metrics.csat,max:5,unit:"/5",col:C.green},{label:"Avg Response",val:metrics.responseTime,max:24,unit:"hrs",col:C.cyan},{label:"Automation Rate",val:metrics.automationRate,max:100,unit:"%",col:C.violet}].map(m=>(<div key={m.label} style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",borderTop:`2px solid ${m.col}`}}><div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{m.label}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,color:m.col,lineHeight:1,marginBottom:4}}>{m.val}<span style={{fontSize:14,color:C.muted}}>{m.unit}</span></div><div style={{height:5,background:C.bg2,borderRadius:3,overflow:"hidden",marginTop:8}}><div style={{height:"100%",width:`${(m.val/m.max)*100}%`,background:m.col,borderRadius:3}}/></div></div>))}
          </div>
        </div>
      )}
      {!loading&&metrics&&tab==="platforms"&&(
        <div>
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
            <SectionHead sub="Reach and engagement breakdown">Platform Performance</SectionHead>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="platform" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<TooltipBox/>}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Bar dataKey="reach" name="Reach" fill={C.gold} radius={[4,4,0,0]}/>
                <Bar dataKey="engagement" name="Engagement" fill={C.cyan} radius={[4,4,0,0]}/>
                <Bar dataKey="leads" name="Leads" fill={C.violet} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            {platformData.map(p=>(<div key={p.platform} style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",borderTop:`2px solid ${p.color}`}}><div style={{fontWeight:700,fontSize:13,marginBottom:10}}>{p.platform}</div><div style={{fontSize:11,color:C.muted,marginBottom:2}}>Reach: <span style={{color:C.gold,fontWeight:700}}>{p.reach.toLocaleString()}</span></div><div style={{fontSize:11,color:C.muted,marginBottom:2}}>Engagement: <span style={{color:C.cyan,fontWeight:700}}>{p.engagement.toLocaleString()}</span></div><div style={{fontSize:11,color:C.muted}}>Leads: <span style={{color:p.color,fontWeight:700}}>{p.leads.toLocaleString()}</span></div></div>))}
          </div>
        </div>
      )}
      {!loading&&metrics&&tab==="ai"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
            <GoldKPI label="AI Replies Sent" value={metrics.aiReplies.toLocaleString()} change="+34% MoM" up icon="?" color={C.gold}/>
            <GoldKPI label="Automation Rate" value={`${metrics.automationRate}%`} change="of messages handled" up icon="?" color={C.violet}/>
            <GoldKPI label="Avg Response Time" value={`${metrics.responseTime}h`} change="from 8.4h last month" up icon="?" color={C.green}/>
          </div>
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px",borderTop:`2px solid ${C.gold}`}}>
            <SectionHead sub="How Hermes AI impacted your brand">AI Impact Summary</SectionHead>
            {[{label:"Hours Saved by AI Automation",val:"284 hrs",icon:"?",detail:"Based on 4 min avg response time × AI replies",col:C.gold},{label:"Revenue from AI-Assisted Leads",val:"?820,000",icon:"??",detail:"Leads closed within 48hrs of AI qualification",col:C.green},{label:"Customer Satisfaction (CSAT)",val:`${metrics.csat}/5.0`,icon:"?",detail:"Based on post-conversation surveys",col:C.amber},{label:"Messages Handled Without Human",val:`${metrics.automationRate}%`,icon:"?",detail:"AI resolved without agent escalation",col:C.violet}].map(item=>(<div key={item.label} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:`1px solid ${C.border}`}}><div style={{width:44,height:44,borderRadius:10,background:`${item.col}18`,border:`1px solid ${item.col}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.icon}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{item.label}</div><div style={{fontSize:11,color:C.muted}}>{item.detail}</div></div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:item.col,flexShrink:0}}>{item.val}</div></div>))}
          </div>
        </div>
      )}
      {!loading&&metrics&&tab==="performance"&&(
        <div>
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
            <SectionHead sub="Monthly trend">Reach Over Time</SectionHead>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData}>
                <defs><linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="month" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                <Tooltip content={<TooltipBox/>}/>
                <Area type="monotone" dataKey="reach" name="Reach" stroke={C.gold} fill="url(#reachGrad)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px"}}>
            <SectionHead sub="Goal vs actual">KPI Targets</SectionHead>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[{label:"Monthly Reach Target",actual:62800,target:60000,col:C.gold,unit:""},{label:"Lead Generation",actual:1840,target:1500,col:C.violet,unit:""},{label:"Revenue Target",actual:598000,target:550000,col:C.green,unit:"?"},{label:"Conversion Rate",actual:0.33,target:0.3,col:C.cyan,unit:"%"}].map(k=>{
                const pct=Math.min(Math.round((k.actual/k.target)*100),120);const onTrack=k.actual>=k.target;
                return (<div key={k.label} style={{background:C.bg2,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:10,color:C.muted}}>{k.label}</span><span style={{fontSize:10,fontWeight:700,color:onTrack?C.green:C.red}}>{onTrack?"? On Track":"? Behind"}</span></div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:k.col,marginBottom:4}}>{k.unit}{k.actual.toLocaleString()}<span style={{fontSize:11,color:C.dim}}> / {k.unit}{k.target.toLocaleString()}</span></div><div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:onTrack?k.col:C.red,borderRadius:3}}/></div><div style={{fontSize:9,color:C.muted,marginTop:3}}>{pct}% of target</div></div>);
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientAdsResultsModule({ activeBrandId: _activeBrandId, activeBrandName, notify, session: _session }) {
  const [period,setPeriod]=useState("march");
  const mockCampaigns=[
    {id:1,name:"Beauty Launch — Q1 2026",platform:"facebook",status:"active",spend:28400,impressions:842000,reach:624000,clicks:18240,leads:1284,sales:342,cpc:1.56,cpm:33.7,ctr:2.17,cpl:22.12,roas:4.8,goal:"leads",thumbnail:"??"},
    {id:2,name:"Bloom Home — Spring Collection",platform:"instagram",status:"active",spend:18600,impressions:624000,reach:442000,clicks:12480,leads:840,sales:218,cpc:1.49,cpm:29.8,ctr:2.00,cpl:22.14,roas:3.9,goal:"sales",thumbnail:"??"},
    {id:3,name:"Kids Essentials — Mom Targeting",platform:"facebook",status:"completed",spend:12200,impressions:384000,reach:284000,clicks:8640,leads:624,sales:164,cpc:1.41,cpm:31.8,ctr:2.25,cpl:19.55,roas:5.2,goal:"leads",thumbnail:"??"},
    {id:4,name:"TikTok Awareness — Gen Z",platform:"tiktok",status:"active",spend:9800,impressions:1240000,reach:984000,clicks:24800,leads:480,sales:98,cpc:0.40,cpm:7.9,ctr:2.00,cpl:20.42,roas:2.8,goal:"awareness",thumbnail:"??"},
    {id:5,name:"Viber Broadcast — Repeat Buyers",platform:"viber",status:"completed",spend:4200,impressions:18400,reach:18400,clicks:2840,leads:284,sales:124,cpc:1.48,cpm:228.3,ctr:15.43,cpl:14.79,roas:8.4,goal:"retention",thumbnail:"??"},
  ];
  const STATUS_COLOR={active:C.green,completed:C.muted,paused:C.amber};
  const totalSpend=mockCampaigns.reduce((a,c)=>a+c.spend,0);
  const totalLeads=mockCampaigns.reduce((a,c)=>a+c.leads,0);
  const totalSales=mockCampaigns.reduce((a,c)=>a+c.sales,0);
  const totalReach=mockCampaigns.reduce((a,c)=>a+c.reach,0);
  const avgROAS=(mockCampaigns.reduce((a,c)=>a+c.roas,0)/mockCampaigns.length).toFixed(1);
  const [sel,setSel]=useState(mockCampaigns[0]);

  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700}}>Ad Results</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{activeBrandName||"All Brands"} · Live Performance</div></div>
        <div style={{display:"flex",gap:8}}>
          {["march","february","q1"].map(p=>(<button key={p} onClick={()=>setPeriod(p)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${period===p?C.gold:C.border}`,background:period===p?`${C.gold}18`:"transparent",color:period===p?C.gold:C.muted,fontSize:10,fontWeight:700,cursor:"pointer",textTransform:"capitalize"}}>{p==="q1"?"Q1 2026":p==="march"?"Mar 2026":"Feb 2026"}</button>))}
          <GoldBtn onClick={()=>notify("Report exported!")} style={{padding:"6px 14px",fontSize:11}}>Export</GoldBtn>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:18}}>
        {[{label:"Total Ad Spend",val:`?${totalSpend.toLocaleString()}`,col:C.gold,icon:"??"},{label:"Total Reach",val:`${(totalReach/1000).toFixed(0)}K`,col:C.cyan,icon:"??"},{label:"Leads Generated",val:totalLeads.toLocaleString(),col:C.violet,icon:"??"},{label:"Sales Closed",val:totalSales.toLocaleString(),col:C.green,icon:"?"},{label:"Avg ROAS",val:`${avgROAS}×`,col:C.amber,icon:"?"}].map(k=>(<div key={k.label} style={{background:C.bg3,border:`1px solid ${C.border}`,borderTop:`2px solid ${k.col}`,borderRadius:11,padding:"12px 14px"}}><div style={{fontSize:9,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>{k.icon} {k.label}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:k.col,lineHeight:1}}>{k.val}</div></div>))}
      </div>
      <div style={{display:"flex",gap:14}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,marginBottom:12}}>Campaign Results</div>
          {mockCampaigns.map(c=>(<div key={c.id} onClick={()=>setSel(c)} style={{background:sel?.id===c.id?C.bg4:C.bg3,border:`1px solid ${sel?.id===c.id?C.border2:C.border}`,borderRadius:11,padding:"14px 16px",marginBottom:8,cursor:"pointer",borderLeft:`3px solid ${STATUS_COLOR[c.status]||C.muted}`,transition:"all 0.12s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:22}}>{c.thumbnail}</div>
                <div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{c.name}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{c.platform.charAt(0).toUpperCase()+c.platform.slice(1)} · <span style={{color:STATUS_COLOR[c.status]}}>{c.status}</span></div></div>
              </div>
              <div style={{textAlign:"right"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:C.gold}}>?{c.spend.toLocaleString()}</div><div style={{fontSize:9,color:C.muted}}>spend</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
              {[["Reach",`${(c.reach/1000).toFixed(0)}K`,C.gold],["Leads",c.leads.toLocaleString(),C.violet],["Sales",c.sales,C.green],["CTR",`${c.ctr}%`,C.cyan],["CPL",`?${c.cpl}`,C.amber],["ROAS",`${c.roas}×`,c.roas>=4?C.green:c.roas>=2.5?C.amber:C.red]].map(([label,val,col])=>(<div key={label} style={{background:C.bg2,borderRadius:7,padding:"7px 8px"}}><div style={{fontSize:8,color:C.muted,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:2}}>{label}</div><div style={{fontSize:12,fontWeight:700,color:col}}>{val}</div></div>))}
            </div>
          </div>))}
        </div>
        {sel&&(
          <div style={{width:280,flexShrink:0}}>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",position:"sticky",top:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:C.gold,marginBottom:14}}>{sel.name}</div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:8}}>Performance Metrics</div>
                {[["Total Spend",`?${sel.spend.toLocaleString()}`,C.gold],["Impressions",sel.impressions.toLocaleString(),C.muted],["Reach",sel.reach.toLocaleString(),C.cyan],["Clicks",sel.clicks.toLocaleString(),C.text],["Leads",sel.leads.toLocaleString(),C.violet],["Sales",sel.sales.toLocaleString(),C.green],["CPC",`?${sel.cpc}`,C.muted],["CPM",`?${sel.cpm}`,C.muted],["CTR",`${sel.ctr}%`,C.cyan],["CPL",`?${sel.cpl}`,C.amber]].map(([label,val,col])=>(<div key={label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:11}}><span style={{color:C.muted}}>{label}</span><span style={{fontWeight:700,color:col}}>{val}</span></div>))}
              </div>
              <div style={{background:sel.roas>=4?`${C.green}12`:`${C.amber}12`,border:`1px solid ${sel.roas>=4?C.green:C.amber}33`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                <div style={{fontSize:9,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"1px"}}>Return on Ad Spend</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:sel.roas>=4?C.green:sel.roas>=2.5?C.amber:C.red}}>{sel.roas}×</div>
                <div style={{fontSize:10,color:C.muted}}>For every ?1 spent</div>
                <div style={{marginTop:4,fontSize:10,fontWeight:700,color:sel.roas>=4?C.green:sel.roas>=2.5?C.amber:C.red}}>{sel.roas>=4?"?? Excellent ROAS":sel.roas>=2.5?"? Good ROAS":"?? Needs Optimization"}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SocialAdsModule({ activeBrandId, activeBrandName, notify, session: _session }) {
  const [tab,setTab]=useState("create");
  const [adType,setAdType]=useState("awareness");
  const [platform,setPlatform]=useState("facebook");
  const [objective,setObjective]=useState("reach");
  const [budget,setBudget]=useState("500");
  const [duration,setDuration]=useState("7");
  const [headline,setHeadline]=useState("");
  const [body,setBody]=useState("");
  const [cta,setCta]=useState("Learn More");
  const [targetAge]=useState([18,45]);
  const [targetGender,setTargetGender]=useState("all");
  const [targetLocation,setTargetLocation]=useState("Metro Manila");
  const [targetInterests,setTargetInterests]=useState("beauty, skincare, fashion");
  const [aiGen,setAiGen]=useState(false);
  const [preview,setPreview]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [campaigns,setCampaigns]=useState([]);

  const mockCampaigns=[
    {id:"sa1",name:"Beauty Launch — Q1",platform:"facebook",status:"active",budget:28400,spent:21200,impressions:842000,clicks:18240,leads:1284,roas:4.8,startDate:"Mar 1",endDate:"Mar 31"},
    {id:"sa2",name:"TikTok Spring Drop",platform:"tiktok",status:"active",budget:15000,spent:8400,impressions:1240000,clicks:24800,leads:480,roas:2.8,startDate:"Mar 15",endDate:"Mar 31"},
    {id:"sa3",name:"Kids Essentials",platform:"facebook",status:"completed",budget:12200,spent:12200,impressions:384000,clicks:8640,leads:624,roas:5.2,startDate:"Feb 1",endDate:"Feb 28"},
  ];
  useEffect(()=>setCampaigns(mockCampaigns),[]);

  const AD_TYPES=[{id:"awareness",label:"Brand Awareness",icon:"??"},{id:"leads",label:"Lead Generation",icon:"??"},{id:"sales",label:"Direct Sales",icon:"??"},{id:"traffic",label:"Website Traffic",icon:"??"},{id:"engagement",label:"Engagement",icon:"??"},{id:"retention",label:"Customer Retention",icon:"??"}];
  const OBJECTIVES={facebook:["reach","traffic","lead_generation","conversions","engagement","video_views"],instagram:["reach","profile_visits","website_clicks","product_catalogue_sales"],tiktok:["reach","video_views","website_clicks","conversions"],shopee:["product_views","add_to_cart","sales"]};
  const CTA_OPTIONS=["Learn More","Shop Now","Sign Up","Get Quote","Contact Us","Book Now","Download","Apply Now"];
  const INTEREST_SUGGESTIONS=["beauty","skincare","fashion","home decor","baby products","food & dining","health","fitness","technology","online shopping","travel","education"];

  const generateAdCopy=async()=>{
    if(!activeBrandName){notify("Select a brand first");return;}
    setAiGen(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`Write a high-converting ${platform} ad for ${activeBrandName} (Philippine brand).\n\nAd Type: ${AD_TYPES.find(a=>a.id===adType)?.label}\nObjective: ${objective}\nBudget: ?${budget}/day × ${duration} days\nTarget: ${targetGender!="all"?targetGender:"All genders"}, ${targetAge[0]}-${targetAge[1]} y/o, ${targetLocation}, interests: ${targetInterests}\n\nReturn ONLY:\nHEADLINE: [max 40 chars]\nBODY: [2-3 compelling sentences, Taglish OK, include emoji]\n\nMake it punchy, culturally relevant to Filipino consumers, with clear value proposition.`}]})});
      const d=await res.json();const text=d.content?.[0]?.text||"";
      const hMatch=text.match(/HEADLINE:\s*(.+)/);const bMatch=text.match(/BODY:\s*([\s\S]+)/);
      if(hMatch)setHeadline(hMatch[1].trim().replace(/^"|"$/g,""));
      if(bMatch)setBody(bMatch[1].trim().replace(/^"|"$/g,""));
      notify("? AI copy generated!");
    }catch{notify("? AI generation failed");}
    setAiGen(false);
  };

  const createCampaign=async()=>{
    if(!headline.trim()||!body.trim()){notify("Headline and body copy are required");return;}if(!activeBrandId){notify("Select a brand first");return;}
    setSubmitting(true);await new Promise(r=>setTimeout(r,800));
    const newC={id:`sa${Date.now()}`,name:`${headline.slice(0,30)}…`,platform,status:"draft",budget:parseInt(budget)*parseInt(duration),spent:0,impressions:0,clicks:0,leads:0,roas:0,startDate:"Pending",endDate:`${duration}d`};
    setCampaigns(p=>[newC,...p]);setTab("campaigns");notify("? Ad campaign created!");
    setHeadline("");setBody("");setSubmitting(false);
  };

  const estimatedReach=Math.round((parseInt(budget)||500)*(parseInt(duration)||7)*28.4);
  const estimatedLeads=Math.round(estimatedReach*0.0045);

  const inp=(x={})=>({background:C.bg4,border:`1px solid ${C.border2}`,borderRadius:9,padding:"8px 12px",color:C.text,fontSize:12,width:"100%",...x});
  const TABS=[{id:"create",label:"Create Ad"},{id:"campaigns",label:"Live Campaigns"},{id:"insights",label:"Audience Insights"}];

  return (
    <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700}}>Social Ads</div>
        <div style={{fontSize:11,color:C.muted}}>{activeBrandName||"All Brands"} · Meta & TikTok Ads Manager</div>
      </div>
      <div style={{display:"flex",gap:4,borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
        {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 16px",background:"transparent",border:"none",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent",color:tab===t.id?C.gold:C.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.label}</button>))}
      </div>

      {tab==="create"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,marginBottom:16}}>Campaign Setup</div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
              <div style={{fontSize:10,color:C.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Campaign Type</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {AD_TYPES.map(a=>(<button key={a.id} onClick={()=>setAdType(a.id)} style={{padding:"10px 12px",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,border:`1px solid ${adType===a.id?C.gold:C.border}`,background:adType===a.id?`${C.gold}18`:"transparent",color:adType===a.id?C.gold:C.muted,display:"flex",alignItems:"center",gap:6}}><span>{a.icon}</span>{a.label}</button>))}
              </div>
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
              <div style={{fontSize:10,color:C.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Platform & Objective</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Platform</label>
                  <select style={inp()} value={platform} onChange={e=>setPlatform(e.target.value)}>
                    {["facebook","instagram","tiktok","shopee"].map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                  </select>
                </div>
                <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Objective</label>
                  <select style={inp()} value={objective} onChange={e=>setObjective(e.target.value)}>
                    {(OBJECTIVES[platform]||[]).map(o=><option key={o} value={o}>{o.replace(/_/g," ")}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Daily Budget (?)</label><input style={inp()} type="number" value={budget} onChange={e=>setBudget(e.target.value)} min="100"/></div>
                <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Duration (days)</label><input style={inp()} type="number" value={duration} onChange={e=>setDuration(e.target.value)} min="1" max="90"/></div>
              </div>
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
              <div style={{fontSize:10,color:C.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Audience Targeting</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Location</label><input style={inp()} value={targetLocation} onChange={e=>setTargetLocation(e.target.value)}/></div>
                <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Gender</label>
                  <select style={inp()} value={targetGender} onChange={e=>setTargetGender(e.target.value)}>
                    <option value="all">All Genders</option><option value="female">Female</option><option value="male">Male</option>
                  </select>
                </div>
              </div>
              <div style={{marginBottom:12}}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Interests</label><input style={inp()} value={targetInterests} onChange={e=>setTargetInterests(e.target.value)} placeholder="beauty, skincare, fashion, home…"/><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:7}}>{INTEREST_SUGGESTIONS.map(i=>(<button key={i} onClick={()=>setTargetInterests(prev=>prev.includes(i)?prev:prev?`${prev}, ${i}`:i)} style={{padding:"2px 8px",borderRadius:5,border:`1px solid ${targetInterests.includes(i)?C.gold:C.border}`,background:targetInterests.includes(i)?`${C.gold}18`:"transparent",color:targetInterests.includes(i)?C.gold:C.muted,fontSize:9,cursor:"pointer"}}>{i}</button>))}</div></div>
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:10,color:C.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>Ad Creative</div>
                <button onClick={generateAdCopy} disabled={aiGen} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${C.gold}44`,background:`${C.gold}12`,color:aiGen?C.muted:C.gold,fontSize:11,fontWeight:700,cursor:aiGen?"not-allowed":"pointer"}}>{aiGen?"? Writing…":"? AI Generate Copy"}</button>
              </div>
              <div style={{marginBottom:10}}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Headline * (max 40 chars)</label><input style={inp()} maxLength={40} value={headline} onChange={e=>setHeadline(e.target.value)} placeholder="Unlock Your Brand's Full Potential ??"/><div style={{fontSize:9,color:C.muted,marginTop:3}}>{headline.length}/40 chars</div></div>
              <div style={{marginBottom:10}}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Ad Body *</label><textarea style={inp({resize:"vertical"})} rows={4} value={body} onChange={e=>setBody(e.target.value)} placeholder="Reach thousands of customers with Hermes AI — the smartest commerce platform for Filipino brands. ????"/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10}}>
                <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Call to Action</label>
                  <select style={inp()} value={cta} onChange={e=>setCta(e.target.value)}>{CTA_OPTIONS.map(o=><option key={o}>{o}</option>)}</select>
                </div>
                <div style={{display:"flex",alignItems:"flex-end"}}>
                  <button onClick={()=>setPreview(p=>!p)} style={{padding:"8px 14px",borderRadius:9,border:`1px solid ${C.border}`,background:preview?`${C.gold}18`:"transparent",color:preview?C.gold:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>?? {preview?"Hide":"Preview"}</button>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <GoldBtn onClick={createCampaign} disabled={submitting} style={{flex:1,padding:"11px 20px"}}>{submitting?"? Creating…":"?? Launch Campaign"}</GoldBtn>
              <button onClick={()=>{notify("Draft saved!");}} style={{padding:"9px 20px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>Save Draft</button>
            </div>
          </div>
          <div>
            <div style={{position:"sticky",top:0}}>
              <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px",marginBottom:14}}>
                <div style={{fontSize:10,color:C.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>?? Forecast</div>
                {[{label:"Est. Reach",val:estimatedReach.toLocaleString(),col:C.gold},{label:"Est. Leads",val:`${estimatedLeads.toLocaleString()}`,col:C.violet},{label:"Total Budget",val:`?${((parseInt(budget)||500)*(parseInt(duration)||7)).toLocaleString()}`,col:C.amber},{label:"CPL Estimate",val:`?${estimatedLeads>0?Math.round((parseInt(budget)||500)*(parseInt(duration)||7)/estimatedLeads):0}`,col:C.cyan}].map(f=>(<div key={f.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:11}}><span style={{color:C.muted}}>{f.label}</span><span style={{fontWeight:700,color:f.col}}>{f.val}</span></div>))}
              </div>
              {preview&&headline&&(
                <div style={{background:"#fff",borderRadius:14,padding:16,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:8,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:"1px"}}>{platform} Ad Preview</div>
                  <div style={{background:"#f0f2f5",height:160,borderRadius:8,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>??</div>
                  <div style={{fontFamily:"Arial,sans-serif"}}><div style={{fontWeight:700,fontSize:13,color:"#1c1e21",marginBottom:4}}>{headline||"Your Headline Here"}</div><div style={{fontSize:11,color:"#65676b",lineHeight:1.5,marginBottom:10}}>{body||"Your ad body copy here."}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:9,color:"#65676b"}}>exponify.ph</span><button style={{padding:"6px 16px",borderRadius:6,background:"#1877f2",color:"white",border:"none",fontSize:12,fontWeight:700}}>{cta}</button></div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab==="campaigns"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700}}>Live & Recent Campaigns</div>
            <GoldBtn onClick={()=>setTab("create")} style={{padding:"7px 16px",fontSize:11}}>+ New Ad</GoldBtn>
          </div>
          {campaigns.map(c=>(<div key={c.id} style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",marginBottom:10,borderLeft:`3px solid ${c.status==="active"?C.green:C.muted}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div><div style={{fontWeight:700,fontSize:13}}>{c.name}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{c.platform.charAt(0).toUpperCase()+c.platform.slice(1)} · <span style={{color:c.status==="active"?C.green:C.muted}}>{c.status}</span> · {c.startDate} — {c.endDate}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:C.gold}}>?{c.spent.toLocaleString()}<span style={{fontSize:11,color:C.muted}}> / ?{c.budget.toLocaleString()}</span></div><div style={{height:4,background:C.bg2,borderRadius:2,width:100,overflow:"hidden",marginTop:4}}><div style={{height:"100%",width:`${Math.min((c.spent/c.budget)*100,100)}%`,background:GOLD_GRADIENT,borderRadius:2}}/></div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
              {[["Impressions",c.impressions.toLocaleString(),C.muted],["Clicks",c.clicks.toLocaleString(),C.cyan],["Leads",c.leads.toLocaleString(),C.violet],["ROAS",`${c.roas}×`,c.roas>=4?C.green:C.amber],["Status",c.status,c.status==="active"?C.green:C.muted]].map(([l,v,col])=>(<div key={l} style={{background:C.bg2,borderRadius:7,padding:"8px 10px"}}><div style={{fontSize:8,color:C.muted,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.8px"}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:col}}>{v}</div></div>))}
            </div>
          </div>))}
        </div>
      )}

      {tab==="insights"&&(
        <div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,marginBottom:16}}>Audience Insights — Philippine Market</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:16}}>
            {[{label:"Best Platform",val:"Facebook",sub:"38% of PH internet users",icon:"??",col:C.cyan},{label:"Best Time",val:"Tue 10AM",sub:"Highest engagement PH",icon:"?",col:C.gold},{label:"Top Gender",val:"Female 62%",sub:"Core beauty audience",icon:"??",col:C.rose},{label:"Best Age",val:"25–34",sub:"Highest spend intent",icon:"??",col:C.violet}].map(k=>(<div key={k.label} style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",borderTop:`2px solid ${k.col}`}}><div style={{fontSize:18,marginBottom:8}}>{k.icon}</div><div style={{fontSize:9,color:C.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:"1px"}}>{k.label}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:k.col,marginBottom:3}}>{k.val}</div><div style={{fontSize:10,color:C.muted}}>{k.sub}</div></div>))}
          </div>
          <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",marginBottom:14}}>
            <SectionHead sub="PH CPM benchmarks by platform">Cost Benchmarks — Philippines</SectionHead>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[{platform:"Facebook",cpm:"?28–42",cpc:"?1.20–1.80",cpl:"?18–28",col:C.cyan},{platform:"Instagram",cpm:"?32–48",cpc:"?1.40–2.10",cpl:"?22–34",col:C.rose},{platform:"TikTok",cpm:"?6–12",cpc:"?0.30–0.55",cpl:"?15–25",col:C.violet},{platform:"Shopee",cpm:"?180–280",cpc:"?2.50–4.20",cpl:"?38–62",col:C.amber}].map(p=>(<div key={p.platform} style={{background:C.bg2,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`,borderTop:`2px solid ${p.col}`}}><div style={{fontWeight:700,fontSize:13,marginBottom:10,color:p.col}}>{p.platform}</div><div style={{fontSize:10,color:C.muted,marginBottom:4}}>CPM: <span style={{color:C.text,fontWeight:600}}>{p.cpm}</span></div><div style={{fontSize:10,color:C.muted,marginBottom:4}}>CPC: <span style={{color:C.text,fontWeight:600}}>{p.cpc}</span></div><div style={{fontSize:10,color:C.muted}}>CPL: <span style={{color:C.gold,fontWeight:700}}>{p.cpl}</span></div></div>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
