'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-500 mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-red-500">Disclaimer</h1>
          <div className="space-y-6 text-white/70 leading-relaxed font-sans">
            <p>
              The information provided on VIP Study is for general educational purposes only. 
              While we strive to keep the content accurate and up-to-date, we make no 
              representations or warranties of any kind about the completeness, accuracy, 
              reliability, or suitability of the information.
            </p>
            <p>
              Any reliance you place on such information is strictly at your own risk. 
              VIP Study is not responsible for any losses or damages incurred in connection 
              with the use of our website or materials.
            </p>
            <p>
              Our test series and study materials are designed to supplement your learning 
              and do not guarantee success in any competitive exam. We recommend using 
              multiple sources for your preparation.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
