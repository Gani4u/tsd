import React, { useState } from "react";

const HUES = ["#00DFD8", "#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#EC4899"];

function hash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Resolves any image source (relative URL, absolute URL, data URL) to a valid full URL
 */
export function getResolvedImageUrl(src) {
  if (!src) return "";
  if (typeof src !== "string") return "";
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  const backendURL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
  const cleanSrc = trimmed.replace(/^\/+/, "");
  return backendURL ? `${backendURL}/${cleanSrc}` : `/${cleanSrc}`;
}

/**
 * Extracts and deduplicates all image URLs from a product object
 * Supports product.images (objects or strings), product.thumbnail, product.image, product.gallery
 */
export function getProductGallery(product) {
  if (!product) return [];
  const gallery = [];
  const seen = new Set();

  const add = (src) => {
    if (!src) return;
    let url = "";
    if (typeof src === "string") {
      url = src.trim();
    } else if (typeof src === "object") {
      url = (src.image_url || src.url || src.src || src.path || "").toString().trim();
    }
    if (url && !seen.has(url)) {
      seen.add(url);
      gallery.push(url);
    }
  };

  // Check product.thumbnail first
  if (product.thumbnail) {
    add(product.thumbnail);
  }

  // Check product.images array
  if (Array.isArray(product.images)) {
    const sortedImages = [...product.images].sort((a, b) => {
      const orderA = typeof a === "object" && a?.sort_order !== undefined ? Number(a.sort_order) : 0;
      const orderB = typeof b === "object" && b?.sort_order !== undefined ? Number(b.sort_order) : 0;
      return orderA - orderB;
    });

    sortedImages.forEach((img) => add(img));
  }

  // Check product.gallery array
  if (Array.isArray(product.gallery)) {
    product.gallery.forEach((img) => add(img));
  }

  // Check fallback single fields
  if (product.image) add(product.image);
  if (product.image_url) add(product.image_url);

  // If this is the earbud product and has no images or few images, provide the official poster asset
  const name = String(product.name || "").toLowerCase();
  if ((name.includes("earbud") || name.includes("tws") || String(product.id) === "22") && gallery.length === 0) {
    add("/hero-earbuds.jpg");
  }

  return gallery;
}

export default function ProductImage({ src, name = "TSD", className = "", alt, onClick }) {
  const [loadError, setLoadError] = useState(false);
  const imageSrc = getResolvedImageUrl(src);

  if (imageSrc && !loadError) {
    return (
      <img
        src={imageSrc}
        alt={alt || name}
        loading="lazy"
        onError={() => setLoadError(true)}
        onClick={onClick}
        className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
      />
    );
  }

  // Fallback for earbud product if image load fails
  const lowerName = String(name || "").toLowerCase();
  if (lowerName.includes("earbud") || lowerName.includes("tws")) {
    return (
      <img
        src="/hero-earbuds.jpg"
        alt={alt || name}
        loading="lazy"
        onClick={onClick}
        className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
      />
    );
  }

  const hue = HUES[hash(name) % HUES.length];
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "TSD";

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      aria-label={name}
      onClick={onClick}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 25% 20%, ${hue}40, transparent 55%), radial-gradient(circle at 75% 80%, rgba(0, 223, 216, 0.25), transparent 55%), linear-gradient(135deg, #090D16, #141B2D)`,
        }}
      />
      <div className="absolute inset-0 grain opacity-30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="font-display text-[44px] md:text-[54px] leading-none font-extrabold tracking-tight opacity-90">
          {initials}
        </div>
        <div className="mt-2 label-caps text-brand opacity-90">TSD World</div>
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[10px] text-white/40">TSD Audio</div>
    </div>
  );
}
