import type { MetadataRoute } from "next";
import { getSiteUrl } from "./_lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/", "/docs/"],
    },
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}
