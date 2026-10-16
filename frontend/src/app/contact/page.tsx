'use client';

import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import ContactSection from '@/components/landing/ContactSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas-light,#ffffff)] dark:bg-[var(--color-canvas-dark,#0b1120)] text-slate-900 dark:text-slate-100 transition-colors">
      <LandingHeader />
      <main className="flex-1 py-12">
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
