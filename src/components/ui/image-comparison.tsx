'use client';

import { cn } from '@/lib/utils';
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  AnimationOptions,
} from 'motion/react';

const SliderContext = createContext<
  | {
      position: number;
      setPosition: (pos: number) => void;
      motionPosition: MotionValue<number>;
      orientation: 'horizontal' | 'vertical';
      isDragging: boolean;
    }
  | undefined
>(undefined);

export type ContrastSliderProps = {
  children: React.ReactNode;
  className?: string;
  hoverControl?: boolean;
  orientation?: 'horizontal' | 'vertical';
  defaultPosition?: number;
  animationConfig?: Partial<AnimationOptions>;
  dividerColor?: string;
};

const DEFAULT_ANIMATION_CONFIG = {
  damping: 24,
  stiffness: 320,
  mass: 0.35,
};

function ImageSlider({
  children,
  className,
  hoverControl = false,
  orientation = 'horizontal',
  defaultPosition = 50,
  animationConfig,
  dividerColor = '#ff4f9c',
}: ContrastSliderProps) {
  const [isActive, setIsActive] = useState(false);
  const baseMotion = useMotionValue(defaultPosition);
  const springMotion = useSpring(
    baseMotion,
    animationConfig ?? DEFAULT_ANIMATION_CONFIG
  );
  const [position, setPosition] = useState(defaultPosition);
  const containerRef = useRef<HTMLDivElement>(null);

  const motionToUse = hoverControl ? baseMotion : springMotion;

  useEffect(() => {
    baseMotion.set(defaultPosition);
    setPosition(defaultPosition);
  }, [defaultPosition, baseMotion]);

  const handleInteraction = useCallback(
    (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      let clientX, clientY;
      if ('touches' in event) {
        if (event.touches.length === 0) return;
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = (event as React.MouseEvent | MouseEvent).clientX;
        clientY = (event as React.MouseEvent | MouseEvent).clientY;
      }

      let percentValue: number;
      if (orientation === 'horizontal') {
        const xPos = clientX - rect.left;
        percentValue = Math.min(Math.max((xPos / rect.width) * 100, 0), 100);
      } else {
        const yPos = clientY - rect.top;
        percentValue = Math.min(Math.max((yPos / rect.height) * 100, 0), 100);
      }

      baseMotion.set(percentValue);
      setPosition(percentValue);
    },
    [baseMotion, orientation]
  );

  useEffect(() => {
    if (!isActive) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      handleInteraction(e);
    };
    const onUp = () => {
      setIsActive(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isActive, handleInteraction]);

  return (
    <SliderContext.Provider
      value={{
        position,
        setPosition,
        motionPosition: motionToUse,
        orientation,
        isDragging: isActive || hoverControl,
      }}
    >
      <div
        ref={containerRef}
        role="slider"
        aria-label="Image comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        className={cn('nyx-image-slider', className)}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: '20px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: 'ew-resize',
          '--divider-color': dividerColor || '#ff4f9c',
        } as React.CSSProperties}
        onMouseMove={(e) => {
          if (hoverControl || isActive) handleInteraction(e);
        }}
        onMouseDown={(e) => {
          if (!hoverControl) {
            setIsActive(true);
            handleInteraction(e);
          }
        }}
        onTouchStart={(e) => {
          if (!hoverControl) {
            setIsActive(true);
            handleInteraction(e);
          }
        }}
      >
        <div
          className="nyx-slider-inner"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '20px',
          }}
        >
          {children}
        </div>
      </div>
    </SliderContext.Provider>
  );
}

type ImageLayerProps = {
  className?: string;
  alt: string;
  src: string;
  layer: 'first' | 'second';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
};

const ImageLayer = ({
  className,
  alt,
  src,
  layer,
  loading = 'eager',
  priority = false,
}: ImageLayerProps) => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('ImageLayer must be used within an ImageSlider');
  }
  const { motionPosition, orientation } = context;

  const firstLayerClip = useTransform(motionPosition, (value) =>
    orientation === 'horizontal'
      ? `inset(0 0 0 ${value}%)`
      : `inset(${value}% 0 0 0)`
  );

  const secondLayerClip = useTransform(motionPosition, (value) =>
    orientation === 'horizontal'
      ? `inset(0 ${100 - value}% 0 0)`
      : `inset(0 0 ${100 - value}% 0)`
  );

  return (
    <motion.img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('nyx-image-layer', className)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        userSelect: 'none',
        pointerEvents: 'none',
        clipPath: layer === 'first' ? firstLayerClip : secondLayerClip,
        willChange: 'clip-path',
      }}
    />
  );
};

type DividerProps = {
  className?: string;
  children?: React.ReactNode;
  width?: number;
  showHandle?: boolean;
  handleSize?: number;
  handleColor?: string;
  handleIcon?: ReactNode;
  hitAreaSize?: number;
};

const Divider = ({
  className,
  children,
  width = 2,
  showHandle = true,
  handleSize = 36,
  handleColor,
  handleIcon,
  hitAreaSize = 34,
}: DividerProps) => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('Divider must be used within an ImageSlider');
  }
  const { motionPosition, orientation, isDragging } = context;
  const dividerPosition = useTransform(motionPosition, (value) => `${value}%`);

  return (
    <motion.div
      className={cn('nyx-divider', className)}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: dividerPosition,
        width: `${width}px`,
        backgroundColor: 'var(--divider-color)',
        boxShadow: '0 0 10px rgba(255, 79, 156, 0.7), 0 0 20px rgba(255, 79, 156, 0.3)',
        willChange: 'transform, left',
        pointerEvents: 'all',
        zIndex: 15,
        cursor: 'ew-resize',
      }}
    >
      <div
        className="nyx-hit-area"
        style={{
          position: 'absolute',
          left: `${-hitAreaSize / 2}px`,
          right: `${-hitAreaSize / 2}px`,
          top: 0,
          bottom: 0,
          width: `${width + hitAreaSize}px`,
          height: '100%',
          cursor: 'ew-resize',
          zIndex: 10,
        }}
      />

      {showHandle && (
        <div
          className={cn('nyx-handle', isDragging && 'is-dragging')}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${handleSize}px`,
            height: `${handleSize}px`,
            borderRadius: '50%',
            backgroundColor: handleColor || 'rgba(15, 12, 18, 0.92)',
            border: '2px solid #ff4f9c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            willChange: 'transform',
            zIndex: 20,
            transition: 'transform 0.15s ease',
          }}
        >
          {handleIcon || children || (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="8 15 5 12 8 9" />
              <polyline points="16 9 19 12 16 15" />
            </svg>
          )}
        </div>
      )}
    </motion.div>
  );
};

export { ImageSlider, ImageLayer, Divider };
