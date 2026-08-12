import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { PROGRAMMATIC_TEMPLATES } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mems.in";
  
  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Add programmatic template routes to sitemap
  PROGRAMMATIC_TEMPLATES.forEach((temp) => {
    routes.push({
      url: `${baseUrl}/templates/${temp.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  });

  // Dynamically add generated meme sharing pages to sitemap
  try {
    const dbPath = path.join(process.cwd(), "data", "db.json");
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, "utf-8");
      const db = JSON.parse(dbContent);
      
      if (db.memes && Array.isArray(db.memes)) {
        db.memes.forEach((meme: { id: string; createdAt: string }) => {
          routes.push({
            url: `${baseUrl}/m/${meme.id}`,
            lastModified: new Date(meme.createdAt),
            changeFrequency: "monthly",
            priority: 0.65,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error reading database for dynamic sitemap generation:", error);
  }

  return routes;
}
