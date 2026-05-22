import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Get in Touch | The Digital Health Digest",
  description:
    "Have a question, tip, or want to suggest a platform we should review? Send us a message.",
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-[#aaaaaa] mb-8">
        <Link href="/" className="hover:text-[#326891] transition-colors">
          Home
        </Link>{" "}
        / Contact
      </p>

      {/* Header */}
      <div
        className="pb-10 border-b border-[#e0e0e0] mb-12"
        style={{ borderBottomWidth: "0.5px" }}
      >
        <h1 className="font-serif text-4xl leading-snug text-[#111111] mb-4 max-w-2xl">
          Get in Touch
        </h1>
        <p className="text-lg text-[#555555] leading-relaxed max-w-xl">
          Have a question, tip, or want to suggest a platform we should review?
          We&rsquo;d love to hear from you.
        </p>
      </div>

      {/* Form — same max-w-2xl column as How We Score / About */}
      <div className="max-w-2xl">
        <ContactForm />
      </div>
    </div>
  );
}
