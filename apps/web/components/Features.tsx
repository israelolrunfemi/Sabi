'use client';

import { Sparkles, Users, Shield, Zap, TrendingUp, Award } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Onboarding',
    description: 'Chat with Claude AI to create your economic profile instantly — no forms, no friction. Your financial identity starts with conversation.',
  },
  {
    icon: TrendingUp,
    title: 'Trust Score Engine',
    description: 'Build your credit profile from real Squad transactions. Every payment counts. Start at 40/100, reach elite status at 75+.',
  },
  {
    icon: Users,
    title: 'Intelligent Matching',
    description: 'AI-ranked job and trade matches by skill, location, and experience — not just keywords. Find the right opportunity.',
  },
  {
    icon: Zap,
    title: 'Squad Virtual Accounts',
    description: 'Your first digital financial identity. Create payment links, receive payments, and build transaction history instantly.',
  },
  {
    icon: Award,
    title: 'Micro-Certifications',
    description: 'Earn verifiable skill badges. 10 verified jobs + 4+ stars = micro-cert on your public profile.',
  },
  {
    icon: Shield,
    title: 'Peer Vouching',
    description: 'Verified users vouch for new users. Social trust becomes a digital credit signal.',
  },
];

export const Features = () => {
  return (
    <section id="features" className="bg-slate-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4">
            Built for the Invisible Economy
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Sabi combines AI matching, Squad payments, and community trust to unlock financial access for traders, artisans, and gig workers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">
            Ready to join 40M+ informal workers building their financial future?
          </p>
          <a
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};