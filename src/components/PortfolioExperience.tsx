'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { PortfolioItem } from '@/data/portfolio';
import { SplitChars, SplitLines } from './SplitText';
import { IconVolumeHigh, IconVolumeMute } from './Iconoir';
import { useLocale } from './LocaleContext';



interface TrailNode {
  cx: number;
  cy: number;
  w: number;
  h: number;
  index: number;
  label: string;
  projectTitle: string;
}

interface TrailData {
  pathData: string;
  width: number;
  height: number;
  cardNodes: TrailNode[];
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
}

interface PortfolioExperienceProps {
  onLoaded: () => void;
  onOpenChange: (isOpen: boolean) => void;
  lenis?: Lenis | null;
}

export default function PortfolioExperience({
  onLoaded,
  onOpenChange,
  lenis,
}: PortfolioExperienceProps) {
  const { dict, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const showcaseIntroRef = useRef<HTMLDivElement>(null);
  const sectionContentRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const galleryWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentDetailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const videoNaturalSizes = useRef<({ w: number; h: number } | null)[]>([]);
  const currentOpenIndex = useRef<number | null>(null);
  const isAnimating = useRef<boolean>(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic showcase items loaded live from Turso DB
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // SVG Trail State & Refs
  const [trail, setTrail] = useState<TrailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEnergized, setIsEnergized] = useState<boolean>(false);

  const isEnergizedRef = useRef<boolean>(false);
  const viewAllWrapperRef = useRef<HTMLAnchorElement>(null);
  const endTextRef = useRef<HTMLDivElement>(null);
  const shockwaveRingRef = useRef<SVGCircleElement>(null);
  const trailSvgRef = useRef<SVGSVGElement>(null);
  const trailCoreRef = useRef<SVGPathElement>(null);
  const orbGroupRef = useRef<SVGGElement>(null);
  const orbRafRef = useRef<number | null>(null);
  const orbTrackerRef = useRef<{ progress: number }>({ progress: 0 });

  // High-craft GSAP electrical conduction wave: ripples through characters with kinetic pop
  const playElectricConduction = useCallback(() => {
    const container = endTextRef.current;
    if (!container) return;
    const chars = container.querySelectorAll<HTMLElement>('.k-char');
    const rows = container.querySelectorAll<HTMLElement>('.kinetic-row');
    const ring = shockwaveRingRef.current;

    const tl = gsap.timeline();

    // 1. Crisp conduction spark pulse in SVG terminal (pure geometric ring expansion)
    if (ring) {
      tl.fromTo(
        ring,
        { r: 4, opacity: 1, strokeWidth: 3 },
        { r: 28, opacity: 0, strokeWidth: 1, duration: 0.5, ease: 'power2.out' },
        0
      );
    }

    // 2. Electrical conduction wave cascading through each character with kinetic pop & color charge
    tl.fromTo(
      chars,
      { y: 0, scale: 1, color: '#ffffff' },
      {
        y: -10,
        scale: 1.08,
        color: '#ff2a85',
        duration: 0.16,
        stagger: 0.022,
        ease: 'power2.out',
      },
      0.03
    ).to(
      chars,
      {
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.022,
        ease: 'elastic.out(1.2, 0.35)',
      },
      0.15
    );

    // 3. Staggered kinetic row recoil
    tl.fromTo(
      rows,
      { x: 0 },
      {
        x: (i) => (i + 1) * 8,
        duration: 0.2,
        stagger: 0.04,
        ease: 'power2.out',
      },
      0.05
    ).to(
      rows,
      {
        x: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'elastic.out(1.1, 0.4)',
      },
      0.22
    );
  }, []);

  const handleMouseEnter = useCallback(() => {
    // ONLY allow hover effect once the electrical conduction has completed and text is pink
    if (!isEnergizedRef.current) return;
    const container = endTextRef.current;
    if (!container) return;
    const rows = container.querySelectorAll<HTMLElement>('.kinetic-row');
    const chars = container.querySelectorAll<HTMLElement>('.k-char');

    gsap.to(rows, {
      x: (i) => (i + 1) * 14,
      skewX: -3,
      duration: 0.38,
      stagger: 0.035,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    gsap.to(chars, {
      color: '#ff2a85',
      stagger: 0.016,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isEnergizedRef.current) return;
    const container = endTextRef.current;
    if (!container) return;
    const rows = container.querySelectorAll<HTMLElement>('.kinetic-row');

    gsap.to(rows, {
      x: 0,
      skewX: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  }, []);

  // Position moving orb at exact coordinates along the trail filament & trigger conduction ONLY when orb physically arrives
  const updateOrbPosition = useCallback((progress: number) => {
    const path = trailCoreRef.current;
    const orbGroup = orbGroupRef.current;
    if (!path || !orbGroup) return;
    try {
      const totalLen = path.getTotalLength();
      if (totalLen > 0) {
        const clamped = Math.max(0, Math.min(1, progress));
        const pt = path.getPointAtLength(clamped * totalLen);
        orbGroup.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);

        // Check exact pixel distance between current orb position and the final terminal contact
        const endPt = path.getPointAtLength(totalLen);
        const distToEnd = Math.hypot(pt.x - endPt.x, pt.y - endPt.y);

        // Electrical conduction triggers ONLY when the glowing orb physically reaches and touches the contact terminal
        if (distToEnd <= 16 || clamped >= 0.99) {
          if (!isEnergizedRef.current) {
            isEnergizedRef.current = true;
            setIsEnergized(true);
            playElectricConduction();
          }
        } else if (distToEnd > 35 && clamped < 0.96) {
          if (isEnergizedRef.current) {
            isEnergizedRef.current = false;
            setIsEnergized(false);
            const container = endTextRef.current;
            if (container) {
              const chars = container.querySelectorAll<HTMLElement>('.k-char');
              gsap.to(chars, { color: '#ffffff', y: 0, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
            }
          }
        }
      }
    } catch {
      // SVG not ready or updating
    }
  }, [playElectricConduction]);

  // Debounced ScrollTrigger refresh to prevent rapid-fire recalculations
  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  // Helper to compute fitted width and height preserving aspect ratio
  const getFitSize = useCallback(
    (natW: number, natH: number, maxW: number, maxH: number) => {
      const ratio = natW / natH;
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      return { w, h };
    },
    []
  );

  const isMobileViewport = useCallback(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 767;
  }, []);

  // Compute organic curved trail path connecting Showcase to each video card through their visual centers
  const updateTrail = useCallback(() => {
    const scrollContent = scrollContentRef.current;
    if (!scrollContent) return;

    const contentRect = scrollContent.getBoundingClientRect();
    const w = scrollContent.scrollWidth;
    const h = scrollContent.offsetHeight;

    if (w <= 0 || h <= 0) return;

    const nodes: TrailNode[] = [];
    galleryWrapperRefs.current.forEach((wrapper, idx) => {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const cx = rect.left - contentRect.left + rect.width / 2;
      const cy = rect.top - contentRect.top + rect.height / 2;
      const item = items[idx];
      nodes.push({
        cx,
        cy,
        w: rect.width,
        h: rect.height,
        index: idx,
        label: `0${idx + 1}`,
        projectTitle: item?.titleTop || `0${idx + 1}`,
      });
    });

    if (nodes.length === 0) return;

    const showcase = showcaseIntroRef.current;
    const first = nodes[0];

    // Smooth origin starting from the left edge, framing beneath the giant centered "Showcase"
    let startX = 0;
    let startY = h * 0.62;
    let endShowcaseX = first.cx * 0.45;
    let endShowcaseY = h * 0.62;

    if (showcase) {
      const sRect = showcase.getBoundingClientRect();
      const titleEl = showcase.querySelector('.showcase-title') as HTMLElement | null;
      const tRect = titleEl ? titleEl.getBoundingClientRect() : sRect;
      startX = Math.max(0, sRect.left - contentRect.left - 40);
      endShowcaseX = sRect.left - contentRect.left + sRect.width;
      // Position clearly below the bottom of the letters with a clean, comfortable gap
      startY = Math.min(h * 0.88, tRect.bottom - contentRect.top + 34);
      endShowcaseY = startY;
    }

    let d = `M ${startX},${startY}`;

    // Underlining curve beneath Showcase
    const introDist = endShowcaseX - startX;
    d += ` C ${startX + introDist * 0.4},${startY} ${endShowcaseX - introDist * 0.15},${endShowcaseY} ${endShowcaseX},${endShowcaseY}`;

    // Sweeping bridge curve connecting Showcase to Card 1
    const bridgeDist = first.cx - endShowcaseX;
    const bridgeCp1X = endShowcaseX + bridgeDist * 0.45;
    const bridgeCp1Y = endShowcaseY;
    const bridgeCp2X = first.cx - bridgeDist * 0.4;
    const bridgeCp2Y = first.cy;
    d += ` C ${bridgeCp1X},${bridgeCp1Y} ${bridgeCp2X},${bridgeCp2Y} ${first.cx},${first.cy}`;

    // Inter-card waves: strictly horizontal tangents at each card center (dy/dx = 0)
    for (let i = 0; i < nodes.length - 1; i++) {
      const p1 = nodes[i];
      const p2 = nodes[i + 1];
      const dx = p2.cx - p1.cx;
      const cp1x = p1.cx + dx * 0.5;
      const cp1y = p1.cy;
      const cp2x = p2.cx - dx * 0.5;
      const cp2y = p2.cy;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.cx},${p2.cy}`;
    }

    // Final Trail Extension: Sweep gracefully directly into the first letter 'v' of "view all my works"
    let targetX = 0;
    let targetY = 0;
    let hasEnd = false;

    if (nodes.length > 0 && viewAllWrapperRef.current) {
      const lastCard = nodes[nodes.length - 1]; // Card 05
      const textEl = endTextRef.current || viewAllWrapperRef.current;
      const tRect = textEl.getBoundingClientRect();

      // Find the first character 'v' of 'view' so the line plugs directly into the start of the typography
      const firstChar = textEl.querySelector('.k-char') as HTMLElement | null;
      const charRect = firstChar ? firstChar.getBoundingClientRect() : tRect;

      targetX = Math.round(charRect.left - contentRect.left - 14);
      targetY = Math.round(charRect.top - contentRect.top + charRect.height * 0.58);
      hasEnd = true;

      const dx = targetX - lastCard.cx;
      const cp1X = lastCard.cx + dx * 0.45;
      const cp1Y = lastCard.cy;
      const cp2X = targetX - dx * 0.25;
      const cp2Y = targetY;

      // Curve gracefully into the text terminal and stop right at the contact point
      d += ` C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${targetX},${targetY}`;
    }

    setTrail({
      pathData: d,
      width: w,
      height: h,
      cardNodes: nodes,
      startX,
      startY,
      endX: hasEnd ? targetX : undefined,
      endY: hasEnd ? targetY : undefined,
    });

    requestAnimationFrame(() => {
      updateOrbPosition(orbTrackerRef.current.progress);
    });
  }, [updateOrbPosition]);

  const sizeGalleryImages = useCallback(() => {
    if (typeof window === 'undefined') return;
    galleryWrapperRefs.current.forEach((wrapper, i) => {
      const size = videoNaturalSizes.current[i];
      if (!size || !wrapper) return;
      const mobile = isMobileViewport();
      const maxH = window.innerHeight * (mobile ? 0.36 : 0.45);
      const maxW = window.innerWidth * (mobile ? 0.8 : 0.6);
      const { w, h } = getFitSize(size.w, size.h, maxW, maxH);
      wrapper.style.width = `${w}px`;
      wrapper.style.height = `${h}px`;
    });
    if (viewAllWrapperRef.current) {
      const mobile = isMobileViewport();
      const maxH = window.innerHeight * (mobile ? 0.36 : 0.45);
      viewAllWrapperRef.current.style.height = `${maxH}px`;
    }
    debouncedRefresh();
    requestAnimationFrame(() => {
      updateTrail();
    });
  }, [getFitSize, isMobileViewport, debouncedRefresh, updateTrail]);

  const sizeContentWrapper = useCallback(
    (index: number) => {
      if (typeof window === 'undefined') return;
      const size = videoNaturalSizes.current[index];
      const wrapper = contentWrapperRefs.current[index];
      if (!size || !wrapper) return;
      const mobile = isMobileViewport();
      const maxW = window.innerWidth * (mobile ? 0.82 : 0.5);
      const maxH = window.innerHeight * (mobile ? 0.55 : 0.6);
      const { w, h } = getFitSize(size.w, size.h, maxW, maxH);
      wrapper.style.width = `${w}px`;
      wrapper.style.height = `${h}px`;
    },
    [getFitSize, isMobileViewport]
  );

  // Initialize FIXED ScrollTrigger pin horizontal scroll & start entrance reveal
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const section = sectionRef.current;
    const scrollContent = scrollContentRef.current;
    if (!section || !scrollContent) return;

    const getScrollDistance = () => {
      return Math.max(0, scrollContent.scrollWidth - window.innerWidth);
    };

    const ctx = gsap.context(() => {
      const pinDistance = () => getScrollDistance() + window.innerHeight * 0.85;
      const orbTracker = { progress: 0 };
      orbTrackerRef.current = orbTracker;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'portfolio-pin',
          trigger: section,
          start: 'top top',
          end: () => `+=${pinDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Brief entrance hold on Card 1 so it frames nicely before scrolling
      tl.to({}, { duration: 0.06 });

      // Smooth horizontal motion traversing Cards 1 through 5 in 1:1 synchronization with the orb along the trail
      tl.to(
        scrollContent,
        {
          x: () => -getScrollDistance(),
          ease: 'none',
          duration: 1,
        },
        'gallery-scroll'
      );

      tl.to(
        orbTracker,
        {
          progress: 1,
          ease: 'none',
          duration: 1,
          onUpdate: () => {
            if (orbRafRef.current !== null) return;
            orbRafRef.current = requestAnimationFrame(() => {
              orbRafRef.current = null;
              updateOrbPosition(orbTracker.progress);
            });
          },
        },
        'gallery-scroll'
      );

      // Dedicated sticky pause on the finale: the orb has arrived and the text is energized
      tl.to({}, { duration: 0.28 });

      // Clean start entrance reveal for Showcase text and SVG trail line
      let hasRevealed = false;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (hasRevealed) return;
          hasRevealed = true;

          // 1. Text entrance: bouncy fluffy letter reveal
          gsap.fromTo(
            '.showcase-title .fluffy-char',
            { opacity: 0, y: 75, scale: 0.65 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              stagger: 0.05,
              ease: 'back.out(1.8)',
            }
          );

          // 2. SVG trail line draw-in
          const svg = trailSvgRef.current;
          if (svg) {
            const paths = svg.querySelectorAll('path');
            paths.forEach((p) => {
              const len = p.getTotalLength?.() || 4000;
              p.style.strokeDasharray = `${len}`;
              p.style.strokeDashoffset = `${len}`;
            });
            gsap.to(paths, {
              strokeDashoffset: 0,
              duration: 2.0,
              ease: 'power2.out',
              delay: 0.15,
            });

            // 3. Glowing celestial active dot entrance
            gsap.fromTo(
              '.trail-active-dot',
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.35,
              }
            );
          }
        },
      });
    }, section);

    const handleResize = () => {
      sizeGalleryImages();
      if (currentOpenIndex.current !== null) {
        sizeContentWrapper(currentOpenIndex.current);
      }
      updateTrail();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (orbRafRef.current !== null) cancelAnimationFrame(orbRafRef.current);
      ctx.revert();
    };
  }, [sizeGalleryImages, sizeContentWrapper, updateTrail, updateOrbPosition]);

  // Video metadata loading tracking & swift initial loader clearance
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  // Fetch live showcase items from Turso DB with dynamic locale translation
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/showcase?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          videoNaturalSizes.current = data.items.map((it: any) => ({
            w: it.width || 720,
            h: it.height || 1280,
          }));
        }
      })
      .catch((err) => console.error('Failed to load live showcase items:', err));

    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Re-size and update trail when dynamic items load
  useEffect(() => {
    sizeGalleryImages();
    debouncedRefresh();
    updateTrail();
  }, [items, sizeGalleryImages, debouncedRefresh, updateTrail]);

  // Immediate layout calculation: dismiss loader quickly (~120ms) without stalling on heavy video network handshakes
  useEffect(() => {
    sizeGalleryImages();
    const timer = setTimeout(() => {
      onLoadedRef.current?.();
      debouncedRefresh();
      updateTrail();
    }, 120);

    return () => clearTimeout(timer);
  }, [sizeGalleryImages, debouncedRefresh, updateTrail]);

  // Mute / Unmute handler for active modal video
  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const idx = currentOpenIndex.current;
    if (idx === null) return;
    const video = videoRefs.current[idx];
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  useEffect(() => {
    let isMounted = true;

    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      const onReady = () => {
        if (!isMounted) return;
        if (video.videoWidth && video.videoHeight) {
          videoNaturalSizes.current[i] = {
            w: video.videoWidth,
            h: video.videoHeight,
          };
          sizeGalleryImages();
        }
      };

      if (video.readyState >= 1 && video.videoWidth) {
        onReady();
      } else {
        video.addEventListener('loadedmetadata', onReady, { once: true });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [sizeGalleryImages]);

  // Smart IntersectionObserver: auto-play visible cards, pause offscreen to save battery and GPU
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      {
        rootMargin: '250px 100px',
        threshold: 0.05,
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // GSAP Flip: Open full detail view
  const openContent = useCallback(
    (index: number) => {
      if (isAnimating.current || currentOpenIndex.current !== null) return;
      isAnimating.current = true;
      currentOpenIndex.current = index;
      setIsMuted(true);

      const currentDetail = contentDetailRefs.current[index];
      const currentWrapper = contentWrapperRefs.current[index];
      const sectionContent = sectionContentRef.current;
      const scrollWrapper = scrollWrapperRef.current;
      const galleryWrapper = galleryWrapperRefs.current[index];

      if (!currentDetail || !currentWrapper || !sectionContent || !scrollWrapper || !galleryWrapper) {
        isAnimating.current = false;
        currentOpenIndex.current = null;
        return;
      }

      const imageContainer = galleryWrapper.querySelector('.image_container');
      if (!imageContainer) {
        isAnimating.current = false;
        currentOpenIndex.current = null;
        return;
      }

      // Collect target elements
      const titleChars = Array.from(
        currentDetail.querySelectorAll('.content_title-top .char, .content_title-bottom .char')
      );
      const titleRoots = Array.from(
        currentDetail.querySelectorAll(
          '.content_title-top .split-chars-root, .content_title-bottom .split-chars-root'
        )
      );
      const allTextLines = Array.from(
        currentDetail.querySelectorAll('.content_text-left .line, .content_text-right .line')
      );
      const leftContainer = currentDetail.querySelector('.content_text-left');
      const rightContainer = currentDetail.querySelector('.content_text-right');

      const otherWrappers: HTMLElement[] = galleryWrapperRefs.current.filter(
        (img, i): img is HTMLDivElement => i !== index && img !== null
      );
      if (viewAllWrapperRef.current) {
        otherWrappers.push(viewAllWrapperRef.current);
      }

      // Instantly set text elements to hidden state BEFORE revealing currentDetail to avoid flash of visible text
      gsap.set(titleChars, {
        clipPath: 'inset(0 100% 0 0)',
        xPercent: 10,
        opacity: 0,
      });
      gsap.set(titleRoots, {
        xPercent: 15,
        opacity: 0,
      });
      gsap.set(allTextLines, {
        yPercent: 100,
        opacity: 0,
      });
      if (leftContainer) gsap.set(leftContainer, { opacity: 0 });
      if (rightContainer) gsap.set(rightContainer, { opacity: 0 });

      const audioCtrl = currentDetail.querySelector('.showcase-audio-ctrl');
      if (audioCtrl) gsap.set(audioCtrl, { opacity: 0, y: 10 });

      // Reveal detail section
      currentDetail.classList.remove('is-hidden');

      // Pre-size target wrapper
      sizeContentWrapper(index);

      // Lock global scroll
      onOpenChange(true);
      setIsDetailOpen(true);

      // Move video to detail wrapper
      const flipState = Flip.getState(imageContainer);
      currentWrapper.appendChild(imageContainer);

      if (backdropRef.current) {
        gsap.set(backdropRef.current, { opacity: 0 });
      }

      const tl = gsap.timeline({
        onStart: () => {
          sectionContent.classList.remove('is-hidden');
          sectionContent.classList.add('is-active');
        },
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      tl.addLabel('start', 0)
        // Smoothly fade in backdrop to cover gallery background seamlessly without glitching
        .to(
          backdropRef.current,
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
          },
          'start'
        )
        // Morph video to center stage (duration 1.25s)
        .add(() => {
          Flip.from(flipState, {
            duration: 1.25,
            ease: 'power4.inOut',
          });
        }, 'start')
        // Hide remaining gallery cards
        .to(
          otherWrappers,
          {
            clipPath: 'inset(100% 0 0 0)',
            duration: 0.75,
            ease: 'power3.inOut',
          },
          0
        )
        // Animate big titles in
        .to(
          titleRoots,
          {
            xPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
          },
          'start+=1.0'
        )
        .to(
          titleChars,
          {
            clipPath: 'inset(0 0% 0 0)',
            xPercent: 0,
            opacity: 1,
            stagger: 0.02,
            duration: 0.7,
            ease: 'power3.out',
          },
          'start+=1.0'
        )
        // Subtitles and copy
        .to(
          [leftContainer, rightContainer].filter(Boolean),
          {
            opacity: 1,
            duration: 0.3,
          },
          'start+=1.1'
        )
        .to(
          allTextLines,
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.035,
            duration: 0.7,
            ease: 'power3.out',
          },
          'start+=1.1'
        );

      // Seamless delayed entrance for audio controller with text animations
      if (audioCtrl) {
        tl.to(
          audioCtrl,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          'start+=1.2'
        );
      }
    },
    [onOpenChange, sizeContentWrapper]
  );

  // GSAP Flip: Close detail view back to gallery
  const hideContent = useCallback(
    (index?: number) => {
      const targetIndex = typeof index === 'number' ? index : currentOpenIndex.current;
      if (targetIndex === null || targetIndex === undefined) return;
      if (isAnimating.current) return;
      isAnimating.current = true;

      const currentDetail = contentDetailRefs.current[targetIndex];
      const currentWrapper = contentWrapperRefs.current[targetIndex];
      const sectionContent = sectionContentRef.current;
      const scrollWrapper = scrollWrapperRef.current;
      const galleryWrapper = galleryWrapperRefs.current[targetIndex];

      if (!currentDetail || !currentWrapper || !sectionContent || !scrollWrapper || !galleryWrapper) {
        isAnimating.current = false;
        return;
      }

      const titleChars = Array.from(
        currentDetail.querySelectorAll('.content_title-top .char, .content_title-bottom .char')
      );
      const titleRoots = Array.from(
        currentDetail.querySelectorAll(
          '.content_title-top .split-chars-root, .content_title-bottom .split-chars-root'
        )
      );
      const allTextLines = Array.from(
        currentDetail.querySelectorAll('.content_text-left .line, .content_text-right .line')
      );
      const leftContainer = currentDetail.querySelector('.content_text-left');
      const rightContainer = currentDetail.querySelector('.content_text-right');
      const audioCtrl = currentDetail.querySelector('.showcase-audio-ctrl');

      const otherWrappers: HTMLElement[] = galleryWrapperRefs.current.filter(
        (img, i): img is HTMLDivElement => i !== targetIndex && img !== null
      );
      if (viewAllWrapperRef.current) {
        otherWrappers.push(viewAllWrapperRef.current);
      }
      const allValidWrappers: HTMLElement[] = [
        ...galleryWrapperRefs.current.filter((img): img is HTMLDivElement => img !== null),
      ];
      if (viewAllWrapperRef.current) {
        allValidWrappers.push(viewAllWrapperRef.current);
      }

      // Automatically re-mute video on modal close
      if (videoRefs.current[targetIndex]) {
        videoRefs.current[targetIndex]!.muted = true;
      }
      setIsMuted(true);

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          currentOpenIndex.current = null;
          onOpenChange(false);
          setIsDetailOpen(false);
          sectionContent.classList.remove('is-active');
          sectionContent.classList.add('is-hidden');
          currentDetail.classList.add('is-hidden');
          if (backdropRef.current) {
            gsap.set(backdropRef.current, { opacity: 0 });
          }
        },
      });

      tl.addLabel('start', 0)
        // Fade out audio controller immediately with text
        .add(() => {
          if (audioCtrl) {
            gsap.to(audioCtrl, {
              opacity: 0,
              y: 6,
              duration: 0.25,
              ease: 'power2.in',
            });
          }
        }, 'start')
        // 1. Text & subtitles slide down and fade out smoothly first
        .to(
          allTextLines,
          {
            yPercent: 100,
            opacity: 0,
            stagger: 0.02,
            duration: 0.45,
            ease: 'power3.in',
          },
          'start'
        )
        .to(
          [leftContainer, rightContainer].filter(Boolean),
          {
            opacity: 0,
            duration: 0.35,
          },
          'start+=0.1'
        )
        // Titles clip away and slide out
        .to(
          titleChars,
          {
            clipPath: 'inset(0 100% 0 0)',
            xPercent: 10,
            opacity: 0,
            stagger: 0.015,
            duration: 0.5,
            ease: 'power3.in',
          },
          'start'
        )
        .to(
          titleRoots,
          {
            xPercent: 10,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.in',
          },
          'start'
        )
        // 2. Video zooms back to horizontal gallery
        .add(() => {
          const imageContainer = currentWrapper.querySelector('.image_container');
          if (!imageContainer) return;
          const flipState = Flip.getState(imageContainer);
          galleryWrapper.appendChild(imageContainer);
          sizeGalleryImages();
          Flip.from(flipState, {
            duration: 1.25,
            ease: 'power4.inOut',
          });
        }, 'start+=0.25')
        // Fade out backdrop smoothly as video docks back to reveal horizontal gallery
        .to(
          backdropRef.current,
          {
            opacity: 0,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'start+=0.25'
        )
        // Reveal other gallery cards
        .to(
          otherWrappers,
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'start+=0.35'
        )
        .set(allValidWrappers, {
          clipPath: 'none',
        });
    },
    [onOpenChange, sizeGalleryImages]
  );

  // Escape key closes detail modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (currentOpenIndex.current !== null) {
          hideContent();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hideContent]);

  return (
    <>
      {/* Pinned Fixed Horizontal Gallery Section */}
      <section ref={sectionRef} className="portfolio-section" id="work">
        <div ref={scrollWrapperRef} className="scroll-wrapper" data-scroll="wrapper">
          <div ref={scrollContentRef} className="scroll-content" data-scroll="content">
            {/* Showcase Intro Stage: simple, huge, centered typography */}
            <div ref={showcaseIntroRef} className="showcase-intro" data-showcase="intro">
              <h2 className="showcase-title" aria-label={dict.showcase?.title || 'Showcase'}>
                {(dict.showcase?.title || 'Showcase').split('').map((char, i) => (
                  <span
                    key={i}
                    className="fluffy-char"
                    style={{ '--char-i': i } as React.CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </h2>
            </div>

            {/* Organic Curved SVG Trail weaving gracefully behind the alternating video cards */}
            {trail && (
              <svg
                ref={trailSvgRef}
                className={`portfolio-trail-svg ${isDetailOpen ? 'is-dimmed' : ''}`}
                viewBox={`0 0 ${trail.width} ${trail.height}`}
                style={{
                  width: `${trail.width}px`,
                  height: `${trail.height}px`,
                }}
                aria-hidden="true"
              >
                <defs>
                  {/* Gaussian blur filter for smooth, diffused neon glow with zero stepped layers */}
                  <filter id="trail-neon-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                  </filter>

                  {/* Primary Trail Linear Gradient */}
                  <linearGradient id="trail-gradient-core" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff4f9c" stopOpacity="0.4" />
                    <stop offset="10%" stopColor="#ff4f9c" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#ff2a85" stopOpacity="1" />
                    <stop offset="85%" stopColor="#ff4f9c" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#c2185b" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Active celestial orb pure luminous glow radial gradient */}
                  <radialGradient id="orb-halo-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="25%" stopColor="#ff70ad" stopOpacity="0.85" />
                    <stop offset="60%" stopColor="#ff2a85" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ff2a85" stopOpacity="0" />
                  </radialGradient>

                  {/* Gradient for Crisp High-Fashion Numbers */}
                  <linearGradient id="num-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff4f9c" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#c2185b" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Backlight halo behind each video card (pure vector radial gradient) */}
                  <radialGradient id="card-halo-gradient">
                    <stop offset="0%" stopColor="#ff4f9c" stopOpacity="0.32" />
                    <stop offset="50%" stopColor="#ff80b5" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#ffeef5" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Behind Each Video Card: Backlight Spotlights and Subtle Reticles */}
                <g className="trail-card-anchors">
                  {trail.cardNodes.map((node) => (
                    <g key={`anchor-${node.index}`} className="trail-card-anchor">
                      {/* Luminous ambient spotlight halo under card */}
                      <ellipse
                        cx={node.cx}
                        cy={node.cy}
                        rx={node.w * 0.54}
                        ry={node.h * 0.54}
                        fill="url(#card-halo-gradient)"
                      />

                      {/* Subtle concentric orbital reticle */}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="44"
                        fill="none"
                        stroke="rgba(255, 79, 156, 0.22)"
                        strokeWidth="1"
                        strokeDasharray="4 8"
                      />
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="20"
                        fill="rgba(255, 79, 156, 0.04)"
                        stroke="rgba(255, 79, 156, 0.4)"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="3.5"
                        fill="#ff4f9c"
                      />
                    </g>
                  ))}
                </g>

                {/* Editorial Numbers - Prominently Floating Above/Below Cards (No cluttered tags) */}
                <g className="trail-card-numbers">
                  {trail.cardNodes.map((node) => {
                    const isOdd = node.index % 2 === 0;
                    const numY = isOdd
                      ? node.cy - node.h * 0.5 - 28
                      : node.cy + node.h * 0.5 + 85;

                    return (
                      <text
                        key={`num-${node.index}`}
                        x={node.cx}
                        y={numY}
                        textAnchor="middle"
                        className="trail-node-num"
                      >
                        {node.label}
                      </text>
                    );
                  })}
                </g>

                {/* Diffused Neon Glow (True smooth Gaussian-blurred aura, no visible stepped layers) */}
                <path
                  d={trail.pathData}
                  fill="none"
                  stroke="url(#trail-gradient-core)"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#trail-neon-blur)"
                  opacity="0.68"
                />

                {/* Core Razor-Crisp Neon Filament */}
                <path
                  ref={trailCoreRef}
                  d={trail.pathData}
                  fill="none"
                  stroke="url(#trail-gradient-core)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="1"
                />

                {/* Active Glowing Orb (Only the glow, pure luminous light bead - no inner colored dot, no harsh rings) */}
                <g
                  ref={orbGroupRef}
                  className="trail-active-dot"
                  transform={`translate(${trail.startX}, ${trail.startY})`}
                >
                  {/* Diffused outer aura */}
                  <circle
                    r="26"
                    fill="url(#orb-halo-gradient)"
                    className="trail-active-orb-halo"
                    filter="url(#trail-neon-blur)"
                    opacity="0.85"
                  />
                  {/* Glowing orb body */}
                  <circle
                    r="16"
                    fill="url(#orb-halo-gradient)"
                    opacity="0.9"
                  />
                  {/* Brilliant white light center */}
                  <circle
                    r="5"
                    fill="#ffffff"
                    opacity="0.95"
                  />
                </g>

                {/* Circuit Conduction Terminal: crisp SVG spark contact (no blurry shadows) */}
                {trail.endX !== undefined && trail.endY !== undefined && (
                  <g
                    className="trail-conduction-terminal"
                    transform={`translate(${trail.endX}, ${trail.endY})`}
                  >
                    {/* Expanding shockwave spark ring */}
                    <circle
                      ref={shockwaveRingRef}
                      r="4"
                      fill="none"
                      stroke="#ff2a85"
                      strokeWidth="2.5"
                      opacity="0"
                    />
                    {/* Terminal core contact */}
                    <circle
                      r="4.5"
                      fill="#ffffff"
                      stroke="#ff2a85"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            )}

            <div className="gallery">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    galleryWrapperRefs.current[index] = el;
                  }}
                  className="gallery_image"
                  data-gallery="image-wrapper"
                  onClick={() => openContent(index)}
                >
                  <div className="image_container" data-gallery="image">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      poster={item.posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    >
                      <source src={item.videoWebm} type="video/webm" />
                      <source src={item.videoMp4} type="video/mp4" />
                    </video>
                  </div>
                </div>
              ))}

              {/* Finale Action: Direct link to /work with GSAP kinetic typography */}
              <Link
                href="/work"
                scroll={false}
                ref={viewAllWrapperRef}
                className={`gallery_end-action ${isEnergized ? 'is-energized' : 'is-idle'}`}
                aria-label={dict.hero.viewAllWorks.fullAria}
                onClick={(e) => {
                  if (!isEnergized) {
                    e.preventDefault();
                    return;
                  }
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="kinetic-stacked-text" ref={endTextRef}>
                  <div className="kinetic-row row-1">
                    <span className="kinetic-word">
                      {dict.hero.viewAllWorks.row1.split('').map((char, i) => (
                        <span key={i} className="k-char">{char}</span>
                      ))}
                    </span>
                  </div>
                  <div className="kinetic-row row-2">
                    {dict.hero.viewAllWorks.row2.split(' ').map((word, wIdx, arr) => (
                      <React.Fragment key={wIdx}>
                        <span className="kinetic-word">
                          {word.split('').map((char, cIdx) => (
                            <span key={cIdx} className="k-char">{char}</span>
                          ))}
                        </span>
                        {wIdx < arr.length - 1 && <span className="k-space">&nbsp;</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="kinetic-row row-3">
                    <span className="kinetic-word">
                      {dict.hero.viewAllWorks.row3.split('').map((char, i) => (
                        <span key={i} className="k-char">{char}</span>
                      ))}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Focus / Detail Overlay Modal */}
      <section
        ref={sectionContentRef}
        className="section_content is-hidden"
        data-content="section"
        onClick={() => hideContent()}
      >
        {/* Seamless full-screen backdrop to eliminate background glitches */}
        <div ref={backdropRef} className="section_backdrop" aria-hidden="true" />

        {items.map((item, index) => {
          const titleTop = item.titleTop;
          const titleBottom = item.titleBottom;
          const leftTitle = item.leftTitle;
          const leftText = item.leftText;
          const rightTitle = item.rightTitle;
          const rightText = item.rightText;

          return (
            <div
              key={item.id}
              ref={(el) => {
                contentDetailRefs.current[index] = el;
              }}
              className="content is-hidden"
              data-content="details"
              onClick={(e) => {
                e.stopPropagation();
                hideContent(index);
              }}
            >
              <div
                ref={(el) => {
                  contentWrapperRefs.current[index] = el;
                }}
                className="content_wrapper"
                data-content="details-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                  hideContent(index);
                }}
              >
                {/* Minimal Showcase Audio Controller (Icon Only) */}
                <button
                  type="button"
                  className={`showcase-audio-ctrl ${isMuted ? 'is-muted' : 'is-active'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(e);
                  }}
                  aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                  title={isMuted ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted ? (
                    <IconVolumeMute size={22} strokeWidth={1.5} />
                  ) : (
                    <IconVolumeHigh size={22} strokeWidth={1.5} />
                  )}
                </button>

                {/* Top Title */}
                <div className="content_title-top" data-content="text-top">
                  <div className="title-big">
                    <SplitChars text={titleTop} />
                  </div>
                </div>

                {/* Bottom Title */}
                <div className="content_title-bottom" data-content="text-bottom">
                  <div className="title-big">
                    <SplitChars text={titleBottom} />
                  </div>
                </div>

                {/* Left Context Text */}
                <div className="content_text-left" data-content="text-left">
                  <div className="title-small">
                    <span className="line-wrap" style={{ display: 'inline-block', overflow: 'hidden' }}>
                      <span className="line" style={{ display: 'inline-block' }}>
                        {leftTitle}
                      </span>
                    </span>
                  </div>
                  <div className="paragraph">
                    <SplitLines text={leftText} />
                  </div>
                </div>

                {/* Right Context Text */}
                <div className="content_text-right" data-content="text-right">
                  <div className="title-small">
                    <span className="line-wrap" style={{ display: 'inline-block', overflow: 'hidden' }}>
                      <span className="line" style={{ display: 'inline-block' }}>
                        {rightTitle}
                      </span>
                    </span>
                  </div>
                  <div className="paragraph">
                    <SplitLines text={rightText} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}


