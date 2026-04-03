'use client';

import { motion } from 'framer-motion';

interface ClassCardProps {
  name: string;
  onClick: () => void;
}

export function ClassCard({ name, onClick }: ClassCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card p-8 flex items-center justify-center text-center group w-full"
    >
      <h3 className="text-xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
        {name}
      </h3>
    </motion.button>
  );
}
