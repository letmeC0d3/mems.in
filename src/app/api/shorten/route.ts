import { NextResponse } from "next/server";
import { saveShortLink, getShortLink } from "@/lib/db";

// Helper to generate a random slug of length 5
function generateSlug() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { url, customAlias, reactionMemeId } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Missing original URL to shorten" }, { status: 400 });
    }

    let slug = customAlias ? customAlias.trim().toLowerCase() : "";
    
    // Validate custom slug
    if (slug) {
      if (!/^[a-z0-9_-]+$/i.test(slug)) {
        return NextResponse.json({ error: "Custom alias can only contain alphanumeric characters, hyphens, and underscores." }, { status: 400 });
      }

      // Check if slug is reserved or already exists
      const existing = getShortLink(slug);
      if (existing || ["shorten", "api", "m", "saved", "templates"].includes(slug)) {
        return NextResponse.json({ error: "This custom alias is already taken or reserved." }, { status: 400 });
      }
    } else {
      // Generate a unique slug
      let unique = false;
      let limit = 10;
      while (!unique && limit > 0) {
        slug = generateSlug();
        const existing = getShortLink(slug);
        if (!existing) {
          unique = true;
        }
        limit--;
      }
      
      if (!unique) {
        return NextResponse.json({ error: "Failed to generate a unique short URL. Try again." }, { status: 500 });
      }
    }

    const shortLink = saveShortLink(slug, url, reactionMemeId);

    return NextResponse.json({ success: true, shortLink });
  } catch (error) {
    console.error("API Shorten Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
