'use client';

import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas-light,#ffffff)] dark:bg-[var(--color-canvas-dark,#0b1120)] text-slate-900 dark:text-slate-100 transition-colors selection:bg-[var(--color-primary)] selection:text-white">
      {/* 1. Header & Navigation */}
      <LandingHeader />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero & Core Introduction */}
        <HeroSection />

        {/* 3. Platform Value Proposition & Pillars */}
        <FeaturesSection />
      </main>

      {/* 4. Comprehensive Footer & Social Networks */}
      <LandingFooter />
    </div>
  );
}
