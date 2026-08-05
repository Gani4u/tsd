import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatINR } from "../lib/api";

export default function ProductCard({ product }) {
  const soon = product.coming_soon;
  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col rounded-2xl border border-token surface overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <ProductImage src={product.image_url} name={product.name} />
        </div>
        {soon && (
          <span className="absolute top-3 left-3 chip !bg-black/70 !text-white !border-white/10 backdrop-blur">
            <Clock size={12} /> Coming Soon
          </span>
        )}
        {product.bundle_of && product.bundle_of.length > 0 && !soon && (
          <span className="absolute top-3 left-3 chip !bg-emerald-500 !text-white !border-transparent text-[10px]">
            Bundle · Save {product.bundle_original_price ? Math.round(((product.bundle_original_price - product.price) / product.bundle_original_price) * 100) : 20}%
          </span>
        )}
        {product.featured && !soon && !(product.bundle_of && product.bundle_of.length > 0) && (
          <span className="absolute top-3 left-3 chip !bg-brand !text-white !border-transparent">Featured</span>
        )}
        <span className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2">
        {product.category_name && (
          <div className="label-caps muted">{product.category_name}</div>
        )}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold text-lg leading-tight">{product.name}</h3>
        </div>
        {product.tagline && <p className="text-sm muted line-clamp-2">{product.tagline}</p>}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-brand">{formatINR(product.price)}</span>
          {soon && <span className="text-xs muted">launching soon</span>}
        </div>
      </div>
    </Link>
  );
}
