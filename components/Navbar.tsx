"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Fleet", href: "/our-fleet" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Drive with Drifully", href: "/drive-with-drifully" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [downloadLink, setDownloadLink] = useState("https://play.google.com/store/apps/details?id=com.drifully.app");

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOS = /ipad|iphone|ipod/.test(userAgent) ||
        (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 2 && /macintosh/.test(userAgent));
      if (isIOS) {
        setDownloadLink("https://apps.apple.com/ng/app/drifully/id6782419021");
      }
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <Link
          href="/"
          className={`navbar__logo-link ${isOpen ? "navbar__logo-link--hidden" : ""}`}
          aria-label="Drifully home"
        >
          <Image
            src="/images/logo.svg"
            alt="Drifully"
            width={120}
            height={36}
            priority
          />
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar__toggle"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Nav links / Mobile Menu */}
        <div className={`navbar__menu ${isOpen ? "is-open" : ""}`}>
          <div className="navbar__mobile-watermark" aria-hidden="true">
            DRIFULLY
          </div>
          <div className="navbar__mobile-header">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image
                src="/images/logo.svg"
                alt="Drifully"
                width={120}
                height={36}
              />
            </Link>
          </div>

          <ul className="navbar__nav" role="list">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.label} className="navbar__nav-item">
                  <Link
                    href={item.href}
                    className="navbar__link"
                    data-active={isActive ? true : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile CTA */}
          <Link href={downloadLink} className="btn btn-primary navbar__cta-mobile" onClick={() => setIsOpen(false)}>
            Download App
          </Link>
        </div>

        {/* Desktop CTA */}
        <Link href={downloadLink} className="btn btn-primary btn-sm navbar__cta-desktop">
          Download App
        </Link>
      </div>
    </nav>
  );
}


