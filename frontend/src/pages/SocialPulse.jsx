import { motion } from 'framer-motion';

export default function SocialPulse() {
  return (
    <div className="w-full min-h-screen bg-hm-light py-12 px-6 flex flex-col items-center justify-center">
      <motion.p 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="font-sans text-xs uppercase tracking-widest text-hm-red mb-4"
      >
        Global Analytics
      </motion.p>
      <motion.h1 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="font-serif text-5xl md:text-7xl text-hm-black mb-6"
      >
        Social Pulse.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="font-sans text-hm-gray text-center max-w-md font-light leading-relaxed"
      >
        Live Persona Trending Feed dropping soon. This engine will connect directly to the 
        <span className="font-medium text-hm-black"> persona_best_sellers.parquet </span> 
        asset to stream exactly what visual styles are trending globally across our entire demographic.
      </motion.p>
    </div>
  );
}
