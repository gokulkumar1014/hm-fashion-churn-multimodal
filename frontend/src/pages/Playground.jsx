import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, AlertTriangle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import AnalystResponse from '../components/AnalystResponse';
import ReactMarkdown from 'react-markdown';

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
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-hm-light flex justify-center py-12 px-4 sm:px-6">
      {/* Central Glassmorphism Container */}
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-glass rounded-sm flex flex-col overflow-hidden relative min-h-[80vh]">
        
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

        {/* Messaging Area */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`p-3 h-12 w-12 rounded-none flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-hm-black text-white' : 'bg-red-50 text-hm-red border border-red-100'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>

                {/* Content Box */}
                <div className={`flex flex-col gap-4 max-w-[85%] w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Text Bubble */}
                  {msg.type !== 'data' && (
                    <div className={`px-6 py-4 font-sans text-sm leading-relaxed ${msg.role === 'user' ? 'bg-hm-black text-white border border-hm-black' : 'bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm text-hm-black'} rounded-sm`}>
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

        {/* Input Bar */}
        <div className="p-6 bg-white/80 backdrop-blur-lg border-t border-gray-100 w-full relative z-10 shrink-0">
          <form onSubmit={handleSubmit} className="flex relative items-center max-w-4xl mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Enter Customer ID or Hex String..."
              className="w-full bg-hm-light border border-gray-200 text-hm-black font-sans text-sm px-6 py-4 outline-none focus:border-hm-black transition-colors shadow-inner"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bg-hm-red text-white p-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[10px] text-hm-gray font-sans mt-3 uppercase tracking-wider">
            Enterprise Grade Customer 360 &sdot; Strategy Engine Version 1.0
          </p>
        </div>

      </div>
    </div>
  );
}
