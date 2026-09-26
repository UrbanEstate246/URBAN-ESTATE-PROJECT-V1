import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Clock, Search } from "lucide-react";
import Navbar from "../../components/Navbar";
import ArticleBody from "../../components/ArticleBody";
import { ARTICLES, ARTICLE_BY_SLUG, relatedArticles } from "../../data/articles";
import { SITE_URL } from "../../config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLE_BY_SLUG[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      url: `/blog/${article.slug}`,
      locale: "en_KE",
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = ARTICLE_BY_SLUG[slug];
  if (!article) notFound();

  const related = relatedArticles(slug);
  const published = new Date(`${article.date}T12:00:00Z`).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  });

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.date,
      inLanguage: "en-KE",
      mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
      author: { "@type": "Organization", name: "UrbanEstate Kenya", url: SITE_URL },
      publisher: { "@type": "Organization", name: "UrbanEstate Kenya", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo/app-icon.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/blog/${article.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="border-b border-[#E3E6E8]">
        <Navbar theme="white" />
      </div>

      <article className="mx-auto max-w-[760px] px-6 pb-16 pt-10 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0B1F33]">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link href="/blog" className="hover:text-[#0B1F33]">Guides</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-gray-700">{article.category}</span>
        </nav>

        <header className="mt-6 border-b border-[#E3E6E8] pb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C28F2C]">{article.category}</p>
          <h1 className="mt-3 font-bricolage text-3xl font-bold leading-tight tracking-tight text-[#0B1F33] sm:text-[2.6rem]">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{article.description}</p>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>By the UrbanEstate Kenya team</span>
            <time dateTime={article.date}>{published}</time>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {article.readMinutes} min read</span>
          </p>
        </header>

        <div className="pt-8">
          <ArticleBody blocks={article.blocks} />
        </div>

        <aside className="mt-14 grid gap-4 sm:grid-cols-2">
          <Link href="/properties" className="group rounded-2xl border border-[#E3E6E8] p-6 transition hover:border-[#0B1F33]">
            <Search className="h-5 w-5 text-[#1E7F4B]" aria-hidden="true" />
            <p className="mt-3 font-bold text-[#0B1F33]">Search property in all 47 counties</p>
            <p className="mt-1 text-sm text-gray-600">Rentals, homes for sale and land, down to the town.</p>
          </Link>
          <Link href="/signup" className="group rounded-2xl bg-[#0B1F33] p-6 text-white transition hover:bg-[#1E7F4B]">
            <ArrowRight className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            <p className="mt-3 font-bold">List your property free</p>
            <p className="mt-1 text-sm text-white/75">Reach people searching in your county.</p>
          </Link>
        </aside>
      </article>

      {related.length > 0 && (
        <section className="border-t border-[#E3E6E8] bg-[#F8F9FA] py-14">
          <div className="mx-auto max-w-[1100px] px-6 sm:px-8">
            <h2 className="text-xl font-bold text-[#0B1F33]">Keep reading</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {related.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="rounded-2xl border border-[#E3E6E8] bg-white p-5 transition hover:border-[#1E7F4B] hover:shadow-md">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C28F2C]">{a.category}</p>
                  <h3 className="mt-2 font-bold leading-snug text-[#0B1F33]">{a.title}</h3>
                  <p className="mt-3 text-xs font-semibold text-gray-500">{a.readMinutes} min read</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
