'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';

interface LoaderProps {
  isReady: boolean;
  onFinish?: () => void;
}

export default function Loader({ isReady, onFinish }: LoaderProps) {
  const [shouldHide, setShouldHide] = useState(false);
  const [removed, setRemoved] = useState(false);
  const isMountedRef = useRef(true);
  const mountTimeRef = useRef<number>(Date.now());
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const segments = useMemo(() => {
    const totalSegments = 30;
    const angleSpan = 40;
    const angleInc = angleSpan / totalSegments;
    const negAngleHalf = -angleSpan / 2;
    const dur = 2;
    const delayInc = dur / 100;

    return Array.from({ length: totalSegments }, (_, i) => {
      const s = i + 1;
      const rotateBy = angleInc * (s - 1);
      const rotation = negAngleHalf + rotateBy;
      const delay = delayInc * (s - 1);
      const isHead = s === 1;
      const isTail = s === totalSegments;

      return {
        id: s,
        rotation,
        delay,
        isHead,
        isTail,
      };
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let hideTimer: NodeJS.Timeout | null = null;
    let fallbackTimer: NodeJS.Timeout | null = null;

    // Full 360-degree revolution of the cat loop takes 2.0s (2000ms).
    // Guarantee at least 2200ms so the cat completes a full revolution before fading.
    const minDisplayTime = 2200;
    // Hard fallback: never leave the user stuck on the loader
    const maxFallbackTime = 4000;

    if (isReady) {
      const elapsed = Date.now() - mountTimeRef.current;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      hideTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setShouldHide(true);
        }
      }, remaining);
    }

    fallbackTimer = setTimeout(() => {
      if (isMountedRef.current) {
        setShouldHide(true);
      }
    }, maxFallbackTime);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [isReady]);

  useEffect(() => {
    let removeTimer: NodeJS.Timeout | null = null;

    if (shouldHide) {
      removeTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setRemoved(true);
          onFinishRef.current?.();
        }
      }, 700);
    }

    return () => {
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [shouldHide]);

  if (removed) return null;

  return (
    <div className={`loader-overlay ${shouldHide ? 'is-loaded' : ''}`} data-loader="overlay">
      <div className="cat" data-cat="container">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className={`cat__segment ${seg.isHead ? 'cat__segment--head' : ''} ${
              seg.isTail ? 'cat__segment--tail' : ''
            }`}
            style={{
              transform: `translate(-50%, -50%) rotate(${seg.rotation}deg)`,
            }}
          >
            <div
              className="cat__segment-inner"
              style={{
                animationDelay: `${seg.delay}s`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="loader-label">loading...</div>
    </div>
  );
}
