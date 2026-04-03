'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ExamCardProps {
  name: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
}

export function ExamCard({ name, icon: Icon, onClick, isActive }: ExamCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card p-4 flex flex-col items-center justify-center gap-3 text-center group w-full transition-all ${isActive ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-500/20' : 'bg-emerald-500/10 group-hover:bg-emerald-500/20'}`}>
        <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-emerald-400' : 'text-emerald-400'}`} />
      </div>
      <h3 className={`text-sm font-semibold tracking-tight transition-colors ${isActive ? 'text-emerald-400' : ''}`}>{name}</h3>
    </motion.button>
  );
}
