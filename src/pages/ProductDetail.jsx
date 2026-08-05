import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, Truck, RefreshCcw, Star, ShoppingBag, Zap } from "lucide-react";
import { api, formatINR } from "../lib/api";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import CheckoutModal from "../components/CheckoutModal";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [buyNow, setBuyNow] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const cart = useCart();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);
      setActiveIdx(0);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const set = [];
    if (product.image_url) set.push(product.image_url);
    (product.images || []).forEach((u) => { if (u && !set.includes(u)) set.push(u); });
    if (set.length === 0) set.push(""); // placeholder slot
    return set;
  }, [product]);

  if (loading) return <div className="container-x py-20"><div className="h-96 card animate-pulse" /></div>;
  if (notFound || !product) return (
    <div className="container-x py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found.</h1>
      <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to shop</Link>
    </div>
  );

  const specs = Object.entries(product.specifications || {});
  const disabled = product.coming_soon;

  const addToCart = () => cart.add(product, 1);
  const startBuyNow = () => setBuyNow(true);

  return (
    <div className="container-x py-8 md:py-14">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm muted hover:text-brand mb-6" data-testid="back-to-shop">
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-token surface" data-testid="product-hero-image">
            <ProductImage src={gallery[activeIdx]} name={product.name} />
            {product.coming_soon && (
              <span className="absolute top-4 left-4 chip !bg-black/70 !text-white !border-white/10 backdrop-blur">
                <Clock size={12} /> Coming Soon
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-1" data-testid="product-thumbs">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  data-testid={`product-thumb-${i}`}
                  onClick={() => setActiveIdx(i)}
                  className={`relative shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 transition ${
                    activeIdx === i ? "border-brand shadow-glow" : "border-token opacity-70 hover:opacity-100"
                  }`}
                >
                  <ProductImage src={src} name={product.name + " " + (i + 1)} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category_name && <div className="label-caps text-brand">{product.category_name}</div>}
          <h1 className="mt-2 font-display font-extrabold text-4xl md:text-5xl tracking-tight" data-testid="product-name">{product.name}</h1>
          {product.tagline && <p className="muted mt-3 text-lg">{product.tagline}</p>}

          <div className="flex items-center gap-2 mt-4 text-sm">
            <div className="flex text-brand">{[...Array(5)].map((_,i) => <Star key={i} size={14} fill="#FF4500" strokeWidth={0} />)}</div>
            <span className="muted">4.8 · 2.1k reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span className="font-display text-5xl font-black text-brand" data-testid="product-price">{formatINR(product.price)}</span>
            <span className="muted line-through text-lg">{formatINR(Math.round(product.price * 1.4))}</span>
            <span className="chip !bg-brand/10 !text-brand !border-brand/20">Save 40%</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              disabled={disabled}
              data-testid="buy-btn"
              onClick={startBuyNow}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={16} /> {disabled ? "Notify me" : "Buy Now"}
            </button>
            <button
              disabled={disabled}
              data-testid="add-to-cart-btn"
              onClick={addToCart}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { icon: <ShieldCheck size={16} className="text-brand" />, t: "1-yr Warranty" },
              { icon: <Truck size={16} className="text-brand" />, t: "Free Shipping" },
              { icon: <RefreshCcw size={16} className="text-brand" />, t: "7-day Returns" },
            ].map((f) => (
              <div key={f.t} className="card px-4 py-3 flex items-center gap-2">
                {f.icon}<span className="text-xs font-semibold">{f.t}</span>
              </div>
            ))}
          </div>

          {product.description && (
            <div className="mt-10">
              <h3 className="font-display font-bold text-xl">Overview</h3>
              <p className="mt-3 muted whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {product.bundle_items && product.bundle_items.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl">What's in the bundle</h3>
                <span className="chip !bg-brand/10 !text-brand !border-brand/20 text-xs">Bundle deal</span>
              </div>
              <div className="mt-4 card divide-y divider overflow-hidden">
                {product.bundle_items.map((b) => (
                  <div key={b.product_id} className="p-3 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-lg overflow-hidden border border-token shrink-0">
                      <ProductImage src={b.image_url} name={b.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{b.name}</div>
                      <div className="muted text-xs">Included · usually {formatINR(b.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
              {product.bundle_original_price > product.price && (
                <div className="mt-3 text-sm">
                  Bundle price <span className="font-bold text-brand">{formatINR(product.price)}</span>
                  <span className="mx-2 muted line-through">{formatINR(product.bundle_original_price)}</span>
                  <span className="chip !bg-emerald-500/15 !text-emerald-500 !border-emerald-500/20 text-[10px] ml-1">
                    You save {formatINR(product.bundle_original_price - product.price)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-10">
            <h3 className="font-display font-bold text-xl">Specifications</h3>
            {specs.length === 0 ? (
              <p className="muted mt-3 text-sm">No specifications listed yet.</p>
            ) : (
              <div className="mt-4 divide-y divider border-token">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 py-3 text-sm">
                    <div className="muted uppercase tracking-wider">{k}</div>
                    <div className="col-span-2 font-medium">{String(v)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {buyNow && (
        <CheckoutModal
          items={[{
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url,
          }]}
          onClose={() => setBuyNow(false)}
          onSuccess={(oid) => { setBuyNow(false); setConfirmed(oid); }}
        />
      )}
      {confirmed && (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" data-testid="order-success">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/15 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold">Order confirmed!</h3>
            <p className="muted mt-2 text-sm">Payment successful. We'll email your details shortly.</p>
            <div className="mt-4 chip font-mono text-xs">#{confirmed.slice(0, 8).toUpperCase()}</div>
            <button onClick={() => setConfirmed(null)} className="btn-primary w-full justify-center mt-6" data-testid="order-success-close">Keep browsing</button>
          </div>
        </div>
      )}
    </div>
  );
}
