'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black p-8 text-white"
        >
          {/* Top Text */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold tracking-widest text-emerald-500"
          >
            PW Test Series
          </motion.div>

          {/* Center Logo & Name */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5 
              }}
              className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <Image
                src="https://th.bing.com/th/id/OIP.ObHeAHmD-Ytv0DWCFiH0xAHaHa?w=174&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
                alt="VIP Study Logo"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-4xl md:text-6xl font-display font-bold tracking-tighter"
            >
              VIP <span className="text-emerald-500">Study</span>
            </motion.h1>
          </div>

          {/* Bottom Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-sm font-medium text-white/40 uppercase tracking-[0.3em]"
          >
            Powered by Raj
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
