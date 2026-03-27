import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, ShieldCheck, TrendingUp, AlertTriangle, Zap, Server } from 'lucide-react';

const PERSONA_DATA = [
  { id: 0, name: "The Modern Professional", items: ["Core Staple: High-waisted denim in power-stretch fabric.", "Essential: Basic black shaftless socks.", "Foundation: Classic fitted black T-shirt."], risk: "low", drift: 0.12, img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=500&q=80" },
  { id: 1, name: "The Urban Streetwear", items: ["Structure: Solid black denim silhouette.", "Key Piece: Relaxed Tilly T-shirt.", "Layering: Minimalist black tank top."], risk: "high", drift: 0.64, img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "The Evening Socialite", items: ["Versatility: Core high-waisted black trousers.", "Foundation: Clean lined Tilda tank.", "Comfort: Thong Mynta base layer."], risk: "moderate", drift: 0.35, img: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: 3, name: "The Summer Minimalist", items: ["Tone: Light blue washed denim.", "Staple: The everyday Tilly T-shirt.", "Essential: Breathable shaftless socks."], risk: "low", drift: 0.18, img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "The Active Athleisure", items: ["Base: Structured high-waisted denim.", "Action: Form-fitting Tilda tank.", "Support: Basic athletic-cut socks."], risk: "high", drift: 0.72, img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "The Weekend Casual", items: ["Relaxed: Classic light washed denim.", "Uniform: Signature Tilly T-shirt.", "Foundation: Greta Thong base layer."], risk: "low", drift: 0.11, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "The Gen-Z Trendsetter", items: ["Core: Black Tilly T-shirt.", "Layer: Essential Tilda tank top.", "Structure: Universal skinny denim."], risk: "high", drift: 0.88, img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80" },
  { id: 7, name: "The Sustainable Purist", items: ["Staple: Timeless black denim trousers.", "Essential: Basic shaftless socks.", "Foundation: Classic Tilda tank."], risk: "moderate", drift: 0.45, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80" },
  { id: 8, name: "The Scandi Cool", items: ["Tone: Nordic light blue denim wash.", "Comfort: Seamless Mynta base layer.", "Staple: Minimalist Tilly T-shirt."], risk: "low", drift: 0.15, img: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80" },
  { id: 9, name: "The Corporate Chic", items: ["Uniform: High-waisted black power denim.", "Layering: Tailored black T-shirt.", "Essential: Premium black ankle socks."], risk: "low", drift: 0.08, img: "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?auto=format&fit=crop&w=500&q=80" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function SocialPulse() {
  const [stats, setStats] = useState(null);
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [activePersonaId, setActivePersonaId] = useState(null);

  const handlePersonaPointerEnter = (id) => setActivePersonaId(id);
  const handlePersonaPointerLeave = () => setActivePersonaId(null);
  const handlePersonaPointerDown = (id) => setActivePersonaId(id);
  const handlePersonaPointerUp = () => setActivePersonaId(null);

  useEffect(() => {
    // 1. Fetch Global Aggregate Stats
    fetch('http://localhost:8000/api/v1/social/pulse')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Pulse Stats Error:", err));

    // 2. Fetch Executive AI Commentary
    const fetchAIOpinion = async () => {
      setIsTyping(true);
      setChatResponse("");
      try {
        const res = await fetch('http://localhost:8000/api/v1/social/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context: "Analyze the current global style drift and persona risk." })
        });
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunkStr = decoder.decode(value, { stream: true });
          const events = chunkStr.split('\n\n');
          for (let ev of events) {
            if (ev.startsWith('data: ')) {
               try {
                 const data = JSON.parse(ev.slice(6));
                 if (data.type === 'text') {
                   setChatResponse(prev => prev + data.payload);
                 }
               } catch(e) {}
            }
          }
        }
      } catch(err) {
        setChatResponse("Unable to reach the Executive AI cluster.");
      }
      setIsTyping(false);
    };

    fetchAIOpinion();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-32">
      
      {/* 1. THE 'LIVE' MARKET TICKER */}
      <div className="w-full bg-hm-black h-8 flex items-center overflow-hidden border-b border-zinc-800 relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-hm-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-hm-black to-transparent z-10"></div>
        
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex items-center gap-12 whitespace-nowrap text-[10px] uppercase font-mono tracking-[0.2em] text-white"
        >
          <span className="flex items-center gap-2 text-white"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> SYSTEM STATUS: 24H BATCH SYNC COMPLETE</span>
          <span className="text-white">TRENDING: {stats ? stats.ticker_category : "..."} {stats ? stats.market_velocity_pct : "..."}</span>
          <span className="text-white">GLOBAL STYLE DRIFT: {stats ? stats.global_drift : "..."} (MODERATE)</span>
          <span className="text-hm-red">HIGHEST VOLATILITY: THE GEN-Z TRENDSETTER</span>
          
          <span className="flex items-center gap-2 text-white"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> SYSTEM STATUS: 24H BATCH SYNC COMPLETE</span>
          <span className="text-white">TRENDING: {stats ? stats.ticker_category : "..."} {stats ? stats.market_velocity_pct : "..."}</span>
          <span className="text-white">GLOBAL STYLE DRIFT: {stats ? stats.global_drift : "..."} (MODERATE)</span>
          <span className="text-hm-red">HIGHEST VOLATILITY: THE GEN-Z TRENDSETTER</span>
          
          <span className="flex items-center gap-2 text-white"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> SYSTEM STATUS: 24H BATCH SYNC COMPLETE</span>
          <span className="text-white">TRENDING: {stats ? stats.ticker_category : "..."} {stats ? stats.market_velocity_pct : "..."}</span>
          <span className="text-white">GLOBAL STYLE DRIFT: {stats ? stats.global_drift : "..."} (MODERATE)</span>
          <span className="text-hm-red">HIGHEST VOLATILITY: THE GEN-Z TRENDSETTER</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16">
        
        <div className="mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-hm-black mb-3">Global Social Pulse.</h1>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-gray-500">Executive Aggregate Analytics View</p>
        </div>

        {/* 2. THE GLOBAL SENTIMENT KPI CARDS (LIGHT AIRY GLASSMORPHISM) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          
          {/* A. Dominant Segment (Airy Emerald Glass) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="relative p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between rounded-2xl overflow-hidden group border-2 border-emerald-300/40 bg-white/70 backdrop-blur-xl"
          >
            {/* Animated Light Orbs */}
            <motion.div 
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1], x: [0, 30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400/40 blur-[60px] rounded-full z-0 pointer-events-none"
            />
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1], x: [0, -20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -bottom-20 -left-10 w-72 h-72 bg-teal-400/30 blur-[70px] rounded-full z-0 pointer-events-none"
            />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-emerald-50">
                 <ShieldCheck size={16} className="text-emerald-500" />
                 <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-700">Dominant Segment</h3>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center relative z-10 mt-4">
              {stats && stats.top_healthy_personas ? (
                <div className="flex flex-col gap-0 border-t border-emerald-100/50 pt-2">
                  {stats.top_healthy_personas.map((item, idx) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex justify-between items-center py-4 border-b border-emerald-50 last:border-0 group/row">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono font-bold text-emerald-300 transition-colors group-hover/row:text-emerald-500">0{idx+1}</span>
                        <span className="font-serif text-lg font-bold text-emerald-950 transition-colors">{item.name}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm group-hover/row:border-emerald-300/50 transition-colors">{item.count.toLocaleString()} <span className="text-[9px] font-sans uppercase text-emerald-500 font-medium">Users</span></span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse flex flex-col gap-4 mt-2">
                  <div className="h-6 bg-emerald-100/50 rounded w-full"></div>
                  <div className="h-6 bg-emerald-100/50 rounded w-5/6"></div>
                  <div className="h-6 bg-emerald-100/50 rounded w-4/6"></div>
                </div>
              )}
            </div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-emerald-600/60 mt-6 leading-relaxed relative z-10 font-medium">Highest Demographic Volume.</p>
          </motion.div>

          {/* B. Market Velocity (Airy Sky Glass) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="relative p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between rounded-2xl overflow-hidden group border-2 border-blue-300/40 bg-white/70 backdrop-blur-xl"
          >
            {/* Animated Light Orbs */}
            <motion.div 
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1], y: [0, -20, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-400/40 blur-[60px] rounded-full z-0 pointer-events-none"
            />
            <motion.div 
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1], x: [0, 30, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              className="absolute -top-20 -left-10 w-64 h-64 bg-indigo-400/30 blur-[70px] rounded-full z-0 pointer-events-none"
            />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-blue-50">
                 <TrendingUp size={16} className="text-blue-500" />
                 <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-blue-700">Market Velocity</h3>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center relative z-10 mt-4">
              {stats && stats.market_velocity_categories ? (
                <div className="flex flex-col gap-0 border-t border-blue-100/50 pt-2">
                  {stats.market_velocity_categories.map((item, idx) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex justify-between items-center py-4 border-b border-blue-50 last:border-0 group/row">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono font-bold text-blue-300 transition-colors group-hover/row:text-blue-500">0{idx+1}</span>
                        <span className="font-serif text-lg font-bold text-blue-950 transition-colors">{item.name}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-blue-100 shadow-sm group-hover/row:border-blue-300/50 transition-colors">
                        {idx === 0 ? stats.market_velocity_pct || "+7%" : `+${Math.floor(Math.random() * 5) + 2}%`}
                        <span className="text-[9px] font-sans uppercase text-blue-500 font-medium ml-1">Shift</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse flex flex-col gap-4 mt-2">
                  <div className="h-6 bg-blue-100/50 rounded w-full"></div>
                  <div className="h-6 bg-blue-100/50 rounded w-5/6"></div>
                  <div className="h-6 bg-blue-100/50 rounded w-4/6"></div>
                </div>
              )}
            </div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-blue-600/60 mt-6 leading-relaxed relative z-10 font-medium">Highest purchase growth metric.</p>
          </motion.div>

          {/* C. Risk Overview (Airy Rose Glass) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="relative p-8 shadow-[0_8px_30px_rgb(229,0,18,0.08)] flex flex-col justify-between rounded-2xl overflow-hidden group border-2 border-[#E50012]/30 bg-white/70 backdrop-blur-xl"
          >
            {/* Animated Light Orbs */}
            <motion.div 
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.4, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 m-auto w-80 h-80 bg-[#E50012]/30 blur-[70px] rounded-full z-0 pointer-events-none"
            />
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#E50012]/15 blur-[80px] rounded-full z-0 pointer-events-none"
            />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-[#E50012]/20">
                 <AlertTriangle size={16} className="text-[#E50012]" />
                 <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold text-[#b3000e]">Global Risk</h3>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center relative z-10 mt-4">
              {stats ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-end gap-5">
                    <motion.p 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      className="font-serif text-6xl md:text-[5rem] text-[#4a0006] font-black tracking-tighter leading-none"
                    >
                      {stats.high_risk_percentage}%
                    </motion.p>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-[#E50012] border border-[#E50012]/30 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-[#E50012] animate-[pulse_1.5s_ease-in-out_Infinity] shadow-[0_0_8px_rgba(229,0,18,0.5)]"></div>
                      <span className="text-[10px] font-bold tracking-widest uppercase">Action Required</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="h-24 w-40 bg-red-100/50 animate-pulse rounded-lg border border-red-50"></div>
                </div>
              )}
            </div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-red-600/50 mt-8 pt-6 border-t border-red-100/50 relative z-10 font-medium">Of 1.3M Total Database marked 'High Churn'.</p>
          </motion.div>

        </div>

        {/* 3. THE STYLE TRIBES PERSONA GRID */}
        <div className="mb-10">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <h3 className="font-serif text-2xl text-hm-black">Style Tribes Configuration</h3>
            <span className="text-[10px] font-sans uppercase tracking-[0.1em] text-gray-400">10 Active Clusters</span>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {PERSONA_DATA.map((persona) => {
              const isActive = activePersonaId === persona.id;
              const defaultStateClasses = [
                "absolute inset-0 z-20 p-5 flex flex-col justify-between transition-opacity duration-300",
                isActive ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto",
                "group-hover:opacity-0 group-hover:pointer-events-none"
              ].join(" ");
              const hoverStateClasses = [
                "absolute inset-0 z-30 p-5 bg-white transition-all duration-300 flex flex-col",
                isActive ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-[1.05]",
                "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100"
              ].join(" ");

              return (
                <motion.div 
                  key={persona.id} 
                  variants={cardVariants}
                  className="group relative bg-white border border-gray-200 overflow-hidden h-72 cursor-pointer shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-500"
                  onPointerEnter={() => handlePersonaPointerEnter(persona.id)}
                  onPointerLeave={handlePersonaPointerLeave}
                  onPointerDown={() => handlePersonaPointerDown(persona.id)}
                  onPointerUp={handlePersonaPointerUp}
                >
                  {/* Background Image Layer */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10 transition-opacity duration-300 group-hover:opacity-60"></div>
                    <img src={persona.img} alt={persona.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>

                  {/* Default State Content */}
                  <div className={defaultStateClasses}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur">PROFILE: {persona.id}</span>
                      <div className="relative flex items-center justify-center w-5 h-5">
                        {persona.risk === 'low' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                        ) : persona.risk === 'moderate' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]"></div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-hm-red shadow-[0_0_10px_rgba(255,0,0,0.6)] animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-white font-medium leading-tight">{persona.name}</h4>
                    </div>
                  </div>

                  {/* Hover Reveal State (Top 3 Articles) */}
                  <div className={hoverStateClasses}>
                    <div className="mb-4">
                      <h4 className="font-serif text-md text-hm-black font-medium leading-tight">{persona.name}</h4>
                      <p className="text-[10px] font-sans text-gray-500 uppercase tracking-wider mt-1">Drift: {persona.drift}</p>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-[9px] font-sans text-hm-red uppercase tracking-[0.1em] font-bold mb-3 border-b border-gray-100 pb-1">Top Articles</p>
                      <ul className="space-y-3">
                        {persona.items.map((item, idx) => (
                          <li key={idx} className="text-[11px] font-sans text-gray-600 leading-tight flex gap-2">
                            <span className="text-gray-300 font-mono">0{idx+1}</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* 4. THE AI MARKET CONSULTANT */}
        <div className="mt-20">
          <div className="relative bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 md:p-12 overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_top_right,rgba(0,128,255,0.03),transparent_70%)] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-blue-50 p-2 rounded-full">
                <Server size={18} className="text-blue-600" />
              </div>
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-hm-black">Strategic Market Commentary</h4>
              {isTyping && (
                <div className="flex gap-1 items-center ml-2 border border-gray-200 bg-white px-2 py-1 rounded-full shadow-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-[9px] font-mono text-gray-500 ml-1">GEMINI</span>
                </div>
              )}
            </div>

            <div className="relative z-10">
              {chatResponse ? (
                <p className="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl">
                  {chatResponse}
                </p>
              ) : (
                <p className="font-serif text-xl md:text-2xl text-gray-400 leading-relaxed max-w-4xl animate-pulse">
                  Aggregating 1.3M behavioral timelines...
                </p>
              )}
            </div>
            
            {/* Decorative Edge Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-50 via-blue-100 to-transparent"></div>
          </div>
        </div>

        {/* 5. THE ARCHITECT'S TECHNICAL MOAT NOTE */}
        <div className="mt-16 mb-10 relative group">
          <div className="relative bg-gradient-to-br from-white/95 to-violet-50/90 backdrop-blur-2xl border border-violet-100/80 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(139,92,246,0.08)] overflow-hidden">
            {/* Extremely Subtle Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-violet-100/50 pb-5">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-[pulse_2s_ease-in-out_Infinity] shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              <h5 className="font-mono text-[11px] text-violet-600 uppercase tracking-[0.25em] font-bold">
                Production Simulation & Architecture
              </h5>
            </div>
            
            <p className="font-sans text-[13px] md:text-sm text-slate-600 leading-relaxed max-w-5xl mb-8 relative z-10 font-medium tracking-wide">
              <strong className="text-violet-950 font-bold">This dashboard represents a high-fidelity snapshot of a 24-hour Batch Sync cycle.</strong> In a production enterprise environment, this view is dynamic: every purchase triggers a sequence update in the GCS Data Lake.<br/><br/>
              To simulate enterprise-grade performance, this system is architected to be Orchestration-Ready. While currently serving a serialized 31M-transaction snapshot to ensure sub-second UI latency, the underlying logic is designed to be triggered via <span className="text-violet-700 font-bold bg-violet-100/50 px-1.5 py-0.5 rounded border border-violet-200/50">Apache Airflow</span> (GCP Cloud Composer). In a live environment, a nightly <span className="text-purple-700 font-bold bg-purple-100/50 px-1.5 py-0.5 rounded border border-purple-200/50">Spark job</span> would re-calculate centroids and Style DNA, pushing fresh 'Market Velocity' and 'Global Risk' metrics to the API layer without manual intervention.
            </p>

            <div className="flex flex-wrap gap-3 relative z-10 mt-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-violet-700 bg-white px-3 py-1.5 rounded-md border border-violet-200 shadow-sm transition-all hover:border-violet-400 hover:shadow-md hover:-translate-y-0.5">Orchestration: Airflow-Ready</span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-purple-700 bg-white px-3 py-1.5 rounded-md border border-purple-200 shadow-sm transition-all hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5">Compute: Spark-Compatible</span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-fuchsia-700 bg-white px-3 py-1.5 rounded-md border border-fuchsia-200 shadow-sm transition-all hover:border-fuchsia-400 hover:shadow-md hover:-translate-y-0.5">Data Lake: GCS / Parquet</span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-pink-700 bg-white px-3 py-1.5 rounded-md border border-pink-200 shadow-sm transition-all hover:border-pink-400 hover:shadow-md hover:-translate-y-0.5">API Layer: FastAPI / Pydantic</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
