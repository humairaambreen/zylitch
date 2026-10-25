'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from './LocaleContext';

export default function Navbar() {
  const pathname = usePathname();
  const { dict } = useLocale();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isWork = pathname === '/work' || pathname?.startsWith('/work');

  return (
    <>
      {/* Top Progressive Blur Vignette */}
      <div className="progressive-blur-top" aria-hidden="true" />

      {/* Clean Floating Navbar */}
      <nav className="nav">
        <div className="nav_top-wrapper">
          <div className="nav_top">
            <Link href="/" onClick={handleLogoClick} className="nav_link">
              ZYLITCH
            </Link>

            {/* Dynamic Centered Navigation Link */}
            <Link
              href={isWork ? '/' : '/work'}
              className="nav_link nav_link--center"
            >
              {isWork ? dict.nav.home : dict.nav.work}
            </Link>

            <a href="mailto:hello@zylitch.in" className="nav_link">
              {dict.nav.contact}
            </a>
          </div>
        </div>
      </nav>

      {/* Bottom Progressive Blur Vignette */}
      <div className="progressive-blur-bottom" aria-hidden="true" />
    </>
  );
}
