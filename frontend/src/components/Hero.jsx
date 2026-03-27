import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Cloud, Activity, Linkedin, Globe } from 'lucide-react';

const IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const scrollVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const STRATEGIC_ROWS = [
  {
    id: "data-input",
    label: "Data Input",
    legacy: "Single-source (CSV/SQL) ignoring visual context.",
    highlight: "Multimodal Fusion",
    description: "Fuses pixel-level article DNA with sequential transaction intent.",
    delay: 0.1
  },
  {
    id: "temporal-logic",
    label: "Temporal Logic",
    legacy: "Static snapshots; treats a user as a fixed profile.",
    highlight: "Sequential Intelligence",
    description: "Analyzes the \"velocity\" of engagement to catch churn before it happens.",
    delay: 0.2
  },
  {
    id: "style-perception",
    label: "Style Perception",
    legacy: "Manual \"Tags\" (e.g., \"Blue Shirt\") that ignore aesthetic shifts.",
    highlight: "Style DNA & Drift",
    description: "Calculates the mathematical distance between historical tastes and recent evolution.",
    delay: 0.3
  },
  {
    id: "business-action",
    label: "Business Action",
    legacy: "\"Spray and Pray\" discounts that erode margins for all users.",
    highlight: "Unit Economics",
    description: "Delivers surgical vouchers targeted only at Persuadables to maximize ROI.",
    delay: 0.4
  },
  {
    id: "execution-hub",
    label: "Execution Hub",
    legacy: "Local, batch-processed scripts with high latency.",
    highlight: "Cloud-Native Inference",
    description: "Asynchronous GCP architecture delivering 360 dossiers in milliseconds.",
    delay: 0.5
  }
];

