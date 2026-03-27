import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, AlertTriangle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import AnalystResponse from '../components/AnalystResponse';
import ReactMarkdown from 'react-markdown';

const BOT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22%3E%3Cdefs%3E%3CradialGradient id=%22h%22 cx=%2250%25%22 cy=%2250%25%22 r=%2260%25%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23f97316%22/%3E%3Cstop offset=%2260%25%22 stop-color=%22%23ef4444%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%233b82f6%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx=%2260%22 cy=%2260%22 r=%2260%22 fill=%22url(%23h)%22/%3E%3Ccircle cx=%2265%22 cy=%2265%22 r=%2235%22 fill-opacity=%220.16%22 fill=%22%23fff%22/%3E%3Ccircle cx=%2260%22 cy=%2260%22 r=%2210%22 fill=%22%23e0f2fe%22/%3E%3C/svg%3E';

// -------------------------------------------------------------
// INJECTABLE SUB-COMPONENTS
// -------------------------------------------------------------
const RiskMeter = ({ assessment }) => {
  const isHigh = assessment.risk_level === "High";
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`p-6 border ${isHigh ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'} shadow-sm flex items-center gap-4`}
    >
      <div className={`p-4 rounded-full ${isHigh ? 'bg-hm-red text-white' : 'bg-green-600 text-white'}`}>
        {isHigh ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
      </div>
      <div>
        <h4 className="font-sans text-xs uppercase tracking-widest text-hm-gray mb-1">Risk Assessment</h4>
        <div className="flex items-end gap-3">
          <span className="font-serif text-4xl">{assessment.churn_probability}%</span>
          <span className={`font-sans text-sm pb-1 font-medium ${isHigh ? 'text-hm-red' : 'text-green-700'}`}>
            {assessment.status_badge}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const StrategyCard = ({ strategy }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }} 
    animate={{ y: 0, opacity: 1 }} 
    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
    className="p-6 bg-hm-black text-hm-white shadow-xl flex flex-col justify-between"
  >
    <div>
      <h4 className="font-sans text-xs uppercase tracking-widest text-hm-gray mb-4">Recommended Strategy</h4>
      <h3 className="font-serif text-2xl mb-2">{strategy.name}</h3>
      <p className="font-sans font-light text-sm text-gray-300 mb-6">{strategy.insight}</p>
    </div>
    <div className="flex items-center gap-2 text-sm font-sans px-4 py-2 border border-hm-gray/50 w-fit">
      <Tag size={16} className="text-hm-red" />
      <span>{strategy.voucher}</span>
    </div>
  </motion.div>
);

const getImageUrl = (article_id) => {
  return `http://localhost:8000/api/v1/image/${article_id}`;
};

const ActivityFeed = ({ items, title }) => (
  <motion.div 
    initial={{ x: -20, opacity: 0 }} 
    animate={{ x: 0, opacity: 1 }} 
    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
    className="col-span-1 md:col-span-2 p-6 bg-white border border-gray-100 shadow-sm"
  >
    <h4 className="font-sans text-xs uppercase tracking-widest text-hm-gray mb-4">{title}</h4>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.slice(0, 5).map((item, idx) => (
        <div key={idx} className="flex flex-col gap-2 group">
          <div className="aspect-[3/4] bg-hm-light w-full border border-gray-50 flex items-center justify-center overflow-hidden relative">
             <img 
               src={getImageUrl(item.article_id)} 
               alt={item.prod_name}
               className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
               onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.nextSibling.style.display = 'flex';
               }}
             />
             <div className="absolute inset-0 flex-col items-center justify-center text-center p-2 bg-hm-light font-sans text-[10px] text-hm-gray" style={{ display: 'none' }}>
               <span>Image Unavailable</span>
               <span className="mt-1">{item.article_id}</span>
             </div>
          </div>
          <p className="font-sans text-xs font-medium line-clamp-1" title={item.prod_name}>{item.prod_name}</p>
          <p className="font-sans text-[10px] text-hm-gray">{item.product_type_name}</p>
        </div>
      ))}
    </div>
  </motion.div>
);


