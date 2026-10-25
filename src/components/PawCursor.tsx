'use client';

import React, { useEffect, useRef } from 'react';

interface PawCursorProps {
  isOpen?: boolean;
}

export default function PawCursor({ isOpen = false }: PawCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastPawX = -999;
    let lastPawY = -999;
    let isLeftPaw = false;
    let isFirst = true;

    // Stamp a paw every 30px of cursor travel
    const STEP_DISTANCE = 30;

    function spawnPaw(x: number, y: number, rotation: number) {
      if (!container) return;

      const stamp = document.createElement('div');
      stamp.className = 'paw-stamp';
      stamp.style.left = `${x}px`;
      stamp.style.top = `${y}px`;
      // Set the exact angle of travel - inner element handles scaling/fading without touching this transform!
      stamp.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)${
        isOpen ? ' scale(1.15)' : ''
      }`;

      stamp.innerHTML = `
        <div class="paw-inner">
          <svg class="paw-icon" viewBox="0 0 249 209.32">
            <use href="#paw" />
          </svg>
        </div>
      `;

      container.appendChild(stamp);

      // Remove DOM node after animation finishes
      setTimeout(() => {
        if (stamp.parentNode === container) {
          container.removeChild(stamp);
        }
      }, 1050);
    }

    function handleMouseMove(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY;

      if (isFirst) {
        lastPawX = x;
        lastPawY = y;
        isFirst = false;
        return;
      }

      const dx = x - lastPawX;
      const dy = y - lastPawY;
      const dist = Math.hypot(dx, dy);

      if (dist >= STEP_DISTANCE) {
        const stepAngle = Math.atan2(dy, dx);
        // Angle in degrees; at 0 rad (moving right), rotate +90deg so toes point right
        const baseRotation = (stepAngle * 180) / Math.PI + 90;

        // Alternating walking gait offset perpendicular to travel
        const perp = stepAngle + Math.PI / 2;
        const sideOffset = isLeftPaw ? -8 : 8;
        const pawX = x + Math.cos(perp) * sideOffset;
        const pawY = y + Math.sin(perp) * sideOffset;
        const pawRotation = baseRotation + (isLeftPaw ? -6 : 6);

        spawnPaw(pawX, pawY, pawRotation);

        lastPawX = x;
        lastPawY = y;
        isLeftPaw = !isLeftPaw;
      }
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="paw-stamps-container"
      aria-hidden="true"
    />
  );
}
