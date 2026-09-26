import Link from "next/link";

/**
 * UrbanEstate brand mark: a gold roofline sheltering a "U" that doubles as a doorway.
 * Pure SVG so it stays crisp at every size and never depends on an image request.
 */
export function LogoMark({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="11" fill="#0B1F33" />
      <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" stroke="#FFFFFF" strokeOpacity="0.12" />
      <path
        d="M8.5 18 L20 9 L31.5 18"
        stroke="#D4AF37"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 19.5 V24.5 a6.5 6.5 0 0 0 13 0 V19.5"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="18.6" r="1.7" fill="#1E7F4B" />
    </svg>
  );
}

/**
 * Full lockup. `tone="light"` is for dark backgrounds (white wordmark),
 * `tone="dark"` for light backgrounds (navy wordmark).
 */
export default function Logo({ tone = "light", size = 40, href = "/", showTagline = true, className = "" }) {
  const onDark = tone === "light";
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} className="shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:-rotate-3" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-bricolage text-[1.35rem] tracking-tight ${onDark ? "text-white" : "text-[#0B1F33]"}`}
        >
          <span className="font-bold">Urban</span>
          <span className={`font-medium ${onDark ? "text-[#D4AF37]" : "text-[#1E7F4B]"}`}>Estate</span>
        </span>
        {showTagline && (
          <span
            className={`mt-1 text-[9.5px] font-semibold uppercase tracking-[0.28em] ${
              onDark ? "text-white/60" : "text-gray-500"
            }`}
          >
            Kenya · Verified
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="UrbanEstate Kenya home" className="group inline-flex">
      {content}
    </Link>
  );
}
