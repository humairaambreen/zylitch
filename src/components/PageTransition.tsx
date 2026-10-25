'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

interface PageTransitionContextValue {
  isTransitioning: boolean;
  navigate: (href: string, label?: string) => void;
  hasInitiallyLoaded: boolean;
  setHasInitiallyLoaded: (val: boolean) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  isTransitioning: false,
  navigate: () => {},
  hasInitiallyLoaded: false,
  setHasInitiallyLoaded: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destinationLabel, setDestinationLabel] = useState('');
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const isNavigatingRef = useRef(false);
  const targetHrefRef = useRef<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const pathPrimaryRef = useRef<SVGPathElement>(null);
  const pathSecondaryRef = useRef<SVGPathElement>(null);
  const centerStageRef = useRef<HTMLDivElement>(null);
  const titleLettersRef = useRef<HTMLSpanElement[]>([]);

  // Helper to construct curved wave SVG path d-string
  const getCurvePath = (y: number, curve: number, mode: 'leave' | 'enter') => {
    // Clamped coordinates in 100 x 100 viewBox
    if (mode === 'leave') {
      // Rising from bottom (100) to top (0), curving convexly upwards
      return `M 0 100 L 0 ${y} Q 50 ${y + curve} 100 ${y} L 100 100 Z`;
    } else {
      // Retracting from bottom (100) to top (0), suctioning upwards
      return `M 0 0 L 100 0 L 100 ${y} Q 50 ${y + curve} 0 ${y} Z`;
    }
  };

  // Main Barba.js style transition function
  const navigate = useCallback(
    (href: string, label?: string) => {
      if (isNavigatingRef.current) return;
      if (href === pathname) return;

      isNavigatingRef.current = true;
      setIsTransitioning(true);
      targetHrefRef.current = href;

      // Determine clean label: strictly "home" or "work"
      const destName =
        label ||
        (href === '/work'
          ? 'work'
          : href === '/'
          ? 'home'
          : href.replace('/', ''));
      setDestinationLabel(destName);

      const overlay = overlayRef.current;
      const pathPrimary = pathPrimaryRef.current;
      const pathSecondary = pathSecondaryRef.current;
      const centerStage = centerStageRef.current;

      if (!overlay || !pathPrimary || !pathSecondary || !centerStage) {
        router.push(href);
        return;
      }

      // Activate overlay container
      gsap.set(overlay, { display: 'block', pointerEvents: 'auto', opacity: 1 });
      gsap.set(centerStage, { opacity: 0, y: 30 });

      // Initial flat paths at bottom (y=100, curve=0)
      pathPrimary.setAttribute('d', getCurvePath(100, 0, 'leave'));
      pathSecondary.setAttribute('d', getCurvePath(100, 0, 'leave'));

      // Wave state objects for GSAP interpolation
      const waveSec = { y: 100, curve: 0 };
      const wavePri = { y: 100, curve: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          // Apex of transition: screen is 100% masked
          // Push route and reset scroll
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          router.push(href);
        },
      });

      // 1. Secondary wave (pink accent) leads the upward surge
      tl.to(
        waveSec,
        {
          y: 0,
          curve: -38,
          duration: 0.75,
          ease: 'power4.inOut',
          onUpdate: () => {
            if (pathSecondary) {
              pathSecondary.setAttribute('d', getCurvePath(waveSec.y, waveSec.curve, 'leave'));
            }
          },
        },
        0
      )
        // Level off the curve at full screen
        .to(
          waveSec,
          {
            curve: 0,
            duration: 0.25,
            ease: 'power2.out',
            onUpdate: () => {
              if (pathSecondary) {
                pathSecondary.setAttribute('d', getCurvePath(waveSec.y, waveSec.curve, 'leave'));
              }
            },
          },
          '>-0.15'
        );

      // 2. Primary wave (deep midnight plum) follows tightly behind
      tl.to(
        wavePri,
        {
          y: 0,
          curve: -44,
          duration: 0.8,
          ease: 'power4.inOut',
          onUpdate: () => {
            if (pathPrimary) {
              pathPrimary.setAttribute('d', getCurvePath(wavePri.y, wavePri.curve, 'leave'));
            }
          },
        },
        0.07
      )
        // Level off the curve at full screen
        .to(
          wavePri,
          {
            curve: 0,
            duration: 0.25,
            ease: 'power2.out',
            onUpdate: () => {
              if (pathPrimary) {
                pathPrimary.setAttribute('d', getCurvePath(wavePri.y, wavePri.curve, 'leave'));
              }
            },
          },
          '>-0.15'
        );

      // 3. Center Stage Kinetic Typography & Progress Counter
      tl.to(
        centerStage,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
        },
        0.35
      );

      // Kinetic character reveal
      const chars = centerStage.querySelectorAll('.barba-title-char');
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.025,
            duration: 0.5,
            ease: 'power4.out',
          },
          0.38
        );
      }
    },
    [pathname, router]
  );

  // Phase 2: Enter Animation (Triggered once route changes)
  useEffect(() => {
    if (!isNavigatingRef.current) return;

    const overlay = overlayRef.current;
    const pathPrimary = pathPrimaryRef.current;
    const pathSecondary = pathSecondaryRef.current;
    const centerStage = centerStageRef.current;

    if (!overlay || !pathPrimary || !pathSecondary || !centerStage) return;

    // Prepare Enter paths (starting full screen at y=100)
    const wavePri = { y: 100, curve: 0 };
    const waveSec = { y: 100, curve: 0 };

    pathPrimary.setAttribute('d', getCurvePath(100, 0, 'enter'));
    pathSecondary.setAttribute('d', getCurvePath(100, 0, 'enter'));

    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => {
        gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
        isNavigatingRef.current = false;
        targetHrefRef.current = null;
        setIsTransitioning(false);
      },
    });

    // 1. Center typography fades and glides upward with letter stagger
    const chars = centerStage.querySelectorAll('.barba-title-char');
    if (chars.length > 0) {
      tl.to(
        chars,
        {
          yPercent: -120,
          opacity: 0,
          stagger: 0.015,
          duration: 0.35,
          ease: 'power3.in',
        },
        0
      );
    }

    tl.to(
      centerStage,
      {
        opacity: 0,
        y: -35,
        duration: 0.35,
        ease: 'power3.in',
      },
      0.1
    );

    // 2. Primary wave suctions upward towards top ceiling
    tl.to(
      wavePri,
      {
        y: 0,
        curve: -40,
        duration: 0.8,
        ease: 'power4.inOut',
        onUpdate: () => {
          if (pathPrimary) {
            pathPrimary.setAttribute('d', getCurvePath(wavePri.y, wavePri.curve, 'enter'));
          }
        },
      },
      0.15
    ).to(
      wavePri,
      {
        curve: 0,
        duration: 0.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (pathPrimary) {
            pathPrimary.setAttribute('d', getCurvePath(wavePri.y, wavePri.curve, 'enter'));
          }
        },
      },
      '>-0.1'
    );

    // 3. Secondary wave peels away right behind it
    tl.to(
      waveSec,
      {
        y: 0,
        curve: -36,
        duration: 0.75,
        ease: 'power4.inOut',
        onUpdate: () => {
          if (pathSecondary) {
            pathSecondary.setAttribute('d', getCurvePath(waveSec.y, waveSec.curve, 'enter'));
          }
        },
      },
      0.22
    ).to(
      waveSec,
      {
        curve: 0,
        duration: 0.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (pathSecondary) {
            pathSecondary.setAttribute('d', getCurvePath(waveSec.y, waveSec.curve, 'enter'));
          }
        },
      },
      '>-0.1'
    );

    // 4. Subtle cascade entrance for the new page
    tl.fromTo(
      ['.pinterest-header', '.pinterest-grid', '.hero', '.about'],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.08,
      },
      0.4
    );
  }, [pathname]);

  // Global link interception so EVERY link seamlessly runs Barba.js transition
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external URLs, hashes, mailto, tel, target=_blank, and modifier clicks
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        anchor.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Resolve relative or root paths
      const targetUrl = new URL(href, window.location.origin);
      if (targetUrl.pathname === window.location.pathname) {
        return;
      }

      // Valid internal transition -> intercept!
      e.preventDefault();
      e.stopPropagation();

      let customLabel: string | undefined;
      if (targetUrl.pathname === '/work') customLabel = 'work';
      if (targetUrl.pathname === '/') customLabel = 'home';

      navigate(targetUrl.pathname, customLabel);
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [navigate]);

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        navigate,
        hasInitiallyLoaded,
        setHasInitiallyLoaded,
      }}
    >
      {children}

      {/* Barba.js Liquid Dual-Curtain SVG Overlay */}
      <div
        ref={overlayRef}
        className="barba-transition-overlay"
        aria-hidden={!isTransitioning}
      >
        <svg
          className="barba-transition-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Secondary Wave: Vibrant Raspberry Glow (#ff4f9c) */}
          <path
            ref={pathSecondaryRef}
            className="barba-path-secondary"
            d="M 0 100 L 0 100 Q 50 100 100 100 L 100 100 Z"
          />

          {/* Primary Wave: Rich Midnight Espresso Plum (#23121c) */}
          <path
            ref={pathPrimaryRef}
            className="barba-path-primary"
            d="M 0 100 L 0 100 Q 50 100 100 100 L 100 100 Z"
          />
        </svg>

        {/* Center Stage: Just the pure, huge text like "home" or "work" */}
        <div ref={centerStageRef} className="barba-center-stage">
          <div className="barba-title-wrapper">
            <span className="barba-main-title">
              {destinationLabel.split('').map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  ref={(el) => {
                    if (el) titleLettersRef.current[index] = el;
                  }}
                  className="barba-title-char"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
