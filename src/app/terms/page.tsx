import React from "react";
import Link from "next/link";
import styles from "../theme.module.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Terms of Service | mems.in",
  description: "Read the Terms of Service for mems.in to learn about rules of use, content creation constraints, and disclaimers.",
};

export default function TermsOfServicePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} id="terms-logo" style={{ padding: 0 }}>
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
          Terms of Service
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Last updated: August 6, 2026</p>

        <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px", lineHeight: "1.6", color: "var(--muted)" }}>
          <p>
            Welcome to mems.in. By accessing and using this website, you agree to comply with and be bound by the following
            terms and conditions. If you do not agree with any part of these terms, please do not use our services.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>1. Acceptance of Terms</h2>
          <p>
            The services provided on mems.in are subject to these Terms of Service. We reserve the right to update or modify
            these terms at any time without notice. Your continued use of the website following any changes constitutes your
            acceptance of the new terms.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>2. Use of Services</h2>
          <p>
            You agree to use the Meme Maker and URL Shortener only for lawful purposes. You are solely responsible for any
            content (including images and text) that you upload, overlay, generate, or share using our services.
          </p>
          <p>
            You agree NOT to use the website to:
            <br />
            • Create or share content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene,
            or invasive of another&apos;s privacy.
            <br />
            • Upload or overlay copyrighted images unless you own the copyright or have express permission to use them.
            <br />
            • Generate link redirections intended for spamming, phishing, malware delivery, or misleading other users.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>3. Content Ownership and License</h2>
          <p>
            mems.in does not claim ownership of the text and images you upload or generate. However, by creating and sharing
            memes on our site, you grant mems.in a worldwide, non-exclusive, royalty-free license to store, serve, and display
            that content publicly on the sharing details pages to make sharing links functional.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>4. Termination of Use</h2>
          <p>
            We reserve the right, in our sole discretion, to terminate or restrict your access to all or part of our website,
            or delete saved memes and shortened links, without notice and for any reason, including violation of these Terms.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>5. Disclaimer of Warranties</h2>
          <p>
            mems.in is provided &apos;as is&apos; and &apos;as available&apos; without any warranty of any kind, either express or
            implied. We do not guarantee that the services will be uninterrupted, secure, or error-free.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>6. Limitation of Liability</h2>
          <p>
            In no event shall mems.in or its owners be liable for any direct, indirect, incidental, special, or consequential
            damages arising out of or in connection with your use or inability to use the services, even if advised of the
            possibility of such damages.
          </p>
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
