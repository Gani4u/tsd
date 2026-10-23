import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Bolt, ShieldCheck, Flame, MapPin, Mail, Volume2, BatteryCharging, Radio } from "lucide-react";
import { getProducts, formatINR } from "../lib/api";
import ProductCard from "../components/ProductCard";
import OfferBannerSlider from "../components/OfferBannerSlider";

const LOGO_3D = "https://customer-assets-agu9un31.emergentagent.net/job_tsd-electronics-mvp/artifacts/2offqlgo_WhatsApp%20Image%202026-07-28%20at%2010.16.23%20PM.jpeg";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Find TSD Earbuds product or fallback to ID 22
  const earbudProduct =
    products.find(
      (p) =>
        String(p.id) === "22" ||
        p.name?.toLowerCase().includes("earbud") ||
        p.name?.toLowerCase().includes("wireless") ||
        p.name?.toLowerCase().includes("tws")
    ) || null;

  // 4 products in one line for handpicked
  const featuredList = products.slice(0, 4);
  const hasAny = featuredList.length > 0;

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden" id="hero">
        {/* Subtle studio ambient lighting */}
        <div className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-brand/12 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 h-[460px] w-[460px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

        <div className="container-x pt-10 sm:pt-14 md:pt-22 pb-12 sm:pb-16 md:pb-22 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and Value Props */}
          <div className="lg:col-span-6 stagger">
            <div className="chip w-fit">
              <Flame size={12} className="text-brand fill-brand" />
              <span>New Drop · Flagship Edition</span>
            </div>

            <h1 className="mt-4 sm:mt-5 font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-[1.0] sm:leading-[0.96] tracking-tight">
              Sound.<br />
              <span className="text-brand">Signal.</span><br />
              Style.
            </h1>

            <p className="mt-4 sm:mt-6 muted text-base sm:text-lg max-w-lg leading-relaxed font-normal">
              Premium audio & personal tech, engineered for precision sound, deep acoustic bass, and all-day endurance. No compromises. No filler.
              <br />
              <strong className="font-semibold text-foreground/90">The World of trust service and durability.</strong>
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/shop" className="btn-primary justify-center text-center shadow-glow" data-testid="hero-shop-btn">
                Shop the Range <ArrowRight size={16} />
              </Link>
              <a href="#featured" className="btn-ghost justify-center text-center" data-testid="hero-featured-btn">
                See Featured Drops
              </a>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm muted">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand shrink-0" />
                <span>1-yr warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Bolt size={16} className="text-brand shrink-0" />
                <span>Fast delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-brand shrink-0" />
                <span>Made in India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Studio Flagship Earbuds Showcase */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            <Link
              to={earbudProduct ? `/product/${earbudProduct.id}` : "/shop"}
              className="group block relative aspect-square rounded-3xl overflow-hidden border border-token surface shadow-2xl bg-black/90 transition-all duration-300 hover:border-brand/50 hover:shadow-glow"
              title="View TSD Tune Pods Flagship Earbuds"
            >
              <img
                src="/hero-earbuds.jpg"
                alt="TSD Tune Pods Flagship TWS Earbuds"
                className="absolute inset-0 h-full w-full object-cover animate-float transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Studio Lighting Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10 pointer-events-none">
                <span className="chip !bg-brand !border-transparent !text-brand-fg text-xs font-bold shadow-glow flex items-center gap-1.5 px-3 py-1">
                  <Flame size={12} className="fill-current" /> FLAGSHIP
                </span>
                <span className="chip !bg-white/10 !border-white/20 !text-white text-xs font-mono backdrop-blur-md">
                  45Hr Battery
                </span>
              </div>

              {/* Bottom Product Info */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between gap-3 z-10 pointer-events-none">
                <div className="min-w-0">
                  <div className="label-caps text-brand font-bold text-[10px] sm:text-xs tracking-wider">
                    Studio TWS Series
                  </div>
                  <div className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-tight mt-0.5 truncate">
                    TSD Tune Pods ANC
                  </div>
                </div>
                <div className="chip !bg-white/15 !border-white/30 !text-white backdrop-blur-md font-mono text-sm sm:text-base font-extrabold shrink-0 shadow-md">
                  {formatINR(earbudProduct?.price || 699)}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Feature Specs Pillars Strip */}
        <div className="border-y border-token surface-subtle py-5 sm:py-6">
          <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                <Volume2 size={18} />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">Acoustic Drivers</div>
                <div className="text-[11px] muted">Deep bass & crystal sound</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                <BatteryCharging size={18} />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">45-Hour Playtime</div>
                <div className="text-[11px] muted">Fast Type-C charge case</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                <Radio size={18} />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">Bluetooth 5.3</div>
                <div className="text-[11px] muted">Instant low-latency pairing</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">Ergonomic Fit</div>
                <div className="text-[11px] muted">Lightweight workout seal</div>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-underline h-[1px]" />
      </section>

      {/* SLIDING FEATURED OFFERS CAROUSEL */}
      <OfferBannerSlider />

      {/* HANDPICKED / FEATURED PRODUCTS (4 in a line) */}
      <section className="container-x py-10 sm:py-16" id="featured">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="label-caps text-brand">Handpicked Catalogue</div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight mt-1">
              Top Picks For You.
            </h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-brand transition">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] card animate-pulse" />)}
          </div>
        ) : hasAny ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 stagger">
            {featuredList.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* CONTACT / SAY HELLO SECTION */}
      <section className="container-x py-12 sm:py-20 scroll-mt-20" id="contact" data-testid="contact-section">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-square max-w-xs sm:max-w-md mx-auto rounded-3xl overflow-hidden border border-token bg-white p-6 sm:p-8 shadow-card">
              <img src={LOGO_3D} alt="TSD World" className="h-full w-full object-contain" />
            </div>
            <div className="absolute -bottom-3 right-2 sm:right-8 chip !bg-brand !text-brand-fg !border-transparent shadow-glow text-xs font-bold">
              <MapPin size={12} className="shrink-0" /> Made in Karnataka
            </div>
          </div>
          <div>
            <div className="label-caps text-brand">Say Hello</div>
            <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05]">
              Questions?<br />We're one message away.
            </h2>
            <p className="muted mt-4 text-sm sm:text-base max-w-lg leading-relaxed">
              Reach us for bulk orders, brand partnerships, warranty claims, or sound advice. Real team, quick replies.
            </p>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <a href="mailto:support@tsdworld.in" data-testid="contact-email-link" className="card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-brand transition group">
                <span className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-brand-fg transition shrink-0">
                  <Mail size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Customer Support Email</div>
                  <div className="font-semibold text-sm sm:text-base truncate mt-0.5">support@tsdworld.in</div>
                </div>
                <ArrowRight size={16} className="muted group-hover:text-brand transition shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card p-8 sm:p-14 text-center">
      <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
        <Flame className="text-brand" />
      </div>
      <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold">The shelves are warming up.</h3>
      <p className="muted mt-2 text-sm">New premium audio drops arriving soon. Stay tuned!</p>
    </div>
  );
}
