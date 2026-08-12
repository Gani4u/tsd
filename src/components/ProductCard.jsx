import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProductCardSlider from "./ProductCardSlider";
import { formatINR, calculatePriceDetails } from "../lib/api";

export default function ProductCard({ product }) {
  const soon = product.stock <= 0;
  const { price, mrp, discountPercent } = calculatePriceDetails(product);

  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col rounded-2xl border border-token surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-black/5 dark:bg-white/5">
        <ProductCardSlider product={product} />
        
        {/* Dynamic Discount OFF Badge on Top Left */}
        {discountPercent > 0 && !soon && (
          <span className="absolute top-2.5 left-2.5 chip !bg-emerald-500/90 !text-white !border-transparent text-[10px] font-bold z-20 shadow-md backdrop-blur-md">
            {discountPercent}% OFF
          </span>
        )}

        <span className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 shadow-md pointer-events-none">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-lg sm:text-xl line-clamp-1">{product.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
            {product.description || product.tagline}
          </p>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-2 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-brand font-bold text-lg sm:text-xl">
              {formatINR(price)}
            </span>
            {mrp > price && (
              <span className="text-xs muted line-through font-medium">
                {formatINR(mrp)}
              </span>
            )}
          </div>

          {soon ? (
            <span className="text-red-500 text-[11px] font-semibold chip !bg-red-500/10 !border-red-500/30">
              Out of Stock
            </span>
          ) : (
            <span className="text-emerald-500 text-[11px] font-bold">
              Save {discountPercent}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
