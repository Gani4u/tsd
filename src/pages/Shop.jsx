import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get("/products");
      setProducts(res.data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const filtered = products.filter((p)=>{

    if(q && !p.name.toLowerCase().includes(q.toLowerCase()))
        return false;

    return true;

});
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [products, q]);

  const setCat = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set("category", id); else next.delete("category");
    setParams(next);
  };

  return (
    <div className="container-x py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="label-caps muted">Catalogue</div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Shop everything.</h1>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 muted" />
          <input
            data-testid="shop-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="input pl-10 min-w-[280px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
        <button
          onClick={() => setCat("")}
          data-testid="filter-all"
          className={`chip whitespace-nowrap ${!activeCat ? "!bg-brand !text-white !border-transparent" : ""}`}
        >All</button>
        {categories.map((c) => (
          <button
            key={c.id}
            data-testid={`filter-cat-${c.slug}`}
            onClick={() => setCat(c.id)}
            className={`chip whitespace-nowrap ${activeCat === c.id ? "!bg-brand !text-white !border-transparent" : ""}`}
          >{c.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="aspect-[3/4] card animate-pulse" />)}
        </div>
      ) : filtered.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="card p-14 text-center">
          <h3 className="font-display text-2xl font-bold">No products found</h3>
          <p className="muted mt-2">Try clearing filters or search.</p>
        </div>
      )}
    </div>
  );
}
