import React, { useEffect, useState } from "react";
import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container-x py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <div className="label-caps muted">Catalogue</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mt-1">
            Shop everything.
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="aspect-[3/4] card animate-pulse" />)}
        </div>
      ) : products.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 stagger">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="card p-8 sm:p-14 text-center">
          <h3 className="font-display text-xl sm:text-2xl font-bold">No products found</h3>
          <p className="muted mt-2 text-sm">Try clearing search to view items.</p>
        </div>
      )}
    </div>
  );
}
