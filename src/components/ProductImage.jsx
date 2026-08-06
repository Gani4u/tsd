import React from "react";

const HUES = ["#FF4500", "#7C3AED", "#0EA5E9", "#22C55E", "#F59E0B", "#EC4899"];

function hash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ProductImage({ src, name = "TSD", className = "" }) {
  const backendURL = process.env.REACT_APP_BACKEND_URL || "";
  const imageSrc = src ? `${backendURL}/${src}` : null;

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={name}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  const hue = HUES[hash(name) % HUES.length];
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "TSD";
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} aria-label={name}>
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 25% 20%, ${hue}55, transparent 55%), radial-gradient(circle at 75% 80%, #FF450055, transparent 55%), linear-gradient(135deg, #0b0b0f, #1a1a22)`,
        }}
      />
      <div className="absolute inset-0 grain opacity-40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="font-display text-[64px] leading-none font-black tracking-tight opacity-90">{initials}</div>
        <div className="mt-2 label-caps opacity-70">TSD World</div>
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[10px] text-white/70">placeholder</div>
    </div>
  );
}
