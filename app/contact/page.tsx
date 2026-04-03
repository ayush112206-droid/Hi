'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';

export default function ContactPage() {
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
          <h1 className="text-4xl font-bold mb-8">Contact VIP Study</h1>
          <div className="grid gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Email Us</h3>
                <p className="text-white/60">support@vipstudy.com</p>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">WhatsApp</h3>
                <p className="text-white/60">+91 98765 43210</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Call Us</h3>
                <p className="text-white/60">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
