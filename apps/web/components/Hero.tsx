'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
              <Zap className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Powering 40M+ informal workers
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Financial Access for the{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Invisible Economy
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Sabi digitally onboards Nigeria's informal traders, artisans, and job seekers — 
              connecting them to opportunities and financial access through AI-powered matching 
              and Squad payments.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">40M+</p>
                <p className="text-sm text-slate-400">Informal workers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">57%</p>
                <p className="text-sm text-slate-400">of GDP</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">0-100</p>
                <p className="text-sm text-slate-400">Trust Score</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
              >
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-8 py-3 font-semibold text-white hover:border-slate-400 hover:bg-slate-700/50 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Instant verification</span>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:block">
            <div className="relative h-96 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-700/50 p-8 backdrop-blur-sm">
              {/* Platform preview illustration */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
              </div>

              {/* Content inside box */}
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">AI Onboarding</p>
                    <p className="text-xs text-slate-400">Conversational profile</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Trust Score</p>
                    <p className="text-xs text-slate-400">Built from transactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Instant Matching</p>
                    <p className="text-xs text-slate-400">AI-ranked opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};