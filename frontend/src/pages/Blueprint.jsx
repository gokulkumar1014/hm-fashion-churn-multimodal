import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  GitMerge,
  Database,
  Cpu,
  Activity,
  Cloud,
  Server,
  Box,
  Focus
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const HoverableCard = ({ className = '', hoverClassName = '', children, ...rest }) => {
  const [isActive, setIsActive] = useState(false);
  const handleActivate = () => setIsActive(true);
  const handleDeactivate = () => setIsActive(false);
  const combinedClassName = `${className} ${isActive ? hoverClassName : ''}`.trim();

  return (
    <div
      {...rest}
      className={combinedClassName}
      onPointerEnter={handleActivate}
      onPointerLeave={handleDeactivate}
      onPointerDown={handleActivate}
      onPointerUp={handleDeactivate}
    >
      {children}
    </div>
  );
};

export default function Blueprint() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans overflow-x-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
        
        {/* Header Header */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20 space-y-6"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-2 w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">System Architecture</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-hm-black leading-tight tracking-tight">
            The Blueprint
          </h1>
          <div className="relative">
            <div className="absolute inset-0 transform scale-95 md:scale-100 rounded-[30px] bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-[0_35px_60px_rgba(15,23,42,0.18)] opacity-90 pointer-events-none"></div>
            <div className="relative rounded-[30px] border border-slate-200/90 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_70px_rgba(15,23,42,0.2)] space-y-6 overflow-hidden">
              <div className="absolute -bottom-10 -right-12 w-40 h-40 rounded-full bg-blue-200/40 blur-[80px] pointer-events-none"></div>
              <div className="absolute -top-10 left-1/4 w-36 h-36 rounded-full bg-amber-200/30 blur-[60px] pointer-events-none"></div>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed relative">
                Let me be very honest: I used to hate the idea of a <strong>churn prediction</strong> project. In the academic world, it's often seen as the <strong>'safe' choice</strong> - a predictable exercise in <strong>logistic regression</strong> that usually ends up as a static file on a forgotten hard drive. But I realized that while the topic might be common, the <strong>business value</strong> is undeniable. In a <strong>31-million-transaction <span className="text-slate-900 font-semibold">H&M</span></strong> ecosystem, churn is a silent, <strong>multi-million dollar</strong> killer.
              </p>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed relative">
                I didn't want to build another <strong>'toy' model</strong>. I wanted to test my ability to handle the engineering weight of a <strong>1.3-million-customer universe</strong> on the cloud. I wanted to break the <strong>Behavioral Glass Ceiling</strong> and see if I could fuse <strong>Computer Vision</strong> with temporal logic. This project isn't just about math; it's about building the <strong>bridge</strong> between raw AI and a clean, usable interface. Because an engine that only hears the rhythm but misses the soul isn't just blind - it's <strong>obsolete</strong>.
              </p>
            </div>
          </div>
        </Motion.div>
        <Motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-24"
        >
          {/* 01. THE CONVERGENCE */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-16 top-0 text-6xl font-serif text-blue-200 font-bold hidden md:block select-none px-3 py-1">
              01
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100">
                <GitMerge size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Convergence: Why This Project Exists</h2>
            </div>
            <HoverableCard
              className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-slate-50 border border-slate-200/60 rounded-2xl p-8 md:p-12 shadow-[0_18px_40px_-18px_rgba(59,130,246,0.28)] transition-transform duration-300 hover:-translate-y-1"
              hoverClassName="-translate-y-1 shadow-[0_18px_40px_-18px_rgba(59,130,246,0.28)]"
            >
              <blockquote className="border-l-4 border-blue-500 pl-6 italic text-lg text-slate-900 mb-8 font-serif leading-relaxed">
                "You can build the smartest AI model in the world, but without a clean interface and cloud-native integration, it stays invisible."
              </blockquote>
              <p className="text-slate-900 leading-relaxed text-[15px] md:text-base">
                This project was born at the intersection of AI Research and Full-Stack Engineering. To solve the problem of customer churn at a 31-million-transaction scale, I realized that deep learning alone wasn't enough. It required a robust data backbone, a scalable cloud environment, and a bridge to the end-user.
              </p>
            </HoverableCard>
          </Motion.section>

          {/* 02. The Scale of the Beast: The H&M Dataset */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-16 top-0 text-6xl font-serif text-purple-200 font-bold hidden md:block select-none px-3 py-1">
              02
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shadow-sm border border-purple-100">
                <Database size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Scale of the Beast: The H&amp;M Dataset</h2>
            </div>
            <HoverableCard
              className="relative overflow-hidden bg-gradient-to-br from-violet-100 via-violet-50 to-indigo-50 border border-slate-200/60 rounded-2xl p-8 md:p-12 shadow-[0_18px_40px_-18px_rgba(91,33,182,0.28)] transition-transform duration-300 hover:-translate-y-1"
              hoverClassName="-translate-y-1 shadow-[0_18px_40px_-18px_rgba(91,33,182,0.28)]"
            >
              <p className="text-slate-800 leading-relaxed text-[15px] md:text-base mb-8 font-medium">
                To build an engine capable of handling real-world retail complexity, I leaned on the{' '}
                <a className="text-blue-600 underline" href="https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/data" target="_blank" rel="noreferrer">
                  H&amp;M Personalized Fashion Recommendations dataset
                </a>. The scale pushed us beyond local compute into a high-performance cloud ecosystem.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Transactions', count: '31.7M+', desc: '733 days of behavioral signals mapping the pulse of 1.3M customers.' },
                  { label: 'Articles', count: '105k+', desc: 'Deep metadata across 25 columns—product types, color groups, rich descriptions.' },
                  { label: 'Customers', count: '1.3M+', desc: 'Demographic spine including club status and age for cohort intelligence.' },
                  { label: 'Images', count: '30GB', desc: 'Raw pixels capturing the visual essence of the H&M catalog.' }
                ].map((item, idx) => (
                  <HoverableCard
                    key={idx}
                    className="bg-gradient-to-br from-white via-slate-50 to-violet-50 border border-gray-200 rounded-xl p-7 group hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(15,23,42,0.3)] transition-all duration-300"
                    hoverClassName="-translate-y-1 shadow-[0_18px_36px_-14px_rgba(15,23,42,0.3)]"
                  >
                    <div className="flex items-baseline gap-3 mb-3">
                      <h4 className="font-serif text-xl text-hm-black">{item.label}</h4>
                      <span className="font-mono text-xs font-bold text-purple-500 bg-purple-100/50 px-2 py-1 rounded">{item.count}</span>
                    </div>
                    <p className="text-sm text-slate-900 leading-relaxed font-light">{item.desc}</p>
                  </HoverableCard>
                ))}
              </div>

            </HoverableCard>
          </Motion.section>

          {/* Infrastructure & Tech Stack Moat */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-16 top-0 text-6xl font-serif text-emerald-200 font-bold hidden md:block select-none px-3 py-1">
              03
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm border border-emerald-100">
                <Cpu size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">Infrastructure &amp; The "Tech Stack" Moat</h2>
            </div>
            <HoverableCard
              className="relative overflow-hidden border border-slate-200/60 rounded-2xl p-8 md:p-12 shadow-[0_18px_40px_-18px_rgba(5,150,105,0.28)] space-y-6 transition-transform duration-300 hover:-translate-y-1"
              hoverClassName="-translate-y-1 shadow-[0_18px_40px_-18px_rgba(5,150,105,0.28)]"
            >
              <p className="text-slate-800 leading-relaxed text-[15px] md:text-base">
                Handling 31 million records and 30GB of imagery requires an architecture that prioritizes memory efficiency and high-throughput I/O.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <HoverableCard
                  className="p-5 bg-gradient-to-br from-white via-teal-50 to-emerald-50 border border-teal-100 rounded-xl shadow-sm space-y-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(13,148,136,0.3)]"
                  hoverClassName="-translate-y-1 shadow-[0_18px_36px_-14px_rgba(13,148,136,0.3)]"
                >
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm uppercase tracking-wide">
                    <Server size={18} /> Compute Engine
                  </div>
                  <p className="text-slate-900 text-sm leading-relaxed">
                    <strong>Vertex AI Workbench (GCP)</strong>. <strong>n2-highmem-8 (64GB RAM)</strong> for heavy ETL/joins; pivot to <strong>g2-standard-16 (NVIDIA L4 GPU)</strong> for deep-learning inference.
                  </p>
                </HoverableCard>
                <HoverableCard
                  className="p-5 bg-gradient-to-br from-white via-teal-50 to-emerald-50 border border-teal-100 rounded-xl shadow-sm space-y-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(13,148,136,0.3)]"
                  hoverClassName="-translate-y-1 shadow-[0_18px_36px_-14px_rgba(13,148,136,0.3)]"
                >
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm uppercase tracking-wide">
                    <Activity size={18} /> Data Processing
                  </div>
                  <p className="text-slate-900 text-sm leading-relaxed">
                    <strong>Polars over pandas</strong>: <strong>Rust-based</strong>, multi-threaded execution delivering near-instant scans on multi-GB parquet without blowing RAM.
                  </p>
                </HoverableCard>
                <HoverableCard
                  className="p-5 bg-gradient-to-br from-white via-teal-50 to-emerald-50 border border-teal-100 rounded-xl shadow-sm space-y-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(13,148,136,0.3)]"
                  hoverClassName="-translate-y-1 shadow-[0_18px_36px_-14px_rgba(13,148,136,0.3)]"
                >
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm uppercase tracking-wide">
                    <Box size={18} /> Experiment Tracking
                  </div>
                  <p className="text-slate-900 text-sm leading-relaxed">
                    <strong>MLflow ledger</strong>: Every hyperparameter and loss curve logged for <strong>100% reproducibility</strong> and auditability.
                  </p>
                </HoverableCard>
              </div>
            </HoverableCard>
          </Motion.section>

          {/* 03. TWO TOWER ARCHITECTURE */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-16 top-0 text-6xl font-serif text-rose-200 font-bold hidden md:block select-none px-3 py-1">
              04
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100">
                <GitMerge size={24} className="transform rotate-90" />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Multi-Modal "Two-Tower" Architecture</h2>
            </div>
            <div className="relative overflow-hidden border border-rose-100/60 rounded-2xl p-8 md:p-12 shadow-[0_20px_25px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/45 via-white/60 to-slate-100/20 pointer-events-none"></div>
              <div className="relative z-10 space-y-8">
                <p className="text-slate-900 leading-relaxed text-[15px] md:text-base mb-10">
                  The core innovation of this engine is the <strong>Fusion of Senses</strong>. We don't just look at when a person shops; we look at what aesthetic they are chasing.
                </p>

                <div className="space-y-8">
                {/* Tower A */}
                <div className="relative pl-8 border-l-2 border-rose-200">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-rose-500"></div>
                  <h3 className="font-serif text-xl text-hm-black mb-4">Tower A: The Behavioral Brain (Phase 1)</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-900">
                      <strong className="text-gray-900">The Tech:</strong> Polars + LSTM (Long Short-Term Memory).
                    </p>
                    <p className="text-sm text-slate-900">
                      <strong className="text-gray-900">The Logic:</strong> I transformed 31M flat records into 3D temporal tensors. By analyzing the latest 27 transactions per user, the model "hears" the rhythm of the shopping cycle.
                    </p>
                    <p className="text-sm text-slate-900">
                      <strong className="text-gray-900">The Result:</strong> A baseline 77% Recall.
                    </p>
                  </div>
                </div>

                {/* Tower B */}
                <div className="relative pl-8 border-l-2 border-rose-200">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-rose-500"></div>
                  <h3 className="font-serif text-xl text-hm-black mb-4">Tower B: The Visual DNA (Phase 2)</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-900">
                      <strong className="text-gray-900">The Tech:</strong> ResNet-50 (CNN) + NVIDIA L4 GPU.
                    </p>
                    <p className="text-sm text-slate-900">
                      <strong className="text-gray-900">The Logic:</strong> Using a pre-trained ResNet-50, I converted 30GB of raw pixels into 2,048-dimensional mathematical "embeddings." I effectively shrank 30GB of data into an 800MB "Style DNA" vault.
                    </p>
                      <div className="mt-4 bg-white/80 border border-rose-200 p-4 rounded-lg shadow-[0_15px_30px_rgba(59,130,246,0.1)]">
                        <p className="text-sm text-rose-600">
                          <strong className="font-bold">The Breakthrough:</strong> Fusing Visual DNA with Behavioral sequences broke the "Behavioral Glass Ceiling," elevating our final Recall to 0.88.
                        </p>
                      </div>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-sm md:text-base text-slate-800 leading-relaxed">
                For a line-by-line breakdown of the <strong>"Aesthetic Drift"</strong> hypothesis and the full architecture, read the <a className="text-blue-600 underline font-semibold" href="https://medium.com/@gokulkumar0639/the-architecture-of-aesthetic-intelligence-engineering-a-two-tower-multi-modal-churn-engine-b9bf97a5a35c" target="_blank" rel="noreferrer">Technical Deep-Dive on Medium</a>.
              </p>
            </div>
          </div>
        </Motion.section>

          {/* 05. THE ENGINEERING STRATEGY */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-16 top-0 text-6xl font-serif text-slate-400 font-bold hidden md:block select-none px-3 py-1">
              05
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-800 rounded-xl text-slate-200 shadow-sm border border-slate-700">
                <Cpu size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">Implementation of the Engineering Strategy</h2>
            </div>
            <div className="relative overflow-hidden border border-slate-200 rounded-2xl p-10 md:p-14 shadow-[0_20px_40px_rgba(15,23,42,0.1)] space-y-8">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 via-slate-100/70 to-white/60 pointer-events-none"></div>
              <div className="relative space-y-8">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold relative z-10">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span> SYSTEMS OPTIMIZATION
              </div>
              <blockquote className="border-l-4 border-slate-300 pl-6 italic text-base text-slate-900 relative z-10">
                "Building a model is easy; building a system that doesn't crash is the real challenge."
              </blockquote>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <HoverableCard
                  className="rounded-2xl bg-white/90 border border-slate-100 p-6 space-y-4 shadow-[0_10px_25px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-transform duration-300"
                  hoverClassName="-translate-y-1 shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                >
                  <h3 className="font-serif text-xl text-hm-black">The Style Centroid: The Predictive Anchor</h3>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">Dimensional Compression:</strong> We replace the high-latency overhead of tracking 50+ individual item IDs with one high-fidelity 2,048-dimensional "Vibe" vector.
                  </p>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">Automatic Noise Reduction:</strong> Outliers like a one-off "Ugly Christmas Sweater" gift are mathematically suppressed. The centroid naturally pulls back toward the customer’s core signal, preserving the integrity of their true style.
                  </p>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">Zero-Shot Discovery:</strong> By mapping brand-new arrivals into the same latent space, we can recommend items with zero sales history. Proximity to the customer’s centroid allows for instant, accurate discovery without prior interactions.
                  </p>
                </HoverableCard>
                <HoverableCard
                  className="rounded-2xl bg-white/90 border border-slate-100 p-6 space-y-4 shadow-[0_10px_25px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-transform duration-300"
                  hoverClassName="-translate-y-1 shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                >
                  <h3 className="font-serif text-xl text-hm-black">The Index Bridge (Memory Optimization)</h3>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Challenge:</strong> Joining 31.7M transactions with 2,048-dim vectors creates a 256 GB RAM explosion.
                  </p>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Logic:</strong> Instead of a raw vector join, I implemented a lightweight "Address Book" strategy, mapping every article to a 4-byte integer pointer.
                  </p>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Result:</strong> Reduced memory footprint by 99.9%, allowing the calculation of 1.3M Customer Style Centroids in minutes on standard GCP hardware.
                  </p>
                </HoverableCard>
                <HoverableCard
                  className="rounded-2xl bg-white border border-slate-100 p-6 space-y-4 shadow-[0_10px_25px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-transform duration-300"
                  hoverClassName="-translate-y-1 shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                >
                  <h3 className="font-serif text-xl text-hm-black">Differential Learning (Preserving the Brain)</h3>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Challenge:</strong> Fusing two pre-trained systems risks "Catastrophic Forgetting" where the new vision data overwrites the behavioral memory.
                  </p>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Strategy:</strong> I "locked" the LSTM Branch at a near-static learning rate (<span className="font-mono text-slate-600">1e<sup>-5</sup></span>) while allowing the Vision Branch to learn aggressively (<span className="font-mono text-slate-600">1e<sup>-3</sup></span>).
                  </p>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Result:</strong> The model maintained its 77% behavioral proficiency while rapidly adapting to new visual "Aesthetic Drift" signals.
                  </p>
                </HoverableCard>
                <HoverableCard
                  className="rounded-2xl bg-white border border-slate-100 p-6 space-y-4 shadow-[0_10px_25px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-transform duration-300"
                  hoverClassName="-translate-y-1 shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                >
                  <h3 className="font-serif text-xl text-hm-black">The Last Mile: Quantization & The Speed Edge</h3>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Logic:</strong> Dynamic INT8 Quantization converted weights from FP32 to 8-bit integers and leveraged CPU-optimized kernels, shrinking the vision model 4x.
                  </p>
                  <p className="text-sm text-slate-900 font-light">
                    <strong className="text-hm-black">The Result:</strong> Sub-200ms inference latency, making "Aesthetic Intelligence" feel instantaneous in production.
                  </p>
                </HoverableCard>
              </div>
            </div>
          </div>
          </Motion.section>
          {/* 06. MLOps LEDGER */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-16 top-0 text-6xl font-serif text-amber-200 font-bold hidden md:block select-none px-3 py-1">
              06
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shadow-sm border border-amber-100">
                <Activity size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The MLOps Ledger: Experiment Tracking</h2>
            </div>
            <div className="relative overflow-hidden border border-slate-200/70 rounded-2xl p-8 md:p-12 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-white/80 to-slate-50 pointer-events-none"></div>
              <div className="relative z-10 space-y-8">
                <p className="text-slate-800 leading-relaxed text-[15px] md:text-base mb-8">
                  We don't "guess" in this lab! we document. Using MLflow hosted on DagsHub, every hyperparameter and loss curve was logged for 100% reproducibility.
                </p>

                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="mt-1">
                      <Focus className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <strong className="text-gray-900 block mb-1">Experimentation</strong>
                      <p className="text-sm text-slate-900 font-light leading-relaxed">Tracked multiple iterations of LSTM weights to solve class imbalance.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1">
                      <Box className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <strong className="text-gray-900 block mb-1">Model Registry</strong>
                      <p className="text-sm text-slate-900 font-light leading-relaxed">Our "Champion Model" was versioned and registered before being pushed to the production API.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1">
                      <Activity className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <strong className="text-gray-900 block mb-1">The Metric</strong>
                      <p className="text-sm text-slate-900 font-light leading-relaxed">
                        We prioritized Recall over Accuracy because in churn prediction, missing a leaving customer is more expensive than a false alarm.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="flex flex-col gap-3 text-sm text-slate-600 pt-4 border-t border-amber-100/70">
                  <span>
                    For detailed logs and model registry: <a className="text-blue-600 underline font-semibold" href="https://dagshub.com/gokulkumar1014/hm-fashion-churn-multimodal/experiments" target="_blank" rel="noreferrer">MLflow</a>
                  </span>
                  <span>
                    For the complete architectural codebase and implementation: <a className="text-blue-600 underline font-semibold" href="https://github.com/gokulkumar1014/hm-fashion-churn-multimodal" target="_blank" rel="noreferrer">GitHub</a>
                  </span>
                </div>
              </div>
            </div>
          </Motion.section>

          {/* 07. CLOUD-NATIVE BRIDGE */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-16 top-0 text-6xl font-serif text-cyan-200 font-bold hidden md:block select-none px-3 py-1">
              07
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 shadow-sm border border-cyan-100">
                <Cloud size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Cloud-Native Bridge</h2>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200/70 rounded-2xl p-8 md:p-12 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_70%)] pointer-events-none"></div>
              <p className="text-slate-600 leading-relaxed text-[15px] md:text-base mb-8 relative z-10 font-light">
                The final stage was turning a `.pth` model file into a live service.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                  {
                    label: 'Backend',
                    desc: <><strong className="text-slate-900">FastAPI</strong> acting as an asynchronous gateway.</>
                  },
                  {
                    label: 'Frontend',
                    desc: <><strong className="text-slate-900">React + Tailwind</strong> providing the "Executive Interface."</>
                  },
                  {
                    label: 'Deployment',
                    desc: <><strong className="text-slate-900">Docker</strong> + <strong className="text-slate-900">GCP Cloud Run</strong>, containerized with internal VPC traffic for efficient egress.</>
                  }
                ].map((item) => (
                  <HoverableCard
                    key={item.label}
                    className="bg-white/80 border border-slate-200 rounded-xl p-6 shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:bg-white hover:border-cyan-300 transform hover:-translate-y-1 transition duration-300"
                    hoverClassName="hover:bg-white hover:border-cyan-300 -translate-y-1"
                  >
                    <h4 className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-3 font-bold">{item.label}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </HoverableCard>
                ))}
              </div>
            </div>
          </Motion.section>

          {/* DISCLAIMER */}
          <Motion.section variants={itemVariants} className="relative group">
            <div className="mt-16 p-8 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_30px_rgba(15,23,42,0.08)]">
              <p className="text-sm text-slate-600 leading-relaxed">
                Disclaimer: This is an independent educational case study. This H&amp;M Intelligence Lab is not affiliated with, sponsored by, or endorsed by H&amp;M Group. All trademarks are the property of their respective owners.
              </p>
            </div>
          </Motion.section>
        </Motion.div>
    </div>
  </div>
  );
}