const StrategicRow = ({ row, isActive, onActivate, onDeactivate }) => {
  const bgClass = isActive ? "bg-white" : "bg-red-50/40";
  const overlayOpacity = isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100";
  const barScale = isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100";
  const textColor = isActive ? "text-hm-red" : "text-hm-black";
  const legacyDeco = `font-serif text-[15px] leading-relaxed ${isActive ? "text-gray-500 group-hover:decoration-gray-400" : "text-gray-500"}`;
  const advantageTransform = isActive ? "translate-x-2" : "translate-x-0 group-hover:translate-x-2";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: row.delay, duration: 0.5 }}
      className={`grid grid-cols-1 md:grid-cols-12 border-b border-red-100 hover:bg-white transition-all duration-500 group relative overflow-hidden ${bgClass}`}
      onPointerEnter={() => onActivate(row.id)}
      onPointerMove={() => onActivate(row.id)}
      onPointerDown={() => onActivate(row.id)}
      onPointerUp={() => onDeactivate()}
      onPointerLeave={() => onDeactivate()}
    >
      <div className={`absolute inset-0 bg-red-50 ${overlayOpacity} transition-opacity duration-500`}></div>
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-hm-red transform origin-center z-10 transition-transform duration-500 ${barScale}`}></div>
      <div className={`md:col-span-3 p-6 md:p-8 border-b md:border-b-0 md:border-r border-red-100 font-sans text-xs tracking-[0.1em] uppercase font-bold flex items-center transition-colors duration-500 relative z-10 ${textColor}`}>
        {row.label}
      </div>
      <div className={`md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-red-100 flex items-center relative z-10 bg-white/50 transition-colors duration-500 ${isActive ? "group-hover:bg-transparent" : ""}`}>
        <p className={`${legacyDeco} line-through decoration-gray-300`}>
          {row.legacy}
        </p>
      </div>
      <div className={`md:col-span-5 p-6 md:p-8 transition-transform duration-500 flex items-center pl-6 md:pl-10 relative z-10 ${advantageTransform}`}>
        <p className="font-sans text-[15px] text-gray-600 leading-relaxed font-light">
          <strong className="text-hm-red tracking-[0.02em] block mb-1">{row.highlight}</strong> {row.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const [activeImage, setActiveImage] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const handleRowActivate = (id) => setActiveRow(id);
  const handleRowDeactivate = () => setActiveRow(null);
  const handleImageActivate = (index) => setActiveImage(index);
  const handleImageDeactivate = () => setActiveImage(null);
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* 1. THE HERO (The Strategic Hook) */}
      <section className="pt-12 pb-0 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center relative border-b border-gray-100">
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-[100px] z-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 w-full max-w-4xl">
          <motion.h4 variants={itemVariants} className="font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-hm-red mb-6 font-extrabold">
            PRECISION RETENTION FOR THE RETAIL ECONOMY
          </motion.h4>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-6xl md:text-8xl lg:text-[96px] text-hm-black mb-10 tracking-tight leading-[1.05] font-normal"
          >
            Preserving Loyalty <br />
            <span className="text-hm-red italic">Through Multimodal</span><br />
            <span className="text-hm-red italic">Intelligence.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="font-sans text-gray-500 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed font-light">
            A strategic intelligence layer that bridges the gap between deep learning research and real-world business profitability.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Link 
              to="/playground" 
              className={`group px-8 py-3.5 border border-hm-black text-white bg-hm-black rounded-full font-sans text-xs tracking-[0.15em] uppercase font-semibold transition-all duration-500 flex items-center justify-center gap-2 ${activeButton === 'launch' ? 'hover:bg-transparent hover:text-hm-black -translate-y-1 shadow-xl' : 'hover:bg-transparent hover:text-hm-black hover:-translate-y-1 hover:shadow-xl'}`}
              onPointerEnter={() => setActiveButton('launch')}
              onPointerMove={() => setActiveButton('launch')}
              onPointerDown={() => setActiveButton('launch')}
              onPointerLeave={() => setActiveButton(null)}
              onPointerUp={() => setActiveButton(null)}
            >
              Launch Engine
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/blueprint" 
              className={`px-8 py-3.5 border border-gray-300 text-gray-500 bg-transparent rounded-full font-sans text-xs tracking-[0.15em] uppercase font-semibold transition-all duration-500 flex items-center justify-center bg-white/50 backdrop-blur ${activeButton === 'blueprint' ? 'hover:border-hm-black hover:text-hm-black -translate-y-1 shadow-xl' : 'hover:border-hm-black hover:text-hm-black hover:-translate-y-1 hover:shadow-xl'}`}
              onPointerEnter={() => setActiveButton('blueprint')}
              onPointerMove={() => setActiveButton('blueprint')}
              onPointerDown={() => setActiveButton('blueprint')}
              onPointerLeave={() => setActiveButton(null)}
              onPointerUp={() => setActiveButton(null)}
            >
              View Blueprint
            </Link>
          </motion.div>
        </motion.div>

        {/* Fashion Editorial Image Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
          className="w-full max-w-6xl mx-auto grid grid-cols-3 gap-4 md:gap-8 relative z-20 pb-20 pt-16"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            onPointerEnter={() => handleImageActivate(0)}
            onPointerMove={() => handleImageActivate(0)}
            onPointerDown={() => handleImageActivate(0)}
            onPointerUp={handleImageDeactivate}
            onPointerLeave={handleImageDeactivate}
          >
            <img
              src={IMAGES[0]}
              alt="High Fashion Sequential"
              className={`w-full h-48 md:h-[400px] object-cover rounded-sm shadow-xl transition-all duration-500 hover:grayscale hover:shadow-2xl cursor-pointer ${activeImage === 0 ? 'grayscale' : ''}`}
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
            onPointerEnter={() => handleImageActivate(1)}
            onPointerMove={() => handleImageActivate(1)}
            onPointerDown={() => handleImageActivate(1)}
            onPointerUp={handleImageDeactivate}
            onPointerLeave={handleImageDeactivate}
          >
            <img
              src={IMAGES[1]}
              alt="High Fashion Multimodal"
              className={`w-full h-64 md:h-[500px] object-cover rounded-sm shadow-2xl -mt-8 md:-mt-16 border border-gray-100 transition-all duration-500 hover:grayscale hover:shadow-3xl cursor-pointer ${activeImage === 1 ? 'grayscale' : ''}`}
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
            onPointerEnter={() => handleImageActivate(2)}
            onPointerMove={() => handleImageActivate(2)}
            onPointerDown={() => handleImageActivate(2)}
            onPointerUp={handleImageDeactivate}
            onPointerLeave={handleImageDeactivate}
          >
            <img
              src={IMAGES[2]}
              alt="High Fashion Intelligence"
              className={`w-full h-48 md:h-[400px] object-cover rounded-sm shadow-xl transition-all duration-500 hover:grayscale hover:shadow-2xl cursor-pointer ${activeImage === 2 ? 'grayscale' : ''}`}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE ENGINEERING MOAT */}
      <section className="py-24 bg-white border-t border-gray-100 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scrollVariant} className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-hm-black mb-4">The Engineering Moat</h2>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-hm-gray">Bridging Big Data & Real-Time Inference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
            <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 group">
              <h3 className="font-sans text-sm tracking-[0.15em] uppercase font-bold text-hm-black flex items-center gap-3">
                <Activity size={18} className="text-hm-red" /> Sequential Depth
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.8] font-light">
                Modeled 31 Million transaction sequences for 1.3 Million customers and 105k products to capture the subtle 'slow down' phase in engagement before churn occurs.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 group">
              <h3 className="font-sans text-sm tracking-[0.15em] uppercase font-bold text-hm-black flex items-center gap-3">
                <Database size={18} className="text-hm-red" /> Multimodal Fusion
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.8] font-light">
                Merged 30GB+ of visual article embeddings (CNN) with behavioral metadata to map unique Style DNA, validating real-time style drift and orchestrating LTV-based interventions.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 group">
              <h3 className="font-sans text-sm tracking-[0.15em] uppercase font-bold text-hm-black flex items-center gap-3">
                <Cloud size={18} className="text-hm-red" /> Cloud Orchestration
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.8] font-light">
                Architected a zero-overload infrastructure on GCP using Polars for high-concurrency joins and GCS-native lazy loading to bypass hardware bottlenecks, ensuring sub-1.5s response times.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. THE STRATEGIC EVOLUTION */}
      <section className="py-24 px-6 bg-white shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.03),transparent_60%)] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between border-b pb-6 border-gray-100">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-hm-black mb-2 tracking-tight">Strategic Intelligence.</h2>
            </div>
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gray-400 text-left md:text-right max-w-xs leading-relaxed font-bold mt-4 md:mt-0">Head-to-head architecture: Legacy Rules vs. Multimodal Inference.</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} 
            className="w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden flex flex-col relative border border-gray-200 bg-white">
            
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-hm-black relative z-10 shadow-md">
              <div className="md:col-span-3 p-5 md:p-6 border-b md:border-b-0 md:border-r border-zinc-800 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">Feature Vector</div>
              <div className="md:col-span-4 p-5 md:p-6 border-b md:border-b-0 md:border-r border-zinc-800 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">Legacy Paradigm</div>
              <div className="md:col-span-5 p-5 md:p-6 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-white flex items-center gap-2 relative overflow-hidden group/header cursor-default">
                <div className="absolute inset-0 bg-hm-red/20 translate-y-full group-hover/header:translate-y-0 transition-transform duration-500 ease-out"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-hm-red animate-pulse relative z-10"></div> 
                <span className="relative z-10">The Strategy Engine</span>
              </div>
            </div>

            {STRATEGIC_ROWS.map((row) => (
              <StrategicRow
                key={row.id}
                row={row}
                isActive={activeRow === row.id}
                onActivate={handleRowActivate}
                onDeactivate={handleRowDeactivate}
              />
            ))}

          </motion.div>
        </div>
      </section>

      {/* 4. THE FOUNDER'S NOTE */}
      <section className="py-32 px-6 bg-gray-50 border-t border-gray-200">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scrollVariant} className="max-w-3xl mx-auto">
          <div className="mb-14 text-center">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-hm-red font-bold mb-4">A Note from the Architect</h4>
            <div className="w-12 h-0.5 bg-hm-black mx-auto"></div>
          </div>
          
          <div className="font-serif text-xl md:text-2xl text-hm-black leading-[1.8] font-light space-y-8 relative px-4">
            <span className="absolute -top-12 -left-6 md:-left-12 text-gray-200 text-8xl md:text-[140px] font-serif leading-none select-none opacity-50 block h-10">"</span>
            
            <p className="relative z-10">
              This project was born from a pivotal realization during my Master's Capstone: <strong className="font-semibold text-hm-red italic">real-world AI shouldn't just live on a laptop and die! It belongs in the Cloud.</strong> After facing the limitations of local hardware while presenting to senior industry leaders and feeling the weight of letting down my teammates after months of hard work, I decided to move beyond academic samples and face the raw intimidation of Big Data, Machine Learning, and Cloud infrastructure head-on.
            </p>
            <p className="relative z-10">
              I wanted an all-rounder objective where I could implement my passion for Machine Learning and Deep Learning while mastering the massive scale of the GCP ecosystem. Pushing myself out of my comfort zone, I architected this system from scratch from ingesting humongous datasets to logging experiments in MLflow and deploying a production-ready gateway.
            </p>
            <p className="italic text-gray-500 text-lg md:text-xl relative z-10 border-l-2 border-hm-red pl-6 py-2 my-10">
              Building this end-to-end was as intimidating as it was satisfying; it gave me the confidence to move past the 'Local Machine Bottleneck' and prepare for the complex, high-stakes challenges of enterprise engineering.
            </p>
          </div>
          
          <div className="mt-16 flex flex-col items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 border border-gray-200 shadow-xl rounded-full overflow-hidden flex items-center justify-center bg-white relative">
                <img src="/profile.jpg" alt="Gokul" className="w-full h-full object-cover object-top absolute inset-0 z-10" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="font-serif text-3xl font-bold text-hm-black z-0">G</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="font-sans text-sm font-bold tracking-[0.15em] uppercase text-hm-black">Gokul Kumar Kesavan</p>
                <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500">Systems Architect</p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href="https://www.linkedin.com/in/gokul-kumar-kesavan/"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <Linkedin size={18} className="text-gray-500 group-hover:text-[#0A66C2]" />
                    LinkedIn
                  </a>
                  <a
                    href="https://gokulkumar1014.github.io/"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:border-black hover:text-black transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <Globe size={18} className="text-gray-500 group-hover:text-black" />
                    Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
