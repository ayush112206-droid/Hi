'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-white/70 leading-relaxed font-sans">
            <p>
              At VIP Study, we value your privacy and are committed to protecting your 
              personal data. This policy outlines how we collect, use, and safeguard 
              your information.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8">Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, 
              and exam preferences when you interact with our website or services.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8">How We Use Your Data</h2>
            <p>
              Your information is used to provide personalized content, improve our 
              services, and communicate with you about updates and new features.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data 
              from unauthorized access, alteration, or disclosure.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
