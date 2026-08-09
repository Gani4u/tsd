import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage, { getProductGallery } from "./ProductImage";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function ProductCardSlider({ product, className = "" }) {
  const images = useMemo(() => getProductGallery(product), [product]);
  const [[page, direction], setPage] = useState([0, 0]);

  const imageCount = images.length;
  // Modulo index
  const currentIndex = ((page % imageCount) + imageCount) % imageCount;

  const paginate = (newDirection, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPage([page + newDirection, newDirection]);
  };

  const jumpTo = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const diff = index - currentIndex;
    if (diff !== 0) {
      setPage([page + diff, diff > 0 ? 1 : -1]);
    }
  };

  if (imageCount <= 1) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <ProductImage src={images[0] || product?.thumbnail} name={product?.name} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      data-testid="product-card-slider"
    >
      {/* Animated Image Slide */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 320, damping: 32 },
            opacity: { duration: 0.25 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
            <ProductImage
              src={images[currentIndex]}
              name={product?.name}
              alt={`${product?.name} - slide ${currentIndex + 1}`}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (visible on hover) */}
      <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={(e) => paginate(-1, e)}
          aria-label="Previous image"
          className="pointer-events-auto h-8 w-8 rounded-full bg-black/60 hover:bg-brand text-white backdrop-blur-md flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => paginate(1, e)}
          aria-label="Next image"
          className="pointer-events-auto h-8 w-8 rounded-full bg-black/60 hover:bg-brand text-white backdrop-blur-md flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Indicator Pill & Dots */}
      <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none z-10">
        <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-2 py-1 rounded-full pointer-events-auto">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => jumpTo(idx, e)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-4 h-1.5 bg-brand shadow-glow"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Photo Count Chip in Top Left on Hover */}
      <div className="absolute top-2.5 left-2.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <span className="chip !bg-black/60 !text-white !border-white/10 !text-[10px] !py-0.5 !px-2 backdrop-blur-md font-mono">
          {currentIndex + 1}/{imageCount}
        </span>
      </div>
    </div>
  );
}
