import { supabaseAdmin } from "@/app/utils/supabase";

async function getProperty(id) {
  const { data } = await supabaseAdmin.from("properties").select("*, property_images(cloudinary_url, display_order)").eq("id", id).maybeSingle();
  return data;
}

export async function generateMetadata({ params }) {
  const { propertyid } = await params;
  const property = await getProperty(propertyid);
  if (!property) return { title: "Property not found" };
  const price = `KES ${Number(property.price).toLocaleString("en-KE")}${property.category === "rent" ? " per month" : ""}`;
  return {
    title: `${property.title} — ${property.area || property.county}, ${property.county}`,
    description: `${price}. ${String(property.description || "").slice(0, 150)}`,
    openGraph: { images: property.property_images?.sort((a, b) => a.display_order - b.display_order)[0]?.cloudinary_url ? [property.property_images.sort((a, b) => a.display_order - b.display_order)[0].cloudinary_url] : [] },
  };
}

export default async function Layout({ children, params }) {
  const { propertyid } = await params;
  const property = await getProperty(propertyid);
  const jsonLd = property && {
    "@context": "https://schema.org",
    "@type": property.category === "land" ? "Place" : "Residence",
    name: property.title,
    address: { "@type": "PostalAddress", addressLocality: property.area, addressRegion: property.county, addressCountry: "KE" },
    image: property.property_images?.sort((a, b) => a.display_order - b.display_order).map((image) => image.cloudinary_url),
  };
  return <>{jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}{children}</>;
}
