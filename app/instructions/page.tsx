'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Globe, Play } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';

interface LanguageCode {
  language: string;
  code: string;
  isSelected: boolean;
}

interface Instructions {
  instructions: Array<{
    texts: {
      [key: string]: string;
    };
  }>;
  languageCodes: LanguageCode[];
}

function InstructionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');

  const [data, setData] = useState<Instructions | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (!testId) {
      router.push('/');
      return;
    }

    const fetchInstructions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://v1.sstudy.site/api/tests/${testId}/instructions`);
        if (!response.ok) throw new Error('Failed to fetch instructions');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          // Set initial language based on isSelected
          const selectedLang = result.data.languageCodes.find((l: LanguageCode) => l.isSelected);
          if (selectedLang) setLanguage(selectedLang.code);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [testId, router]);

  const currentInstructions = data?.instructions?.map(i => i.texts[language]).join('<br/>') || 'No instructions provided.';

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Tests
        </button>

        <div className="glass-card p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Info className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Test Instructions</h1>
          </div>

          {loading ? (
            <div className="space-y-4 mb-12">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : (
            <div className="prose prose-invert max-w-none mb-12 text-white/70 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: currentInstructions }} />
            </div>
          )}

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-white/40" />
              <span className="text-sm font-medium text-white/60">Select Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {data?.languageCodes.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.language}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/test?testId=${testId}`)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 px-12 rounded-2xl transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Test Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function InstructionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Instructions...</div>}>
      <InstructionsContent />
    </Suspense>
  );
}
