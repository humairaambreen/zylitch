'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale } from './LocaleContext';

export default function AboutSection() {
  const { dict } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section" id="about">
      <div ref={contentRef} className="about-content-wrapper">
        <h2 className="about-title">{dict.about.title}</h2>
        <div className="about-body">
          <p className="about-description">{dict.about.p1}</p>
          <p className="about-description">{dict.about.p2}</p>
          <p className="about-description">{dict.about.p3}</p>
        </div>
      </div>
    </section>
  );
}