// -------------------------------------------------------------
// MAIN PLAYGROUND CHAT INTERFACE
// -------------------------------------------------------------
export default function Playground() {
  const { messages, sendMessage, isLoading, resetMessages } = useChat();
  const [input, setInput] = useState('');
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const current = input;
      setInput('');
      await sendMessage(current);
    }
  };

  const handleRandomId = async () => {
    if (isLoading || isRandomLoading) return;
    setIsRandomLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/random-id');
      if (!response.ok) throw new Error('Unable to fetch random ID');
      const { random_id } = await response.json();
      setInput(random_id);
      setInput('');
      await sendMessage(random_id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRandomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hm-light flex justify-center py-12 px-4 sm:px-6">
        {/* Central Glassmorphism Container */}
        <div className="w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-glass rounded-sm overflow-hidden relative min-h-[80vh]">
         
          {/* Header */}
          <div className="px-8 py-5 border-b border-gray-100 bg-white/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="font-serif text-2xl text-hm-black">Intelligence Playground</h1>
              <p className="font-sans text-xs text-hm-gray uppercase tracking-widest mt-1">H&M Strategy Engine API</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-sans text-xs text-hm-gray font-medium">Model Active</span>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Data Sidebar */}
            <div className="lg:w-1/4 space-y-5">
              <div className="bg-white/90 border border-gray-100 rounded-3xl shadow-2xl p-6 space-y-6">
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-hm-gray font-semibold">The 1.3M Identity Universe</p>
                  <h3 className="font-serif text-2xl text-hm-black">Data Discovery</h3>
                  <p className="text-sm text-hm-gray mt-1">Access the full demographic spine supporting this engine. The dataset historically spans from <strong>2018-09-19</strong> to <strong>2020-09-21</strong>.</p>
                </div>
                <div className="grid gap-3">
                  <a
                    href="https://docs.google.com/spreadsheets/d/1chRkUrGtYZozmbLVCYvGQ_pip-QRHxTUWJO0-8TP1Zw/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="group block border border-gray-200 rounded-2xl bg-white p-4 shadow-sm transition hover:border-hm-red"
                  >
                    <p className="text-[11px] uppercase tracking-[0.4em] text-hm-gray font-semibold">Identity Preview (Google Sheets)</p>
                    <h4 className="font-serif text-xl text-hm-black mt-2">Google Sheets</h4>
                    <p className="text-sm text-hm-gray mt-1">Peek at curated loyalty, persona, and style DNA stats that feed the engine.</p>
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-hm-red">
                      <span>Open in Sheets</span>
                      <ArrowRight size={16} />
                    </div>
                  </a>
                  <a
                    href="https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/data?select=customers.csv"
                    target="_blank"
                    rel="noreferrer"
                    className="group block border border-gray-200 rounded-2xl bg-white p-4 shadow-sm transition hover:border-hm-red"
                  >
                    <p className="text-[11px] uppercase tracking-[0.4em] text-hm-gray font-semibold">Raw Source (Kaggle)</p>
                    <h4 className="font-serif text-xl text-hm-black mt-2">Kaggle Dataset</h4>
                    <p className="text-sm text-hm-gray mt-1">Explore the complete customer tables powering the fusion workflows. Contains transaction history (2018-2020).</p>
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-hm-red">
                      <span>Download Source</span>
                      <ArrowRight size={16} />
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Conversation Column */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="relative flex-1 bg-gradient-to-br from-white via-white/70 to-[#f4ecff] border border-white/60 rounded-3xl shadow-[0_30px_80px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_55%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/60">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-hm-gray font-semibold">Conversation</p>
                    <p className="text-[11px] text-hm-gray">Realtime CRM narrative + GPT insights.</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetMessages}
                    className="text-[11px] uppercase tracking-[0.3em] text-hm-red font-semibold hover:text-hm-black transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ minHeight: 'calc(100% - 220px)' }}>
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-6 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div className="p-2 h-12 w-12 rounded-full flex items-center justify-center shrink-0 bg-white shadow-inner border border-white/60 overflow-hidden">
                          {msg.role === 'user' ? (
                            <User size={20} className="text-hm-black" />
                          ) : (
                            <img
                              src={BOT_AVATAR}
                              alt="AI avatar"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {/* Content Box */}
                        <div className={`flex flex-col gap-4 max-w-[85%] w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          {/* Text Bubble */}
                          {msg.type !== 'data' && (
                            <div className={`px-6 py-4 font-sans text-sm leading-relaxed rounded-2xl shadow-sm transition-all duration-300 ${msg.role === 'user' ? 'bg-gradient-to-br from-hm-black to-slate-900 text-white border border-hm-black shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : 'bg-white/70 backdrop-blur-md border border-gray-100 text-hm-black'}`}>
                              {msg.role === 'user' ? (
                                msg.text
                              ) : (
                                <div className="markdown-content">
                                  <ReactMarkdown
                                    components={{
                                      p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                                      strong: ({node, ...props}) => <strong className="font-semibold text-hm-black" {...props} />,
                                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
                                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                                      li: ({node, ...props}) => <li className="mb-1" {...props} />
                                    }}
                                  >
                                    {msg.text}
                                  </ReactMarkdown>
                                </div>
                              )}
                              
                              {msg.isThinking && (
                                <span className="ml-2 inline-flex gap-1">
                                  <span className="animate-bounce delay-100">.</span>
                                  <span className="animate-bounce delay-200">.</span>
                                  <span className="animate-bounce delay-300">.</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Rich Component Injection (Only for AI Data messages) */}
                          {msg.type === 'data' && msg.data && (
                            <AnalystResponse
                              narrative={msg.text}
                              data={msg.data}
                              RiskCard={RiskMeter}
                              StrategyCard={StrategyCard}
                              VisualTwinsFeed={ActivityFeed}
                              RecentHistoryFeed={ActivityFeed}
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={endOfMessagesRef} className="h-4" />
                </div>
              </div>

              {/* Input Bar */}
              <div className="p-6 bg-white/80 backdrop-blur-lg border border-gray-100 w-full relative z-10 shrink-0 rounded-3xl shadow-inner">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={handleRandomId}
                    disabled={isLoading || isRandomLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-black text-[10px] font-mono tracking-[0.4em] uppercase text-white shadow-[0_0_30px_rgba(255,255,255,0.45)] transition hover:shadow-[0_0_40px_rgba(255,255,255,0.55)] disabled:opacity-40 animate-pulse"
                  >
                    <span>🎲</span>
                    Random ID
                  </button>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter Customer ID or Hex String..."
                    className="flex-1 bg-hm-light border border-gray-200 text-hm-black font-mono text-sm px-6 py-4 outline-none focus:border-hm-black transition-colors shadow-inner tracking-[0.2em]"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="h-12 w-12 flex items-center justify-center rounded-full bg-hm-red text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <p className="text-center text-[10px] text-hm-gray font-sans mt-3 uppercase tracking-wider">
                  Enterprise Grade Customer 360 · Strategy Engine Version 1.0
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
