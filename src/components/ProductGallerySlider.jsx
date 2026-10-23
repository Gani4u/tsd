import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Tag, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage, { getProductGallery, getResolvedImageUrl } from "./ProductImage";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.96,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default function ProductGallerySlider({
  product,
  images: propImages,
  disabled = false,
  badgeText = "",
  className = "",
}) {
  const images = useMemo(() => {
    if (Array.isArray(propImages) && propImages.length > 0) {
      return propImages;
    }
    return getProductGallery(product);
  }, [propImages, product]);

  const imageCount = images.length;
  const [[page, direction], setPage] = useState([0, 0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailsRef = useRef(null);

  const currentIndex = imageCount > 0 ? ((page % imageCount) + imageCount) % imageCount : 0;

  const paginate = useCallback((newDirection) => {
    if (imageCount <= 1) return;
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, [imageCount]);

  const jumpTo = useCallback((targetIndex) => {
    if (imageCount <= 1) return;
    const diff = targetIndex - currentIndex;
    if (diff !== 0) {
      setPage(([prevPage]) => [prevPage + diff, diff > 0 ? 1 : -1]);
    }
  }, [currentIndex, imageCount]);

  // Auto-play slideshow logic
  useEffect(() => {
    if (!isAutoPlaying || isHovered || imageCount <= 1 || isLightboxOpen) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 3800);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, imageCount, isLightboxOpen, paginate]);

  // Keyboard navigation when Lightbox or focused
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) {
        if (e.key === "Escape") setIsLightboxOpen(false);
        if (e.key === "ArrowLeft") paginate(-1);
        if (e.key === "ArrowRight") paginate(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, paginate]);

  // Auto scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.children[currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  if (imageCount === 0) {
    return (
      <div className={`relative aspect-square rounded-3xl overflow-hidden border border-token surface ${className}`}>
        <ProductImage name={product?.name || "TSD"} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 sm:gap-4 select-none ${className}`} data-testid="product-gallery-slider">
      {/* MAIN HERO CAROUSEL */}
      <div
        className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-token surface group cursor-grab active:cursor-grabbing shadow-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.28 },
              scale: { duration: 0.28 },
            }}
            drag={imageCount > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold || offset.x < -50) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold || offset.x > 50) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <ProductImage
              src={images[currentIndex]}
              name={product?.name}
              alt={`${product?.name || "Product"} view ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* OVERLAYS & BADGES */}
        {disabled ? (
          <span className="absolute top-3 sm:top-4 left-3 sm:left-4 chip !bg-red-500/90 !text-white !border-transparent backdrop-blur-md z-20 font-semibold text-[11px] sm:text-xs shadow-md">
            Out of Stock
          </span>
        ) : badgeText ? (
          <span className="absolute top-3 sm:top-4 left-3 sm:left-4 chip !bg-brand !text-brand-fg !border-transparent backdrop-blur-md z-20 font-bold text-[11px] sm:text-xs shadow-glow">
            <Tag size={12} /> {badgeText}
          </span>
        ) : null}

        {/* TOP RIGHT ACTIONS (Zoom Lightbox & Auto-play) */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-20">
          {imageCount > 1 && (
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
              title={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${
                isAutoPlaying
                  ? "bg-brand text-brand-fg shadow-glow font-bold"
                  : "bg-black/45 hover:bg-black/70 text-white"
              }`}
            >
              {isAutoPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Enlarge image"
            title="Expand fullscreen view"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all transform hover:scale-105"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* FLOATING NAVIGATION ARROWS */}
        {imageCount > 1 && (
          <div className="absolute inset-y-0 inset-x-2 sm:inset-x-3 flex items-center justify-between pointer-events-none z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              aria-label="Previous slide"
              className="pointer-events-auto h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/50 hover:bg-brand text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg opacity-85 sm:opacity-90 sm:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              aria-label="Next slide"
              className="pointer-events-auto h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/50 hover:bg-brand text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg opacity-85 sm:opacity-90 sm:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* BOTTOM COUNTER & INDICATOR PILL */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex items-center justify-center gap-2 pointer-events-none z-20">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 pointer-events-auto shadow-lg">
              <span className="text-white text-[11px] sm:text-xs font-mono font-bold tracking-wider">
                {currentIndex + 1} <span className="opacity-50">/</span> {imageCount}
              </span>
              <div className="h-2.5 w-[1px] bg-white/20" />
              <div className="flex items-center gap-1 sm:gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => jumpTo(idx)}
                    aria-label={`Jump to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex
                        ? "w-4 sm:w-5 h-1.5 bg-brand shadow-glow"
                        : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* THUMBNAIL GALLERY STRIP */}
      {imageCount > 1 && (
        <div
          ref={thumbnailsRef}
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth"
        >
          {images.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => jumpTo(idx)}
                aria-label={`Select photo ${idx + 1}`}
                className={`relative flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 border-2 ${
                  isActive
                    ? "border-brand ring-2 ring-brand/40 scale-105 shadow-glow"
                    : "border-token opacity-70 hover:opacity-100 hover:border-brand/50"
                }`}
              >
                <ProductImage
                  src={img}
                  name={product?.name}
                  className="h-full w-full object-cover"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-brand/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-6 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div
              className="w-full flex items-center justify-between text-white z-30 pb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <h4 className="font-display font-bold text-base sm:text-xl truncate">
                  {product?.name || "Product Gallery"}
                </h4>
                <span className="chip !bg-white/10 !border-white/20 !text-white font-mono text-xs shrink-0">
                  {currentIndex + 1} / {imageCount}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0"
                aria-label="Close fullscreen"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Lightbox Stage */}
            <div
              className="relative w-full max-w-5xl h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.25 },
                  }}
                  className="w-full h-full flex items-center justify-center p-2"
                >
                  <img
                    src={getResolvedImageUrl(images[currentIndex])}
                    alt={`${product?.name} fullscreen view ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Lightbox Arrows */}
              {imageCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(-1);
                    }}
                    className="absolute left-1 sm:left-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/60 hover:bg-brand text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 shadow-2xl"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(1);
                    }}
                    className="absolute right-1 sm:right-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/60 hover:bg-brand text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 shadow-2xl"
                    aria-label="Next"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Lightbox Thumbnails */}
            {imageCount > 1 && (
              <div
                className="flex items-center gap-2 overflow-x-auto py-2 max-w-full no-scrollbar z-30"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => jumpTo(idx)}
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden transition border-2 flex-shrink-0 ${
                      idx === currentIndex
                        ? "border-brand scale-110 ring-2 ring-brand/50"
                        : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ProductImage src={img} name={product?.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
