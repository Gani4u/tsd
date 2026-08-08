import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Truck, RefreshCcw, ShoppingBag, Zap } from "lucide-react";
import { getProductById, formatINR } from "../lib/api";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const cart = useCart();

  useEffect(() => {
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
      }
    })();
  }, [id]);

  const gallery = useMemo(() => {
    return product && product.thumbnail ? [product.thumbnail] : [];
  }, [product]);

  if (loading) return <div className="container-x py-20"><div className="h-96 card animate-pulse" /></div>;
  if (notFound || !product) return (
    <div className="container-x py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found.</h1>
      <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to shop</Link>
    </div>
  );

  const disabled = product.stock <= 0;

  const addToCart = () => cart.add(product, 1);
  const startBuyNow = () => {
    cart.add(product, 1);
    navigate("/checkout");
  };

  return (
    <div className="container-x py-8 md:py-14">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm muted hover:text-brand mb-6" data-testid="back-to-shop">
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-token surface" data-testid="product-hero-image">
            <ProductImage src={gallery[0]} name={product.name} />
            {disabled && (
              <span className="absolute top-4 left-4 chip !bg-red-500/80 !text-white !border-transparent backdrop-blur">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="mt-2 font-display font-extrabold text-4xl md:text-5xl tracking-tight" data-testid="product-name">{product.name}</h1>
          
          <div className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span className="font-display text-5xl font-black text-brand" data-testid="product-price">{formatINR(product.price)}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              disabled={disabled}
              data-testid="buy-btn"
              onClick={startBuyNow}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={16} /> {disabled ? "Out of Stock" : "Buy Now"}
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
              <p className="mt-3 muted whitespace-pre-line text-base leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
