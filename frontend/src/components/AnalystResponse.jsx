import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function AnalystResponse({
  narrative,
  data,
  RiskCard,
  StrategyCard,
  VisualTwinsFeed,
  RecentHistoryFeed
}) {
  // Container variants that stagger its children by 0.2s
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 w-full"
    >
      {/* LLM Narrative Bubble */}
      <motion.div variants={item} className="w-full">
        <div className="px-6 py-5 font-sans text-sm leading-relaxed bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm text-hm-black rounded-r-2xl rounded-bl-2xl">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-hm-black" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />
            }}
          >
            {narrative}
          </ReactMarkdown>
        </div>
      </motion.div>

      {/* CRM Data Injection (Only appears if data exists) */}
      {data && (
        <motion.div variants={item} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <RiskCard assessment={data.risk_assessment} />
          <StrategyCard strategy={data.strategy} />
          <RecentHistoryFeed title="Recent Activity" items={data.recent_activity_feed} />
          <VisualTwinsFeed title="Visual Recommendations" items={data.orchestrated_recommendations} />
        </motion.div>
      )}
    </motion.div>
  );
}
