import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { posts } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/coaching",
    "/pm-roles",
    "/blog",
    "/testimonials",
    "/newsletter",
    "/contact",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const blog = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...routes, ...blog];
}
