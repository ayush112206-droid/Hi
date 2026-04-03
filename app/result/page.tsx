'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BarChart3, 
  Clock, 
  Trophy,
  ChevronLeft,
  ArrowLeft,
  LayoutGrid,
  Check,
  X,
  Minus,
  Home
} from 'lucide-react';

interface QuestionResult {
  questionNumber: number;
  status: 'correct' | 'wrong' | 'unattempted';
  userAnswer: number | undefined;
  correctAnswer: number;
  marks: number;
  subject: string;
}

interface TestResult {
  testId: string;
  testName: string;
  correct: number;
  wrong: number;
  unattempted: number;
  totalQuestions: number;
  marksObtained: number;
  totalPossibleMarks: number;
  percentage: string;
  timeTaken: number;
  questionAnalysis: QuestionResult[];
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [activeSubject, setActiveSubject] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('last_test_result');
    if (stored) {
      const parsed = JSON.parse(stored);
      setTimeout(() => {
        setResult(parsed);
        if (parsed.questionAnalysis.length > 0) {
          setActiveSubject(parsed.questionAnalysis[0].subject);
        }
      }, 0);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!result) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const subjects = Array.from(new Set(result.questionAnalysis.map(q => q.subject)));

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-12 font-sans">
      {/* Premium Header */}
      <div className="bg-[#1a1c23] text-white pt-16 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500 blur-[120px]" />
        </div>
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10"
        >
          <Trophy className="w-12 h-12 text-emerald-500" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-display font-black mb-3 tracking-tighter">
            Test <span className="text-emerald-500">Analysis</span>
          </h1>
          <p className="text-white/40 text-sm md:text-lg font-bold uppercase tracking-[0.3em]">{result.testName}</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Score Card */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * parseFloat(result.percentage)) / 100}
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-gray-900">{result.percentage}%</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 w-full">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marks Obtained</p>
                <p className="text-4xl font-black text-gray-900">
                  {result.marksObtained} <span className="text-gray-300 text-xl">/ {result.totalPossibleMarks}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Taken</p>
                <p className="text-4xl font-black text-gray-900">{formatTime(result.timeTaken)}</p>
              </div>
              <div className="col-span-2 pt-4 flex gap-4">
                <button 
                  onClick={() => router.push('/result/solutions')}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  View Solutions
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="px-6 bg-gray-50 hover:bg-gray-100 text-gray-400 font-black py-4 rounded-2xl transition-all flex items-center justify-center"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <SummaryCard 
              label="Correct" 
              value={result.correct} 
              color="bg-emerald-50" 
              textColor="text-emerald-600" 
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <SummaryCard 
              label="Wrong" 
              value={result.wrong} 
              color="bg-red-50" 
              textColor="text-red-600" 
              icon={<XCircle className="w-5 h-5" />}
            />
            <SummaryCard 
              label="Skipped" 
              value={result.unattempted} 
              color="bg-gray-50" 
              textColor="text-gray-500" 
              icon={<HelpCircle className="w-5 h-5" />}
            />
            <SummaryCard 
              label="Accuracy" 
              value={Math.round((result.correct / (result.correct + result.wrong || 1)) * 100)} 
              suffix="%"
              color="bg-indigo-50" 
              textColor="text-indigo-600" 
              icon={<BarChart3 className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Question-wise Analysis */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
          <div className="bg-[#495057] text-white px-6 py-4">
            <h3 className="text-lg font-bold">Question-wise Analysis</h3>
          </div>
          
          <div className="p-6">
            {/* Subject Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setActiveSubject(subject)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeSubject === subject 
                        ? 'bg-[#f0f3ff] text-[#007bff] ring-1 ring-[#007bff]' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {/* Subject Stats */}
              <div className="flex flex-wrap gap-2">
                <SubjectStat 
                  label={result.questionAnalysis.filter(q => q.subject === activeSubject && q.status === 'correct').length} 
                  color="bg-[#28a745]" 
                  icon={<Check className="w-3 h-3" />} 
                />
                <SubjectStat 
                  label={result.questionAnalysis.filter(q => q.subject === activeSubject && q.status === 'wrong').length} 
                  color="bg-[#dc3545]" 
                  icon={<X className="w-3 h-3" />} 
                />
                <SubjectStat 
                  label={result.questionAnalysis.filter(q => q.subject === activeSubject && q.status === 'unattempted').length} 
                  color="bg-gray-400" 
                  icon={<Minus className="w-3 h-3" />} 
                />
                <div className="bg-[#6332f6] text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                  {result.questionAnalysis.filter(q => q.subject === activeSubject).reduce((acc, q) => acc + q.marks, 0).toFixed(1)} marks
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-8 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[#28a745]" />
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[#dc3545]" />
                <span>Wrong</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-gray-100 border" />
                <span>Unattempted</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-3">
              {result.questionAnalysis
                .filter(q => q.subject === activeSubject)
                .map((q) => (
                  <div
                    key={q.questionNumber}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                      q.status === 'correct' ? 'bg-[#28a745] text-white border-[#28a745]' :
                      q.status === 'wrong' ? 'bg-[#dc3545] text-white border-[#dc3545]' :
                      'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {q.questionNumber}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-300">
            <CheckCircle2 className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">Leaderboard data is not available yet.</p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, textColor, icon, suffix = "" }: { label: string, value: number, color: string, textColor: string, icon: React.ReactNode, suffix?: string }) {
  return (
    <div className={`${color} rounded-3xl p-6 flex flex-col items-center justify-center border border-white/10 shadow-sm transition-transform hover:scale-[1.02]`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${textColor} bg-white shadow-sm`}>
        {icon}
      </div>
      <p className={`text-2xl font-black ${textColor} leading-none mb-1`}>{value}{suffix}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
    </div>
  );
}

function SubjectStat({ label, color, icon }: { label: number, color: string, icon: React.ReactNode }) {
  return (
    <div className={`${color} text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1`}>
      {icon}
      {label}
    </div>
  );
}
