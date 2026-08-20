import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import styles from "../theme.module.css";
import ThemeToggle from "@/components/ThemeToggle";
import { PROGRAMMATIC_TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Meme Templates Library & Online Generator - mems.in",
  description: "Browse and select from our complete collection of trending and classic meme templates. Create custom memes online for free with no watermarks.",
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: "Meme Templates Library & Online Generator - mems.in",
    description: "Browse and select from our complete collection of trending and classic meme templates. Create custom memes online for free with no watermarks.",
    url: "https://mems.in/templates",
    siteName: "mems.in",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meme Templates Library - mems.in",
    description: "Browse and select from our complete collection of trending and classic meme templates.",
  },
};

export default function TemplatesDirectoryPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} id="templates-dir-logo" style={{ padding: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" style={{ display: "block" }}>
              <rect width="32" height="32" rx="8" fill="var(--foreground)" stroke="var(--card-border)" strokeWidth="1"/>
              <text x="16" y="18" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="var(--background)">m</text>
            </svg>
          </Link>
          <div className={styles.navActions}>
            <nav className={styles.navLinks} style={{ marginRight: "12px" }}>
              <Link href="/" className="btn btn-secondary" style={{ padding: "6px 16px" }} id="templates-nav-home-btn">
                Meme Maker
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.container}>
        {/* Breadcrumb / Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            <Link href="/" style={{ textDecoration: "underline" }}>Home</Link> &gt; <span style={{ color: "var(--primary)" }}>Templates</span>
          </div>
          <h1 style={{ fontSize: "2.2rem", marginTop: "4px" }} id="templates-dir-title">
            Popular Meme Templates
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "700px" }}>
            Select any trending meme template from our library below to open the custom online editor. Customize captions, colors, and layout instantly without watermarks.
          </p>
        </div>

        {/* Templates Grid catalog */}
        <div className={`glass ${styles.selectorContainer}`} style={{ marginTop: "16px" }} id="templates-grid-card">
          <div className={styles.templateGrid} style={{ maxHeight: "none", overflow: "visible" }}>
            {PROGRAMMATIC_TEMPLATES.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.slug}`}
                className={styles.templateCard}
                id={`template-card-${template.id}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.url}
                  alt={`${template.name} Meme Template`}
                  className={styles.templateImage}
                  loading="lazy"
                  crossOrigin="anonymous"
                />
                <div className={styles.templateName}>{template.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Information Section */}
        <section
          className="glass"
          style={{
            marginTop: "32px",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          id="templates-seo-guide"
        >
          <h2 style={{ fontSize: "1.4rem", color: "var(--foreground)" }}>
            How to use these Meme Templates
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Our online meme generator lets you customize classic templates such as <strong>Drake Hotline Bling</strong>, <strong>Distracted Boyfriend</strong>, <strong>UNO Draw 25</strong>, and more. 
            Simply click on any template to open it in the editor. You can add new text fields, adjust sizes, toggle bold styles, swap stroke colors, and drag captions directly on the image canvas.
          </p>
          <div style={{ borderBottom: "1px solid var(--card-border)", margin: "4px 0" }} />
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Once you generate a meme, you will get a high-quality watermark-free PNG download and a short URL to share with friends, featuring custom reaction screens.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2026 mems.in • All Rights Reserved.</p>
          <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center", fontSize: "0.8rem" }}>
            <Link href="/about" style={{ textDecoration: "underline", color: "var(--primary)" }}>About & Contact</Link>
            <Link href="/privacy" style={{ textDecoration: "underline", color: "var(--primary)" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ textDecoration: "underline", color: "var(--primary)" }}>Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
