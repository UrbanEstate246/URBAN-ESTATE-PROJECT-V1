// Client-side session helpers. The API sets a `token` cookie and the pages mirror
// the user in localStorage; both must be written and cleared together.
const KEYS = ["token", "userId", "userRole", "userName", "role"];

export function saveSession({ token, user }) {
  localStorage.setItem("token", token || "");
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userName", user.name);
}

export function clearSession() {
  KEYS.forEach((k) => localStorage.removeItem(k));
  document.cookie = "token=; Max-Age=0; path=/";
}

export function authHeaders(extra = {}) {
  return { ...extra, Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
}

export function redirectIfUnauthorized(response, path = window.location.pathname) {
  if (response.status !== 401) return false;
  clearSession();
  window.location.href = `/login?next=${encodeURIComponent(path)}`;
  return true;
}

/** Only allow same-site relative redirects (blocks ?next=https://evil.example). */
export function safeNext(fallback = "/") {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
