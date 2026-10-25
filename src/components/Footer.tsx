'use client';

import React from 'react';
import { useLocale, LanguageSwitcher } from './LocaleContext';

export default function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-content">
        <span className="footer-label">{dict.contact.getInTouch}</span>
        <a href="mailto:hello@zylitch.in" className="footer-email">
          hello@zylitch.in
        </a>
        <div className="footer-bottom">
          <span className="footer-copy">{dict.contact.rights}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
