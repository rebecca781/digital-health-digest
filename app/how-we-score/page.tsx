import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Score | The Digital Health Digest",
  description:
    "Every review on The Digital Health Digest is based on the same five criteria. Here's exactly how we evaluate telehealth platforms.",
};

const criteria = [
  {
    number: "01",
    title: "Clinical quality",
    body: "We look at who is doing the prescribing. Are the providers board-certified physicians, or are patients seen exclusively by PAs and NPs without physician oversight? We also evaluate whether the clinical protocol — the conditions treated, the medications offered, the dosing logic — reflects current evidence-based guidelines rather than commercial convenience.",
  },
  {
    number: "02",
    title: "Pricing and transparency",
    body: "We enroll as real patients and track every charge from intake to prescription. Advertised prices rarely tell the whole story: consultation fees, compounding upcharges, mandatory bundle tiers, and auto-renewing subscriptions all affect true cost. A platform scores well here only when a new patient can accurately predict what they'll spend before they hand over a credit card.",
  },
  {
    number: "03",
    title: "Patient experience",
    body: "How long does it take to complete intake? When you message a provider, how quickly do they respond — and do they actually answer your question? We time these interactions ourselves over multiple weeks. Platforms are also evaluated on app and portal quality, how easy it is to cancel or pause, and whether support is reachable when something goes wrong.",
  },
  {
    number: "04",
    title: "Treatment access",
    body: "Breadth of formulary matters. A platform that treats only one condition, offers only one medication, or requires patients to escalate outside the platform for anything complex scores lower than one that can handle the realistic range of needs in its category. We also flag platforms that steer patients toward higher-margin options regardless of clinical fit.",
  },
  {
    number: "05",
    title: "Ongoing care",
    body: "Telehealth should not be a one-and-done transaction. We evaluate whether platforms include meaningful follow-up — check-ins, lab monitoring where clinically indicated, protocol adjustments over time. Platforms that issue an initial prescription and then go silent score lower than those that treat chronic care as an ongoing relationship.",
  },
];

export default function HowWeScorePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-[#aaaaaa] mb-8">
        <Link href="/" className="hover:text-[#3B6D11] transition-colors">
          Home
        </Link>{" "}
        / How We Score
      </p>

      {/* Header */}
      <div className="pb-10 border-b border-[#e0e0e0] mb-14" style={{ borderBottomWidth: "0.5px" }}>
        <h1 className="font-serif text-4xl leading-snug text-[#111111] mb-4 max-w-2xl">
          How We Score
        </h1>
        <p className="text-lg text-[#555555] leading-relaxed max-w-xl">
          Every review on The Digital Health Digest is based on the same criteria.
          Here&rsquo;s exactly how we evaluate telehealth platforms.
        </p>
      </div>

      {/* Criteria */}
      <div className="max-w-2xl">
        <ol className="flex flex-col">
          {criteria.map((item, i) => (
            <li
              key={item.number}
              className={`flex gap-8 py-10 ${
                i < criteria.length - 1
                  ? "border-b border-[#eeeeee]"
                  : ""
              }`}
              style={i < criteria.length - 1 ? { borderBottomWidth: "0.5px" } : {}}
            >
              {/* Number */}
              <span
                className="font-serif text-3xl leading-none text-[#3B6D11] select-none shrink-0 w-9 text-right"
                aria-hidden="true"
              >
                {item.number}
              </span>

              {/* Text */}
              <div>
                <h2 className="font-serif text-xl text-[#111111] mb-3">
                  {item.title}
                </h2>
                <p className="text-[#444444] leading-relaxed text-base">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Independence note */}
        <div
          className="mt-14 pt-10 border-t border-[#e0e0e0]"
          style={{ borderTopWidth: "0.5px" }}
        >
          <p className="text-xs uppercase tracking-widest font-medium text-[#999999] mb-3">
            Editorial independence
          </p>
          <p className="text-sm text-[#555555] leading-relaxed">
            The Digital Health Digest is editorially independent. We do not
            accept payment, free product, or any other form of compensation from
            the brands we review. Our only source of revenue is reader support.
            If you believe a review is inaccurate or out of date,{" "}
            <Link
              href="/contact"
              className="text-[#3B6D11] underline underline-offset-2 hover:text-[#27500A] transition-colors"
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
