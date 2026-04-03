'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  BookOpen,
  Check,
  X,
  LayoutGrid
} from 'lucide-react';
import Image from 'next/image';

interface QuestionSolution {
  question: {
    _id: string;
    questionNumber: number;
    options: any[];
    solutions: string[];
    solutionDescription: any[];
    images: {
      en: string;
    };
  };
}

interface TestResult {
  testId: string;
  testName: string;
  questionAnalysis: any[];
  solutions: QuestionSolution[];
}

export default function SolutionsPage() {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('last_test_result');
    if (stored) {
      setTimeout(() => {
        setResult(JSON.parse(stored));
      }, 0);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!result) return null;

  const currentSolution = result.solutions[currentIndex];
  const analysis = result.questionAnalysis[currentIndex];

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-[#6332f6] text-white flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft />
          </button>
          <h1 className="font-bold truncate max-w-[200px] md:max-w-none flex items-center gap-2">
            Detailed Solutions
            <span className="bg-amber-400 text-[#6332f6] text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Premium</span>
          </h1>
        </div>
        <div className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
          Question {currentIndex + 1} of {result.solutions.length}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Question Section */}
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#f0f3ff] text-[#007bff] px-4 py-1 rounded-lg text-sm font-bold">
                    Question {currentSolution.question.questionNumber}
                  </span>
                  {analysis.status === 'correct' ? (
                    <span className="flex items-center gap-1.5 text-[#28a745] text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : analysis.status === 'wrong' ? (
                    <span className="flex items-center gap-1.5 text-[#dc3545] text-sm font-bold">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-gray-400 text-sm font-bold">
                      <HelpCircle className="w-4 h-4" /> Unattempted
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Marks: {analysis.marks}
                </div>
              </div>

              {currentSolution.question.images.en ? (
                <div className="relative w-full min-h-[200px] mb-8">
                  <Image
                    src={currentSolution.question.images.en}
                    alt={`Question ${currentSolution.question.questionNumber}`}
                    width={800}
                    height={400}
                    className="object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-50 text-gray-400 italic mb-8">
                  No question image available
                </div>
              )}

              {/* Options Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSolution.question.options.map((opt: any, idx: number) => {
                  const label = String.fromCharCode(65 + idx);
                  const isCorrect = currentSolution.question.solutions.includes(opt._id);
                  const isUserAnswer = analysis.userAnswer === idx;

                  return (
                    <div 
                      key={opt._id}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                        isCorrect ? 'bg-[#e8fbf3] border-[#28a745]' :
                        isUserAnswer ? 'bg-[#fff1f1] border-[#dc3545]' :
                        'bg-white border-gray-100'
                      }`}
                    >
                      <span className={`font-bold ${isCorrect ? 'text-[#28a745]' : isUserAnswer ? 'text-[#dc3545]' : 'text-gray-500'}`}>
                        Option {label}
                      </span>
                      {isCorrect && <Check className="w-5 h-5 text-[#28a745]" />}
                      {isUserAnswer && !isCorrect && <X className="w-5 h-5 text-[#dc3545]" />}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Solution Description Section */}
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6 text-[#6332f6]">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-bold">Step-by-step Solution</h3>
              </div>
              
              {currentSolution.question.solutionDescription?.[0]?.images?.en ? (
                <div className="relative w-full min-h-[300px]">
                  <Image
                    src={currentSolution.question.solutionDescription[0].images.en}
                    alt="Solution"
                    width={800}
                    height={600}
                    className="object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8">No detailed solution image available for this question.</p>
              )}
            </section>
          </div>
        </main>

        {/* Question Selector Sidebar */}
        <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l p-6 overflow-y-auto max-h-[300px] lg:max-h-none">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Jump to Question
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {result.solutions.map((sol, idx) => {
              const qAnalysis = result.questionAnalysis[idx];
              return (
                <button
                  key={sol.question._id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                    currentIndex === idx ? 'ring-2 ring-[#6332f6] ring-offset-2' : ''
                  } ${
                    qAnalysis.status === 'correct' ? 'bg-[#28a745] text-white border-[#28a745]' :
                    qAnalysis.status === 'wrong' ? 'bg-[#dc3545] text-white border-[#dc3545]' :
                    'bg-gray-50 text-gray-500 border-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-white border-t p-4 flex items-center justify-between sticky bottom-0 z-50">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="flex items-center gap-2 text-gray-600 font-bold disabled:opacity-30 transition-opacity"
        >
          <ChevronLeft /> Previous
        </button>
        <button
          disabled={currentIndex === result.solutions.length - 1}
          onClick={() => setCurrentIndex(prev => prev + 1)}
          className="flex items-center gap-2 text-[#6332f6] font-bold disabled:opacity-30 transition-opacity"
        >
          Next <ChevronLeft className="rotate-180" />
        </button>
      </footer>
    </div>
  );
}
