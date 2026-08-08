import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Bolt, Headphones, ShieldCheck, Sparkles, MapPin, Mail, Phone } from "lucide-react";
import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

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

  const featuredList = products.slice(0, 6);
  const hasAny = featuredList.length > 0;

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-[520px] w-[520px] rounded-full bg-brand/30 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-[120px] pointer-events-none" />
        <div className="container-x pt-14 md:pt-24 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 stagger">
            <div className="chip w-fit"><Sparkles size={12} className="text-brand" /> New Drop · Winter '26</div>
            <h1 className="mt-5 font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Sound.<br />
              <span className="text-brand">Signal.</span><br />
              Style.
            </h1>
            <p className="mt-6 muted text-lg max-w-lg">
              Premium audio & personal tech, engineered for the loudest generation India has ever raised. No compromises. No filler.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="btn-primary" data-testid="hero-shop-btn">
                Shop the Range <ArrowRight size={16} />
              </Link>
              <Link to="/shop?featured=1" className="btn-ghost" data-testid="hero-featured-btn">
                See Featured
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm muted">
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-brand" /> 1-yr warranty</div>
              <div className="flex items-center gap-2"><Bolt size={16} className="text-brand" /> Fast delivery</div>
              <div className="flex items-center gap-2"><Cpu size={16} className="text-brand" /> Made in India</div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-token surface">
              <img
                src={HERO_IMG}
                alt="Featured product"
                className="absolute inset-0 h-full w-full object-cover animate-float"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <div className="label-caps text-white/70">Flagship</div>
                  <div className="font-display font-bold text-2xl text-white">TSD Pulse Pro</div>
                </div>
                <div className="chip !bg-white/10 !border-white/20 !text-white backdrop-blur-md font-mono">₹ 4,999</div>
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
      <section className="container-x py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { k: "50Hr", v: "Playtime" },
          { k: "0.05s", v: "Low latency" },
          { k: "IPX7", v: "Sweat & rain" },
          { k: "1M+", v: "Loud fans" },
        ].map((s) => (
          <div key={s.v} className="card p-6">
            <div className="font-display text-3xl font-bold">{s.k}</div>
            <div className="label-caps muted mt-1">{s.v}</div>
          </div>
        ))}
      </section>

      {/* FEATURED */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="label-caps muted">Featured</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">Handpicked for you.</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold hover:text-brand">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => <div key={i} className="aspect-[3/4] card animate-pulse" />)}
          </div>
        ) : hasAny ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {featuredList.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* CTA */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden card p-8 md:p-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
          <div className="grid md:grid-cols-2 gap-8 items-center relative">
            <div>
              <div className="label-caps text-brand">Membership</div>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl mt-2 tracking-tight">
                Join TSD Insider. Drops before anyone else.
              </h3>
              <p className="muted mt-3 max-w-md">
                Early access to launches, exclusive colorways and up to 20% off first orders. Free forever.
              </p>
            </div>
            <div className="flex gap-2 md:justify-end">
              <input placeholder="you@sound.city" className="input max-w-xs" data-testid="newsletter-input" />
              <button className="btn-primary" data-testid="newsletter-btn">Join</button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / VISIT US */}
      <section className="container-x py-8 md:py-16" id="contact" data-testid="contact-section">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-square max-w-md rounded-3xl overflow-hidden border border-token bg-white p-8">
              <img src={LOGO_3D} alt="TSD World" className="h-full w-full object-contain" />
            </div>
            <div className="absolute -bottom-4 -right-4 md:right-8 chip !bg-brand !text-white !border-transparent shadow-glow">
              <MapPin size={12} /> Made in Karnataka
            </div>
          </div>
          <div>
            <div className="label-caps text-brand">Say hello</div>
            <h2 className="mt-2 font-display font-black text-4xl md:text-5xl tracking-tight leading-[1.05]">
              Questions?<br />We're one message away.
            </h2>
            <p className="muted mt-4 max-w-lg">
              Reach us for bulk orders, brand collabs, warranty claims or anything in between. Real humans, quick replies.
            </p>

            <div className="mt-8 space-y-4">
              <a href="mailto:info@tsdworld.in" data-testid="contact-email-link" className="card p-4 flex items-center gap-4 hover:border-brand transition group">
                <span className="h-11 w-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition">
                  <Mail size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Email</div>
                  <div className="font-semibold truncate">info@tsdworld.in</div>
                </div>
                <ArrowRight size={16} className="muted group-hover:text-brand transition" />
              </a>

              <a href="tel:+918660145698" data-testid="contact-phone-link" className="card p-4 flex items-center gap-4 hover:border-brand transition group">
                <span className="h-11 w-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition">
                  <Phone size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Phone / WhatsApp</div>
                  <div className="font-semibold">+91 8660145698</div>
                </div>
                <ArrowRight size={16} className="muted group-hover:text-brand transition" />
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Huded+Mahalaxmi+temple+Ilkal+Karnataka+587125"
                target="_blank" rel="noopener noreferrer"
                data-testid="contact-address-link"
                className="card p-4 flex items-center gap-4 hover:border-brand transition group"
              >
                <span className="h-11 w-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition">
                  <MapPin size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="label-caps muted">Studio · Karnataka</div>
                  <div className="font-semibold">Near Huded Mahalaxmi temple, Ilkal, 587125</div>
                </div>
                <ArrowRight size={16} className="muted group-hover:text-brand transition" />
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
    <div className="card p-14 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/15 flex items-center justify-center">
        <Sparkles className="text-brand" />
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold">The shelves are still warming up.</h3>
      <p className="muted mt-2">New premium audio gear dropping soon. Stay tuned!</p>
    </div>
  );
}
