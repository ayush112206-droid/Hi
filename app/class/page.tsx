'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Layers } from 'lucide-react';
import { ClassCard } from '@/components/ClassCard';
import { Suspense } from 'react';

const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 
  'Class 11', 'Class 12', 'Class 12+', 'Under Graduation', 'Graduation'
];

function ClassSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exam = searchParams.get('exam');

  const handleSelectClass = (className: string) => {
    const classNum = className.replace('Class ', '');
    router.push(`/batches?exam=${encodeURIComponent(exam || '')}&class=${encodeURIComponent(classNum)}`);
  };

  if (!exam) {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-6xl mb-12"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Exams
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Layers className="w-4 h-4" />
            Targeting {exam}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            Select Your <span className="premium-gradient-text">Class</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Pick your current academic level to find the most relevant study material.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {CLASSES.map((className, index) => (
          <motion.div
            key={className}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <ClassCard
              name={className}
              onClick={() => handleSelectClass(className)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ClassSelectionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ClassSelectionContent />
    </Suspense>
  );
}
