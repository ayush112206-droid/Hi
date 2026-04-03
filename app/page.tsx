'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Stethoscope, 
  BookOpen, 
  Wrench, 
  Landmark, 
  Gavel, 
  Calculator, 
  Briefcase, 
  Globe, 
  Cpu, 
  Search,
  School,
  Star,
  Target,
  Rocket,
  X,
  MessageCircle,
  Send,
  Home,
  ShieldCheck,
  FileText,
  Phone,
  ExternalLink,
  Info,
  ChevronRight,
  Menu,
  Loader2
} from 'lucide-react';
import { ExamCard } from '@/components/ExamCard';
import { SplashScreen } from '@/components/SplashScreen';
import Link from 'next/link';

const EXAMS = [
  { id: 'IIT-JEE', name: 'IIT-JEE', icon: Cpu },
  { id: 'NEET', name: 'NEET', icon: Stethoscope },
  { id: 'BOARD EXAM', name: 'BOARD EXAM', icon: BookOpen },
  { id: 'AE/JE', name: 'AE/JE', icon: Wrench },
  { id: 'Banking', name: 'Banking', icon: Landmark },
  { id: 'BPSC', name: 'BPSC', icon: Gavel },
  { id: 'CA', name: 'CA', icon: Calculator },
  { id: 'Commerce', name: 'Commerce', icon: Briefcase },
  { id: 'CSIR NET', name: 'CSIR NET', icon: Globe },
  { id: 'CUET UG', name: 'CUET UG', icon: GraduationCap },
  { id: 'GATE', name: 'GATE', icon: Cpu },
  { id: 'UPSC', name: 'UPSC', icon: Search },
];

const MENU_ITEMS = [
  { name: 'Join WhatsApp Channel', icon: MessageCircle, link: 'https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U', external: true, color: 'text-green-500' },
  { name: 'Join Telegram Channel', icon: Send, link: 'https://t.me/vip_study_channel', external: true, color: 'text-blue-500' },
  { name: 'Contact VIP Study', icon: Phone, link: '/contact', color: 'text-purple-500' },
  { name: 'Home Page', icon: Home, link: '/', color: 'text-emerald-500' },
  { name: 'Disclaimer', icon: Info, link: '/disclaimer', color: 'text-red-500' },
  { name: 'About', icon: Info, link: '/about', color: 'text-blue-400' },
  { name: 'Privacy Policy', icon: ShieldCheck, link: '/privacy-policy', color: 'text-yellow-500' },
  { name: 'Terms', icon: FileText, link: '/terms', color: 'text-gray-400' },
];

