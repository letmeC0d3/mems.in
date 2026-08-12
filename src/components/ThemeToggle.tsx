"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import styles from "../app/theme.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className={styles.themeToggleBtn}
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      id="theme-toggle-btn"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
