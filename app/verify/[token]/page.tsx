'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your token...');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = params.token as string;
        if (!token) {
          setStatus('error');
          setMessage('No token provided');
          return;
        }

        const res = await fetch('/api/verify/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          // Store verification in localStorage
          try {
            const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
            localStorage.setItem('verifiedUntil', expiry.toString());
            
            // Ensure the userId matches the one in the token
            if (data.userId) {
              localStorage.setItem('userId', data.userId);
            }
          } catch (e) {
            console.error('localStorage error during verification:', e);
          }

          setStatus('success');
          setMessage('Verification successful! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Invalid or expired token');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyToken();
  }, [params.token, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Verifying...</h2>
            <p className="text-white/50">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center text-green-500 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2 text-green-400">Verified!</h2>
            <p className="text-white/50">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center text-red-500 mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2 text-red-400">Verification Failed</h2>
            <p className="text-white/50 mb-8">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all"
            >
              Return Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
