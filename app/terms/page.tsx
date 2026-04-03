'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          <div className="space-y-6 text-white/70 leading-relaxed font-sans">
            <p>
              By accessing or using VIP Study, you agree to be bound by these Terms 
              and Conditions. Please read them carefully.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8">Use of Content</h2>
            <p>
              All content on VIP Study, including test series, study materials, and 
              graphics, is protected by copyright and intellectual property laws. 
              You may not reproduce or distribute it without our permission.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8">User Conduct</h2>
            <p>
              You agree to use our website for lawful purposes only and not to 
              engage in any activity that could harm our services or other users.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8">Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued 
              use of the website after changes are posted constitutes your acceptance 
              of the new terms.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
