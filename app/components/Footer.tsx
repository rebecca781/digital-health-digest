import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t border-[#d0d0d0] mt-20"
      style={{ borderWidth: "0.5px" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-[#111111]">
          The Digital Health Digest
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[#666666]">
          <Link href="/category/all" className="hover:text-[#3B6D11] transition-colors">
            Reviews
          </Link>
          <Link href="/about" className="hover:text-[#3B6D11] transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#3B6D11] transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-[#3B6D11] transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
