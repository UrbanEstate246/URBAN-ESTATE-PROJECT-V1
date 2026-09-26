import { COUNTIES, countySlug } from "@/app/data/kenyaLocations";
import { ARTICLES } from "@/app/data/articles";
import { SITE_URL } from "@/app/config/site";
import { supabaseAdmin } from "@/app/utils/supabase";

export const revalidate = 3600;

export default async function sitemap() {
  const { data: properties } = await supabaseAdmin.from("properties").select("id, created_at").eq("status", "active");
  const staticPaths = ["", "/properties", "/blog", "/commonrules", "/terms", "/privacy"];
  return [
    ...staticPaths.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...COUNTIES.map((county) => ({ url: `${SITE_URL}/counties/${countySlug(county.name)}` })),
    ...ARTICLES.map((article) => ({ url: `${SITE_URL}/blog/${article.slug}`, lastModified: article.date })),
    ...(properties || []).map((property) => ({ url: `${SITE_URL}/properties/${property.id}`, lastModified: property.created_at })),
  ];
}
