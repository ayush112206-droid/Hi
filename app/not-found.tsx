'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center glass-card p-12 max-w-lg w-full"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-6xl font-display font-bold mb-4 premium-gradient-text">404</h1>
        <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
        
        <p className="text-white/60 mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 px-8 rounded-2xl transition-all hover:scale-105 active:scale-95"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
