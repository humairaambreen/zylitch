'use client';

import React, { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';
import catAnimationData from '@/data/cat-sitting.json';

interface AnimatedCatProps {
  className?: string;
}

export default function AnimatedCat({ className = '' }: AnimatedCatProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: AnimationItem | null = null;

    import('lottie-web').then((lottieModule) => {
      const lottie = lottieModule.default || lottieModule;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: catAnimationData,
        });
      }
    });

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, []);

  return (
    <div className={`animated-cat-wrapper ${className}`}>
      <div ref={containerRef} className="lottie-cat-container" />
    </div>
  );
}
