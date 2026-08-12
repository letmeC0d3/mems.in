import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getMeme } from "@/lib/db";
import styles from "../../theme.module.css";
import ClientShare from "./ClientShare";
import ThemeToggle from "@/components/ThemeToggle";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dynamic SEO metadata generation for crawlers
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const meme = getMeme(id);

  if (!meme) {
    return {
      title: "Meme Not Found | mems.in",
      description: "This meme could not be found on mems.in.",
    };
  }

  const titleText = `${meme.title} | Created on mems.in`;
  const descText = "Check out this funny meme. Generate your own memes and shorten links with reaction overlays on mems.in.";
  
  // Use the production domain since user owns mems.in
  const domain = "https://mems.in";
  const fullImageUrl = `${domain}${meme.imageUrl}`;

  return {
    title: titleText,
    description: descText,
    openGraph: {
      title: titleText,
      description: descText,
      type: "website",
      images: [
        {
          url: fullImageUrl,
          width: 800,
          height: 600,
          alt: meme.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [fullImageUrl],
    },
  };
}

export default async function MemePage({ params }: PageProps) {
  const { id } = await params;
  const meme = getMeme(id);

  if (!meme) {
    return (
      <div className={styles.redirectContainer} id="meme-not-found-page">
        <span style={{ fontSize: "4rem" }}>😢</span>
        <h1>Meme Not Found</h1>
        <p style={{ color: "var(--muted)" }}>
          The meme link you followed doesn&apos;t exist or has been removed.
        </p>
        <Link href="/" className="btn btn-primary" id="meme-404-home-btn">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} id="detail-nav-logo" style={{ padding: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" style={{ display: "block" }}>
              <rect width="32" height="32" rx="8" fill="var(--foreground)" stroke="var(--card-border)" strokeWidth="1"/>
              <text x="16" y="18" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="var(--background)">m</text>
            </svg>
          </Link>
          <div className={styles.navActions}>
            <nav className={styles.navLinks} style={{ marginRight: "12px" }}>
              <Link href="/" className="btn btn-secondary" style={{ padding: "6px 16px" }} id="detail-nav-create-btn">
                + Create Meme
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Showcase */}
      <main className={styles.container}>
        <div className={`${styles.shareContainer} fade-in`} id="meme-detail-container">
          <h1 className={styles.shareTitle}>{meme.title}</h1>
          
          <div className={styles.memeShowcase}>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
               src={meme.imageUrl}
               alt={meme.title}
               className={styles.showcaseImage}
               id="meme-detail-image"
             />
          </div>

          <div className="glass" style={{ padding: "28px" }}>
            <ClientShare memeId={meme.id} imageUrl={meme.imageUrl} title={meme.title} />
          </div>

          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <Link
              href="/"
              className="btn btn-primary"
              style={{ padding: "14px 32px", fontSize: "1.1rem" }}
              id="create-own-meme-cta"
            >
              🔥 Make Your Own Meme Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2026 mems.in • All Rights Reserved.</p>
          <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center", fontSize: "0.8rem" }}>
            <Link href="/about" style={{ textDecoration: "underline", color: "var(--primary)" }} id="detail-footer-link-about">About & Contact</Link>
            <Link href="/privacy" style={{ textDecoration: "underline", color: "var(--primary)" }} id="detail-footer-link-privacy">Privacy Policy</Link>
            <Link href="/terms" style={{ textDecoration: "underline", color: "var(--primary)" }} id="detail-footer-link-terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
