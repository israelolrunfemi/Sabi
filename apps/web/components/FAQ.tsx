'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How does Sabi verify my identity?',
        a: 'Sabi uses AI-powered onboarding to extract and verify your economic profile through conversation. You\'ll also need a valid phone number linked to your Squad virtual account. We partner with Squad to ensure secure KYC verification.',
      },
      {
        q: 'Do I need a credit card to sign up?',
        a: 'No! Sabi is free to join. You only pay when you upgrade to Professional or Enterprise tiers. Your Squad virtual account is also free to create.',
      },
      {
        q: 'What if I don\'t have a phone number or email yet?',
        a: 'A phone number is required to set up your Squad virtual account. If you need help, visit our support center or contact our team at support@sabi.ng',
      },
    ],
  },
  {
    category: 'Trust Score',
    questions: [
      {
        q: 'How is my trust score calculated?',
        a: 'Your trust score (0-100) is built from: Transaction frequency & completion rate (35 pts), ratings from completed matches (25 pts), tenure on platform (20 pts), peer vouching (15 pts), and profile completeness (5 pts). You start at 40/100.',
      },
      {
        q: 'How can I improve my trust score?',
        a: 'Complete transactions regularly, ask satisfied buyers/employers to rate you, stay on the platform, get vouched by verified users, and keep your profile up-to-date. Each action builds your score.',
      },
      {
        q: 'What benefits come with a high trust score?',
        a: 'At 75+, you unlock elite visibility in search results, higher match frequency, and potential access to micro-loans based on your Sabi financial history.',
      },
    ],
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-700 py-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left transition-colors hover:text-blue-400"
      >
        <h4 className="text-lg font-semibold text-white pr-4">{question}</h4>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <p className="mt-4 text-slate-400 leading-relaxed">{answer}</p>}
    </div>
  );
};

export const FAQ = () => {
  return (
    <section id="faq" className="bg-slate-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-400">
            Can\'t find the answer you\'re looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, idx) => (
            <div key={idx}>
              {/* Category Title */}
              <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-700">
                {category.category}
              </h3>

              {/* Questions */}
              <div className="space-y-0">
                {category.questions.map((item, qidx) => (
                  <FAQItem key={qidx} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-slate-300 mb-6">
            Our support team is here to help. Reach out anytime.
          </p>
          <a
            href="mailto:support@sabi.ng"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-blue-800"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};