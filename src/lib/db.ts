import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const SAVED_IMAGES_DIR = path.join(process.cwd(), "public", "saved");

export interface MemeData {
  id: string;
  templateId: string;
  imageUrl: string; // URL like /saved/xxx.png
  title: string;
  createdAt: string;
}

export interface ShortLinkData {
  id: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  reactionMemeId?: string; // e.g. success, facepalm, etc.
}

interface DatabaseSchema {
  memes: MemeData[];
  links: ShortLinkData[];
}

// Ensure database and directories exist
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(SAVED_IMAGES_DIR)) {
    fs.mkdirSync(SAVED_IMAGES_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      memes: [],
      links: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
  }
}

// Read database
function readDb(): DatabaseSchema {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading database:", error);
    return { memes: [], links: [] };
  }
}

// Write database
function writeDb(db: DatabaseSchema) {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// MEME OPERATIONS
export function saveMeme(memeId: string, templateId: string, base64Data: string, title: string): MemeData {
  initDb();
  
  // Clean base64 prefix if present
  const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Clean, "base64");
  
  // Write image file to public/saved/id.png
  const fileName = `${memeId}.png`;
  const filePath = path.join(SAVED_IMAGES_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  
  const imageUrl = `/saved/${fileName}`;
  const newMeme: MemeData = {
    id: memeId,
    templateId,
    imageUrl,
    title: title || "Funny Meme",
    createdAt: new Date().toISOString(),
  };
  
  const db = readDb();
  db.memes.push(newMeme);
  writeDb(db);
  
  return newMeme;
}

export function getMeme(id: string): MemeData | undefined {
  const db = readDb();
  return db.memes.find((m) => m.id === id);
}

// SHORT LINK OPERATIONS
export function saveShortLink(id: string, originalUrl: string, reactionMemeId?: string): ShortLinkData {
  let normalizedUrl = originalUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const newLink: ShortLinkData = {
    id,
    originalUrl: normalizedUrl,
    clicks: 0,
    createdAt: new Date().toISOString(),
    reactionMemeId: reactionMemeId || undefined,
  };

  const db = readDb();
  db.links.push(newLink);
  writeDb(db);

  return newLink;
}

export function getShortLink(id: string, incrementClick = false): ShortLinkData | undefined {
  const db = readDb();
  const linkIndex = db.links.findIndex((l) => l.id === id);
  
  if (linkIndex === -1) {
    return undefined;
  }
  
  if (incrementClick) {
    db.links[linkIndex].clicks += 1;
    writeDb(db);
  }
  
  return db.links[linkIndex];
}
