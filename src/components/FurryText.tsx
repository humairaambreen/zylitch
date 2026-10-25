'use client';

import React, { useState } from 'react';

interface FurryTextProps {
  onLetterHover?: (char: string) => void;
  show3D?: boolean;
}

export default function FurryText({ onLetterHover, show3D = false }: FurryTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const letters = 'ZYLITCH'.split('');

  return (
    <div className="furry-text-container">
      {/* SVG Filter for realistic organic furry / fuzzy edges */}
      <svg
        className="furry-svg-defs"
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id="plush-fur-filter" x="-20%" y="-20%" width="140%" height="140%">
            {/* Turbulence noise generates organic microscopic fur fibers */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.075 0.095"
              numOctaves="4"
              result="furNoise"
            />
            {/* Displace the text silhouette to create fuzzy edges */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="furNoise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedFur"
            />
            {/* Soft fur halo */}
            <feGaussianBlur in="displacedFur" stdDeviation="0.6" result="softFur" />
            <feMerge>
              <feMergeNode in="softFur" />
              <feMergeNode in="SourceGraphic" opacity="0.3" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {show3D ? (
        /* 3D Fur Render Mode (Generated with Nano) */
        <div className="furry-3d-wrapper">
          <img
            src="/images/furry-zylitch.jpg"
            alt="ZYLITCH Furry 3D Typography"
            className="furry-3d-image"
          />
        </div>
      ) : (
        /* Interactive Plush Live Typography Mode */
        <div className="furry-letters-wrapper" data-text="ZYLITCH">
          {/* Cute Cat Ears on the initial Z */}
          <div className="cat-ears-accent" aria-hidden="true">
            <svg viewBox="0 0 80 45" className="cat-ears-svg">
              <path
                d="M 5,42 Q 18,2 35,12 Q 22,35 24,42 Z"
                fill="#ff4f9c"
                stroke="#ff85b8"
                strokeWidth="2"
              />
              <path
                d="M 12,38 Q 20,10 30,17 Q 22,33 22,38 Z"
                fill="#ffd6e3"
              />
              <path
                d="M 75,42 Q 62,2 45,12 Q 58,35 56,42 Z"
                fill="#ff4f9c"
                stroke="#ff85b8"
                strokeWidth="2"
              />
              <path
                d="M 68,38 Q 60,10 50,17 Q 58,33 58,38 Z"
                fill="#ffd6e3"
              />
            </svg>
          </div>

          {/* Letter by letter plush rendering */}
          {letters.map((char, index) => (
            <span
              key={index}
              className={`furry-char ${hoveredIndex === index ? 'is-hovered' : ''}`}
              onMouseEnter={() => {
                setHoveredIndex(index);
                onLetterHover?.(char);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animationDelay: `${index * 0.08}s`,
              }}
            >
              {/* Back plush shadow layer */}
              <span className="furry-char-shadow" aria-hidden="true">
                {char}
              </span>
              {/* Main furry body with SVG displacement filter */}
              <span className="furry-char-body">{char}</span>
              {/* Fluffy fiber highlight */}
              <span className="furry-char-highlight" aria-hidden="true">
                {char}
              </span>
            </span>
          ))}

          {/* Wagging plush tail on the trailing H */}
          <div className="cat-tail-accent" aria-hidden="true">
            <svg viewBox="0 0 60 70" className="cat-tail-svg">
              <path
                d="M 5,60 C 25,60 45,50 45,30 C 45,12 30,8 24,18 C 20,24 28,30 32,24"
                fill="none"
                stroke="#ff4f9c"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 5,60 C 25,60 45,50 45,30 C 45,12 30,8 24,18 C 20,24 28,30 32,24"
                fill="none"
                stroke="#ffd6e3"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
