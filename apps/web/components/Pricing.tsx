'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    subtitle: 'Solo traders & freelancers',
    price: 'Free',
    description: 'Get started with Sabi',
    features: [
      'AI-powered onboarding',
      'Squad virtual account',
      'Basic trust score',
      'Search opportunities',
      'Payment links (up to 10/month)',
      'Transaction history',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    subtitle: 'Active traders & teams',
    price: '₦2,999',
    period: '/month',
    description: 'Unlock full potential',
    features: [
      'Everything in Starter',
      'Unlimited payment links',
      'Advanced AI matching',
      'Post opportunities',
      'Team collaboration (up to 5 members)',
      'Priority support',
      'Advanced analytics',
      'Micro-certifications',
    ],
    cta: 'Start 14-Day Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'Associations & cooperatives',
    price: 'Custom',
    description: 'Scale your network',
    features: [
      'Everything in Professional',
      'Custom integrations',
      'Dedicated account manager',
      'Bulk user onboarding',
      'API access',
      'White-label options',
      'Advanced reporting',
      'SLA support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="bg-slate-900 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free. Scale affordably. No hidden fees, no credit card required for Starter.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border transition-all duration-300 ${
                tier.highlighted
                  ? 'border-blue-500 bg-gradient-to-br from-blue-950 to-slate-900 shadow-2xl shadow-blue-500/20 scale-105 md:scale-100 md:z-10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              {/* Badge */}
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Tier Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{tier.subtitle}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    {tier.period && <span className="text-slate-400">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{tier.description}</p>
                </div>

                {/* CTA */}
                <Link
                  href={tier.name === 'Enterprise' ? '#contact' : '/auth/register'}
                  className={`w-full block rounded-lg px-6 py-3 text-center font-semibold transition-all duration-200 mb-8 ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      : 'border border-slate-600 text-white hover:border-slate-500 hover:bg-slate-700/50'
                  }`}
                >
                  {tier.cta}
                </Link>

                {/* Features */}
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Includes</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            All plans include access to the AI matching engine and Squad integration.{' '}
            <a href="#contact" className="text-blue-400 hover:text-blue-300">
              Questions? Contact us.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};