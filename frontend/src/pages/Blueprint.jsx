import { motion } from 'framer-motion';

const Section = ({ title, children, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay }}
    className="py-16 md:py-24 border-b border-gray-100 last:border-0"
  >
    <h2 className="font-serif text-4xl mb-6 text-hm-black">{title}</h2>
    <div className="font-sans text-lg font-light text-hm-gray leading-relaxed max-w-3xl">
      {children}
    </div>
  </motion.div>
);

export default function Blueprint() {
  return (
    <div className="w-full min-h-screen bg-hm-white py-12 px-6">
      <div className="max-w-4xl mx-auto pt-10">
        <p className="font-sans text-xs text-hm-red uppercase tracking-widest mb-4">Architecture</p>
        <h1 className="font-serif text-6xl md:text-8xl mb-24 text-hm-black">The Blueprint.</h1>
        
        <Section title="Why This Project?" delay={0.1}>
          <p className="mb-4">Historically, fashion recommendations have relied on simplistic "Next Best Action" logic. If a user buys a blue shirt, we recommend blue pants. This ignores the mathematical reality of <span className="text-hm-black font-medium">Customer Style Drift</span>.</p>
          <p>We built this engine to detect when a user is actively evolving their style, allowing us to pivot our retention strategies in real-time, preventing churn before it happens.</p>
        </Section>

        <Section title="The Hybrid Architecture" delay={0.2}>
          <p className="mb-4">Our engine bridges the gap between massive scale and zero-latency execution.</p>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong className="text-hm-black">Google Cloud Storage (GCS):</strong> Houses the 8.5GB Long-term Style DNA and 400MB Activity Sequences.</li>
            <li><strong className="text-hm-black">Polars LazyFrames:</strong> Executes predicate pushdowns to scan GCS massive parquets without downloading them entirely.</li>
            <li><strong className="text-hm-black">ONNX Runtime:</strong> Executes the quantified Visionary Champion neural network dynamically in milliseconds.</li>
            <li><strong className="text-hm-black">FastAPI:</strong> Orchestrates the logic in an asynchronous threadpool.</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
