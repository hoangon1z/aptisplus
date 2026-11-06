import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return process.env.NEXT_PUBLIC_SITE_URL
    ? [
        {
          url: process.env.NEXT_PUBLIC_SITE_URL,
          changeFrequency: "weekly",
          priority: 1,
        },
      ]
    : [];
}
