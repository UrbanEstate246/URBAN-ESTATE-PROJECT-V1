import { SITE_URL } from "@/app/config/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/login", "/signup", "/addProperty", "/myProperties", "/booking", "/bookingstatus", "/Favourite"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
