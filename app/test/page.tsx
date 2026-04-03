'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X,
  Check
} from 'lucide-react';
import Image from 'next/image';

interface Question {
  _id: string;
  questionNumber: number;
  imageIds: {
    en: string;
  };
  options: Array<{
    texts: {
      [key: string]: string;
    };
  }>;
  subject?: string;
  positiveMarks: number;
  negativeMarks: number;
}

interface Section {
  name: string;
  displayOrder: number;
  questions: Question[];
}

enum QuestionStatus {
  UNVISITED = 'unvisited',
  NOT_ANSWERED = 'not-answered',
  ANSWERED = 'answered',
  MARKED = 'marked',
  ANSWERED_MARKED = 'answered-marked',
}

function TestInterfaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(11971); // ~3:19:31 as in image
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [testName, setTestName] = useState('PW NEET (AITS Full Syllabus Test-07)');
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [testStats, setTestStats] = useState<{ correct: number; wrong: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load answers from localStorage on mount
  useEffect(() => {
    if (testId) {
      const savedAnswers = localStorage.getItem(`test_answers_${testId}`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    }
  }, [testId]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (testId && Object.keys(answers).length > 0) {
      localStorage.setItem(`test_answers_${testId}`, JSON.stringify(answers));
    }
  }, [answers, testId]);

  const submitTest = useCallback(async () => {
    try {
      setSubmitting(true);
      
      // Artificial delay for loading screen as requested
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Fetch solutions
      const response = await fetch(`https://v1.sstudy.site/api/tests/${testId}/solutions`);
      if (!response.ok) throw new Error('Failed to fetch solutions');
      const result = await response.json();
      
      if (!result.success || !result.data.questions) {
        throw new Error('Invalid solutions data');
      }

      const solutionsData = result.data.questions;
      let correct = 0;
      let wrong = 0;
      let unattempted = 0;
      let marksObtained = 0;
      let totalPossibleMarks = 0;

      const questionAnalysis = questions.map((q) => {
        const userSelectedIdx = answers[q.questionNumber];
        const solutionObj = solutionsData.find((s: any) => s.question._id === q._id);
        
        const correctOptionIds = solutionObj?.question?.solutions || [];
        const correctOptionIdx = q.options.findIndex(opt => correctOptionIds.includes((opt as any)._id));
        
        let status: 'correct' | 'wrong' | 'unattempted' = 'unattempted';
        let marks = 0;

        totalPossibleMarks += q.positiveMarks;

        if (userSelectedIdx === undefined) {
          unattempted++;
          status = 'unattempted';
          marks = 0;
        } else if (userSelectedIdx === correctOptionIdx) {
          correct++;
          status = 'correct';
          marks = q.positiveMarks;
          marksObtained += q.positiveMarks;
        } else {
          wrong++;
          status = 'wrong';
          marks = -q.negativeMarks;
          marksObtained -= q.negativeMarks;
        }

        return {
          questionNumber: q.questionNumber,
          status,
          userAnswer: userSelectedIdx,
          correctAnswer: correctOptionIdx,
          marks,
          subject: q.subject
        };
      });

      const results = {
        testId,
        testName,
        correct,
        wrong,
        unattempted,
        totalQuestions: questions.length,
        marksObtained: Math.max(0, marksObtained),
        totalPossibleMarks,
        percentage: ((Math.max(0, marksObtained) / totalPossibleMarks) * 100).toFixed(2),
        timeTaken: 11971 - timeLeft,
        questionAnalysis,
        // Sanitize solutions data to avoid circular structures and store only necessary fields
        solutions: solutionsData.map((s: any) => ({
          question: {
            _id: s.question?._id,
            questionNumber: s.question?.questionNumber,
            options: s.question?.options?.map((opt: any) => ({ _id: opt._id, texts: opt.texts })),
            solutions: s.question?.solutions,
            solutionDescription: s.question?.solutionDescription?.map((desc: any) => ({
              images: desc.images
            })),
            images: s.question?.images
          }
        }))
      };

      localStorage.setItem('last_test_result', JSON.stringify(results));
      // Clear local progress
      localStorage.removeItem(`test_answers_${testId}`);
      
      setTestStats({ correct, wrong });
      setSubmissionComplete(true);
      setSubmitting(false);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  }, [testId, testName, answers, questions, timeLeft]);

  useEffect(() => {
    if (!testId) {
      router.push('/');
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://v1.sstudy.site/api/tests/${testId}/questions`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const result = await response.json();
        if (result.success && result.data.sections) {
          const allSections: Section[] = result.data.sections;
          setSections(allSections);
          
          const flattened = allSections.flatMap(section => 
            section.questions.map(q => ({ ...q, subject: section.name }))
          );
          setQuestions(flattened);

          // Initialize statuses
          const initialStatuses: Record<number, QuestionStatus> = {};
          flattened.forEach(q => {
            initialStatuses[q.questionNumber] = QuestionStatus.UNVISITED;
          });
          initialStatuses[flattened[0].questionNumber] = QuestionStatus.NOT_ANSWERED;
          setStatuses(initialStatuses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId, router]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitTest]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    const qNum = questions[currentIndex].questionNumber;
    setAnswers({ ...answers, [qNum]: optionIndex });
    
    // If it was marked, it becomes answered-marked, else answered
    if (statuses[qNum] === QuestionStatus.MARKED || statuses[qNum] === QuestionStatus.ANSWERED_MARKED) {
      setStatuses({ ...statuses, [qNum]: QuestionStatus.ANSWERED_MARKED });
    } else {
      setStatuses({ ...statuses, [qNum]: QuestionStatus.ANSWERED });
    }
  };

  const clearResponse = () => {
    const qNum = questions[currentIndex].questionNumber;
    const newAnswers = { ...answers };
    delete newAnswers[qNum];
    setAnswers(newAnswers);
    setStatuses({ ...statuses, [qNum]: QuestionStatus.NOT_ANSWERED });
  };

  const markForReview = () => {
    const qNum = questions[currentIndex].questionNumber;
    if (answers[qNum] !== undefined) {
      setStatuses({ ...statuses, [qNum]: QuestionStatus.ANSWERED_MARKED });
    } else {
      setStatuses({ ...statuses, [qNum]: QuestionStatus.MARKED });
    }
    nextQuestion();
  };

  const saveAndNext = () => {
    const qNum = questions[currentIndex].questionNumber;
    if (answers[qNum] === undefined) {
      setStatuses({ ...statuses, [qNum]: QuestionStatus.NOT_ANSWERED });
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextQNum = questions[nextIdx].questionNumber;
      if (statuses[nextQNum] === QuestionStatus.UNVISITED) {
        setStatuses({ ...statuses, [nextQNum]: QuestionStatus.NOT_ANSWERED });
      }
      setCurrentIndex(nextIdx);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e212d]">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-white/60 font-medium">Preparing your exam environment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1e212d]">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-white">No Questions Found</h2>
        <button onClick={() => router.back()} className="text-emerald-400 hover:underline">Go Back</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case QuestionStatus.ANSWERED: return 'bg-[#28a745] text-white';
      case QuestionStatus.NOT_ANSWERED: return 'bg-[#dc3545] text-white';
      case QuestionStatus.MARKED: return 'bg-[#7016d0] text-white';
      case QuestionStatus.ANSWERED_MARKED: return 'bg-[#ffc107] text-black';
      default: return 'bg-[#e9ecef] text-black';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-black overflow-hidden font-sans">
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {!submitting && !submissionComplete ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit Test?</h3>
                  <p className="text-gray-500 mb-8">
                    Are you sure you want to end the test? You won&apos;t be able to change your answers after submission.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowSubmitModal(false)}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitTest}
                      className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      Yes, Submit
                    </button>
                  </div>
                </div>
              ) : submitting ? (
                <div className="p-12 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Calculating Results</h3>
                  <p className="text-gray-500">
                    Analyzing your performance and preparing premium solutions...
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Test Submitted!</h3>
                  <p className="text-gray-500 mb-6">
                    Your performance has been analyzed. Premium solutions are now available for all questions.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">Correct</p>
                      <p className="text-3xl font-black text-emerald-700">{testStats?.correct}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-1">Incorrect</p>
                      <p className="text-3xl font-black text-red-700">{testStats?.wrong}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/result')}
                    className="w-full px-6 py-4 rounded-xl bg-[#6332f6] hover:bg-[#5225d9] font-bold text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    View your result
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {submitting && !showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1e212d] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mb-6"
            />
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Submitting Your Test
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/60"
            >
              Please wait while we calculate your results...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="h-16 bg-[#1a1c23] flex items-center justify-between px-3 md:px-6 sticky top-0 z-50 shadow-xl border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 hover:bg-white/5 rounded-xl lg:hidden text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-white font-bold text-xs md:text-base truncate max-w-[120px] sm:max-w-[180px] md:max-w-md leading-tight">
              {testName}
            </h1>
            <span className="text-[8px] md:text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live Examination</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 bg-zinc-900 border border-white/10 px-2 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-inner">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono font-black text-white text-xs md:text-lg tracking-wider">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2 md:py-2.5 px-3 md:px-6 rounded-xl md:rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm uppercase tracking-wider"
          >
            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Submit
          </button>
        </div>
      </header>

      {/* Subject Tabs */}
      <div className="bg-[#252833] px-6 py-3 flex gap-3 overflow-x-auto no-scrollbar border-b border-white/5">
        {sections.map((section) => (
          <button 
            key={section.name} 
            onClick={() => {
              const firstInSec = questions.findIndex(q => q.subject === section.name);
              if (firstInSec !== -1) setCurrentIndex(firstInSec);
            }}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              currentQuestion.subject === section.name 
                ? 'bg-white text-black border-white shadow-lg' 
                : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Question Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#fcfcfd]">
          <div className="max-w-4xl mx-auto">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Question</span>
                  <span className="text-xl font-black text-gray-900 leading-none">
                    {currentIndex + 1} <span className="text-gray-300 text-sm font-bold">/ {questions.length}</span>
                  </span>
                </div>
                <div className="h-8 w-px bg-gray-100 mx-2" />
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  Single Correct
                </span>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Correct</span>
                  <span className="text-sm font-black text-emerald-600">+{currentQuestion.positiveMarks}</span>
                </div>
                <div className="h-8 w-px bg-gray-100 mx-1" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-0.5">Wrong</span>
                  <span className="text-sm font-black text-red-500">-{currentQuestion.negativeMarks}</span>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="mb-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
              {currentQuestion.imageIds.en ? (
                <div className="relative w-full flex-1 flex items-center justify-center">
                  <Image
                    src={currentQuestion.imageIds.en}
                    alt={`Question ${currentQuestion.questionNumber}`}
                    width={1000}
                    height={500}
                    className="max-w-full h-auto object-contain"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full flex-1 flex flex-col items-center justify-center text-gray-300 gap-4">
                  <AlertCircle className="w-12 h-12 opacity-20" />
                  <p className="italic font-medium">No question content available</p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {currentQuestion.options.map((option, idx) => {
                const label = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = answers[currentQuestion.questionNumber] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`group relative w-full border-2 rounded-2xl p-5 flex items-center gap-4 text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-500 shadow-md' 
                        : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 font-black transition-all ${
                      isSelected 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-gray-50 border-gray-100 text-gray-400 group-hover:border-emerald-200 group-hover:text-emerald-500'
                    }`}>
                      {label}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-emerald-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        Option {idx + 1}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-100 mb-12">
              <button
                onClick={clearResponse}
                className="px-8 py-3.5 rounded-2xl border-2 border-red-100 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all active:scale-95"
              >
                Clear Response
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={markForReview}
                  className="px-8 py-3.5 rounded-2xl border-2 border-purple-100 text-purple-600 font-black uppercase tracking-widest text-[10px] hover:bg-purple-50 transition-all active:scale-95"
                >
                  Mark for Review
                </button>
                <button
                  onClick={saveAndNext}
                  className="px-10 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Question Palette Sidebar (Desktop) */}
        <aside className="hidden lg:block w-80 border-l bg-[#f8f9fa] p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#007bff] border-b-2 border-[#007bff] pb-1 mb-4">Question Palette</h3>
            
            <div className="space-y-2 mb-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Status:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-[10px] font-medium">
                  <div className="w-4 h-4 rounded bg-[#28a745]" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium">
                  <div className="w-4 h-4 rounded bg-[#dc3545]" />
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium">
                  <div className="w-4 h-4 rounded bg-[#e9ecef] border" />
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium">
                  <div className="w-4 h-4 rounded bg-[#7016d0]" />
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium">
                  <div className="w-4 h-4 rounded bg-[#ffc107]" />
                  <span>Answered & Marked</span>
                </div>
              </div>
            </div>

            {sections.map((section) => {
              const sectionQuestions = questions.filter(q => q.subject === section.name);
              return (
                <div key={section.name} className="mb-6">
                  <h4 className="text-xs font-bold text-gray-700 bg-blue-50 p-1.5 rounded mb-3">{section.name}</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {sectionQuestions.map((q) => {
                      const idx = questions.findIndex(item => item._id === q._id);
                      const status = statuses[q.questionNumber] || QuestionStatus.UNVISITED;
                      return (
                        <button
                          key={q._id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`aspect-square rounded flex items-center justify-center text-[10px] font-bold transition-all border ${
                            currentIndex === idx 
                              ? 'ring-2 ring-[#007bff] ring-offset-1' 
                              : ''
                          } ${getStatusColor(status)}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showSidebar && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSidebar(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed top-0 left-0 h-full w-4/5 bg-white z-[70] p-6 lg:hidden overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-[#007bff]">Question Palette</h3>
                  <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                </div>
                
                {sections.map((section) => {
                  const sectionQuestions = questions.filter(q => q.subject === section.name);
                  return (
                    <div key={section.name} className="mb-6">
                      <h4 className="text-xs font-bold text-gray-700 bg-blue-50 p-1.5 rounded mb-3">{section.name}</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {sectionQuestions.map((q) => {
                          const idx = questions.findIndex(item => item._id === q._id);
                          const status = statuses[q.questionNumber] || QuestionStatus.UNVISITED;
                          return (
                            <button
                              key={q._id}
                              onClick={() => {
                                setCurrentIndex(idx);
                                setShowSidebar(false);
                              }}
                              className={`aspect-square rounded flex items-center justify-center text-[10px] font-bold border ${
                                currentIndex === idx ? 'ring-2 ring-[#007bff]' : ''
                              } ${getStatusColor(status)}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TestInterfacePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#1e212d] text-white">Loading Exam...</div>}>
      <TestInterfaceContent />
    </Suspense>
  );
}
