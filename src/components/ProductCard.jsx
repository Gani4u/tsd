import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatINR } from "../lib/api";

export default function ProductCard({ product }) {
  const soon = product.stock <= 0;

  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col rounded-2xl border border-token surface overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <ProductImage src={product.thumbnail} name={product.name} />
        </div>
        <span className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-xl">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {product.description || product.tagline}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-brand font-bold">
            {formatINR(product.price)}
          </span>
          {soon && (
            <span className="text-red-500 text-xs">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
