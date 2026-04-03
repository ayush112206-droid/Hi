'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, AlertCircle } from 'lucide-react';
import { BatchCard } from '@/components/BatchCard';
import { CardSkeleton } from '@/components/Skeleton';

interface Batch {
  _id: string;
  name: string;
  previewImage: string;
  testCatId: string;
}

function BatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exam = searchParams.get('exam');
  const selectedClass = searchParams.get('class');

  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAllMode = searchParams.get('all') === 'true';
    
    if (!isAllMode && (!exam || !selectedClass)) {
      router.push('/');
      return;
    }

    const fetchBatches = async () => {
      try {
        setLoading(true);
        const url = isAllMode 
          ? 'https://v1.sstudy.site/api/batches'
          : `https://v1.sstudy.site/api/batches?exam=${encodeURIComponent(exam || '')}&class=${encodeURIComponent(selectedClass || '')}`;
          
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch batches');
        const result = await response.json();
        const batchesArray = result.success && Array.isArray(result.data) ? result.data : [];
        setBatches(batchesArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [exam, selectedClass, router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 text-black font-bold py-2 px-6 rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isAllMode = searchParams.get('all') === 'true';

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
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
          {isAllMode ? 'Back to Home' : 'Back to Classes'}
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Package className="w-4 h-4" />
            {isAllMode ? 'All Available Batches' : `${exam} • Class ${selectedClass}`}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            {isAllMode ? 'All' : 'Available'} <span className="premium-gradient-text">Batches</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {isAllMode 
              ? 'Explore every batch available across all categories and classes.'
              : 'Explore our curated batches specifically designed for your target exam and class.'}
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-xl">No batches found for this selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {batches.map((batch, index) => (
            <motion.div
              key={batch._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <BatchCard
                name={batch.name}
                image={batch.previewImage}
                onClick={() => router.push(`/tests?batchId=${batch._id}&testCatId=${batch.testCatId}`)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BatchesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Batches...</div>}>
      <BatchesContent />
    </Suspense>
  );
}
