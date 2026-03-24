import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Code2, Cloud, ArrowRight, XCircle, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

const IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Hero() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 1. The Above-the-Fold (The Hook) */}
      <section className="pt-12 pb-0 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center relative border-b border-gray-100">
        {/* Subtle background glow from Image 3 */}
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-[100px] z-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 w-full max-w-4xl">
          <motion.h4 variants={itemVariants} className="font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-hm-red mb-6 font-extrabold">
            The Next Generation CRM
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
            A centralized Strategy Engine that moves beyond standard recommendation algorithms. Diagnose churn probability, analyze style drift, and orchestrate retention at scale.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Link to="/playground" className="group px-8 py-3.5 bg-hm-black text-white rounded-full font-sans text-xs tracking-[0.15em] uppercase font-semibold hover:bg-hm-red transition-all duration-500 flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_10px_20px_rgba(255,0,0,0.2)] hover:-translate-y-1.5 hover:scale-[1.02]">
              Launch Engine
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/blueprint" className="px-8 py-3.5 border border-gray-200 text-gray-600 rounded-full font-sans text-xs tracking-[0.15em] uppercase font-semibold hover:border-hm-black hover:text-hm-black transition-all duration-500 flex items-center justify-center bg-white/50 backdrop-blur hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
              View Blueprint
            </Link>
          </motion.div>
        </motion.div>

        {/* Fashion Editorial Image Grid (Replaces old Corner Floats) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
          className="w-full max-w-6xl mx-auto grid grid-cols-3 gap-4 md:gap-8 relative z-20 pb-20 pt-16"
        >
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
            <img
              src={IMAGES[0]} alt="High Fashion"
              className="w-full h-48 md:h-[400px] object-cover rounded-sm shadow-xl transition-all duration-500 hover:grayscale hover:opacity-80 cursor-pointer hover:shadow-2xl"
            />
          </motion.div>

          <motion.div animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}>
            <img
              src={IMAGES[1]} alt="High Fashion"
              className="w-full h-64 md:h-[500px] object-cover rounded-sm shadow-2xl -mt-8 md:-mt-16 border border-gray-100 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
            />
          </motion.div>

          <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}>
            <img
              src={IMAGES[2]} alt="High Fashion"
              className="w-full h-48 md:h-[400px] object-cover rounded-sm shadow-xl transition-all duration-500 hover:grayscale hover:opacity-80 cursor-pointer hover:shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. The "Problem/Solution" Section: Why this exists? */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-hm-black mb-4">Why This Exists</h2>
          <p className="font-sans text-sm uppercase tracking-widest text-hm-gray">Escaping Simplistic Analytics</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Old Way */}
          <div className="bg-gray-100 p-10 border border-gray-200 rounded-sm shadow-inner flex flex-col h-full transition-colors hover:bg-gray-200">
            <div className="flex items-center gap-3 mb-10 text-gray-500 border-b border-gray-200 pb-6 shrink-0">
              <XCircle size={28} />
              <h3 className="font-serif text-2xl font-bold text-hm-black flex items-end gap-2">
                The Old Way <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-widest leading-loose">(Simplistic)</span>
              </h3>
            </div>
            <div className="space-y-10 flex-1">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-hm-black mb-2 flex items-center gap-2"><ShieldAlert size={16} className="text-hm-gray" /> Rule-based</h4>
                <p className="text-gray-600 font-sans leading-relaxed">"You bought a blue shirt, here are blue pants."</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-hm-black mb-2 flex items-center gap-2"><ShieldAlert size={16} className="text-hm-gray" /> Static</h4>
                <p className="text-gray-600 font-sans leading-relaxed">Ignores that a user's style evolves over time.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-hm-black mb-2 flex items-center gap-2"><ShieldAlert size={16} className="text-hm-gray" /> Reactive</h4>
                <p className="text-gray-600 font-sans leading-relaxed">Waits for a customer to leave (Churn) before taking action.</p>
              </div>
            </div>
          </div>

          {/* Engine Way */}
          <div className="bg-white p-10 border-2 border-red-100 rounded-sm shadow-xl relative overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl hover:border-red-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 opacity-30 blur-3xl rounded-full translate-x-1/3 -translate-y-1/4"></div>
            <div className="flex items-center gap-3 mb-10 text-hm-red border-b border-red-100 pb-6 relative z-10 shrink-0">
              <CheckCircle2 size={28} />
              <h3 className="font-serif text-2xl font-bold text-hm-black flex items-end gap-2">
                The Engine Way <span className="text-[11px] font-sans font-bold text-hm-red uppercase tracking-widest leading-loose">(Advanced)</span>
              </h3>
            </div>
            <div className="space-y-10 relative z-10 flex-1">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-hm-black mb-2 flex items-center gap-2"><Cpu size={16} className="text-hm-red" /> Multimodal</h4>
                <p className="text-gray-700 font-sans leading-relaxed font-normal">Analyzes the visual aesthetic of the shirt and the sequential intent of the user.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-hm-black mb-2 flex items-center gap-2"><Cpu size={16} className="text-hm-red" /> Dynamic</h4>
                <p className="text-gray-700 font-sans leading-relaxed font-normal">Detects Customer Style Drift to pivot retention strategies in real-time.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-hm-black mb-2 flex items-center gap-2"><Cpu size={16} className="text-hm-red" /> Proactive</h4>
                <p className="text-gray-700 font-sans leading-relaxed font-normal">Predicts churn probability with an incredible <strong className="text-hm-red font-bold">0.88 Recall</strong> strictly before the next cycle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The "Engine Specs" (The Technical Flex) */}
      <section className="py-24 bg-zinc-50 border-t border-gray-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl font-bold text-hm-black mb-4">The Spec Sheet</h2>
            <p className="font-sans text-sm uppercase tracking-widest text-hm-gray">Production-Ready Heavy Lifting</p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">

            {/* Spec 1 */}
            <div className="flex flex-col gap-5 border-t-2 border-hm-black pt-6 hover:bg-white hover:shadow-xl transition-all p-6 -m-6 rounded-sm">
              <div className="text-hm-red mb-2">
                <Database size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-hm-black">Big Data Backbone</h3>
              <ul className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed list-none">
                <li className="flex items-start gap-3"><span className="text-hm-red mt-0.5 font-bold">•</span> Processed 31 Million transactions and 1.3 Million customers.</li>
                <li className="flex items-start gap-3"><span className="text-hm-red mt-0.5 font-bold">•</span> Engineered with Polars on high-memory GCP instances for 10x faster joins than Pandas.</li>
              </ul>
            </div>

            {/* Spec 2 */}
            <div className="flex flex-col gap-5 border-t-2 border-hm-black pt-6 hover:bg-white hover:shadow-xl transition-all p-6 -m-6 rounded-sm">
              <div className="text-hm-red mb-2">
                <Code2 size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-hm-black">The Architecture</h3>
              <ul className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed list-none">
                <li className="flex items-start gap-3"><span className="text-hm-red mt-0.5 font-bold">•</span> <span><strong>Multimodal Two-Tower Model:</strong> Merges visual CNN embeddings with sequential metadata.</span></li>
              </ul>
            </div>

            {/* Spec 3 */}
            <div className="flex flex-col gap-5 border-t-2 border-hm-black pt-6 hover:bg-white hover:shadow-xl transition-all p-6 -m-6 rounded-sm">
              <div className="text-hm-red mb-2">
                <Cloud size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-hm-black">Zero-Overload Cloud Design</h3>
              <ul className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed list-none">
                <li className="flex items-start gap-3"><span className="text-hm-red mt-0.5 font-bold">•</span> Hosted on Google Cloud Run to ensure stability beyond local hardware limits.</li>
                <li className="flex items-start gap-3"><span className="text-hm-red mt-0.5 font-bold">•</span> <span><strong>Production Monitoring:</strong> Full experiment tracking via MLflow. Model registry and versioning to ensure reproducible "Production-Ready" results.</span></li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="pb-32 px-6 bg-zinc-50 pt-10">
        <div className="max-w-4xl mx-auto bg-red-50/50 border border-red-100 p-8 md:p-12 text-center rounded-sm hover:shadow-lg transition-shadow">
          <h4 className="font-sans text-xs uppercase tracking-widest text-hm-red mb-6 font-bold">Founder's Note</h4>
          <p className="font-serif text-xl md:text-2xl text-hm-black italic leading-relaxed font-light">
            "While standard academic projects rely on sampled data, this engine was architected to handle the raw reality of retail: 31 Million transactions. By offloading compute to Google Cloud's high-memory Vertex instances, I eliminated the 'Local Machine Bottleneck' to focus on high-fidelity, production-ready inference."
          </p>
        </div>
      </section>

      {/* Note: The Live Status Ticker (Social Proof) is globally injected via App.jsx */}
    </div>
  );
}
