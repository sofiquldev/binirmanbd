'use client';

import { useEffect, useState } from 'react';
import { generalSettings } from '@/config/general.config';

export function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering static content on server
  if (!mounted) {
    return (
      <footer className="footer">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5">
            <div className="flex order-2 md:order-1 gap-2 font-normal text-sm">
              <span className="text-muted-foreground">{new Date().getFullYear()} &copy;</span>
              <a
                href="https://coderfleek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-foreground hover:text-primary"
              >
                coderfleek
              </a>
            </div>
            <nav className="flex order-1 md:order-2 gap-4 font-normal text-sm text-muted-foreground">
              <a
                href={generalSettings.docsLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Docs
              </a>
              <a
                href={generalSettings.purchaseLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Purchase
              </a>
              <a
                href={generalSettings.faqLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                FAQ
              </a>
              <a
                href="https://devs.coderfleek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Support
              </a>
              <a
                href={generalSettings.licenseLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                License
              </a>
            </nav>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5">
          <div className="flex order-2 md:order-1 gap-2 font-normal text-sm">
            <span className="text-muted-foreground">{new Date().getFullYear()} &copy;</span>
            <a
              href="https://coderfleek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-foreground hover:text-primary"
            >
              coderfleek
            </a>
          </div>
          <nav className="flex order-1 md:order-2 gap-4 font-normal text-sm text-muted-foreground">
            <a
              href={generalSettings.docsLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Docs
            </a>
            <a
              href={generalSettings.purchaseLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Purchase
            </a>
            <a
              href={generalSettings.faqLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              FAQ
            </a>
            <a
              href="https://devs.coderfleek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Support
            </a>
            <a
              href={generalSettings.licenseLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              License
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
