import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Bolt, Headphones, ShieldCheck, Flame, MapPin, Mail, Phone } from "lucide-react";
import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import OfferBannerSlider from "../components/OfferBannerSlider";

const HERO_IMG = "https://images.pexels.com/photos/6867267/pexels-photo-6867267.jpeg";
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
            <div className="chip w-fit"><Flame size={12} className="text-brand" /> New Drop · Winter '26</div>
            <h1 className="mt-4 sm:mt-5 font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[1.0] sm:leading-[0.95] tracking-tight">
              Sound.<br />
              <span className="text-brand">Signal.</span><br />
              Style.
            </h1>
            <p className="mt-4 sm:mt-6 muted text-base sm:text-lg max-w-lg leading-relaxed">
              Premium audio & personal tech, engineered for the loudest generation India has ever raised. No compromises. No filler.
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

          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-token surface shadow-card">
              <img
                src={HERO_IMG}
                alt="Featured product"
                className="absolute inset-0 h-full w-full object-cover animate-float"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 flex items-end justify-between">
                <div>
                  <div className="label-caps text-white/70">Flagship</div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-white">TSD Pulse Pro</div>
                </div>
                <div className="chip !bg-white/10 !border-white/20 !text-white backdrop-blur-md font-mono text-xs sm:text-sm">₹ 4,999</div>
              </div>
            </div>

            <div className="hidden md:flex absolute -bottom-6 -left-6 card p-4 gap-3 items-center shadow-card">
              <div className="h-10 w-10 rounded-full bg-brand/15 flex items-center justify-center"><Headphones size={18} className="text-brand" /></div>
              <div>
                <div className="text-xs muted">Now shipping</div>
                <div className="font-semibold text-sm">Pulse ANC · Studio</div>
              </div>
            </div>
          </div>
        </div>
        <div className="brand-underline h-[2px]" />
      </section>

      {/* MARQUEE STATS */}
      <section className="container-x py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {[
          { k: "50Hr", v: "Playtime" },
          { k: "0.05s", v: "Low latency" },
          { k: "IPX7", v: "Sweat & rain" },
          { k: "1M+", v: "Loud fans" },
        ].map((s) => (
          <div key={s.v} className="card p-4 sm:p-6">
            <div className="font-display text-2xl sm:text-3xl font-bold">{s.k}</div>
            <div className="label-caps muted mt-1 text-[9px] sm:text-[10px]">{s.v}</div>
          </div>
        ))}
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
              <a href="mailto:info@tsdworld.in" data-testid="contact-email-link" className="card p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-brand transition group">
                <span className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition shrink-0">
                  <Mail size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Email</div>
                  <div className="font-semibold text-sm sm:text-base truncate">info@tsdworld.in</div>
                </div>
                <ArrowRight size={16} className="muted group-hover:text-brand transition shrink-0" />
              </a>

              <a href="tel:+918660145698" data-testid="contact-phone-link" className="card p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-brand transition group">
                <span className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition shrink-0">
                  <Phone size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Phone / WhatsApp</div>
                  <div className="font-semibold text-sm sm:text-base truncate">+91 8660145698</div>
                </div>
                <ArrowRight size={16} className="muted group-hover:text-brand transition shrink-0" />
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Huded+Mahalaxmi+temple+Ilkal+Karnataka+587125"
                target="_blank" rel="noopener noreferrer"
                data-testid="contact-address-link"
                className="card p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-brand transition group"
              >
                <span className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition shrink-0">
                  <MapPin size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Studio · Karnataka</div>
                  <div className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2">Near Huded Mahalaxmi temple, Ilkal, 587125</div>
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
