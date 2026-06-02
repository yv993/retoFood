import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Public, indexable routes only — /cart and /checkout/* are intentionally excluded.
  const routes = [
    "",
    "/menu",
    "/about",
    "/gallery",
    "/reserve",
    "/catering",
    "/gift-cards",
    "/contact",
    "/privacy",
    "/terms",
    "/cookie-policy",
    "/accessibility",
    "/allergens",
  ];
  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
