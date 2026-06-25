import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.drifullyrentals.com";

  const routes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/our-fleet", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "daily" as const },
    { url: "/contact-us", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
