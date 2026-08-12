import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Truck, RefreshCcw, ShoppingBag, Zap, Tag } from "lucide-react";
import { getProductById, formatINR, calculatePriceDetails } from "../lib/api";
import ProductGallerySlider from "../components/ProductGallerySlider";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const cart = useCart();

  useEffect(() => {
    // Reset scroll to top immediately when ID changes
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch {
      window.scrollTo(0, 0);
    }

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const prod = await getProductById(id);
        if (!prod) throw new Error("Product not found");
        setProduct(prod);
      } catch (err) {
        console.error("Failed to load product", err);
        setNotFound(true);
      } finally {
        setLoading(false);
        // Ensure scroll top after product state updates
        setTimeout(() => {
          try {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          } catch {
            window.scrollTo(0, 0);
          }
        }, 10);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container-x py-8 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="aspect-square card animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 w-3/4 card animate-pulse" />
            <div className="h-12 w-1/3 card animate-pulse" />
            <div className="h-12 w-full sm:w-2/3 card animate-pulse" />
            <div className="h-32 card animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container-x py-16 md:py-24 text-center">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Product not found.</h1>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Back to shop
        </Link>
      </div>
    );
  }

  const disabled = product.stock <= 0;
  const { price, mrp, savings, discountPercent } = calculatePriceDetails(product);

  const addToCart = () => cart.add(product, 1);
  const startBuyNow = () => {
    cart.add(product, 1);
    navigate("/checkout");
  };

  return (
    <div className="container-x py-6 md:py-14">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm muted hover:text-brand mb-4 md:mb-6 transition"
        data-testid="back-to-shop"
      >
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* PRODUCT GALLERY WITH SMOOTH SLIDING TRANSITION */}
        <div data-testid="product-hero-image" className="w-full max-w-full">
          <ProductGallerySlider product={product} disabled={disabled} />
        </div>

        {/* PRODUCT DETAILS */}
        <div className="flex flex-col">
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight"
            data-testid="product-name"
          >
            {product.name}
          </h1>

          {/* PRICE & DISCOUNT SECTION */}
          <div className="mt-4 sm:mt-6 flex flex-col gap-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="font-display text-4xl sm:text-5xl font-black text-brand"
                data-testid="product-price"
              >
                {formatINR(price)}
              </span>

              {mrp > price && (
                <span className="font-display text-xl sm:text-2xl muted line-through font-semibold">
                  {formatINR(mrp)}
                </span>
              )}

              {discountPercent > 0 && !disabled && (
                <span className="chip !bg-emerald-500/15 !border-emerald-500/30 !text-emerald-500 font-bold text-xs sm:text-sm py-1 px-3">
                  <Tag size={12} /> Save ₹{savings} ({discountPercent}% OFF)
                </span>
              )}

              {disabled && (
                <span className="chip !bg-red-500/10 !border-red-500/30 !text-red-500 font-bold">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="text-xs muted font-medium">
              Inclusive of all taxes · Free express shipping across India
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full">
            <button
              disabled={disabled}
              data-testid="buy-btn"
              onClick={startBuyNow}
              className="btn-primary flex-1 justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
            >
              <Zap size={16} /> {disabled ? "Out of Stock" : "Buy Now"}
            </button>
            <button
              disabled={disabled}
              data-testid="add-to-cart-btn"
              onClick={addToCart}
              className="btn-ghost flex-1 justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-6 sm:mt-8">
            {[
              { icon: <ShieldCheck size={16} className="text-brand shrink-0" />, t: "1-yr Warranty" },
              { icon: <Truck size={16} className="text-brand shrink-0" />, t: "Free Shipping" },
              { icon: <RefreshCcw size={16} className="text-brand shrink-0" />, t: "7-day Returns" },
            ].map((f) => (
              <div key={f.t} className="card px-3.5 py-3 flex items-center gap-2.5">
                {f.icon}
                <span className="text-xs font-semibold">{f.t}</span>
              </div>
            ))}
          </div>

          {product.description && (
            <div className="mt-8 sm:mt-10 pt-6 border-t border-token">
              <h3 className="font-display font-bold text-lg sm:text-xl">Overview</h3>
              <p className="mt-3 muted whitespace-pre-line text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
