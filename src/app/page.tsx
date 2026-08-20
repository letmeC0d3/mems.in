"use client";

import React, { useState } from "react";
import styles from "./theme.module.css";
import TemplateSelector, { MemeTemplate } from "../components/TemplateSelector";
import MemeEditor from "../components/MemeEditor";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

// Predefined Reaction Memes for the URL Shortener
export interface ReactionMeme {
  id: string;
  emoji: string;
  name: string;
  url: string;
  desc: string;
}

export const REACTION_MEMES: ReactionMeme[] = [
  {
    id: "none",
    emoji: "⚡",
    name: "Direct Redirect",
    url: "",
    desc: "Instant redirection (no splash screen).",
  },
  {
    id: "success",
    emoji: "🏆",
    name: "Success Kid",
    url: "https://api.imgflip.com/s/meme/Success-Kid.jpg",
    desc: "Show Success Kid while redirecting.",
  },
  {
    id: "facepalm",
    emoji: "🤦",
    name: "Epic Facepalm",
    url: "https://api.imgflip.com/s/meme/Sad-Pablo-Escobar.jpg",
    desc: "Show Sad Pablo Escobar (waiting...).",
  },
  {
    id: "thinking",
    emoji: "🤔",
    name: "Big Brain",
    url: "https://api.imgflip.com/s/meme/Roll-Safe-Think-About-It.jpg",
    desc: "Show Safe Roll (Think about it...).",
  },
  {
    id: "doge",
    emoji: "🐕",
    name: "Much Wow Doge",
    url: "https://api.imgflip.com/s/meme/Doge.jpg",
    desc: "Show classic Doge redirecting.",
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is this a completely free memes generator?",
    answer: "Yes, mems.in is a 100% free memes generator and online memes generator. You can use our pre-loaded trending templates, upload custom files, and customize text without paying a dime or dealing with watermarks.",
  },
  {
    question: "What is an ai memes generator and do you support it?",
    answer: "An ai memes generator uses artificial intelligence to create funny captions or generate custom template images from scratch. While our main tool is a high-performance canvas-based dank memes generator, we are currently designing ai memes generator capabilities to allow text-to-meme creations in future releases.",
  },
  {
    question: "Can I use this as a video memes generator or gif memes generator?",
    answer: "Our current editor is optimized as a static image funny memes generator. We have planned updates to support a gif memes generator and video memes generator, allowing users to upload short MP4 and GIF clips, overlay text, and download them.",
  },
  {
    question: "How does the random memes generator link shortener work?",
    answer: "We offer a unique memes generator + meme creator and link shortener in one! When shortening a link, you can attach a reaction meme. When a user clicks your shortened link, they will see a fun 2-second loading screen with the meme before redirecting to the target URL.",
  },
  {
    question: "Can I customize font styles, strokes, and outline colors?",
    answer: "Absolutely! Our online memes generator features draggable text positioning, custom font size adjustments, fill colors, outline stroke selections, uppercase filters, and bold settings to make your creation look exactly the way you want.",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"meme" | "shortener">("meme");
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Meme success result state
  const [generatedMeme, setGeneratedMeme] = useState<{
    url: string;
    shareId: string;
    shortUrl: string;
  } | null>(null);

  // Shortener form state
  const [targetUrl, setTargetUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [selectedReaction, setSelectedReaction] = useState("none");
  const [shortenResult, setShortenResult] = useState<string | null>(null);
  const [shortenError, setShortenError] = useState<string | null>(null);
  const [isShortening, setIsShortening] = useState(false);
  const [copied, setCopied] = useState(false);

  // Toggle FAQ accordion index
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Shortener Submit
  const handleShortenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsShortening(true);
    setShortenResult(null);
    setShortenError(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          customAlias: customAlias || undefined,
          reactionMemeId: selectedReaction !== "none" ? selectedReaction : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.shortLink) {
        const shortLinkVal = `${window.location.origin}/${data.shortLink.id}`;
        setShortenResult(shortLinkVal);
        setTargetUrl("");
        setCustomAlias("");
      } else {
        setShortenError(data.error || "Failed to shorten link.");
      }
    } catch (err) {
      console.error(err);
      setShortenError("Something went wrong. Please check your connection.");
    } finally {
      setIsShortening(false);
    }
  };

  const resetMemeCreator = () => {
    setSelectedTemplate(null);
    setGeneratedMeme(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header / Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.logo} id="navbar-logo" style={{ padding: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" style={{ display: "block" }}>
              <rect width="32" height="32" rx="8" fill="var(--foreground)" stroke="var(--card-border)" strokeWidth="1"/>
              <text x="16" y="18" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="var(--background)">m</text>
            </svg>
          </div>
          <div className={styles.navActions}>
            <nav className={styles.navLinks} style={{ marginRight: "12px", display: "flex", gap: "16px", alignItems: "center" }}>
              <a
                href="#"
                style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--foreground)" }}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("meme");
                }}
                id="nav-link-meme"
              >
                Meme Maker
              </a>
              <Link
                href="/templates"
                style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)" }}
                id="nav-link-templates"
              >
                Templates
              </Link>
            </nav>
            {/* Theme switcher toggle button */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle} id="main-hero-title">
            Dank Memes Generator
          </h1>
          <p className={styles.heroSubtitle}>
            mems.in is the ultimate free memes generator + meme creator and link shortener. 
            Create hilarious content with our online memes generator and attach reaction memes to shortened links.
          </p>
        </section>

        {/* Dynamic Tab Switcher */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === "meme" ? styles.tabButtonActive : ""}`}
              onClick={() => {
                setActiveTab("meme");
                setShortenResult(null);
              }}
              id="tab-btn-meme"
            >
              🎭 Memes Generator
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${
                activeTab === "shortener" ? styles.tabButtonActive : ""
              }`}
              onClick={() => {
                setActiveTab("shortener");
                setGeneratedMeme(null);
              }}
              id="tab-btn-shorten"
            >
              🔗 Link Shortener
            </button>
          </div>
        </div>

        {/* Tab Content A: Meme Maker */}
        {activeTab === "meme" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {generatedMeme ? (
              // Success Share screen (Sleek monochrome showing the meme itself)
              <div
                className={`${styles.shareContainer} fade-in`}
                id="meme-generation-success-card"
                style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
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

                <div className="glass" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className={styles.shareActions}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleCopyText(generatedMeme.shortUrl)}
                        id="copy-success-link-btn"
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
                    id="create-another-meme-btn"
                  >
                    ➕ Create Another Meme
                  </button>
                </div>
              </div>
            ) : !selectedTemplate ? (
              // Step 1: Select Template
              <div className={`glass ${styles.selectorContainer}`} id="template-selector-container">
                <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span>1️⃣</span> Choose a Meme Template
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
                  Select from popular templates or upload custom images to our **free memes generator**.
                </p>
                <TemplateSelector
                  selectedTemplateId={null}
                  onSelectTemplate={(template) => setSelectedTemplate(template)}
                />
              </div>
            ) : (
              // Step 2: Edit Meme
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} id="meme-editor-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedTemplate(null)}
                    id="back-to-templates-btn"
                  >
                    ← Back to Templates
                  </button>
                  <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>
                    Template: {selectedTemplate.name}
                  </span>
                </div>
                <MemeEditor
                  template={selectedTemplate}
                  onGenerateSuccess={(url, id) => {
                    const short = `${window.location.origin}/m/${id}`;
                    setGeneratedMeme({ url, shareId: id, shortUrl: short });
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab Content B: URL Shortener */}
        {activeTab === "shortener" && (
          <div
            className="fade-in glass"
            style={{ padding: "32px 20px", maxWidth: "700px", margin: "0 auto", width: "100%" }}
            id="url-shortener-card"
          >
            <h2 style={{ fontSize: "1.3rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>🔗</span> URL Shortener & Meme Creator
            </h2>

            {shortenResult ? (
              // Short link success display
              <div className={styles.resultContainer} id="shortener-success-result">
                <h3 className={styles.resultTitle}>⚡ Short URL Generated Successfully!</h3>
                <div className={styles.shareBox}>
                  <div className={styles.shortLink}>{shortenResult}</div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleCopyText(shortenResult)}
                    id="copy-short-link-btn"
                  >
                    {copied ? "Copied! ✓" : "Copy Link"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShortenResult(null)}
                    style={{ width: "100%" }}
                    id="shorten-another-link-btn"
                  >
                    Shorten Another Link
                  </button>
                </div>
              </div>
            ) : (
              // Shortener Form
              <form onSubmit={handleShortenSubmit} className={styles.shortenerForm}>
                {shortenError && (
                  <div
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid var(--error)",
                      borderRadius: "var(--radius-sm)",
                      padding: "12px 16px",
                      color: "var(--error)",
                      fontSize: "0.9rem",
                    }}
                    id="shortener-error-banner"
                  >
                    ⚠️ {shortenError}
                  </div>
                )}

                <div className={styles.controlGroup}>
                  <label htmlFor="destination-url-input">Destination URL</label>
                  <input
                    id="destination-url-input"
                    type="url"
                    required
                    className="input"
                    placeholder="https://example.com/very-long-link-to-shorten"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <label htmlFor="custom-alias-input">Custom Alias (Optional)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--muted)", fontWeight: 700, userSelect: "none", fontSize: "0.9rem" }}>
                      mems.in/
                    </span>
                    <input
                      id="custom-alias-input"
                      type="text"
                      className="input"
                      placeholder="e.g. secret-deal"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                    />
                  </div>
                </div>

                {/* Reaction Meme Selection */}
                <div className={styles.controlGroup}>
                  <label>Reaction Screen Overlay</label>
                  <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: "8px" }}>
                    Attach a funny reaction from our **random memes generator** selection to show before navigating.
                  </p>
                  <div className={styles.reactionGrid}>
                    {REACTION_MEMES.map((meme) => (
                      <div
                        key={meme.id}
                        className={`${styles.reactionCard} ${
                          selectedReaction === meme.id ? styles.reactionCardActive : ""
                        }`}
                        onClick={() => setSelectedReaction(meme.id)}
                        id={`reaction-option-${meme.id}`}
                      >
                        <span className={styles.reactionEmoji}>{meme.emoji}</span>
                        <span className={styles.reactionName}>{meme.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px 24px", fontSize: "1.1rem" }}
                    disabled={isShortening}
                    id="shorten-url-submit-btn"
                  >
                    {isShortening ? "🚀 Generating Short URL..." : "✨ Shorten URL"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Collapsible FAQ Section (Extremely High SEO Value) */}
        <section className={styles.faqSection} id="seo-faq-section">
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "8px" }}>Meme Generator & Redirect Creator FAQ</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Frequently asked questions about our **online memes generator** and custom redirect tools.
            </p>
          </div>

          <div className={styles.faqContainer}>
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`${styles.faqItem} glass`}>
                  <button
                    type="button"
                    className={styles.faqHeader}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    id={`faq-btn-${index}`}
                  >
                    <span className={styles.faqQuestion}>{item.question}</span>
                    <span
                      className={`${styles.faqChevron} ${
                        isOpen ? styles.faqChevronRotated : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`${styles.faqAnswer} ${
                      isOpen ? styles.faqAnswerExpanded : ""
                    }`}
                  >
                    <div className={styles.faqAnswerContent}>
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2026 mems.in • All Rights Reserved.</p>
          <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center", fontSize: "0.8rem" }}>
            <Link href="/templates" style={{ textDecoration: "underline", color: "var(--primary)" }} id="footer-link-templates">Templates Library</Link>
            <Link href="/about" style={{ textDecoration: "underline", color: "var(--primary)" }} id="footer-link-about">About & Contact</Link>
            <Link href="/privacy" style={{ textDecoration: "underline", color: "var(--primary)" }} id="footer-link-privacy">Privacy Policy</Link>
            <Link href="/terms" style={{ textDecoration: "underline", color: "var(--primary)" }} id="footer-link-terms">Terms of Service</Link>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "12px" }}>
            Developed as a premium, mobile-optimized **free memes generator** and link helper.
          </p>
        </div>
      </footer>

      {/* FAQ Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
              },
            })),
          }),
        }}
      />
      {/* WebApplication Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "mems.in Meme Generator",
            "operatingSystem": "All",
            "applicationCategory": "MultimediaApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD",
            },
            "description": "Create custom memes with templates, upload custom files, and shorten link URLs with reaction overlay screens.",
          }),
        }}
      />
    </div>
  );
}
