'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ImageSlider, ImageLayer, Divider } from '@/components/ui/image-comparison';

interface ColorPreset {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  altBefore: string;
  altAfter: string;
}

const PRESETS: ColorPreset[] = [
  {
    id: 'walters-sign',
    beforeSrc: '/assets/color-grading/walters_ungraded.png',
    afterSrc: '/assets/color-grading/walters_graded.png',
    altBefore: 'Before Color Grade',
    altAfter: 'After Color Grade',
  },
  {
    id: 'wamiqa-gala',
    beforeSrc: '/assets/color-grading/wamiqa_ungraded.png',
    afterSrc: '/assets/color-grading/wamiqa_graded.png',
    altBefore: 'Before Color Grade',
    altAfter: 'After Color Grade',
  },
  {
    id: 'siciliana-pizza',
    beforeSrc: '/assets/color-grading/pizza_ungraded.png',
    afterSrc: '/assets/color-grading/pizza_graded.png',
    altBefore: 'Before Color Grade',
    altAfter: 'After Color Grade',
  },
  {
    id: 'walters-feast',
    beforeSrc: '/assets/color-grading/editorial_ungraded.png',
    afterSrc: '/assets/color-grading/editorial_graded.png',
    altBefore: 'Before Color Grade',
    altAfter: 'After Color Grade',
  },
];

export default function ColorGradeSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePreset = PRESETS[activeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : PRESETS.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < PRESETS.length - 1 ? prev + 1 : 0));
  }, []);

  // Keyboard navigation for Apple-style dot switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section className="color-grade-section" id="color-grading" aria-label="Color Grading">
      {/* Ambient background glow */}
      <div className="color-grade-ambient-glow" aria-hidden="true" />

      <div className="color-grade-container">
        {/* Interactive Comparison Slider Viewport */}
        <div className="color-grade-frame">
          <div className="color-grade-slider-box">
            <ImageSlider
              key={activePreset.id}
              defaultPosition={50}
              dividerColor="#ff4f9c"
            >
              {/* Graded Film Master (First Layer) */}
              <ImageLayer
                src={activePreset.afterSrc}
                alt={activePreset.altAfter}
                layer="first"
                loading="eager"
                priority
              />

              {/* Ungraded Raw LOG (Second Layer) */}
              <ImageLayer
                src={activePreset.beforeSrc}
                alt={activePreset.altBefore}
                layer="second"
                loading="eager"
                priority
              />

              {/* Tactile Draggable Divider Handle */}
              <Divider
                width={2}
                handleSize={38}
                handleColor="rgba(18, 14, 22, 0.94)"
                hitAreaSize={36}
              />
            </ImageSlider>
          </div>
        </div>

        {/* Apple-Style Fluid UI Dots Bar */}
        <div className="apple-dots-container">
          <button
            type="button"
            onClick={handlePrev}
            className="apple-nav-btn"
            aria-label="Previous preset"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Apple-Style Frosted Capsule */}
          <div
            className="apple-dots-capsule"
            role="tablist"
            aria-label="Color grading photo selection"
          >
            {PRESETS.map((preset, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={preset.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Photo ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`apple-dot-btn ${isActive ? 'is-active' : ''}`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="apple-nav-btn"
            aria-label="Next preset"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
