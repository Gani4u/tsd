import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Bolt, ShieldCheck, Flame, MapPin, Mail } from "lucide-react";
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
        p.name?.toLowerCase().includes("wireless")
    ) || null;

  // 4 products in one line for handpicked
  const featuredList = products.slice(0, 4);
  const hasAny = featuredList.length > 0;

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden" id="hero">
        <div className="absolute -top-24 -right-24 h-[520px] w-[520px] rounded-full bg-brand/30 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-[120px] pointer-events-none" />
        <div className="container-x pt-10 sm:pt-14 md:pt-24 pb-12 sm:pb-16 md:pb-24 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 stagger">
            <div className="chip w-fit"><Flame size={12} className="text-brand" /> New Drop · Flagship Edition</div>
            <h1 className="mt-4 sm:mt-5 font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[1.0] sm:leading-[0.95] tracking-tight">
              Sound.<br />
              <span className="text-brand">Signal.</span><br />
              Style.
            </h1>
            <p className="mt-4 sm:mt-6 muted text-base sm:text-lg max-w-lg leading-relaxed">
              Premium audio & personal tech, engineered for the loudest generation India has ever raised. No compromises. No filler. <br /> <b>The World of trust service and durability.</b>
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/shop" className="btn-primary justify-center text-center" data-testid="hero-shop-btn">
                Shop the Range <ArrowRight size={16} />
              </Link>
              <a href="#featured" className="btn-ghost justify-center text-center" data-testid="hero-featured-btn">
                See Featured Drops
              </a>
            </div>
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm muted">
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-brand shrink-0" /> 1-yr warranty</div>
              <div className="flex items-center gap-2"><Bolt size={16} className="text-brand shrink-0" /> Fast delivery</div>
              <div className="flex items-center gap-2"><Cpu size={16} className="text-brand shrink-0" /> Made in India</div>
            </div>
          </div>

          {/* FLAGSHIP HERO PRODUCT CARD */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            <Link
              to={earbudProduct ? `/product/${earbudProduct.id}` : "/shop"}
              className="group block relative aspect-square rounded-3xl overflow-hidden border border-token surface shadow-2xl bg-black/80 transition-all duration-300 hover:border-brand/50 hover:shadow-glow"
            >
              <img
                src="/hero-earbuds.jpg"
                alt="TSD Tune Pods Flagship Earbuds"
                className="absolute inset-0 h-full w-full object-cover animate-float transition-transform duration-[1500] group-hover:scale-105"
              />
              {/* Subtle Studio Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

              {/* TOP CHIPS */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
                <span className="chip !bg-brand !border-transparent !text-white text-xs font-bold shadow-glow flex items-center gap-1">
                  <Flame size={12} /> FLAGSHIP
                </span>
                <span className="chip !bg-white/10 !border-white/20 !text-white text-xs font-mono backdrop-blur-md">
                  45Hr Battery
                </span>
              </div>

              {/* BOTTOM PRODUCT INFO */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between gap-3 z-10">
                <div className="min-w-0">
                  <div className="label-caps text-brand font-bold text-[10px] sm:text-xs tracking-wider">
                    Studio TWS Series
                  </div>
                  <div className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-tight mt-0.5 truncate">
                    TSD Tune Pods ANC
                  </div>
                </div>
                <div className="chip !bg-white/15 !border-white/30 !text-white backdrop-blur-md font-mono text-sm sm:text-base font-extrabold shrink-0 shadow-md">
                  {formatINR(earbudProduct?.price || 799)}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="brand-underline h-[2px]" />
      </section>

      {/* SLIDING FEATURED OFFERS / AUGUST 15 DROP CAROUSEL */}
      <OfferBannerSlider />

      {/* HANDPICKED / FEATURED PRODUCTS (4 in a line) */}
      <section className="container-x py-8 sm:py-14">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="label-caps text-brand">Handpicked</div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight mt-1">
              Top Picks For You.
            </h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold hover:text-brand">
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
      <section className="container-x py-10 sm:py-16 scroll-mt-20" id="contact" data-testid="contact-section">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-square max-w-xs sm:max-w-md mx-auto rounded-3xl overflow-hidden border border-token bg-white p-6 sm:p-8">
              <img src={LOGO_3D} alt="TSD World" className="h-full w-full object-contain" />
            </div>
            <div className="absolute -bottom-3 right-2 sm:right-8 chip !bg-brand !text-white !border-transparent shadow-glow text-xs">
              <MapPin size={12} /> Made in Karnataka
            </div>
          </div>
          <div>
            <div className="label-caps text-brand">Say hello</div>
            <h2 className="mt-2 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05]">
              Questions?<br />We're one message away.
            </h2>
            <p className="muted mt-4 text-sm sm:text-base max-w-lg leading-relaxed">
              Reach us for bulk orders, brand collabs, warranty claims or anything in between. Real humans, quick replies.
            </p>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <a href="mailto:support@tsdworld.in" data-testid="contact-email-link" className="card p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-brand transition group">
                <span className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition shrink-0">
                  <Mail size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Email</div>
                  <div className="font-semibold text-sm sm:text-base truncate">support@tsdworld.in</div>
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
      <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand/15 flex items-center justify-center">
        <Flame className="text-brand" />
      </div>
      <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold">The shelves are still warming up.</h3>
      <p className="muted mt-2 text-sm">New premium audio gear dropping soon. Stay tuned!</p>
    </div>
  );
}
