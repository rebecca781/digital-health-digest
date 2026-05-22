import type { SanityScorecard } from "@/types/sanity";

interface ScorecardProps {
  scorecard: SanityScorecard;
}

function RatingBar({ rating }: { rating: number }) {
  const pct = (rating / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-[#e8e8e8]" role="presentation">
        <div className="h-full bg-[#326891]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-[#1a1a1a] tabular-nums w-8 text-right">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function Scorecard({ scorecard }: ScorecardProps) {
  return (
    <div
      className="border border-[#d8d4cc] max-w-2xl mb-10"
      style={{ borderWidth: "0.5px" }}
    >
      {/* Header bar */}
      <div className="bg-[#326891] px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] uppercase tracking-widest font-medium text-[#a8c8e0]">
            Our Pick
          </span>
          <span className="text-[10px] text-[#7aaec8]">—</span>
          <span className="text-sm font-semibold text-white">
            {scorecard.winner}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-[#a8c8e0]">
            Overall
          </span>
          <span className="text-sm font-bold text-white tabular-nums">
            {scorecard.overallRating.toFixed(1)}
            <span className="text-[10px] font-normal text-[#a8c8e0]">/10</span>
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div
        className="grid grid-cols-3 border-b border-[#e8e8e8]"
        style={{ borderBottomWidth: "0.5px" }}
      >
        {/* Rating */}
        <div
          className="px-5 py-4 border-r border-[#e8e8e8]"
          style={{ borderRightWidth: "0.5px" }}
        >
          <p className="text-[10px] uppercase tracking-widest text-[#888] mb-2">
            Rating
          </p>
          <RatingBar rating={scorecard.overallRating} />
        </div>

        {/* Best for */}
        <div
          className="px-5 py-4 border-r border-[#e8e8e8]"
          style={{ borderRightWidth: "0.5px" }}
        >
          <p className="text-[10px] uppercase tracking-widest text-[#888] mb-1.5">
            Best For
          </p>
          <p className="text-xs text-[#4a4a4a] leading-snug">
            {scorecard.bestFor}
          </p>
        </div>

        {/* Price tier */}
        <div className="px-5 py-4">
          <p className="text-[10px] uppercase tracking-widest text-[#888] mb-1.5">
            Price Tier
          </p>
          <div className="flex items-center gap-0.5">
            {["$", "$", "$", "$"].map((sign, i) => {
              const filled = i < scorecard.priceTier.length;
              return (
                <span
                  key={i}
                  className={`text-sm font-semibold ${
                    filled ? "text-[#326891]" : "text-[#dddddd]"
                  }`}
                >
                  {sign}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Pros */}
        <div
          className="px-5 py-5 sm:border-r border-[#e8e8e8]"
          style={{ borderRightWidth: "0.5px" }}
        >
          <p className="text-[10px] uppercase tracking-widest font-medium text-[#326891] mb-3">
            Pros
          </p>
          <ul className="flex flex-col gap-2">
            {scorecard.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#4a4a4a]">
                <span
                  className="mt-0.5 w-3.5 h-3.5 shrink-0 rounded-full bg-[#e8f1f7] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    width="7"
                    height="6"
                    viewBox="0 0 7 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 3L2.8 5L6 1"
                      stroke="#326891"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div
          className="px-5 py-5 border-t border-[#e8e8e8] sm:border-t-0"
          style={{ borderTopWidth: "0.5px" }}
        >
          <p className="text-[10px] uppercase tracking-widest font-medium text-[#888] mb-3">
            Cons
          </p>
          <ul className="flex flex-col gap-2">
            {scorecard.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#4a4a4a]">
                <span
                  className="mt-0.5 w-3.5 h-3.5 shrink-0 rounded-full bg-[#f5f5f5] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    width="7"
                    height="2"
                    viewBox="0 0 7 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1H6"
                      stroke="#999999"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
