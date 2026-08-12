"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../app/theme.module.css";

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count?: number;
}

interface TemplateSelectorProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (template: MemeTemplate) => void;
}

// Fallback high-quality templates if the external API is unreachable
const FALLBACK_TEMPLATES: MemeTemplate[] = [
  {
    id: "181913649",
    name: "Drake Hotline Bling",
    url: "https://i.imgflip.com/30b1gx.jpg",
    width: 1200,
    height: 1200,
  },
  {
    id: "112126428",
    name: "Distracted Boyfriend",
    url: "https://i.imgflip.com/1ur9ql.jpg",
    width: 1200,
    height: 800,
  },
  {
    id: "87743020",
    name: "Two Buttons",
    url: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908,
  },
  {
    id: "129242436",
    name: "Change My Mind",
    url: "https://i.imgflip.com/24y43o.jpg",
    width: 482,
    height: 361,
  },
  {
    id: "61579",
    name: "One Does Not Simply",
    url: "https://i.imgflip.com/1bij.jpg",
    width: 568,
    height: 335,
  },
  {
    id: "101470",
    name: "Ancient Aliens",
    url: "https://i.imgflip.com/26am.jpg",
    width: 500,
    height: 437,
  },
];

export default function TemplateSelector({
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<MemeTemplate[]>(FALLBACK_TEMPLATES);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("https://api.imgflip.com/get_memes");
        const data = await res.json();
        if (data.success && data.data?.memes?.length > 0) {
          // Put standard templates first
          setTemplates(data.data.memes);
        }
      } catch (err) {
        console.warn("Failed to fetch templates from Imgflip, using local fallbacks.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // Create a custom template item
        const img = new Image();
        img.onload = () => {
          const customTemplate: MemeTemplate = {
            id: `custom-${Date.now()}`,
            name: `Custom Upload (${file.name})`,
            url: result,
            width: img.naturalWidth || 800,
            height: img.naturalHeight || 600,
          };
          onSelectTemplate(customTemplate);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        <input
          type="text"
          className="input"
          placeholder="🔍 Search templates (e.g. Drake, Boyfriend)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="template-search-input"
        />
      </div>

      <div className={styles.templateGrid}>
        {/* Upload Custom Template Card */}
        <div
          className={styles.uploadArea}
          onClick={() => fileInputRef.current?.click()}
          id="custom-template-upload"
        >
          <span style={{ fontSize: "2rem" }}>📤</span>
          <span style={{ fontWeight: 600, fontSize: "0.85rem", marginTop: "8px" }}>
            Upload Custom
          </span>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {loading ? (
          <div
            style={{
              gridColumn: "span 3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              color: "var(--muted)",
            }}
          >
            Loading templates...
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`${styles.templateCard} ${
                selectedTemplateId === template.id ? styles.templateCardActive : ""
              }`}
              onClick={() => onSelectTemplate(template)}
              id={`template-card-${template.id}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.url}
                alt={template.name}
                className={styles.templateImage}
                loading="lazy"
                crossOrigin="anonymous"
              />
              <div className={styles.templateName}>{template.name}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
