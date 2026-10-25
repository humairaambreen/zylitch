'use client';

import React from 'react';

interface SplitCharsProps {
  text: string;
  className?: string;
}

export function SplitChars({ text, className = '' }: SplitCharsProps) {
  return (
    <span
      className={`split-chars-root ${className}`}
      style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="char-wrap"
          style={{
            whiteSpace: 'nowrap',
            display: 'inline-block',
            overflow: 'hidden',
          }}
        >
          <span
            className="char"
            style={{
              display: 'inline-block',
              willChange: 'transform, clip-path, opacity',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
}

interface SplitLinesProps {
  text: string;
  className?: string;
}

export function SplitLines({ text, className = '' }: SplitLinesProps) {
  // Split by clauses, sentences, or phrases so that lines animate progressively
  const chunks = text.match(/[^.,;!?]+[.,;!?]+|[^.,;!?]+$/g) || [text];

  return (
    <span className={`split-lines-root ${className}`}>
      {chunks.map((chunk, index) => (
        <span
          key={index}
          className="line-wrap"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
          }}
        >
          <span
            className="line"
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity',
            }}
          >
            {chunk.trim()}{' '}
          </span>
        </span>
      ))}
    </span>
  );
}
