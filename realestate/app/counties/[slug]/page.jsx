import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { COUNTIES, COUNTY_BY_SLUG, countySlug, placesInCounty } from "@/app/data/kenyaLocations";
import { SITE_URL } from "@/app/config/site";
import { supabaseAdmin } from "@/app/utils/supabase";
import { formatProperty } from "@/app/utils/property";

export const revalidate = 600;
export function generateStaticParams() { return COUNTIES.map((county) => ({ slug: countySlug(county.name) })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const county = COUNTY_BY_SLUG[slug];
  if (!county) return {};
  const places = county.towns.slice(0, 4).join(", ");
  return {
    title: `Houses, rentals & land in ${county.name} County`,
    description: `Find houses, rentals and land in ${county.name} County, including ${places}. Free to search and list.`,
    alternates: { canonical: `${SITE_URL}/counties/${slug}` },
  };
}

export default async function CountyPage({ params }) {
  const { slug } = await params;
  const county = COUNTY_BY_SLUG[slug];
  if (!county) notFound();
  const { data } = await supabaseAdmin.from("properties").select("*, property_images(*)").eq("status", "active").eq("county", county.name).order("created_at", { ascending: false });
  const properties = (data || []).map(formatProperty);
  return <div className="min-h-screen bg-white"><Navbar theme="white" /><main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
    <p className="font-semibold text-[#1E7F4B]">{county.region} region · County headquarters: {county.hq}</p>
    <h1 className="mt-3 font-bricolage text-4xl font-bold text-[#0B1F33]">Houses, rentals &amp; land in {county.name} County</h1>
    {properties.length ? <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label={`Listings in ${county.name}`}>
      {properties.map((property) => <Link key={property.id} href={`/properties/${property.id}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><img src={property.images[0]} alt={`${property.title} in ${property.city}, ${county.name}`} className="h-52 w-full object-cover" /><div className="p-5"><h2 className="text-xl font-bold text-[#0B1F33]">{property.title}</h2><p className="mt-1 text-gray-600">{property.city}, {county.name}</p><p className="mt-3 font-bold text-[#1E7F4B]">KES {property.price.toLocaleString()}{property.category === "rent" ? " / month" : ""}</p>{property.verificationStatus === "verified" && <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Verified</span>}</div></Link>)}
    </section> : <div className="mt-10 rounded-2xl border border-dashed border-gray-300 p-8 text-center"><p>No listings in {county.name} yet.</p><Link href="/signup" className="mt-4 inline-block font-bold text-[#1E7F4B]">List yours free</Link></div>}
    <section className="mt-14"><h2 className="text-2xl font-bold text-[#0B1F33]">Towns and sub-counties</h2><div className="mt-5 flex flex-wrap gap-2">{placesInCounty(county.name).map((place) => <Link key={place} href={`/properties?county=${encodeURIComponent(county.name)}&area=${encodeURIComponent(place)}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-[#0B1F33] hover:border-[#1E7F4B]">{place}</Link>)}</div></section>
  </main></div>;
}
