'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-950/80 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Sabi
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700 mt-4 pt-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;