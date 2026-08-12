import { NextResponse } from "next/server";
import { saveMeme } from "@/lib/db";

// Helper to generate a random base62 string of length 6
function generateId() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01233456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { templateId, base64Data, title } = await request.json();

    if (!base64Data) {
      return NextResponse.json({ error: "Missing base64Data image content" }, { status: 400 });
    }

    const memeId = generateId();
    const meme = saveMeme(memeId, templateId || "custom", base64Data, title);

    return NextResponse.json({ success: true, meme });
  } catch (error) {
    console.error("API Memes Save Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
