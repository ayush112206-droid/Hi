'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface BatchCardProps {
  name: string;
  image: string;
  onClick: () => void;
}

export function BatchCard({ name, image, onClick }: BatchCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden flex flex-col group h-full border border-white/10 hover:border-emerald-500/50 transition-all duration-300"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={image || 'https://picsum.photos/seed/batch/800/450'}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold line-clamp-2 mb-4 group-hover:text-emerald-400 transition-colors min-h-[3rem]">
          {name}
        </h3>
        
        <button
          onClick={onClick}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 group/btn"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
