import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-[#d8d4cc] bg-[#fdfaf5]" style={{ borderWidth: "0.5px" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo — "Health" in accent blue */}
        <Link href="/" className="text-base font-semibold tracking-tight text-[#1a1a1a]">
          The Digital{" "}
          <span className="text-[#326891]">Health</span>
          {" "}Digest
        </Link>

        <div className="flex items-center gap-7">
          <nav className="flex items-center gap-7 text-sm text-[#4a4a4a]">
            <Link href="/category/all" className="hover:text-[#326891] transition-colors">
              Reviews
            </Link>
            <Link href="/category/all" className="hover:text-[#326891] transition-colors">
              Categories
            </Link>
            <Link href="/how-we-score" className="hover:text-[#326891] transition-colors">
              How We Score
            </Link>
            <Link href="/about" className="hover:text-[#326891] transition-colors">
              About
            </Link>
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
      </div>
    </header>
  );
}
