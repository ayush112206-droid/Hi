'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold mb-8">About VIP Study</h1>
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>
              Welcome to VIP Study, your premier destination for high-quality test series and educational resources. 
              We are dedicated to helping students achieve their academic goals through meticulously crafted 
              study materials and practice tests.
            </p>
            <p>
              Our mission is to provide accessible, affordable, and effective learning tools for competitive 
              exams like IIT-JEE, NEET, UPSC, and more. With a focus on excellence and student success, 
              VIP Study has become a trusted name in the education sector.
            </p>
            <p>
              Founded by Raj, VIP Study aims to bridge the gap between traditional learning and modern 
              digital education, ensuring every student has the opportunity to excel.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
