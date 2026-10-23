import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Tag, ShieldCheck, Zap, Headphones, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: "flagship-tws-drop",
    tag: "Studio Flagship Drop",
    tagIcon: Sparkles,
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    title: "Silence the Noise.",
    titleHighlight: "Feel Every Frequency.",
    description:
      "TSD Tune Pods ANC with 45-Hour monster battery, Bluetooth 5.3 low-latency, acoustic driver cutaway, and 4 custom studio colorways.",
    badge: "Save ₹699 Today",
    priceTag: "₹ 699",
    strikePrice: "₹ 1,398 (50% OFF)",
    ctaText: "Explore TWS Earbuds",
    ctaLink: "/shop",
    gradient:
      "radial-gradient(circle at 85% 15%, rgba(0, 223, 216, 0.35), transparent 45%), radial-gradient(circle at 15% 85%, rgba(99, 102, 241, 0.30), transparent 50%), linear-gradient(135deg, #090D16 0%, #111A2E 100%)",
  },
  {
    id: "hypercharge-power",
    tag: "Ultra-Fast Power Drop",
    tagIcon: Zap,
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    title: "80W Cables & 65W Adapters.",
    titleHighlight: "Flat 40% Off Fast Power.",
    description:
      "Superfast 80W / 65W braided Type-C cables and 65W Dual Port QC+PD fast chargers. Braided durability, zero overheating & lightning-fast speeds.",
    badge: "Save 40% Today",
    priceTag: "Starting ₹ 169",
    strikePrice: "₹ 282 (40% OFF)",
    ctaText: "Shop Cables & Adapters",
    ctaLink: "/shop",
    gradient:
      "radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.35), transparent 45%), radial-gradient(circle at 20% 80%, rgba(2, 132, 199, 0.25), transparent 50%), linear-gradient(135deg, #0D1117 0%, #171E2B 100%)",
  },
  {
    id: "wired-studio-earphones",
    tag: "Studio HD Audio Drop",
    tagIcon: Headphones,
    tagColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    title: "Zero Latency. Pure Bass.",
    titleHighlight: "Flat 30% Off Wired Series.",
    description:
      "Type-C & 3.5mm wired earphones with high-definition acoustics, crystal-clear mic, metallic chamber, and tangle-free braided cables.",
    badge: "Save 30% Today",
    priceTag: "Starting ₹ 149",
    strikePrice: "₹ 213 (30% OFF)",
    ctaText: "Shop Wired Earphones",
    ctaLink: "/shop",
    gradient:
      "radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.35), transparent 45%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.25), transparent 50%), linear-gradient(135deg, #070F1B 0%, #101B2E 100%)",
  },
  {
    id: "august-15-freedom",
    tag: "Exclusive Special Offer",
    tagIcon: Tag,
    tagColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    title: "Freedom to Vibe.",
    titleHighlight: "Upto 50% Savings Across Range.",
    description:
      "Celebrate uncompromising sound. Enjoy flat upto 50% savings applied directly on checkout with free all-India express delivery.",
    badge: "Limited Season Offer",
    priceTag: "Upto 50% Off",
    ctaText: "Shop Featured Range",
    ctaLink: "/shop",
    gradient:
      "radial-gradient(circle at 10% 20%, rgba(2, 132, 199, 0.35), transparent 45%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.25), transparent 50%), linear-gradient(135deg, #0B111E 0%, #162035 100%)",
  },
];

const bannerVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.98,
  }),
};

export default function OfferBannerSlider() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  const bannerCount = BANNERS.length;
  const currentIndex = ((page % bannerCount) + bannerCount) % bannerCount;
  const currentBanner = BANNERS[currentIndex];

  const paginate = useCallback(
    (newDirection) => {
      setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    },
    []
  );

  const jumpTo = (index) => {
    const diff = index - currentIndex;
    if (diff !== 0) {
      setPage(([prevPage]) => [prevPage + diff, diff > 0 ? 1 : -1]);
    }
  };

  // Auto-scroll every 6 seconds if not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, paginate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  const TagIcon = currentBanner.tagIcon;

  return (
    <section className="container-x py-6 md:py-10" aria-label="Special Offers">
      <div
        className="relative overflow-hidden rounded-3xl border border-token shadow-2xl min-h-[460px] sm:min-h-[440px] md:min-h-[420px] lg:min-h-[400px] select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 280, damping: 28 },
              opacity: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -50) paginate(1);
              else if (offset.x > 50) paginate(-1);
            }}
            style={{ background: currentBanner.gradient }}
            className="absolute inset-0 w-full h-full p-5 sm:p-7 md:p-10 pb-16 sm:pb-16 md:pb-12 flex flex-col justify-between"
          >
            {/* Grain Overlay */}
            <div className="absolute inset-0 grain opacity-40 pointer-events-none" />

            {/* TOP BAR */}
            <div className="relative z-10 flex items-center justify-between gap-2.5 flex-wrap">
              <span
                className={`chip border backdrop-blur-md font-semibold text-xs sm:text-sm flex items-center gap-1.5 py-1 px-3.5 ${currentBanner.tagColor}`}
              >
                <TagIcon size={14} />
                {currentBanner.tag}
              </span>

              <div className="flex items-center gap-2">
                <span className="chip !bg-white/10 !border-white/20 !text-white backdrop-blur-md font-mono text-xs font-bold">
                  {currentBanner.badge}
                </span>
                <span className="chip !bg-brand !border-transparent !text-brand-fg backdrop-blur-md font-bold text-xs shadow-glow">
                  {currentBanner.priceTag}
                </span>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 my-2 sm:my-auto max-w-2xl">
              <h3 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.08]">
                {currentBanner.title}{" "}
                <span className="text-brand block sm:inline">{currentBanner.titleHighlight}</span>
              </h3>
              <p className="mt-2.5 sm:mt-3 text-white/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
                {currentBanner.description}
              </p>
            </div>

            {/* BOTTOM BAR WITH ACTION BUTTON */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to={currentBanner.ctaLink}
                  className="btn-primary justify-center shadow-glow font-bold text-xs sm:text-sm py-2.5 px-5 sm:py-3 sm:px-6"
                >
                  {currentBanner.ctaText} <ArrowRight size={15} />
                </Link>
                {currentBanner.strikePrice && (
                  <div className="text-white/60 text-xs sm:text-sm font-semibold">
                    <span className="line-through">{currentBanner.strikePrice}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-white/70 text-[11px] sm:text-xs font-semibold">
                <ShieldCheck size={14} className="text-brand shrink-0" />
                <span>100% Genuine · 1-Year Official TSD Warranty</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* LEFT / RIGHT CONTROLS */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous Offer Slide"
            onClick={() => paginate(-1)}
            className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next Offer Slide"
            onClick={() => paginate(1)}
            className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* DOTS INDICATOR */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {BANNERS.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={banner.id}
                type="button"
                aria-label={`Jump to slide ${index + 1}`}
                onClick={() => jumpTo(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  isActive ? "w-8 bg-brand" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
