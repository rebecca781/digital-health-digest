import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t border-[#d8d4cc] mt-20 bg-[#fdfaf5]"
      style={{ borderWidth: "0.5px" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-[#1a1a1a]">
          The Telehealth Review
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[#4a4a4a]">
          <Link href="/about" className="hover:text-[#326891] transition-colors">
            About
          </Link>
          <Link href="/how-we-score" className="hover:text-[#326891] transition-colors">
            How We Score
          </Link>
          <Link href="/category/all" className="hover:text-[#326891] transition-colors">
            Reviews
          </Link>
          <Link href="/contact" className="hover:text-[#326891] transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-[#326891] transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
