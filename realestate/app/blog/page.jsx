import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import { ARTICLES, ARTICLE_CATEGORIES } from "../data/articles";

export const metadata = {
  title: "Property guides for renters, buyers and landlords in Kenya",
  description:
    "Practical guides on listing property, avoiding rental and land scams, buying land safely, and choosing where to live in Nairobi, Mombasa, Kisumu, Nakuru and across Kenya.",
  alternates: { canonical: "/blog" },
};

const CATEGORY_BLURB = {
  "Listing guides": "Get your property in front of the right people.",
  "Stay safe": "Protect your money when renting or buying.",
  "Area guides": "Know where to look, in Nairobi and beyond.",
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="border-b border-[#E3E6E8] bg-white">
        <Navbar theme="white" />
      </div>

      <header className="mx-auto max-w-[1200px] px-6 pb-6 pt-16 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#C28F2C]">UrbanEstate guides</p>
        <h1 className="mt-2 max-w-3xl font-bricolage text-4xl font-bold tracking-tight text-[#0B1F33] sm:text-5xl">
          Rent, buy and list property in Kenya — the smart way
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Plain-language guides from our team: how to list, how to spot scams, and where to look across all 47 counties.
        </p>
      </header>

      <main className="mx-auto max-w-[1200px] space-y-16 px-6 pb-24 pt-8 sm:px-8">
        {ARTICLE_CATEGORIES.map((category) => (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <h2 id={`cat-${category}`} className="text-2xl font-bold text-[#0B1F33]">{category}</h2>
              <p className="text-sm text-gray-500">{CATEGORY_BLURB[category]}</p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ARTICLES.filter((a) => a.category === category).map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[#E3E6E8] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#1E7F4B] hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-lg font-bold leading-snug text-[#0B1F33] group-hover:text-[#1E7F4B]">{a.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{a.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {a.readMinutes} min read</span>
                    <span className="inline-flex items-center gap-1 text-[#1E7F4B]">Read <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-[#0B1F33] p-8 text-white sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Have a property to rent out or sell?</h2>
          <p className="mt-2 max-w-xl text-white/75">Listing is free. Add photos, set your price and reach people searching in your county.</p>
          <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#0B1F33] transition hover:bg-white">
            List your property free <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
