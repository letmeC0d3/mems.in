"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../../theme.module.css";
import MemeEditor from "@/components/MemeEditor";
import ThemeToggle from "@/components/ThemeToggle";
import { TemplateDetails } from "@/lib/templates";

interface TemplatePageClientProps {
  template: TemplateDetails;
}

export default function TemplatePageClient({ template }: TemplatePageClientProps) {
  const [generatedMeme, setGeneratedMeme] = useState<{
    url: string;
    shareId: string;
    shortUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetMemeCreator = () => {
    setGeneratedMeme(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} id="template-nav-logo" style={{ padding: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" style={{ display: "block" }}>
              <rect width="32" height="32" rx="8" fill="var(--foreground)" stroke="var(--card-border)" strokeWidth="1"/>
              <text x="16" y="18" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="var(--background)">m</text>
            </svg>
          </Link>
          <div className={styles.navActions}>
            <nav className={styles.navLinks} style={{ marginRight: "12px" }}>
              <Link href="/templates" className="btn btn-secondary" style={{ padding: "6px 16px" }} id="template-nav-home-btn">
                All Templates
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
            <Link href="/" style={{ textDecoration: "underline" }}>Home</Link> &gt; <span>Templates</span> &gt; <span style={{ color: "var(--primary)" }}>{template.name}</span>
          </div>
          <h1 style={{ fontSize: "2rem", marginTop: "4px" }} id="template-page-title">
            {template.name} Meme Generator
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Customize the {template.name} template online for free. Drag text boxes, style colors, and share.
          </p>
        </div>

        {/* Dynamic Editor / Success Block */}
        <div style={{ marginTop: "12px" }}>
          {generatedMeme ? (
            // Success Share screen (Sleek monochrome showing the meme itself)
            <div
              className={`${styles.shareContainer} fade-in`}
              id="template-generation-success"
              style={{ width: "100%", maxWidth: "600px", margin: "0 auto", padding: 0 }}
            >
              <div className={styles.memeShowcase}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedMeme.url}
                  alt="Created Meme"
                  className={styles.showcaseImage}
                  id="success-meme-image"
                />
              </div>

              <div className="glass" style={{ padding: "24px", marginTop: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className={styles.shareActions}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleCopyText(generatedMeme.shortUrl)}
                      id="copy-template-success-link"
                    >
                      {copied ? "Copied! ✓" : "🔗 Copy Share Link"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={async () => {
                        try {
                          const response = await fetch(generatedMeme.url);
                          const blob = await response.blob();
                          const blobUrl = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = blobUrl;
                          link.download = `${generatedMeme.shareId}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(blobUrl);
                        } catch (error) {
                          console.error("Failed to download image:", error);
                          window.open(generatedMeme.url, "_blank");
                        }
                      }}
                      id="download-success-btn"
                    >
                      💾 Download PNG
                    </button>
                  </div>

                  <div style={{ borderBottom: "1px solid var(--card-border)", margin: "4px 0" }} />

                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "10px" }}>
                      Share this meme with friends
                    </p>
                    <div className={styles.shareIconList}>
                      <button
                        type="button"
                        className={styles.shareIconBtn}
                        onClick={() => {
                          const text = encodeURIComponent(`Check out this funny meme created on mems.in!`);
                          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(generatedMeme.shortUrl)}&text=${text}`, "_blank");
                        }}
                        title="Share on X (Twitter)"
                        id="share-twitter-btn"
                      >
                        𝕏
                      </button>
                      <button
                        type="button"
                        className={styles.shareIconBtn}
                        onClick={() => {
                          const text = encodeURIComponent(`Check out this meme: ${generatedMeme.shortUrl}`);
                          window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                        }}
                        title="Share on WhatsApp"
                        id="share-whatsapp-btn"
                      >
                        💬
                      </button>
                      <button
                        type="button"
                        className={styles.shareIconBtn}
                        onClick={() => {
                          const text = encodeURIComponent(`Check out this meme: ${generatedMeme.shortUrl}`);
                          window.open(`sms:?body=${text}`, "_blank");
                        }}
                        title="Share via SMS"
                        id="share-sms-btn"
                      >
                        📱
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px", justifyContent: "center" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "12px" }}
                  onClick={resetMemeCreator}
                  id="edit-again-btn"
                >
                  ➕ Create Another Meme
                </button>
              </div>
            </div>
          ) : (
            <MemeEditor
              template={template}
              onGenerateSuccess={(url, id) => {
                const short = `${window.location.origin}/m/${id}`;
                setGeneratedMeme({ url, shareId: id, shortUrl: short });
              }}
            />
          )}
        </div>

        {/* Description & Origin info section (Targeting keyword details) */}
        <section
          className="glass"
          style={{
            marginTop: "32px",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          id="template-seo-info"
        >
          <h2 style={{ fontSize: "1.4rem", color: "var(--foreground)" }}>
            About the {template.name} Meme Template
          </h2>
          <div>
            <h3 style={{ fontSize: "1rem", color: "var(--primary)", marginBottom: "4px" }}>🎬 Meme Origin</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>{template.origin}</p>
          </div>
          <div style={{ borderBottom: "1px solid var(--card-border)", margin: "4px 0" }} />
          <div>
            <h3 style={{ fontSize: "1rem", color: "var(--secondary)", marginBottom: "4px" }}>💡 How to use the generator</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>{template.description}</p>
          </div>
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
