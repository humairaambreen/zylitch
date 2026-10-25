'use client';

import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLocale } from '@/components/LocaleContext';

import { WorkPin, extractHashtags } from '@/lib/defaultPins';
import { getLocalizedPost, getLocalizedTag } from '@/lib/postTranslations';
export type { WorkPin };

/* --- Iconoir Style Clean Vector Icons --- */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21L16.65 16.65" />
    </svg>
  );
}

function SoundHighIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13.5V10.5C2 9.39543 2.89543 8.5 4 8.5H7L11.2929 4.20711C11.9229 3.57714 13 4.02324 13 4.91421V19.0858C13 19.9768 11.9229 20.4229 11.2929 19.7929L7 15.5H4C2.89543 15.5 2 14.6046 2 13.5Z" />
      <path d="M17 8C18.3333 9.33333 19 10.6667 19 12C19 13.3333 18.3333 14.6667 17 16" />
      <path d="M20 5C22 7.33333 23 9.66667 23 12C23 14.3333 22 16.6667 20 19" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13.5V10.5C2 9.39543 2.89543 8.5 4 8.5H7L11.2929 4.20711C11.9229 3.57714 13 4.02324 13 4.91421V19.0858C13 19.9768 11.9229 20.4229 11.2929 19.7929L7 15.5H4C2.89543 15.5 2 14.6046 2 13.5Z" />
      <path d="M17 16L22 11M22 16L17 11" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4.5V19.5L19 12L7 4.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 5H10V19H7V5Z" />
      <path d="M14 5H17V19H14V5Z" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H4V9M15 4H20V9M9 20H4V15M15 20H20V15" />
    </svg>
  );
}

function OpenInNewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10L21 3M21 3H15M21 3V9M19 13.5V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5H10.5" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6L18 18M18 6L6 18" />
    </svg>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function WorkPageClient({
  initialTag = 'all',
  initialOpenId,
  initialPins,
}: {
  initialTag?: string;
  initialOpenId?: string;
  initialPins?: WorkPin[];
}) {
  const { locale, dict } = useLocale();
  const [activeTag, setActiveTag] = useState(initialTag || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [columnsCount, setColumnsCount] = useState(4);
  const [selectedPin, setSelectedPin] = useState<WorkPin | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Dynamic projects from Turso DB
  const [pins, setPins] = useState<WorkPin[]>(initialPins || []);
  const watchStartTimeRef = useRef<number | null>(null);

  // Auto-open initial post if loaded directly via /work/[id]
  useEffect(() => {
    if (!initialOpenId || pins.length === 0) return;
    const target = pins.find((p) => p.id === initialOpenId);
    if (target && !selectedPin) {
      setSelectedPin(target);
      setIsPlaying(true);
      setCurrentTime(0);
      setIsControlsVisible(true);
      watchStartTimeRef.current = Date.now();
      setTimeout(() => {
        if (modalCardRef.current && modalBackdropRef.current) {
          gsap.fromTo(modalBackdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
          gsap.fromTo(
            modalCardRef.current,
            { opacity: 0, scale: 0.94, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }
          );
        }
      }, 50);
    }
  }, [initialOpenId, pins, selectedPin]);

  // Synchronize browser popstate (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      const tagMatch = path.match(/\/work\/tag\/([^/]+)/);
      const postMatch = path.match(/\/work\/(pin-[^/]+)/);
      if (postMatch) {
        const p = pins.find((x) => x.id === postMatch[1]);
        if (p) setSelectedPin(p);
      } else {
        setSelectedPin(null);
        if (tagMatch) {
          setActiveTag(tagMatch[1]);
        } else if (path === '/work' || path.endsWith('/work')) {
          setActiveTag('all');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pins]);

  // Session ID for anonymous unique visitor metrics
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    let sid = localStorage.getItem('zylitch_sid');
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('zylitch_sid', sid);
    }
    return sid;
  }, []);

  // Fetch live projects from Turso DB with real dynamic translation
  useEffect(() => {
    fetch(`/api/projects?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setPins(data.projects);
        }
      })
      .catch(() => {});
  }, [locale]);

  // Dynamic hashtags pills derived from description tags across active projects
  const filterTags = useMemo(() => {
    const tagCounts = new Map<string, number>();

    pins.forEach((p) => {
      const tags = (p.tags && p.tags.length > 0) ? p.tags : extractHashtags(p.description || '');
      tags.forEach((t) => {
        const clean = t.toLowerCase().trim().replace(/^#/, '');
        if (clean) {
          tagCounts.set(clean, (tagCounts.get(clean) || 0) + 1);
        }
      });
    });

    const sorted = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([id, count]) => ({
        id,
        label: `#${getLocalizedTag(id, locale)}`,
        count,
      }));

    return [{ id: 'all', label: dict.work.all, count: pins.length }, ...sorted];
  }, [pins, dict.work.all, locale]);

  // Custom Video Player States
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showPlaySplash, setShowPlaySplash] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for Morph Animation, Tab Indicator & Video Scrubber
  const modalCardRef = useRef<HTMLDivElement>(null);
  const modalBackdropRef = useRef<HTMLDivElement>(null);
  const cinemaStageRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const tagsBarRef = useRef<HTMLDivElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isFirstFilter = useRef(true);
  const isTabSwitching = useRef(false);

  // Instant scroll to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const t1 = setTimeout(() => window.scrollTo(0, 0), 10);
      const t2 = setTimeout(() => window.scrollTo(0, 0), 60);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w >= 1200) {
        setColumnsCount(4);
      } else if (w >= 820) {
        setColumnsCount(3);
      } else if (w >= 520) {
        setColumnsCount(2);
      } else {
        setColumnsCount(1);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Filtered pins based on active hashtag tag and real-time search query
  const filteredPins = useMemo(() => {
    let list = pins;

    if (activeTag !== 'all') {
      list = list.filter((pin) => {
        const tags = (pin.tags && pin.tags.length > 0) ? pin.tags : extractHashtags(pin.description || '');
        const tagMatch = tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());
        const descMatch = pin.description?.toLowerCase().includes(`#${activeTag.toLowerCase()}`);
        const catMatch = pin.category?.toLowerCase() === activeTag.toLowerCase();
        return tagMatch || descMatch || catMatch;
      });
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const cleanQ = q.replace(/^#/, '');
      list = list.filter((pin) => {
        const loc = getLocalizedPost(pin, locale);
        const inTitle = pin.title?.toLowerCase().includes(q) || loc.title?.toLowerCase().includes(q);
        const inClient = pin.client?.toLowerCase().includes(q) || loc.client?.toLowerCase().includes(q);
        const inDesc = pin.description?.toLowerCase().includes(q) || loc.description?.toLowerCase().includes(q);
        const tags = (pin.tags && pin.tags.length > 0) ? pin.tags : extractHashtags(pin.description || '');
        const inTags = tags.some((t) => t.toLowerCase().includes(cleanQ) || getLocalizedTag(t, locale).toLowerCase().includes(cleanQ));
        return inTitle || inClient || inDesc || inTags;
      });
    }

    return list;
  }, [pins, activeTag, searchQuery, locale]);

  // Round-robin distribution
  const columns = useMemo(() => {
    const cols: WorkPin[][] = Array.from({ length: columnsCount }, () => []);
    filteredPins.forEach((pin, index) => {
      cols[index % columnsCount].push(pin);
    });
    return cols;
  }, [filteredPins, columnsCount]);

  // Reposition floating tab indicator with GSAP
  const updateTabIndicator = useCallback((tagId: string, immediate = false) => {
    if (!tagsBarRef.current || !tabIndicatorRef.current) return;
    const activeBtn = tagsBarRef.current.querySelector<HTMLButtonElement>(`button[data-tag="${tagId}"]`);
    if (!activeBtn) return;

    const x = activeBtn.offsetLeft;
    const y = activeBtn.offsetTop;
    const width = activeBtn.offsetWidth;
    const height = activeBtn.offsetHeight;

    if (immediate) {
      gsap.set(tabIndicatorRef.current, {
        x,
        y,
        width,
        height,
        opacity: 1,
      });
    } else {
      gsap.to(tabIndicatorRef.current, {
        x,
        y,
        width,
        height,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      });
    }
  }, []);

  // Update tab indicator on activeTag change or resize
  useEffect(() => {
    updateTabIndicator(activeTag, isFirstFilter.current);
    const handleResize = () => updateTabIndicator(activeTag, true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTag, updateTabIndicator]);

  // Enable horizontal mouse wheel scroll on tags bar
  useEffect(() => {
    const el = tagsBarRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Kinetic Rack-Focus Stagger transition when switching tabs
  const handleSelectTab = useCallback(
    (newTag: string) => {
      if (newTag === activeTag || isTabSwitching.current) return;
      isTabSwitching.current = true;

      updateTabIndicator(newTag, false);

      if (tagsBarRef.current) {
        const btn = tagsBarRef.current.querySelector<HTMLButtonElement>(`button[data-tag="${newTag}"]`);
        if (btn) {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }

      const gridEl = gridRef.current;
      if (!gridEl) {
        setActiveTag(newTag);
        isTabSwitching.current = false;
        return;
      }

      const currentPins = gridEl.querySelectorAll('.pinterest-pin-item');

      // Phase 1: Defocus & depth retreat
      gsap.killTweensOf(currentPins);
      gsap.to(currentPins, {
        opacity: 0,
        scale: 0.93,
        y: -14,
        filter: 'blur(8px)',
        stagger: {
          amount: 0.12,
          from: 'start',
        },
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setActiveTag(newTag);
          if (typeof window !== 'undefined') {
            const nextUrl = newTag === 'all' ? '/work' : `/work/tag/${encodeURIComponent(newTag.toLowerCase())}`;
            window.history.pushState(null, '', nextUrl);
          }
        },
      });
    },
    [activeTag, updateTabIndicator]
  );

  // Phase 2: Cinema rack-focus entrance on new cards
  useEffect(() => {
    if (isFirstFilter.current) {
      isFirstFilter.current = false;
      return;
    }

    const gridEl = gridRef.current;
    if (!gridEl) {
      isTabSwitching.current = false;
      return;
    }

    const newPins = gridEl.querySelectorAll('.pinterest-pin-item');
    gsap.killTweensOf(newPins);

    gsap.fromTo(
      newPins,
      {
        opacity: 0,
        scale: 0.88,
        y: 38,
        rotateX: -14,
        filter: 'blur(12px)',
        transformOrigin: '50% 0%',
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 0.65,
        stagger: {
          amount: 0.28,
          from: 'start',
          ease: 'power2.out',
        },
        ease: 'expo.out',
        clearProps: 'transform,filter',
        onComplete: () => {
          isTabSwitching.current = false;
        },
      }
    );
  }, [activeTag]);

  // Controls autohide logic (2.2s inactivity while playing)
  const resetControlsTimer = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2200);
    }
  }, [isPlaying]);

  const handleStageMouseMove = useCallback(() => {
    resetControlsTimer();
  }, [resetControlsTimer]);

  const handleStageMouseLeave = useCallback(() => {
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setIsControlsVisible(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setIsControlsVisible(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      resetControlsTimer();
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, resetControlsTimer]);

  // Open pin with FLIP bounding rect capture & trigger video_open analytics
  const handleOpenPin = useCallback((pin: WorkPin, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setOriginRect(rect);
    setSelectedPin(pin);
    setIsPlaying(true);
    setCurrentTime(0);
    setIsControlsVisible(true);
    watchStartTimeRef.current = Date.now();

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/work/${pin.id}`);
    }

    // Pause all background masonry videos immediately to free GPU video decoders
    const bgVideos = document.querySelectorAll<HTMLVideoElement>('.pin-video-element');
    bgVideos.forEach((v) => {
      try {
        v.pause();
      } catch {}
    });

    // Log video_open event with Vercel GeoIP
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: pin.id,
        eventType: 'video_open',
        sessionId: getSessionId(),
      }),
    }).catch(() => {});
  }, [getSessionId]);

  // Handle clicking "View Original Reel"
  const handleReelClick = useCallback(() => {
    if (selectedPin) {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedPin.id,
          eventType: 'show_reel_click',
          sessionId: getSessionId(),
        }),
      }).catch(() => {});
    }
  }, [selectedPin, getSessionId]);

  // Close pin with FLIP morph animation back to origin & record watch dwell duration
  const handleClose = useCallback(() => {
    if (isClosing) return;

    // Send dwell watch duration
    if (watchStartTimeRef.current && selectedPin) {
      const elapsedSec = Math.round((Date.now() - watchStartTimeRef.current) / 100) / 10;
      if (elapsedSec > 0.5) {
        fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedPin.id,
            eventType: 'video_watch_time',
            durationSeconds: elapsedSec,
            sessionId: getSessionId(),
          }),
        }).catch(() => {});
      }
      watchStartTimeRef.current = null;
    }

    if (!modalCardRef.current || !modalBackdropRef.current) {
      setSelectedPin(null);
      setOriginRect(null);

      if (typeof window !== 'undefined') {
        const backUrl = activeTag !== 'all' ? `/work/tag/${encodeURIComponent(activeTag.toLowerCase())}` : '/work';
        window.history.pushState(null, '', backUrl);
      }

      // Resume background grid videos
      const bgVideos = document.querySelectorAll<HTMLVideoElement>('.pin-video-element');
      bgVideos.forEach((v) => {
        try {
          v.play().catch(() => {});
        } catch {}
      });
      return;
    }

    setIsClosing(true);
    const cardEl = modalCardRef.current;
    const backdropEl = modalBackdropRef.current;
    const currentModalRect = cardEl.getBoundingClientRect();

    // Re-query origin pin element if available so it closes into its current position
    let targetRect = originRect;
    if (selectedPin) {
      const pinEl = document.querySelector(`[data-pin-id="${selectedPin.id}"]`);
      if (pinEl) {
        targetRect = pinEl.getBoundingClientRect();
      }
    }
    if (!targetRect) {
      targetRect = currentModalRect;
    }

    const originCenterX = targetRect.left + targetRect.width / 2;
    const originCenterY = targetRect.top + targetRect.height / 2;
    const modalCenterX = currentModalRect.left + currentModalRect.width / 2;
    const modalCenterY = currentModalRect.top + currentModalRect.height / 2;

    const dx = originCenterX - modalCenterX;
    const dy = originCenterY - modalCenterY;
    const scaleX = targetRect.width / currentModalRect.width;
    const scaleY = targetRect.height / currentModalRect.height;

    // Kill any active tweens immediately to prevent race conditions
    gsap.killTweensOf(cardEl);
    gsap.killTweensOf(backdropEl);

    // Fast-fade info panel
    if (infoPanelRef.current) {
      gsap.to(infoPanelRef.current, { opacity: 0, duration: 0.14, ease: 'power2.out' });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setSelectedPin(null);
        setIsClosing(false);
        setOriginRect(null);

        if (typeof window !== 'undefined') {
          const backUrl = activeTag !== 'all' ? `/work/tag/${encodeURIComponent(activeTag.toLowerCase())}` : '/work';
          window.history.pushState(null, '', backUrl);
        }

        // Resume background grid videos
        const bgVideos = document.querySelectorAll<HTMLVideoElement>('.pin-video-element');
        bgVideos.forEach((v) => {
          try {
            v.play().catch(() => {});
          } catch {}
        });
      },
    });

    tl.to(backdropEl, { opacity: 0, duration: 0.24, ease: 'power2.inOut' }, 0);
    tl.to(
      cardEl,
      {
        x: dx,
        y: dy,
        scaleX: scaleX,
        scaleY: scaleY,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 0.28,
        ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
        force3D: true,
      },
      0
    );
  }, [isClosing, originRect, selectedPin, getSessionId]);

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  // Morph into full stage on mount along the exact same symmetrical angle
  useIsomorphicLayoutEffect(() => {
    if (selectedPin && modalCardRef.current && modalBackdropRef.current && originRect && !isClosing) {
      const cardEl = modalCardRef.current;
      const backdropEl = modalBackdropRef.current;
      const modalRect = cardEl.getBoundingClientRect();

      const originCenterX = originRect.left + originRect.width / 2;
      const originCenterY = originRect.top + originRect.height / 2;
      const modalCenterX = modalRect.left + modalRect.width / 2;
      const modalCenterY = modalRect.top + modalRect.height / 2;

      const dx = originCenterX - modalCenterX;
      const dy = originCenterY - modalCenterY;
      const scaleX = originRect.width / modalRect.width;
      const scaleY = originRect.height / modalRect.height;

      // Pause all background masonry videos immediately
      const bgVideos = document.querySelectorAll<HTMLVideoElement>('.pin-video-element');
      bgVideos.forEach((v) => {
        try {
          v.pause();
        } catch {}
      });

      // Kill any remaining tweens
      gsap.killTweensOf(cardEl);
      gsap.killTweensOf(backdropEl);

      // Synchronously set initial transform so browser NEVER paints the un-transformed modal
      gsap.set(backdropEl, { opacity: 0 });
      gsap.set(cardEl, {
        x: dx,
        y: dy,
        scaleX: scaleX,
        scaleY: scaleY,
        transformOrigin: '50% 50%',
        opacity: 0.85,
        force3D: true,
      });

      // Animate smoothly into centered stage
      gsap.to(backdropEl, {
        opacity: 1,
        duration: 0.34,
        ease: 'power2.out',
      });

      gsap.to(cardEl, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.38,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        force3D: true,
      });

      if (infoPanelRef.current) {
        gsap.fromTo(
          infoPanelRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.28, delay: 0.1, ease: 'power2.out' }
        );
      }
    }
  }, [selectedPin, originRect]);

  // Keyboard navigation (Escape to close, Space to play/pause - NO arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPin) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (modalVideoRef.current) {
          if (modalVideoRef.current.paused) {
            modalVideoRef.current.play();
            setIsPlaying(true);
          } else {
            modalVideoRef.current.pause();
            setIsPlaying(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPin, handleClose]);

  // Toggle play/pause with ripple splash
  const togglePlayPause = useCallback(() => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      setIsPlaying(true);
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }
    setShowPlaySplash(true);
    setTimeout(() => setShowPlaySplash(false), 500);
  }, []);

  // Time update from video
  const handleTimeUpdate = useCallback(() => {
    if (!isScrubbing && modalVideoRef.current) {
      setCurrentTime(modalVideoRef.current.currentTime);
    }
  }, [isScrubbing]);

  const handleLoadedMetadata = useCallback(() => {
    if (modalVideoRef.current) {
      setVideoDuration(modalVideoRef.current.duration);
    }
  }, []);

  // Scrub handler
  const handleScrubStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!timelineRef.current || !modalVideoRef.current) return;
      setIsScrubbing(true);

      const updateTime = (clientX: number) => {
        if (!timelineRef.current || !modalVideoRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const targetTime = pos * (modalVideoRef.current.duration || 1);
        modalVideoRef.current.currentTime = targetTime;
        setCurrentTime(targetTime);
      };

      updateTime(e.clientX);

      const handlePointerMove = (ev: PointerEvent) => {
        updateTime(ev.clientX);
      };

      const handlePointerUp = () => {
        setIsScrubbing(false);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    []
  );

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!cinemaStageRef.current) return;
    if (!document.fullscreenElement) {
      if (cinemaStageRef.current.requestFullscreen) {
        cinemaStageRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  const progressPercent = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  return (
    <div className="pinterest-page">
      <Navbar />

      {/* Editorial Header */}
      <header className="pinterest-header">
        <div className="pinterest-header-inner">
          <div className="pinterest-headline-wrap">
            <h1 className="pinterest-title">
              {dict.work.curatedPrefix}<span className="title-accent">{dict.work.curatedAccent}</span>
            </h1>
          </div>

          <p className="pinterest-subhead">
            {dict.work.subtitle}
          </p>

          {/* Search Archive Input Bar */}
          <div className="pinterest-search-wrapper">
            <div className="pinterest-search-box">
              <span className="search-icon-wrap" aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder={dict.work.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pinterest-search-input"
                aria-label="Search work archive"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>

          {/* Pinterest Filter Pills Bar with Gliding Indicator & Smooth Horizontal Scroll */}
          <div className="pinterest-tags-scroll-wrap">
            <div
              ref={tagsBarRef}
              className="pinterest-tags-bar"
              role="tablist"
              aria-label="Filter works by hashtag"
            >
              {/* Fluid Magnetic Tab Indicator */}
              <div ref={tabIndicatorRef} className="pinterest-tab-indicator" aria-hidden="true" />

              {filterTags.map((tag) => (
                <button
                  key={tag.id}
                  data-tag={tag.id}
                  role="tab"
                  aria-selected={activeTag === tag.id}
                  className={`pinterest-tag-pill ${activeTag === tag.id ? 'is-active' : ''}`}
                  onClick={() => handleSelectTab(tag.id)}
                >
                  <span className="tag-label">{tag.label}</span>
                  <span className="tag-count">{tag.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Genuine Multi-Column Masonry Grid */}
      <main className="pinterest-masonry-wrapper">
        {filteredPins.length === 0 ? (
          <div className="pinterest-empty-state">
            <p className="empty-title">{dict.work.noResults}</p>
            <p className="empty-sub">
              {searchQuery
                ? dict.work.noResultsQuery(searchQuery)
                : dict.work.noResultsTag(activeTag)}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                handleSelectTab('all');
              }}
              className="empty-reset-btn"
            >
              {dict.work.reset}
            </button>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="pinterest-grid"
            style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
          >
            {columns.map((columnPins, colIndex) => (
              <div key={`col-${colIndex}`} className="pinterest-col">
                {columnPins.map((pin) => {
                  const locPin = getLocalizedPost(pin, locale);
                  return (
                    <div
                      key={pin.id}
                      data-pin-id={pin.id}
                      className="pinterest-pin-item"
                      onClick={(e) => handleOpenPin(pin, e.currentTarget)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenPin(pin, e.currentTarget);
                        }
                      }}
                    >
                      {/* Visual Media Canvas with In-Video Frosted Bottom Vignette */}
                      <div className={`pin-media-wrapper aspect-${pin.aspect}`}>
                        <video
                          poster={pin.poster}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="pin-video-element"
                        >
                          <source src={pin.videoWebm} type="video/webm" />
                          <source src={pin.videoMp4} type="video/mp4" />
                        </video>

                        {/* Frosted Blur Bottom Gradient Overlay */}
                        <div className="pin-frosted-backdrop" aria-hidden="true" />

                        {/* Clean In-Video Typography */}
                        <div className="pin-content-overlay">
                          <h2 className="pin-title-text">{locPin.title}</h2>
                          <div className="pin-client-row">
                            {locPin.client && locPin.client.trim() ? (
                              <span className="pin-client-name">{locPin.client}</span>
                            ) : null}
                            <span className="pin-duration-tag">{locPin.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Unique Cinema Studio Post Viewer (Overlay with FLIP Morphing Animation) */}
      {selectedPin && (
        <div
          ref={modalBackdropRef}
          className="cinema-modal-backdrop"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalCardRef}
            className="cinema-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left / Center Stage: Bespoke Cinema Video Player */}
            <div
              ref={cinemaStageRef}
              className={`cinema-media-stage aspect-${selectedPin.aspect}`}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
            >
              <video
                ref={modalVideoRef}
                src={selectedPin.videoMp4}
                poster={selectedPin.poster}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlayPause}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="cinema-video"
              />

              {/* Center Play / Pause Indicator */}
              {showPlaySplash && (
                <div className="cinema-play-splash" aria-hidden="true">
                  {isPlaying ? <PlayIcon /> : <PauseIcon />}
                </div>
              )}

              {/* Bottom Floating Apple-Style Liquid Glass HUD (Autohiding) */}
              <div
                className={`cinema-hud-glass ${isControlsVisible ? 'hud-visible' : 'hud-hidden'}`}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* Play / Pause Liquid Glass Button */}
                <button
                  type="button"
                  className="liquid-glass-btn liquid-glass-circle hud-glass-btn"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                {/* Fine Interactive Scrubber Timeline */}
                <div
                  ref={timelineRef}
                  className="cinema-timeline-wrap"
                  onPointerDown={handleScrubStart}
                  title="Drag to scrub timeline"
                >
                  <div className="cinema-timeline-track">
                    <div
                      className="cinema-timeline-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                    <div
                      className="cinema-timeline-thumb"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Timecode */}
                <div className="cinema-timecode">
                  <span className="time-curr">{formatTime(currentTime)}</span>
                  <span className="time-sep">/</span>
                  <span className="time-total">{formatTime(videoDuration)}</span>
                </div>

                {/* Apple Liquid Glass Audio Toggle */}
                <button
                  type="button"
                  className="liquid-glass-btn liquid-glass-circle hud-glass-btn"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <SoundOffIcon /> : <SoundHighIcon />}
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  className="liquid-glass-btn liquid-glass-circle hud-glass-btn"
                  onClick={handleToggleFullscreen}
                  aria-label="Toggle Fullscreen"
                  title="Toggle Fullscreen"
                >
                  <ExpandIcon />
                </button>

                {/* Open Raw Video in New Tab Button */}
                <a
                  href={selectedPin.videoMp4}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass-btn liquid-glass-circle hud-glass-btn"
                  aria-label="Open video file in new tab"
                  title="Open video in new tab"
                >
                  <OpenInNewIcon />
                </a>
              </div>
            </div>

            {/* Right Panel: Clean Editorial Info Sheet */}
            {(() => {
              const locSelected = selectedPin ? getLocalizedPost(selectedPin, locale) : selectedPin;
              const primaryTag = selectedPin.tags?.[0] ? selectedPin.tags[0] : (selectedPin.category || 'visual');
              const localizedPrimaryTag = getLocalizedTag(primaryTag, locale);

              return (
                <div ref={infoPanelRef} className="cinema-info-sheet">
                  {/* Top Header: Primary Hashtag & Close Button */}
                  <div className="cinema-sheet-top">
                    <span className="cinema-category-label">
                      #{localizedPrimaryTag.toUpperCase()}
                    </span>

                    <button
                      type="button"
                      className="liquid-glass-btn liquid-glass-circle close-glass-btn"
                      onClick={handleClose}
                      aria-label="Close post (Esc)"
                      title="Close (Esc)"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  {/* Headline */}
                  <h2 className="cinema-title">{locSelected.title}</h2>

                  {/* Dynamic Specs: Client, Runtime, Format, FPS, Color Grade - rendered ONLY if non-empty */}
                  <div className="cinema-meta-row">
                    {locSelected.client && locSelected.client.trim() ? (
                      <div className="cinema-meta-item">
                        <span className="meta-label">{dict.work.client}</span>
                        <span className="meta-val">{locSelected.client}</span>
                      </div>
                    ) : null}
                    {locSelected.duration && locSelected.duration.trim() ? (
                      <div className="cinema-meta-item">
                        <span className="meta-label">{dict.work.runtime}</span>
                        <span className="meta-val">{locSelected.duration}</span>
                      </div>
                    ) : null}
                    {locSelected.aspect ? (
                      <div className="cinema-meta-item">
                        <span className="meta-label">{dict.work.format}</span>
                        <span className="meta-val">
                          {locSelected.aspect === 'vertical'
                            ? dict.work.formatVertical
                            : locSelected.aspect === 'square'
                            ? dict.work.formatSquare
                            : dict.work.formatCinema}
                        </span>
                      </div>
                    ) : null}
                    {locSelected.specs?.fps && locSelected.specs.fps.trim() ? (
                      <div className="cinema-meta-item">
                        <span className="meta-label">{dict.work.fps}</span>
                        <span className="meta-val">{locSelected.specs.fps}</span>
                      </div>
                    ) : null}
                    {locSelected.specs?.colorGrade && locSelected.specs.colorGrade.trim() ? (
                      <div className="cinema-meta-item">
                        <span className="meta-label">{dict.work.colorGrade}</span>
                        <span className="meta-val">{locSelected.specs.colorGrade}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Synopsis Description */}
                  <p className="cinema-description">{locSelected.description}</p>

                  {/* Minimalist Tags */}
                  <div className="cinema-tags-row">
                    {(selectedPin.tags && selectedPin.tags.length > 0
                      ? selectedPin.tags
                      : extractHashtags(selectedPin.description || '')
                    ).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="cinema-tag-badge"
                        onClick={() => {
                          handleClose();
                          handleSelectTab(t);
                        }}
                        title={`Filter by #${t}`}
                      >
                        #{getLocalizedTag(t, locale)}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Footer: Social Post Link & Production Inquiry */}
                  <div className="cinema-footer-deck">
                    {/* Button to view actual post on Instagram */}
                    <a
                      href={selectedPin.sourceUrl || 'https://instagram.com/zylitch'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleReelClick}
                      className="liquid-glass-btn liquid-glass-pill cinema-social-btn"
                      title="View post on Instagram"
                    >
                      <InstagramIcon />
                      <span>{dict.work.viewInstagram}</span>
                      <OpenInNewIcon />
                    </a>

                    {/* Direct Booking / Inquiry CTA */}
                    <a
                      href={`mailto:hello@zylitch.in?subject=Project%20Inquiry%3A%20${encodeURIComponent(locSelected.title)}`}
                      className="cinema-inquire-btn"
                    >
                      <span>{dict.work.bookProduction}</span>
                      <span className="inquire-arrow">↗</span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

