'use client';

import Link from 'next/link';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-4 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Sabi</h3>
            <p className="text-sm text-slate-400 mb-6">
              Digitally onboarding Nigeria's informal economy — connecting traders, artisans, and job seekers to opportunities and financial access.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Lagos, Nigeria</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="https://blog.sabi.ng" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal & Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="mailto:support@sabi.ng" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 py-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-slate-500">
              © {currentYear} Sabi. All rights reserved. Built for Squad Hackathon 3.0.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://twitter.com/sabiplatform"
                aria-label="Twitter"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/sabiplatform"
                aria-label="LinkedIn"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/israelolrunfemi/sabi"
                aria-label="GitHub"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};