import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-hm-white">
      {/* Background Graphic (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-hm-red blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-hm-black blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-hm-red font-sans font-semibold tracking-widest uppercase text-sm mb-6 block">
            The Next Generation CRM
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight mb-8">
            Preserving Loyalty <br />
            <span className="italic text-hm-gray">Through Multimodal Intelligence.</span>
          </h1>
        </motion.div>

        <motion.p 
          className="font-sans text-lg md:text-xl text-hm-gray max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A centralized Strategy Engine that moves beyond standard recommendation algorithms. Diagnose churn probability, analyze style drift, and orchestrate retention at scale.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="flex items-center gap-2 bg-hm-red text-hm-white px-8 py-4 font-sans uppercase tracking-wider text-sm hover:bg-red-700 transition-colors shadow-sm">
            Launch Engine <ArrowRight size={18} />
          </button>
          <button className="flex items-center gap-2 bg-transparent border border-hm-black text-hm-black px-8 py-4 font-sans uppercase tracking-wider text-sm hover:bg-hm-black hover:text-hm-white transition-colors">
            View Blueprint
          </button>
        </motion.div>
      </div>
    </section>
  );
}
