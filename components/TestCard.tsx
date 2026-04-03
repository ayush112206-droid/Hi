'use client';

import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

interface TestCardProps {
  name: string;
  onClick: () => void;
}

export function TestCard({ name, onClick }: TestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex items-center justify-between gap-4 group"
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors">
          {name}
        </h3>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-8 rounded-xl transition-all shrink-0 whitespace-nowrap min-w-[140px] shadow-lg shadow-emerald-500/20"
      >
        <PlayCircle className="w-5 h-5" />
        <span>Start Test</span>
      </motion.button>
    </motion.div>
  );
}
