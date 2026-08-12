import React, { useEffect, useState } from "react";
import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    { id: "all", label: "All Drops", badge: null },
    { id: "cables", label: "Charging Cables", badge: "40% OFF" },
    { id: "adapters", label: "Fast Adapters", badge: "40% OFF" },
    { id: "earbuds", label: "TWS Earbuds", badge: "Upto 50% OFF" },
    { id: "wired", label: "Wired Earphones", badge: "30% OFF" },
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
    <div className="container-x py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <div className="label-caps text-brand">Exclusive Catalogue</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mt-1">
            Shop Everything.
          </h1>
        </div>
        <div className="relative w-full md:w-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 muted" />
          <input
            data-testid="shop-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="input pl-10 w-full md:min-w-[280px]"
          />
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isActive
                  ? "bg-brand text-white border-brand shadow-glow"
                  : "bg-surface border-token hover:border-brand/50 text-foreground/80"
              }`}
            >
              <span>{cat.label}</span>
              {cat.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-emerald-500/15 text-emerald-500"
                  }`}
                >
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="aspect-[3/4] card animate-pulse" />)}
        </div>
      ) : filteredProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 stagger">
          {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="card p-8 sm:p-14 text-center">
          <h3 className="font-display text-xl sm:text-2xl font-bold">No products found</h3>
          <p className="muted mt-2 text-sm">Try clearing search or choosing another category.</p>
        </div>
      )}
    </div>
  );
}
