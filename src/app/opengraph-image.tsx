import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Nexus Bio — Architecting Molecular Intelligence";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#05070A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Subtle glowing circular accents */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 229, 199, 0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124, 92, 255, 0.08) 0%, transparent 70%)",
          }}
        />

        {/* Centered Brand Mark */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <svg
            width="90"
            height="90"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="og-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00E5C7" />
                <stop offset="100%" stopColor="#7C5CFF" />
              </linearGradient>
            </defs>
            <path
              d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
              stroke="url(#og-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 8L23 12V20L16 24L9 20V12L16 8Z"
              fill="url(#og-grad)"
              fillOpacity="0.15"
              stroke="url(#og-grad)"
              strokeWidth="1"
            />
            <circle cx="16" cy="16" r="3" fill="#00E5C7" />
          </svg>
        </div>

        {/* Brand Text Heading */}
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#F4F6F5",
            letterSpacing: "-0.03em",
            display: "flex",
            alignItems: "center",
          }}
        >
          NEXUS<span style={{ color: "#00E5C7" }}>BIO</span>
        </div>

        {/* Clinical description tagline */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(244, 246, 245, 0.6)",
            marginTop: 14,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Architecting Molecular Intelligence
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
