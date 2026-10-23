import React, { useEffect, useState } from "react";
import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Search, Sparkles } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    { id: "all", label: "All Drops", badge: null },
    { id: "earbuds", label: "TWS Earbuds", badge: "Upto 50% OFF" },
    { id: "cables", label: "Fast Cables", badge: "40% OFF" },
    { id: "adapters", label: "Power Adapters", badge: "40% OFF" },
    { id: "wired", label: "Wired Audio", badge: "30% OFF" },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(q);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [q]);

  const filteredProducts = products.filter((p) => {
    if (category === "all") return true;
    const name = (p.name || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();

    if (category === "cables") {
      return name.includes("cable") || desc.includes("cable");
    }
    if (category === "adapters") {
      return name.includes("charger") || name.includes("adapter") || desc.includes("charger");
    }
    if (category === "earbuds") {
      return name.includes("earbud") || name.includes("tws") || name.includes("wireless");
    }
    if (category === "wired") {
      return name.includes("wired") || (name.includes("earphone") && !name.includes("earbud") && !name.includes("wireless"));
    }
    return true;
  });

  return (
    <div className="container-x py-8 sm:py-14">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-7 sm:mb-9">
        <div>
          <div className="label-caps text-brand flex items-center gap-1.5">
            <Sparkles size={13} /> Exclusive Audio & Gear
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mt-1.5">
            Shop Everything.
          </h1>
          <p className="muted text-sm sm:text-base mt-1">
            Engineered audio, ultra-fast charging, and lifestyle tech drops.
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 muted pointer-events-none" />
          <input
            data-testid="shop-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, earbuds, cables…"
            className="input pl-10 pr-4 py-2.5 w-full md:min-w-[320px] text-sm"
          />
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-7 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                isActive
                  ? "bg-brand text-brand-fg border-brand shadow-glow font-extrabold"
                  : "surface border-token hover:border-brand/40 text-current muted hover:text-current"
              }`}
            >
              <span>{cat.label}</span>
              {cat.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-black/20 text-current" : "bg-emerald-500/15 text-emerald-500"
                  }`}
                >
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="aspect-[3/4] card animate-pulse" />)}
        </div>
      ) : filteredProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 stagger">
          {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="card p-10 sm:p-16 text-center">
          <h3 className="font-display text-xl sm:text-2xl font-bold">No products match your search</h3>
          <p className="muted mt-2 text-sm">Try clearing your search term or exploring another category.</p>
          <button
            onClick={() => {
              setQ("");
              setCategory("all");
            }}
            className="btn-ghost mt-6 inline-flex"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
