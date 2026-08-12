import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getShortLink } from "@/lib/db";
import styles from "../theme.module.css";
import RedirectClient from "./RedirectClient";

interface RedirectPageProps {
  params: Promise<{ shortId: string }>;
}

const REACTION_MEME_IMAGES: Record<string, { name: string; url: string }> = {
  success: {
    name: "Success Kid",
    url: "https://api.imgflip.com/s/meme/Success-Kid.jpg",
  },
  facepalm: {
    name: "Epic Facepalm",
    url: "https://api.imgflip.com/s/meme/Sad-Pablo-Escobar.jpg",
  },
  thinking: {
    name: "Big Brain",
    url: "https://api.imgflip.com/s/meme/Roll-Safe-Think-About-It.jpg",
  },
  doge: {
    name: "Much Wow Doge",
    url: "https://api.imgflip.com/s/meme/Doge.jpg",
  },
};

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortId } = await params;
  
  // Fetch link and increment click count
  const link = getShortLink(shortId, true);

  if (!link) {
    return (
      <div className={styles.redirectContainer} id="shortid-404-page">
        <span style={{ fontSize: "4rem" }}>🔍</span>
        <h1>Link Not Found</h1>
        <p style={{ color: "var(--muted)" }}>
          The short link you clicked does not exist or has expired.
        </p>
        <Link href="/" className="btn btn-primary" id="shortid-404-home-btn">
          Go back to Home
        </Link>
      </div>
    );
  }

  // If a reaction meme was selected, show splash screen
  if (link.reactionMemeId && REACTION_MEME_IMAGES[link.reactionMemeId]) {
    const reaction = REACTION_MEME_IMAGES[link.reactionMemeId];

    return (
      <div className={styles.redirectContainer} id="reaction-splash-page">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Redirecting via mems.in...</h2>
          <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
            Reaction: {reaction.name}
          </span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reaction.url}
          alt={reaction.name}
          className={styles.redirectMeme}
          id="reaction-splash-image"
        />

        <RedirectClient targetUrl={link.originalUrl} />
      </div>
    );
  }

  // Otherwise, fast direct redirect
  redirect(link.originalUrl);
}
