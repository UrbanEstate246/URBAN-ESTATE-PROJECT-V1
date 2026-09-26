import { BRAND } from "@/app/config/brand";

const PLACEHOLDER = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

export function formatProperty(p) {
  const images = (p.property_images || [])
    .sort((a, b) => a.display_order - b.display_order)
    .map((image) => image.cloudinary_url);

  return {
    _id: p.id,
    id: p.id,
    ownerId: p.owner_id,
    title: p.title,
    description: p.description,
    moredetails: p.description,
    price: Number(p.price),
    category: p.category,
    type: p.type || "",
    status: p.status === "active" ? "available" : p.status,
    verificationStatus: p.verification_status,
    city: p.area || p.county,
    state: p.county,
    address: `${p.ward ? `${p.ward}, ` : ""}${p.area || ""}, ${p.county}`,
    bedrooms: p.bedrooms || null,
    bathrooms: p.bathrooms || null,
    areaSqFt: null,
    amenities: p.amenities || [],
    images: images.length ? images : [PLACEHOLDER],
    contact: { name: "UrbanEstate support", phone: BRAND.phone, email: BRAND.email },
  };
}
