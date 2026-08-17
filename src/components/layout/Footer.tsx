"use client";

import React from "react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Technology", href: "#technology" },
  { name: "Capabilities", href: "#capabilities" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-foreground/5 py-12 md:py-16 mt-auto">
      <div className="mx-auto max-w-container px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Logo and brand name */}
        <div className="flex items-center gap-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <defs>
              <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--accent-teal)" />
                <stop offset="100%" stopColor="var(--accent-violet)" />
              </linearGradient>
            </defs>
            <path
              d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
              stroke="url(#footer-logo-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="16" r="3" fill="var(--accent-teal)" />
          </svg>
          <span className="font-display font-bold tracking-tight text-md text-foreground">
            NEXUS<span className="text-accent-teal">BIO</span>
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs md:text-sm text-foreground/60 hover:text-accent-teal transition-colors focus:outline-none"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <div className="text-xs text-foreground/40 text-center md:text-right">
          &copy; {currentYear} NexusBio Technologies. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
