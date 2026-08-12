"use client";

import React, { useState } from "react";
import styles from "../../theme.module.css";

interface ClientShareProps {
  memeId: string;
  imageUrl: string;
  title: string;
}

export default function ClientShare({ memeId, imageUrl, title }: ClientShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Check out this funny meme: "${title}" created on mems.in!`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`, "_blank");
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this meme: "${title}" - ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleSmsShare = () => {
    const text = encodeURIComponent(`Check out this meme: "${title}" - ${shareUrl}`);
    window.open(`sms:?body=${text}`, "_blank");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${memeId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
      // Fallback direct link
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className={styles.shareActions}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCopy}
          id="detail-copy-link-btn"
        >
          {copied ? "Copied! ✓" : "🔗 Copy Share Link"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownload}
          id="detail-download-btn"
        >
          💾 Download PNG
        </button>
      </div>

      <div style={{ borderBottom: "1px solid var(--card-border)", margin: "8px 0" }} />

      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
          Share this meme with friends
        </p>
        <div className={styles.shareIconList}>
          <button
            type="button"
            className={styles.shareIconBtn}
            onClick={handleTwitterShare}
            title="Share on X (Twitter)"
            id="share-twitter-btn"
          >
            𝕏
          </button>
          <button
            type="button"
            className={styles.shareIconBtn}
            onClick={handleWhatsAppShare}
            title="Share on WhatsApp"
            id="share-whatsapp-btn"
          >
            💬
          </button>
          <button
            type="button"
            className={styles.shareIconBtn}
            onClick={handleSmsShare}
            title="Share via SMS"
            id="share-sms-btn"
          >
            📱
          </button>
        </div>
      </div>
    </div>
  );
}
