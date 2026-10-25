'use client';

import React from 'react';
import AnimatedCat from './AnimatedCat';
import { useLocale } from './LocaleContext';

export default function Hero() {
  const { dict } = useLocale();

  return (
    <section className="hero-section" id="hero">
      <div className="hero-center-stage">
        <div className="hero-wordmark-wrapper">
          <div className="cat-on-the-t">
            <AnimatedCat />
          </div>
          <picture>
            <source srcSet="/images/furry-zylitch-clean.webp" type="image/webp" />
            <img
              src="/images/furry-zylitch-clean.png"
              alt="ZYLITCH"
              className="hero-3d-fur-logo"
              draggable={false}
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <h1 className="sr-only">ZYLITCH — {dict.hero.tagline}</h1>
        </div>
      </div>
    </section>
  );
}
