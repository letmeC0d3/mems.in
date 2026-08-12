import React from "react";
import Link from "next/link";
import styles from "../theme.module.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "About Us & Contact | mems.in",
  description: "Learn more about the purpose of mems.in and find contact information for support and inquiries.",
};

export default function AboutPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} id="about-logo" style={{ padding: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" style={{ display: "block" }}>
              <rect width="32" height="32" rx="8" fill="var(--foreground)" stroke="var(--card-border)" strokeWidth="1"/>
              <text x="16" y="18" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="var(--background)">m</text>
            </svg>
          </Link>
          <div className={styles.navActions}>
            <nav className={styles.navLinks} style={{ marginRight: "12px" }}>
              <Link href="/" className="btn btn-secondary" style={{ padding: "6px 16px" }}>
                Home
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={styles.container} style={{ maxWidth: "800px", gap: "20px" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "8px", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
          About Us & Contact
        </h1>

        <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px", lineHeight: "1.6", color: "var(--muted)" }}>
          <h2 style={{ color: "var(--foreground)", fontSize: "1.4rem" }}>Our Mission</h2>
          <p>
            Welcome to <strong>mems.in</strong>! We are dedicated to providing a fast, fun, and easy-to-use platform for the
            digital meme community. We understand that sharing memes is a core part of modern online conversation, and we want
            to make it as frictionless as possible.
          </p>
          <p>
            Our site combines a high-performance, mobile-optimized canvas-based <strong>online memes generator</strong> with a
            unique link shortener. By allowing creators to attach reaction meme splash overlays to their redirected URLs, we
            aim to make link sharing more engaging and entertaining.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.4rem", marginTop: "12px" }}>How It Works</h2>
          <p>
            1. <strong>Create</strong>: Select a trending template from our searchable database, or upload your own image. Type,
            customize, and drag your text boxes directly on the canvas.
            <br />
            2. <strong>Save & Shorten</strong>: Click generate, and we save the meme as a lightweight PNG, producing a short URL
            equipped with Server-Side Rendered (SSR) Open Graph tags for rich messaging card previews.
            <br />
            3. <strong>Custom Redirects</strong>: Paste any long URL, select a reaction meme like Success Kid or Big Brain, and share
            a custom redirect link that greets visitors with a reaction overlay during navigation.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.4rem", marginTop: "12px" }}>Contact Us</h2>
          <p>
            We love hearing feedback, template suggestions, feature requests, or security reports. Feel free to reach out to us at:
          </p>
          <div
            style={{
              background: "var(--muted-light)",
              padding: "20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--card-border)",
              marginTop: "4px",
              fontFamily: "var(--font-sans)",
            }}
          >
            <p style={{ fontWeight: 700, color: "var(--foreground)", marginBottom: "6px" }}>📧 Email Support</p>
            <p style={{ color: "var(--primary)", fontWeight: 600 }}>support@mems.in</p>
            <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
              We typically respond to all inquiries within 24 to 48 hours.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer} style={{ marginTop: "auto" }}>
        <div className={styles.footerContent}>
          <p>© 2026 mems.in • All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
