import Link from "next/link";
import { Lightbulb } from "lucide-react";

// Renders inline **bold** and [text](href) inside article strings (see app/data/articles.js).
function Inline({ text }) {
  const parts = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(<strong key={match.index} className="font-semibold text-[#0B1F33]">{match[1]}</strong>);
    } else {
      const href = match[3];
      parts.push(
        href.startsWith("/") ? (
          <Link key={match.index} href={href} className="font-semibold text-[#1E7F4B] underline underline-offset-2 hover:text-[#0B1F33]">
            {match[2]}
          </Link>
        ) : (
          <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1E7F4B] underline underline-offset-2">
            {match[2]}
          </a>
        )
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function ArticleBody({ blocks }) {
  return (
    <div className="space-y-5 text-[17px] leading-8 text-gray-700">
      {blocks.map((b, i) => {
        if (b.h) return <h2 key={i} className="pt-6 font-bricolage text-2xl font-bold tracking-tight text-[#0B1F33]">{b.h}</h2>;
        if (b.p) return <p key={i}><Inline text={b.p} /></p>;
        if (b.ul)
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-[#C28F2C]">
              {b.ul.map((item, j) => <li key={j}><Inline text={item} /></li>)}
            </ul>
          );
        if (b.ol)
          return (
            <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-[#0B1F33]">
              {b.ol.map((item, j) => <li key={j}><Inline text={item} /></li>)}
            </ol>
          );
        if (b.tip)
          return (
            <aside key={i} className="flex gap-3 rounded-2xl border border-[#1E7F4B]/20 bg-[#1E7F4B]/5 p-5 text-base leading-7">
              <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-[#1E7F4B]" aria-hidden="true" />
              <p><Inline text={b.tip} /></p>
            </aside>
          );
        return null;
      })}
    </div>
  );
}
