import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Apple touch icon generation using Edge runtime resvg
export default function AppleTouchIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 105,
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontWeight: 800,
          borderRadius: "40px",
          border: "4px solid #27272a",
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        m.
      </div>
    ),
    {
      ...size,
    }
  );
}
