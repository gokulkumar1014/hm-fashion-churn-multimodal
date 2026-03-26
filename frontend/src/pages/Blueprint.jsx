import React from 'react';
import { motion } from 'framer-motion';
import { 
  GitMerge, Database, Cpu, Layout, 
  Activity, Cloud, Server, Box, Focus, ChevronRight
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Blueprint() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans overflow-x-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full pl-6 md:pl-32 lg:pl-48 xl:pl-64">
        
        {/* Header Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">System Architecture</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-hm-black leading-tight tracking-tight mb-6">
            The Blueprint
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl leading-relaxed">
            From 31 million flat transactions to a unified, context-aware artificial intelligence. Here is the technical foundation supporting the Social Pulse platform.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-24"
        >
          {/* 01. THE CONVERGENCE */}
          <motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-12 top-0 text-6xl font-serif text-gray-100 font-bold hidden md:block select-none group-hover:text-blue-50 transition-colors duration-500">01</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100">
                <GitMerge size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Convergence: Why This Project Exists</h2>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <blockquote className="border-l-4 border-blue-500 pl-6 italic text-lg text-gray-600 mb-8 font-serif leading-relaxed">
                "You can build the smartest AI model in the world, but without a clean interface and cloud-native integration, it stays invisible."
              </blockquote>
              <p className="text-gray-600 leading-relaxed text-[15px] md:text-base">
                This project was born at the intersection of AI Research and Full-Stack Engineering. To solve the problem of customer churn at a 31-million-transaction scale, I realized that deep learning alone wasn't enough. It required a robust data backbone, a scalable cloud environment, and a bridge to the end-user.
              </p>
            </div>
          </motion.section>

          {/* 02. THE RAW REALITY */}
          <motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-12 top-0 text-6xl font-serif text-gray-100 font-bold hidden md:block select-none group-hover:text-purple-50 transition-colors duration-500">02</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shadow-sm border border-purple-100">
                <Database size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Raw Reality: The Dataset</h2>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <p className="text-gray-600 leading-relaxed text-[15px] md:text-base mb-8">
                To build an industrial-grade engine, we moved beyond academic "toy" datasets and ingested the H&M Personalized Fashion reality:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Articles", count: "105k+", desc: "Detailed metadata (Article ID, Product Type, Graphics, and Descriptions)." },
                  { label: "Customers", count: "1.3M+", desc: "Individual demographics and membership statuses." },
                  { label: "Transactions", count: "31M+", desc: "High-frequency interaction data mapping the pulse of retail." },
                  { label: "Images", count: "30GB", desc: "Raw visual pixels representing the aesthetic intent of the catalog." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 group hover:border-purple-200 hover:bg-white transition-all">
                    <div className="flex items-baseline gap-3 mb-3">
                      <h4 className="font-serif text-xl text-hm-black">{item.label}</h4>
                      <span className="font-mono text-xs font-bold text-purple-500 bg-purple-100/50 px-2 py-1 rounded">{item.count}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 03. TWO TOWER ARCHITECTURE */}
          <motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-12 top-0 text-6xl font-serif text-gray-100 font-bold hidden md:block select-none group-hover:text-rose-50 transition-colors duration-500">03</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100">
                <GitMerge size={24} className="transform rotate-90" />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Multi-Modal "Two-Tower" Architecture</h2>
            </div>
            <div className="bg-gradient-to-br from-white/95 to-rose-50/30 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <p className="text-gray-600 leading-relaxed text-[15px] md:text-base mb-10">
                The core innovation of this engine is the <strong>Fusion of Senses</strong>. We don't just look at when a person shops; we look at what aesthetic they are chasing.
              </p>
              
              <div className="space-y-8">
                {/* Tower A */}
                <div className="relative pl-8 border-l-2 border-rose-200">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-rose-500"></div>
                  <h3 className="font-serif text-xl text-hm-black mb-4">Tower A: The Behavioral Brain (Phase 1)</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600"><strong className="text-gray-900">The Tech:</strong> Polars + LSTM (Long Short-Term Memory).</p>
                    <p className="text-sm text-gray-600"><strong className="text-gray-900">The Logic:</strong> We transformed 31M flat records into 3D temporal tensors. By analyzing the latest 27 transactions per user, the model "hears" the rhythm of the shopping cycle.</p>
                    <p className="text-sm text-gray-600"><strong className="text-gray-900">The Result:</strong> A baseline 77% Recall.</p>
                  </div>
                </div>

                {/* Tower B */}
                <div className="relative pl-8 border-l-2 border-orange-200">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-orange-500"></div>
                  <h3 className="font-serif text-xl text-hm-black mb-4">Tower B: The Visual DNA (Phase 2)</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600"><strong className="text-gray-900">The Tech:</strong> ResNet-50 (CNN) + NVIDIA L4 GPU.</p>
                    <p className="text-sm text-gray-600"><strong className="text-gray-900">The Logic:</strong> Using a pre-trained ResNet-50, we converted 30GB of raw pixels into 2,048-dimensional mathematical "embeddings." We effectively shrank 30GB of data into an 800MB "Style DNA" vault.</p>
                    <div className="mt-4 bg-orange-50/80 border border-orange-100 p-4 rounded-lg">
                      <p className="text-sm text-orange-900"><strong className="font-bold">The Breakthrough:</strong> Fusing Visual DNA with Behavioral sequences broke the "Behavioral Glass Ceiling," elevating our final Recall to 0.88.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 04. INDUSTRIAL STACK */}
          <motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-12 top-0 text-6xl font-serif text-gray-100 font-bold hidden md:block select-none group-hover:text-emerald-50 transition-colors duration-500">04</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm border border-emerald-100">
                <Server size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Industrial Stack: Engineering for Scale</h2>
            </div>
            
            <p className="text-gray-500 mb-8 font-light text-sm md:text-base">
              To dismantle the 16GB local bottleneck, the entire laboratory was hosted on the Google Cloud Platform (GCP).
            </p>

            <div className="overflow-x-auto">
              <table className="w-fulltext-left border-collapse bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th className="py-4 px-6 text-xs font-mono tracking-widest uppercase text-gray-500 text-left">Component</th>
                    <th className="py-4 px-6 text-xs font-mono tracking-widest uppercase text-gray-500 text-left">Technology</th>
                    <th className="py-4 px-6 text-xs font-mono tracking-widest uppercase text-gray-500 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6 font-medium text-gray-900 border-l-4 border-emerald-500">Compute</td>
                    <td className="py-5 px-6"><span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded text-xs font-mono border border-emerald-100">Vertex AI Workbench</span></td>
                    <td className="py-5 px-6 text-sm text-gray-600 leading-relaxed font-light">Machine Type: n2-highmem-8 (8 vCPU, 4 core, 64 GB memory) for massive workload; g2-standard-16 (Graphics Optimized: 1 NVIDIA L4 GPU, 16 vCPUs, 64GB RAM) for final Model training.</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6 font-medium text-gray-900 border-l-4 border-blue-500">Data Engine</td>
                    <td className="py-5 px-6"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-mono border border-blue-100">Polars (Rust-based)</span></td>
                    <td className="py-5 px-6 text-sm text-gray-600 leading-relaxed font-light">Multithreaded execution for near-instant processing of 3.5GB tables.</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6 font-medium text-gray-900 border-l-4 border-purple-500">Storage</td>
                    <td className="py-5 px-6"><span className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-mono border border-purple-100">Google Cloud Storage</span></td>
                    <td className="py-5 px-6 text-sm text-gray-600 leading-relaxed font-light">A high-durability vault for our Parquet Data Lake.</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6 font-medium text-gray-900 border-l-4 border-rose-500">Inference</td>
                    <td className="py-5 px-6"><span className="bg-rose-50 text-rose-700 px-3 py-1 rounded text-xs font-mono border border-rose-100">ONNX Runtime</span></td>
                    <td className="py-5 px-6 text-sm text-gray-600 leading-relaxed font-light">Quantized model execution to achieve sub-1.5s response times.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* 05. MLOps LEDGER */}
          <motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-12 top-0 text-6xl font-serif text-gray-100 font-bold hidden md:block select-none group-hover:text-amber-50 transition-colors duration-500">05</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shadow-sm border border-amber-100">
                <Activity size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The MLOps Ledger: Experiment Tracking</h2>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <p className="text-gray-600 leading-relaxed text-[15px] md:text-base mb-8">
                We don't "guess" in this lab; we document. Using MLflow hosted on DagsHub, every hyperparameter and loss curve was logged for 100% reproducibility.
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1"><Focus className="text-amber-500" size={20} /></div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Experimentation</strong>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">Tracked multiple iterations of LSTM weights to solve class imbalance.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><Box className="text-amber-500" size={20} /></div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Model Registry</strong>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">Our "Champion Model" was versioned and registered before being pushed to the production API.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><Activity className="text-amber-500" size={20} /></div>
                  <div>
                    <strong className="text-gray-900 block mb-1">The Metric</strong>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">We prioritized Recall over Accuracy—because in churn prediction, missing a leaving customer is more expensive than a false alarm.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* 06. CLOUD-NATIVE BRIDGE */}
          <motion.section variants={itemVariants} className="relative group">
            <div className="absolute -left-12 top-0 text-6xl font-serif text-gray-100 font-bold hidden md:block select-none group-hover:text-cyan-50 transition-colors duration-500">06</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 shadow-sm border border-cyan-100">
                <Cloud size={24} />
              </div>
              <h2 className="text-3xl font-serif text-hm-black">The Cloud-Native Bridge</h2>
            </div>
            
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden border border-slate-700">
              {/* Outer Glow in Dark Mode */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none"></div>
              
              <p className="text-gray-300 leading-relaxed text-[15px] md:text-base mb-8 relative z-10 font-light">
                The final stage was turning a `.pth` model file into a live service.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-slate-800/80 border border-slate-700/50 p-6 rounded-xl backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
                  <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3 font-bold">Backend</h4>
                  <p className="text-sm text-gray-400 font-light leading-relaxed"><strong className="text-gray-200">FastAPI</strong> acting as an asynchronous gateway.</p>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/50 p-6 rounded-xl backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
                  <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3 font-bold">Frontend</h4>
                  <p className="text-sm text-gray-400 font-light leading-relaxed"><strong className="text-gray-200">React + Tailwind</strong> providing the "Executive Interface."</p>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/50 p-6 rounded-xl backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
                  <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3 font-bold">Deployment</h4>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">Containerized via <strong className="text-gray-200">Docker</strong> and deployed to <strong className="text-gray-200">GCP Cloud Run</strong>, utilizing internal VPC traffic to keep data egress costs near zero.</p>
                </div>
              </div>
            </div>
          </motion.section>

        </motion.div>
      </div>
    </div>
  );
}
