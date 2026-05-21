import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-[#d0d0d0]" style={{ borderWidth: "0.5px" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-base font-semibold tracking-tight text-[#111111]">
          The Digital Health Digest
        </Link>
        <nav className="flex items-center gap-7 text-sm text-[#444444]">
          <Link href="/category/all" className="hover:text-[#3B6D11] transition-colors">
            Reviews
          </Link>
          <Link href="/category/all" className="hover:text-[#3B6D11] transition-colors">
            Categories
          </Link>
          <Link href="/how-we-score" className="hover:text-[#3B6D11] transition-colors">
            How We Score
          </Link>
          <Link href="/about" className="hover:text-[#3B6D11] transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
