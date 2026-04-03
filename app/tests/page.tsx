'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ClipboardList, AlertCircle } from 'lucide-react';
import { TestCard } from '@/components/TestCard';
import { Skeleton } from '@/components/Skeleton';

interface Test {
  _id: string;
  name: string;
}

function TestsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batchId');
  const testCatId = searchParams.get('testCatId');

  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId || !testCatId) {
      router.push('/');
      return;
    }

    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://v1.sstudy.site/api/tests?batchId=${batchId}&testCatId=${testCatId}`);
        if (!response.ok) throw new Error('Failed to fetch tests');
        const result = await response.json();
        const testsArray = result.success && Array.isArray(result.data) ? result.data : [];
        setTests(testsArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [batchId, testCatId, router]);

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

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-4xl mx-auto mb-12"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Batches
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <ClipboardList className="w-4 h-4" />
            Test Series
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Select Your <span className="premium-gradient-text">Test</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Practice makes perfect. Choose a test to evaluate your preparation.
          </p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 flex items-center justify-between">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-32" />
            </div>
          ))
        ) : tests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-xl">No tests available for this batch yet.</p>
          </div>
        ) : (
          tests.map((test) => (
            <TestCard
              key={test._id}
              name={test.name}
              onClick={() => router.push(`/instructions?testId=${test._id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Tests...</div>}>
      <TestsContent />
    </Suspense>
  );
}
