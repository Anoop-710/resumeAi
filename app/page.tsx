// File: app/page.tsx

'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ResumeOptimizer from '../components/ResumeOptimizer';
import JobResumeOptimizer from '../components/JobResumeOptimizer';
import TechStackResume from '../components/TechStackResume';
import { useDarkMode } from '../contexts/DarkModeContext';
import ThemeGreen from '@/components/Theme';

export default function Home() {

  const { darkMode } = useDarkMode();
  const theme = darkMode ? ThemeGreen.dark : ThemeGreen.light;
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gradient-to-br from-emerald-950 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-emerald-100'}`}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Hero darkMode={darkMode} />

        <div className="space-y-8">
          <ResumeOptimizer />
          <JobResumeOptimizer />
          <TechStackResume />
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}