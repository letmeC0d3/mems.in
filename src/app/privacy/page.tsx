import React from "react";
import Link from "next/link";
import styles from "../theme.module.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Privacy Policy | mems.in",
  description: "Read the Privacy Policy for mems.in to learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} id="privacy-logo" style={{ padding: 0 }}>
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
          Privacy Policy
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Last updated: August 6, 2026</p>

        <section style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px", lineHeight: "1.6", color: "var(--muted)" }}>
          <p>
            At mems.in, accessible from https://mems.in, one of our main priorities is the privacy of our
            visitors. This Privacy Policy document contains types of information that is collected and recorded
            by mems.in and how we use it.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>1. Log Files</h2>
          <p>
            mems.in follows a standard procedure of using log files. These files log visitors when they visit
            websites. The information collected by log files includes internet protocol (IP) addresses, browser type,
            Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
            These are not linked to any information that is personally identifiable. The purpose of the information is for
            analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic
            information.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>2. Cookies and Web Beacons</h2>
          <p>
            Like any other website, mems.in uses &apos;cookies&apos;. These cookies are used to store information including
            visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is
            used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type
            and/or other information.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>3. Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to
            our site visitors based upon their visit to https://mems.in and other sites on the internet. However, visitors may
            choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the
            following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "underline" }}>https://policies.google.com/technologies/ads</a>.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>4. Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense.
            Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access,
            we hyperlinked to their Privacy Policies above.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>5. Third Party Privacy Policies</h2>
          <p>
            mems.in&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to
            consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may
            include their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. To know more detailed information
            about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>6. Children&apos;s Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and
            guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            mems.in does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you
            think that your child provided this kind of information on our website, we strongly encourage you to contact us
            immediately and we will do our best efforts to promptly remove such information from our records.
          </p>

          <h2 style={{ color: "var(--foreground)", fontSize: "1.3rem", marginTop: "12px" }}>7. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
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