export default function HomePage() {
  const [step, setStep] = useState<'splash' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState<'exams' | 'home' | 'about' | 'contact'>('exams');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [showExamPopup, setShowExamPopup] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Verification State
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  useEffect(() => {
    // Check verification status
    try {
      const verifiedUntil = localStorage.getItem('verifiedUntil');
      const now = Date.now();
      
      let storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        storedUserId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('userId', storedUserId);
      }
      setUserId(storedUserId);

      if (verifiedUntil && parseInt(verifiedUntil, 10) > now) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (e) {
      console.error('localStorage error:', e);
      setIsVerified(false);
      setUserId(Math.random().toString(36).substring(2, 15));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('main');
      // Show WhatsApp popup after splash screen if verified
      if (isVerified === true) {
        setTimeout(() => setShowWhatsAppPopup(true), 500);
      } else if (isVerified === false) {
        setShowVerificationPopup(true);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [isVerified]);

  const handleVerify = async () => {
    setIsGeneratingLink(true);
    try {
      const res = await fetch('/api/verify/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.shortLink) {
        window.location.href = data.shortLink;
      } else {
        alert('Failed to generate verification link. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleSelectExam = (exam: string) => {
    setSelectedExam(exam);
    setShowExamPopup(true);
  };

  const SIDEBAR_NAV = [
    { id: 'select', text: 'Select your exam', icon: School, action: () => setActiveTab('exams') },
    { id: 'welcome', text: 'Welcome to VIP study', icon: Star, action: () => setActiveTab('home') },
    { id: 'target', text: 'Choose your target', icon: Target, action: () => setActiveTab('exams') },
    { id: 'prep', text: 'Get started your preparation', icon: Rocket, action: () => setActiveTab('exams') }
  ];

  const SOCIAL_LINKS = [
    { name: 'WhatsApp Channel', icon: MessageCircle, link: 'https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Telegram Channel', icon: Send, link: 'https://t.me/vip_study_channel', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <SplashScreen />

      <AnimatePresence>
        {step === 'main' && (
          <>
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`fixed lg:relative z-40 h-full bg-zinc-950 border-r border-white/5 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-0 lg:w-20 overflow-hidden'}`}
            >
              <div className="p-6 flex items-center justify-between">
                <h2 className={`text-2xl font-display font-bold tracking-tighter transition-opacity ${!isSidebarOpen && 'lg:opacity-0'}`}>
                  VIP <span className="text-emerald-500">Study</span>
                </h2>
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-white/5 rounded-lg lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
                {/* Primary Navigation (Boxed Items) */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-3">Navigation</p>
                  {SIDEBAR_NAV.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className={`w-full group flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activeTab === 'exams' && (item.id === 'select' || item.id === 'target') ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900/30 border-white/5 hover:border-white/20'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeTab === 'exams' && (item.id === 'select' || item.id === 'target') ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] uppercase tracking-[0.1em] font-bold transition-colors ${activeTab === 'exams' && (item.id === 'select' || item.id === 'target') ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Social Channels */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-3">Channels</p>
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-auto text-white/20" />
                    </a>
                  ))}
                </div>

                {/* More Options (Collapsible) */}
                <div className="space-y-2">
                  <button 
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className="w-full flex items-center justify-between px-2 mb-3 group"
                  >
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest group-hover:text-white/50 transition-colors">More Options</p>
                    <ChevronRight className={`w-3 h-3 text-white/20 transition-transform ${isMoreOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isMoreOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1"
                      >
                        {MENU_ITEMS.filter(i => !i.external).map((item) => (
                          <Link
                            key={item.name}
                            href={item.link}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 ${item.color}`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                    R
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">Raj</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tight">Founder</p>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto custom-scrollbar">
              {/* Mobile Header */}
              <div className="lg:hidden p-4 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
                <h2 className="text-xl font-display font-bold">
                  VIP <span className="text-emerald-500">Study</span>
                </h2>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 bg-white/5 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-12 max-w-6xl mx-auto">
                {/* Verification Pop-up */}
                <AnimatePresence>
                  {showVerificationPopup && step === 'main' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-md bg-zinc-900 border border-emerald-500/30 rounded-[2.5rem] p-8 relative shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center"
                      >
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 mb-6 mx-auto">
                          <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3">Verification Required</h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-8">
                          To access VIP Study, please verify your device. This verification is valid for 24 hours.
                        </p>
                        
                        <button 
                          onClick={handleVerify}
                          disabled={isGeneratingLink}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                        >
                          {isGeneratingLink ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Generating Link...</>
                          ) : (
                            <><ExternalLink className="w-5 h-5" /> Verify Now</>
                          )}
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {activeTab === 'exams' && (
                    <motion.div
                      key="exams"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center justify-between mb-12">
                        <div>
                          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
                            Target <span className="text-emerald-500">Exams</span>
                          </h1>
                          <p className="text-white/40">Select your exam to view available batches and materials.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                        {EXAMS.map((exam, index) => (
                          <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <ExamCard
                              name={exam.name}
                              icon={exam.icon}
                              onClick={() => handleSelectExam(exam.id)}
                              isActive={selectedExam === exam.id}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Exam Selection Pop-up */}
                      <AnimatePresence>
                        {showExamPopup && selectedExam && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                            >
                              <div className="p-6 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-4">
                                  <Target className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Exam Selected!</h3>
                                <p className="text-white/60 mb-8">You have selected <span className="text-emerald-400 font-bold">{selectedExam}</span>. Ready to view the batches?</p>
                                
                                <div className="flex flex-col w-full gap-3">
                                  <button 
                                    onClick={() => window.location.href = `/class?exam=${encodeURIComponent(selectedExam)}`}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                                  >
                                    Go to Batches
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setShowExamPopup(false)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/60 font-medium rounded-2xl transition-all"
                                  >
                                    Change Exam
                                  </button>
                                </div>
                              </div>
                              <button 
                                onClick={() => setShowExamPopup(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                              >
                                <X className="w-5 h-5 text-white/40" />
                              </button>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>

                      {/* WhatsApp Channel Pop-up */}
                      <AnimatePresence>
                        {showWhatsAppPopup && (
                          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                            <motion.div
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 50, opacity: 0 }}
                              className="w-full max-w-sm bg-zinc-950 border border-emerald-500/30 rounded-[2.5rem] p-8 relative shadow-[0_0_50px_rgba(16,185,129,0.15)]"
                            >
                              <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center text-green-500 mb-6 animate-bounce">
                                  <MessageCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-3">Join Our Community!</h3>
                                <p className="text-white/50 text-sm leading-relaxed mb-8">
                                  Get instant updates, study materials, and exam notifications directly on your WhatsApp.
                                </p>
                                
                                <a 
                                  href="https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(34,197,94,0.3)]"
                                >
                                  Join WhatsApp Channel
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                
                                <button 
                                  onClick={() => setShowWhatsAppPopup(false)}
                                  className="mt-4 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                                >
                                  Maybe Later
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => setShowWhatsAppPopup(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors group"
                              >
                                <X className="w-5 h-5 text-white/20 group-hover:text-white/60" />
                              </button>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {activeTab === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-20"
                    >
                      <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8">
                        <Home className="w-12 h-12" />
                      </div>
                      <h1 className="text-5xl font-display font-bold mb-6">Welcome to VIP Study</h1>
                      <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Your one-stop destination for premium test series, study materials, and expert guidance for all major competitive exams.
                      </p>
                      <button 
                        onClick={() => setActiveTab('exams')}
                        className="mt-12 px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Explore Exams
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
