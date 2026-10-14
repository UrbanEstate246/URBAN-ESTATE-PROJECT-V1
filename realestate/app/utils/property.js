import { BRAND } from "@/app/config/brand";
import { normalizeKenyanPhone } from "@/app/utils/phone";

const PLACEHOLDER = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

/**
 * Who a buyer should call. The listing's own contact (owner/agent) wins; UrbanEstate support
 * is only the last resort for old listings that have no phone number at all.
 */
function contactFor(p) {
  const phone = normalizeKenyanPhone(p.contact_phone) || normalizeKenyanPhone(p.owner?.phone);
  if (phone) return { name: p.contact_name || "Property owner", phone, direct: true };
  return { name: "UrbanEstate support", phone: normalizeKenyanPhone(BRAND.phone), email: BRAND.email, direct: false };
}

// Phone numbers are only attached when `includeContact` is set (single listing, my listings, admin)
// so bulk listing feeds don't hand out every number at once.
export function formatProperty(p, { includeContact = false } = {}) {
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
    createdAt: p.created_at,
    city: p.area || p.county,
    state: p.county,
    address: `${p.ward ? `${p.ward}, ` : ""}${p.area || ""}, ${p.county}`,
    bedrooms: p.bedrooms || null,
    bathrooms: p.bathrooms || null,
    areaSqFt: null,
    amenities: p.amenities || [],
    images: images.length ? images : [PLACEHOLDER],
    ...(includeContact ? { contact: contactFor(p) } : {}),
  };
}
