'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import PawCursor from '@/components/PawCursor';
import Loader from '@/components/Loader';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import PortfolioExperience from '@/components/PortfolioExperience';
import ColorGradeSection from '@/components/ColorGradeSection';
import Footer from '@/components/Footer';

import { usePageTransition } from '@/components/PageTransition';

export default function Home() {
  const { hasInitiallyLoaded, setHasInitiallyLoaded } = usePageTransition();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Creamy, weighted smooth scrolling matching the horizontal gallery feel
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.05,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (lenisRef.current) {
      if (open) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, []);

  return (
    <main className="site-main">
      {!hasInitiallyLoaded && (
        <Loader
          isReady={isLoaded}
          onFinish={() => setHasInitiallyLoaded(true)}
        />
      )}
      <Navbar />
      <PawCursor isOpen={isOpen} />

      {/* 1. Hero Section (100vh) */}
      <Hero />

      {/* 2. About Section (Natural vertical scroll, giant Satoshi typography) */}
      <AboutSection />

      {/* 3. Horizontal Portfolio Experience Section (Sticky horizontal scroll) */}
      <PortfolioExperience
        lenis={lenisRef.current}
        onLoaded={handleLoaded}
        onOpenChange={handleOpenChange}
      />

      {/* 4. Interactive Color Grading Before/After Comparison Section */}
      <ColorGradeSection />

      {/* 5. Semantic SSR context for AI bots, screen readers & search engines */}
      <section className="sr-only" aria-label="About Zylitch Video Editing Studio">
        <h2>ZYLITCH — Commercial Video Editor &amp; Visual Storyteller</h2>
        <p>
          Zylitch (질리치 / ジリッチ) is a commercial video editor with 4+ years of specialized craft in high-impact commercial video editing, brand launch reels, food and beverage sizzle reels, DaVinci Resolve color grading, and viral social campaigns across 9:16 vertical and 16:9 cinematic formats.
        </p>
        <p>
          Direct Inquiries: <a href="mailto:hello@zylitch.in">hello@zylitch.in</a> | Explore the complete video archive at <a href="/work">zylitch.in/work</a>.
        </p>
      </section>

      {/* 5. Footer Section (Allows scrolling past videos and returning up) */}
      <Footer />
    </main>
  );
}


