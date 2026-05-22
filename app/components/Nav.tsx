"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "About",        href: "/about"         },
  { label: "How We Score", href: "/how-we-score"  },
  { label: "Reviews",      href: "/category/all"  },
  { label: "Contact",      href: "/contact"       },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="bg-[#fdfaf5] border-b border-[#d8d4cc] relative z-50"
      style={{ borderBottomWidth: "0.5px" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">

        {/* Logo — never wraps */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-[#1a1a1a] shrink-0 whitespace-nowrap"
        >
          The Digital{" "}
          <span className="text-[#326891]">Health</span>
          {" "}Digest
        </Link>

        {/* ── Desktop nav (md+) ─────────────────────────── */}
        <div className="hidden md:flex items-center gap-7">
          <nav className="flex items-center gap-7 text-[#4a4a4a]" style={{ fontSize: "13px" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[#326891] transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search icon */}
          <button
            aria-label="Search"
            className="text-[#4a4a4a] hover:text-[#326891] transition-colors"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* ── Mobile hamburger (below md) ───────────────── */}
        <button
          className="md:hidden flex items-center justify-center text-[#1a1a1a] hover:text-[#326891] transition-colors"
          style={{ width: "44px", height: "44px" }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            /* X icon */
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────── */}
      {open && (
        <nav
          className="md:hidden bg-[#fdfaf5] border-t border-[#d8d4cc] w-full"
          style={{ borderTopWidth: "0.5px" }}
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-[#1a1a1a] hover:text-[#326891] hover:bg-[#f4f0e8] transition-colors"
              style={{
                fontSize: "16px",
                padding: "1rem 1.25rem",
                borderTop: i > 0 ? "0.5px solid #d8d4cc" : undefined,
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
