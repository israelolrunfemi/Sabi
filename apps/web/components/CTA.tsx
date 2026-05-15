'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-blue-600 opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-purple-600 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-8 sm:p-12 lg:p-16 text-center">
          {/* Main Heading */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
            Ready to Build Your Financial Future?
          </h2>

          {/* Subheading */}
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of informal economy workers building trust, earning money, and accessing 
            financial services through Sabi. No credit card needed. Start for free.
          </p>

          {/* Key Benefits - Quick List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-sm">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <span className="text-green-400 font-bold">✓</span>
              </div>
              <span className="text-slate-300">Free forever for solo traders</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <span className="text-green-400 font-bold">✓</span>
              </div>
              <span className="text-slate-300">Instant Squad virtual account</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <span className="text-green-400 font-bold">✓</span>
              </div>
              <span className="text-slate-300">AI-matched opportunities</span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 text-lg"
            >
              Start Free Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-8 py-4 font-semibold text-white hover:border-slate-400 hover:bg-slate-700/50 transition-all duration-200 text-lg"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Note */}
          <p className="text-xs text-slate-500">
            By signing up, you agree to our Terms of Service and Privacy Policy. 
            Squad handles all payments securely.
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Trusted by traders, artisans, and job seekers across Nigeria. Built for Squad Hackathon 3.0.
          </p>
        </div>
      </div>
    </section>
  );
};