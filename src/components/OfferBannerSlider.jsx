import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Tag, ShieldCheck, Flame, Zap, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: "august-15-freedom",
    tag: "🇮🇳 August 15 Independence Special",
    tagIcon: Tag,
    tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    title: "Freedom to Vibe.",
    titleHighlight: "Special upto 50% Savings.",
    description:
      "Celebrate India's Independence Day with uncompromised sound. Enjoy flat upto 50% savings applied directly on checkout with free all-India express delivery.",
    badge: "Limited Festive Offer",
    priceTag: "Flat upto 50% Off",
    ctaText: "Shop Independence Drop",
    ctaLink: "/shop",
    gradient:
      "radial-gradient(circle at 10% 20%, rgba(255, 107, 0, 0.45), transparent 45%), radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.35), transparent 50%), linear-gradient(135deg, #0b0c10 0%, #151720 100%)",
  },
  {
    id: "pulse-pro-anc",
    tag: "Studio Flagship Drop",
    tagIcon: Flame,
    tagColor: "bg-brand/20 text-brand border-brand/30",
    title: "Silence the Noise.",
    titleHighlight: "Feel Every Beat.",
    description:
      "TWS Earbuds with ENC, 50-Hour monster battery life, and ultra-low latency in gaming mode.",
    badge: "Save ₹700 Today",
    priceTag: "₹ 799",
    strikePrice: "₹ 1,499 (47% OFF)",
    ctaText: "Explore TWS Earbuds",
    ctaLink: "/shop",
    gradient:
      "radial-gradient(circle at 85% 15%, rgba(255, 69, 0, 0.4), transparent 45%), radial-gradient(circle at 15% 85%, rgba(147, 51, 234, 0.35), transparent 50%), linear-gradient(135deg, #090a0f 0%, #161524 100%)",
  },
  {
    id: "hypercharge-power",
    tag: "⚡ Ultra-Fast Power Drop",
    tagIcon: Zap,
    tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
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
      "radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.45), transparent 45%), radial-gradient(circle at 20% 80%, rgba(234, 179, 8, 0.35), transparent 50%), linear-gradient(135deg, #100b05 0%, #1a1207 100%)",
  },
  {
    id: "wired-studio-earphones",
    tag: "🎧 Studio HD Audio Drop",
    tagIcon: Headphones,
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
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
      "radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.45), transparent 45%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.35), transparent 50%), linear-gradient(135deg, #070d17 0%, #0d1a2d 100%)",
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

  const paginate = useCallback((newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const jumpTo = (index) => {
    const diff = index - currentIndex;
    if (diff !== 0) {
      setPage(([prevPage]) => [prevPage + diff, diff > 0 ? 1 : -1]);
    }
  };

  // Auto slide every 5.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5500);
    return () => clearInterval(timer);
  }, [isHovered, paginate]);

  const TagIcon = currentBanner.tagIcon;

  return (
    <section
      id="featured"
      className="container-x py-6 sm:py-10"
      aria-label="Offers and Featured Drops"
    >
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <div className="label-caps text-brand flex items-center gap-1.5">
            <Tag size={12} /> Exclusive Offers & Drops
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight mt-1">
            Featured Specials.
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous banner"
            className="h-9 w-9 rounded-full border border-token flex items-center justify-center hover:border-brand hover:text-brand transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next banner"
            className="h-9 w-9 rounded-full border border-token flex items-center justify-center hover:border-brand hover:text-brand transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* BANNER STAGE - Spacious height so buttons never get cut off */}
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
                <span className="chip !bg-brand !border-transparent !text-white backdrop-blur-md font-bold text-xs shadow-glow">
                  {currentBanner.priceTag}
                </span>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 my-2 sm:my-auto max-w-2xl">
              <h3 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.08]">
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

        {/* FLOATING PREV/NEXT BUTTONS */}
        <div className="absolute inset-y-0 inset-x-2 sm:inset-x-4 flex items-center justify-between pointer-events-none z-20">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
            className="pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/55 hover:bg-brand text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next slide"
            className="pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/55 hover:bg-brand text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all transform active:scale-95 sm:hover:scale-110 shadow-lg"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* BOTTOM PAGINATION INDICATOR PILLS */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 pointer-events-auto shadow-md">
            {BANNERS.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                onClick={() => jumpTo(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-5 sm:w-7 h-1.5 sm:h-2 bg-brand shadow-glow"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
