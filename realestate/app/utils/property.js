import { BRAND } from "@/app/config/brand";
import { normalizeKenyanPhone } from "@/app/utils/phone";

const PLACEHOLDER = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

/**
 * Who a buyer should call. The listing's own contact (owner/agent) wins; UrbanEstate support
 * is only the last resort for old listings that have no phone number at all.
 */
function contactFor(p) {
  const rawPhone = p.contact_phone || p.owner?.phone;
  const phone = normalizeKenyanPhone(rawPhone);
  // Fall back to Ann (UrbanEstate Verified Agent) if phone is missing or dummy 0700000000
  if (phone && !phone.endsWith("700000000")) {
    const name = p.contact_name || (p.owner?.name && !p.owner.name.includes("Super Admin") ? p.owner.name : "Ann (UrbanEstate Verified Agent)");
    return { name, phone, direct: true };
  }
  return { name: "Ann (UrbanEstate Verified Agent)", phone: normalizeKenyanPhone(BRAND.phone), email: BRAND.email, direct: true };
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
    moredetails: p.moredetails && p.moredetails !== p.description ? p.moredetails : null,
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
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    images: images.length ? images : [PLACEHOLDER],
    ...(includeContact ? { contact: contactFor(p) } : {}),
  };
}
