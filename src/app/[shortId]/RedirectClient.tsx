"use client";

import React, { useEffect, useState } from "react";
import styles from "../theme.module.css";

interface RedirectClientProps {
  targetUrl: string;
}

export default function RedirectClient({ targetUrl }: RedirectClientProps) {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirect after 2.2 seconds
    const timeout = setTimeout(() => {
      window.location.href = targetUrl;
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetUrl]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div className={styles.redirectProgress}>
        <div className={styles.progressBar} />
      </div>
      <p className={styles.redirectText}>
        Redirecting to <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{targetUrl}</span> in {countdown}s...
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
        Not redirecting? <a href={targetUrl} style={{ color: "var(--primary)", textDecoration: "underline" }} id="manual-redirect-link">click here</a>
      </p>
    </div>
  );
}
