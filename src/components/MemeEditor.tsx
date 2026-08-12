"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../app/theme.module.css";
import { MemeTemplate } from "./TemplateSelector";

interface MemeEditorProps {
  template: MemeTemplate;
  onGenerateSuccess: (memeUrl: string, shareId: string) => void;
}

interface TextLine {
  id: string;
  text: string;
  x: number; // absolute canvas pixels
  y: number; // absolute canvas pixels
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  bold: boolean;
  uppercase: boolean;
}

export default function MemeEditor({ template, onGenerateSuccess }: MemeEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textLines, setTextLines] = useState<TextLine[]>([]);
  const [activeLineId, setActiveLineId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [memeTitle, setMemeTitle] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragLineIdRef = useRef<string | null>(null);
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });

  // Sync state if template changes
  const [prevTemplateId, setPrevTemplateId] = useState(template.id);
  if (template.id !== prevTemplateId) {
    setPrevTemplateId(template.id);
    setImageLoaded(false);
  }

  // Initialize text lines when template changes
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);

      const canvas = canvasRef.current;
      if (canvas) {
        // Set canvas to natural dimensions of image
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        setCanvasHeight(canvas.height);

        // Default font size relative to template height
        const defaultFontSize = Math.round(canvas.height * 0.08);

        // Setup two default text boxes (Top and Bottom)
        const initialLines: TextLine[] = [
          {
            id: "top",
            text: "TOP TEXT",
            x: canvas.width / 2,
            y: canvas.height * 0.12,
            fontSize: defaultFontSize,
            color: "#ffffff",
            strokeColor: "#000000",
            strokeWidth: Math.max(2, Math.round(defaultFontSize / 12)),
            bold: true,
            uppercase: true,
          },
          {
            id: "bottom",
            text: "BOTTOM TEXT",
            x: canvas.width / 2,
            y: canvas.height * 0.88,
            fontSize: defaultFontSize,
            color: "#ffffff",
            strokeColor: "#000000",
            strokeWidth: Math.max(2, Math.round(defaultFontSize / 12)),
            bold: true,
            uppercase: true,
          },
        ];
        setTextLines(initialLines);
        setActiveLineId("top");
        setMemeTitle(template.name.replace(/\s+/g, " ") + " Meme");
      }
    };
    img.src = template.url;
  }, [template]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw text lines
    textLines.forEach((line) => {
      ctx.save();
      
      const txt = line.uppercase ? line.text.toUpperCase() : line.text;
      const fontStr = `${line.bold ? "bold" : "normal"} ${line.fontSize}px Impact, Arial, sans-serif`;
      ctx.font = fontStr;
      ctx.fillStyle = line.color;
      ctx.strokeStyle = line.strokeColor;
      ctx.lineWidth = line.strokeWidth;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw stroke first
      if (line.strokeWidth > 0) {
        ctx.strokeText(txt, line.x, line.y);
      }
      // Draw text
      ctx.fillText(txt, line.x, line.y);

      // Highlight active text box for dragging UI visual feedback
      if (line.id === activeLineId) {
        ctx.strokeStyle = "rgba(99, 102, 241, 0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        
        const metrics = ctx.measureText(txt);
        const textWidth = metrics.width + 20;
        const textHeight = line.fontSize + 10;
        
        ctx.strokeRect(
          line.x - textWidth / 2,
          line.y - textHeight / 2,
          textWidth,
          textHeight
        );
      }

      ctx.restore();
    });
  }, [textLines, imageLoaded, activeLineId]);

  // Draw canvas loop when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Helper to map mouse client coordinates to Canvas coordinates
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find which text box was clicked (search in reverse order so top elements are selected first)
    let foundLine: TextLine | null = null;
    
    for (let i = textLines.length - 1; i >= 0; i--) {
      const line = textLines[i];
      ctx.save();
      const fontStr = `${line.bold ? "bold" : "normal"} ${line.fontSize}px Impact, sans-serif`;
      ctx.font = fontStr;
      const metrics = ctx.measureText(line.uppercase ? line.text.toUpperCase() : line.text);
      ctx.restore();
      
      const width = metrics.width + 20;
      const height = line.fontSize + 10;
      
      const left = line.x - width / 2;
      const right = line.x + width / 2;
      const top = line.y - height / 2;
      const bottom = line.y + height / 2;
      
      if (x >= left && x <= right && y >= top && y <= bottom) {
        foundLine = line;
        break;
      }
    }

    if (foundLine) {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragLineIdRef.current = foundLine.id;
      setActiveLineId(foundLine.id);
      dragStartOffsetRef.current = {
        x: x - foundLine.x,
        y: y - foundLine.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !dragLineIdRef.current) return;
    
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const targetId = dragLineIdRef.current;
    const offset = dragStartOffsetRef.current;

    setTextLines((prev) =>
      prev.map((line) =>
        line.id === targetId
          ? {
              ...line,
              x: Math.round(x - offset.x),
              y: Math.round(y - offset.y),
            }
          : line
      )
    );
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    dragLineIdRef.current = null;
  };

  // Add custom text box
  const handleAddText = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const defaultFontSize = Math.round(canvas.height * 0.08);
    const newLineId = `line-${Date.now()}`;
    const newLine: TextLine = {
      id: newLineId,
      text: "NEW TEXT",
      x: canvas.width / 2,
      y: canvas.height / 2,
      fontSize: defaultFontSize,
      color: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: Math.max(2, Math.round(defaultFontSize / 12)),
      bold: true,
      uppercase: true,
    };

    setTextLines((prev) => [...prev, newLine]);
    setActiveLineId(newLineId);
  };

  // Delete active text box
  const handleDeleteText = (id: string) => {
    setTextLines((prev) => prev.filter((l) => l.id !== id));
    if (activeLineId === id) {
      setActiveLineId(textLines[0]?.id || "");
    }
  };

  // Update specific field of active text line
  const updateActiveLine = (updates: Partial<TextLine>) => {
    if (!activeLineId) return;
    setTextLines((prev) =>
      prev.map((line) => (line.id === activeLineId ? { ...line, ...updates } : line))
    );
  };

  // Call API to save generated meme
  const handleGenerateMeme = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isGenerating) return;

    setIsGenerating(true);
    
    // Hide active box border line in output image
    const tempActiveId = activeLineId;
    setActiveLineId(""); 
    
    // Tiny delay to allow canvas redraw without border box
    setTimeout(async () => {
      try {
        const base64Data = canvas.toDataURL("image/png");
        
        // Restore active border box state
        setActiveLineId(tempActiveId);

        const res = await fetch("/api/memes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: template.id,
            base64Data,
            title: memeTitle,
          }),
        });

        const data = await res.json();
        if (data.success && data.meme) {
          onGenerateSuccess(data.meme.imageUrl, data.meme.id);
        } else {
          alert(data.error || "Failed to generate meme.");
        }
      } catch (err) {
        console.error("Meme Generation failed:", err);
        alert("Failed to generate meme. Please ensure the template loaded correctly.");
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const activeLine = textLines.find((l) => l.id === activeLineId);

  return (
    <div className={styles.dashboardGrid}>
      {/* Canvas Panel */}
      <div className={`${styles.panel} glass`}>
        <h3 className={styles.panelTitle}>
          <span>🎨</span> Canvas Editor
        </h3>
        <div style={{ marginBottom: "12px", color: "var(--muted)", fontSize: "0.85rem" }}>
          💡 Drag texts directly on the canvas to reposition.
        </div>
        <div className={styles.canvasWrapper}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            id="meme-canvas"
          />
        </div>
      </div>

      {/* Editor Controls Panel */}
      <div className={`${styles.panel} glass`}>
        <h3 className={styles.panelTitle}>
          <span>⚙️</span> Controls
        </h3>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label htmlFor="meme-title-input">Meme Name / Title</label>
            <input
              id="meme-title-input"
              type="text"
              className="input"
              placeholder="e.g. Distracted Programmer"
              value={memeTitle}
              onChange={(e) => setMemeTitle(e.target.value)}
            />
          </div>

          <div style={{ borderBottom: "1px solid var(--card-border)", margin: "4px 0" }} />

          {/* Text Line Selection List */}
          <div className={styles.controlGroup}>
            <label>Text Boxes</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
              {textLines.map((line, idx) => (
                <div key={line.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    type="button"
                    className={`${styles.styleBtn} ${
                      activeLineId === line.id ? styles.styleBtnActive : ""
                    }`}
                    style={{ width: "auto", padding: "0 14px", fontSize: "0.85rem" }}
                    onClick={() => setActiveLineId(line.id)}
                    id={`select-line-${line.id}`}
                  >
                    #{idx + 1} {line.text.substring(0, 10) || "Empty"}
                  </button>
                  {textLines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteText(line.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--error)",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        padding: "0 4px",
                      }}
                      title="Delete Box"
                      id={`delete-line-${line.id}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "var(--radius-sm)" }}
                onClick={handleAddText}
                id="add-text-box-btn"
              >
                + Add Box
              </button>
            </div>
          </div>

          {activeLine && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "16px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--card-border)",
              }}
            >
              {/* Active text line fields */}
              <div className={styles.controlGroup}>
                <label htmlFor="active-text-input">Text Content</label>
                <input
                  id="active-text-input"
                  type="text"
                  className="input"
                  value={activeLine.text}
                  onChange={(e) => updateActiveLine({ text: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className={styles.controlGroup}>
                  <label htmlFor="active-font-size">Font Size ({activeLine.fontSize}px)</label>
                  <input
                    id="active-font-size"
                    type="range"
                    min="8"
                    max={Math.max(150, Math.round(canvasHeight * 0.35))}
                    value={activeLine.fontSize}
                    onChange={(e) => {
                      const fs = parseInt(e.target.value);
                      updateActiveLine({
                        fontSize: fs,
                        strokeWidth: Math.max(1, Math.round(fs / 12)),
                      });
                    }}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <label>Styling Options</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className={`${styles.styleBtn} ${activeLine.bold ? styles.styleBtnActive : ""}`}
                      onClick={() => updateActiveLine({ bold: !activeLine.bold })}
                      title="Bold"
                      id="text-bold-toggle"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      className={`${styles.styleBtn} ${activeLine.uppercase ? styles.styleBtnActive : ""}`}
                      onClick={() => updateActiveLine({ uppercase: !activeLine.uppercase })}
                      title="ALL CAPS"
                      id="text-caps-toggle"
                    >
                      aA
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className={styles.controlGroup}>
                  <label htmlFor="active-text-color">Fill Color</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      id="active-text-color"
                      type="color"
                      value={activeLine.color}
                      onChange={(e) => updateActiveLine({ color: e.target.value })}
                      style={{
                        border: "none",
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        background: "none",
                      }}
                    />
                    <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
                      {activeLine.color}
                    </span>
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <label htmlFor="active-stroke-color">Outline Color</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      id="active-stroke-color"
                      type="color"
                      value={activeLine.strokeColor}
                      onChange={(e) => updateActiveLine({ strokeColor: e.target.value })}
                      style={{
                        border: "none",
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        background: "none",
                      }}
                    />
                    <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
                      {activeLine.strokeColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "12px" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px 24px", fontSize: "1.1rem" }}
              onClick={handleGenerateMeme}
              disabled={isGenerating || !imageLoaded}
              id="generate-meme-btn"
            >
              {isGenerating ? "🚀 Generating Share Link..." : "🔥 Generate & Shorten Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
