// Kenyan phone helpers shared by the browser and the API routes.
const KENYAN_PHONE = /^(?:\+?254|0)([71]\d{8})$/;

/** Returns the number as +2547XXXXXXXX / +2541XXXXXXXX, or null when it is not a valid Kenyan number. */
export function normalizeKenyanPhone(input) {
  const match = String(input || "").replace(/[\s()-]/g, "").match(KENYAN_PHONE);
  return match ? `+254${match[1]}` : null;
}

/** "+254712345678" -> "0712 345 678" */
export function formatPhoneDisplay(e164) {
  const normalized = normalizeKenyanPhone(e164);
  if (!normalized) return String(e164 || "");
  const national = `0${normalized.slice(4)}`;
  return `${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7)}`;
}

export function telHref(e164) {
  const normalized = normalizeKenyanPhone(e164);
  return normalized ? `tel:${normalized}` : undefined;
}

export function whatsappHref(e164, text = "") {
  const normalized = normalizeKenyanPhone(e164);
  if (!normalized) return undefined;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${normalized.slice(1)}${query}`;
}
