import React, { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, formatApiError, formatINR } from "../lib/api";
import {
  Package, Tags, LogOut, Plus, Trash2, Pencil, Zap, X, Sparkles, Search, BadgeCheck, Clock, Save, Receipt, Eye, Truck, LayoutDashboard, TrendingUp, AlertTriangle, IndianRupee, ShoppingBag, PackageCheck, XCircle, RotateCcw,
} from "lucide-react";
import ProductImage from "../components/ProductImage";

function AdminShell({ children }) {
  const { user, logout, loading } = useAuth();
  const nav = useNavigate();
  if (loading) return <div className="container-x py-20"><div className="h-64 card animate-pulse" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container-x py-8">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 h-max">
          <div className="card p-4">
            <div className="flex items-center gap-2 px-2 py-2">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg overflow-hidden bg-white shrink-0">
                <img src="https://customer-assets-agu9un31.emergentagent.net/job_tsd-electronics-mvp/artifacts/mg0oqn79_WhatsApp%20Image%202026-07-28%20at%2010.15.58%20PM.jpeg" alt="TSD" className="h-full w-full object-contain scale-110" />
              </span>
              <div>
                <div className="font-display font-bold text-sm leading-tight">TSD Admin</div>
                <div className="text-[10px] muted truncate max-w-[140px]">{user.email}</div>
              </div>
            </div>
            <nav className="mt-3 flex flex-col gap-1">
              {[
                { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={14} />, end: true },
                { to: "/admin/products", label: "Products", icon: <Package size={14} /> },
                { to: "/admin/orders", label: "Orders", icon: <Receipt size={14} /> },
                { to: "/admin/categories", label: "Categories", icon: <Tags size={14} /> },
              ].map((it) => (
                <NavLink
                  key={it.label}
                  to={it.to}
                  end={it.end}
                  data-testid={`admin-nav-${it.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      isActive ? "bg-brand text-white" : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`
                  }
                >
                  {it.icon}{it.label}
                </NavLink>
              ))}
              <button
                onClick={() => { logout(); nav("/"); }}
                data-testid="admin-logout"
                className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 text-red-500"
              >
                <LogOut size={14} /> Sign out
              </button>
            </nav>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminShell>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Routes>
    </AdminShell>
  );
}

// ---------- PRODUCTS ----------
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await api.get("/products");
          setProducts(res.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="label-caps muted">Catalogue</div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Products</h1>
          <p className="muted text-sm mt-1">{products.length} total · updates go live instantly on the storefront.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="input pl-9 h-10 py-0"
              data-testid="admin-search"
            />
          </div>
          <button
            className="btn-primary"
            data-testid="admin-add-product"
            onClick={() => { setEditing(null); setOpen(true); }}
          >
            <Plus size={16} /> New product
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left label-caps muted border-b divider">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-10 text-center muted">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-brand/15 flex items-center justify-center"><Sparkles className="text-brand" size={20} /></div>
                    <div className="mt-3 font-semibold">No products yet</div>
                    <div className="muted text-sm">Add your first drop to see it on the storefront.</div>
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="border-b divider last:border-none hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" data-testid={`admin-row-${p.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-lg overflow-hidden border border-token">
                        <ProductImage src={p.image_url} name={p.name} />
                      </div>
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="muted text-xs">{p.tagline || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.category_name ? <span className="chip">{p.category_name}</span> : <span className="muted text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatINR(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`chip !border ${
                      p.stock === 0 ? "bg-red-500/15 text-red-500 border-red-500/20" :
                      p.stock <= 10 ? "bg-amber-500/15 text-amber-500 border-amber-500/20" : ""
                    }`}>
                      {p.stock === 0 ? "Sold out" : `${p.stock} left`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.coming_soon ? (
                      <span className="chip"><Clock size={12} /> Coming soon</span>
                    ) : p.featured ? (
                      <span className="chip !bg-brand !text-white !border-transparent"><BadgeCheck size={12} /> Featured</span>
                    ) : (
                      <span className="chip">Live</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button className="btn-ghost !py-2 !px-3" data-testid={`admin-edit-${p.id}`} onClick={() => { setEditing(p); setOpen(true); }}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn-ghost !py-2 !px-3 text-red-500" data-testid={`admin-delete-${p.id}`} onClick={() => remove(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <ProductModal
          categories={categories}
          product={editing}
          onClose={() => setOpen(false)}
          onSaved={() => { setOpen(false); load(); }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState(() => ({
    name: product?.name || "",
    price: product?.price ?? "",
    stock: product?.stock ?? 100,
    category_id: product?.category_id || "",
    description: product?.description || "",
    image_url: product?.image_url || "",
    images_text: (product?.images || []).join("\n"),
    tagline: product?.tagline || "",
    coming_soon: product?.coming_soon || false,
    featured: product?.featured || false,
    bundle_of: product?.bundle_of || [],
    specs_text: product?.specifications
      ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join("\n")
      : "",
  }));
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/products", { params: { is_bundle: false, limit: 200 } });
      setAllProducts(data.filter((p) => !product || p.id !== product.id));
    })();
  }, [product]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const parseSpecs = (text) => {
    const obj = {};
    text.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) {
        const k = line.slice(0, idx).trim();
        const v = line.slice(idx + 1).trim();
        if (k) obj[k] = v;
      }
    });
    return obj;
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Math.max(0, parseInt(form.stock || 0, 10)),
      category_id: form.category_id || null,
      description: form.description,
      image_url: form.image_url.trim(),
      images: form.images_text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5),
      tagline: form.tagline,
      coming_soon: !!form.coming_soon,
      featured: !!form.featured,
      bundle_of: form.bundle_of || [],
      specifications: parseSpecs(form.specs_text),
    };
    try {
      if (isEdit) {
        await api.patch(`/products/${product.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      onSaved();
    } catch (e2) {
      setErr(formatApiError(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-4" data-testid="product-modal">
      <div className="w-full max-w-2xl card p-0 my-8">
        <div className="flex items-center justify-between p-5 border-b divider">
          <div>
            <div className="label-caps muted">{isEdit ? "Edit" : "New"}</div>
            <h3 className="font-display text-xl font-bold">{isEdit ? product.name : "Add product"}</h3>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full border border-token flex items-center justify-center" data-testid="modal-close"><X size={16} /></button>
        </div>

        <form onSubmit={save} className="p-5 grid md:grid-cols-2 gap-4">
          <Field label="Name" required className="md:col-span-2">
            <input required className="input" data-testid="form-name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>

          <Field label="Tagline">
            <input className="input" data-testid="form-tagline"
              value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </Field>

          <Field label="Price (INR)" required>
            <input required type="number" min="0" step="1" className="input" data-testid="form-price"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>

          <Field label="Stock (units)">
            <input type="number" min="0" step="1" className="input" data-testid="form-stock"
              value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </Field>

          <Field label="Category">
            <select className="input" data-testid="form-category"
              value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">— none —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          <Field label="Image URL (main)">
            <input className="input" data-testid="form-image"
              placeholder="https://…" value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </Field>

          <Field label="Additional images (one URL per line, up to 5)" className="md:col-span-2">
            <textarea rows={3} className="input font-mono text-xs" data-testid="form-images"
              placeholder={"https://…/side.jpg\nhttps://…/back.jpg\nhttps://…/lifestyle.jpg"}
              value={form.images_text}
              onChange={(e) => setForm({ ...form, images_text: e.target.value })} />
          </Field>

          <Field label="Description" className="md:col-span-2">
            <textarea rows={3} className="input" data-testid="form-description"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>

          <Field label="Specifications (one per line, key: value)" className="md:col-span-2">
            <textarea rows={4} className="input font-mono text-xs" data-testid="form-specs"
              placeholder={"Driver: 13mm dynamic\nBattery: 50h\nBluetooth: 5.3"}
              value={form.specs_text} onChange={(e) => setForm({ ...form, specs_text: e.target.value })} />
          </Field>

          <label className="flex items-center gap-3 card px-4 py-3 cursor-pointer">
            <input type="checkbox" checked={form.coming_soon} onChange={(e) => setForm({ ...form, coming_soon: e.target.checked })} data-testid="form-coming-soon" />
            <div>
              <div className="font-semibold text-sm">Coming Soon</div>
              <div className="muted text-xs">Show as pre-launch on storefront</div>
            </div>
          </label>

          <label className="flex items-center gap-3 card px-4 py-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} data-testid="form-featured" />
            <div>
              <div className="font-semibold text-sm">Featured</div>
              <div className="muted text-xs">Highlight on home page</div>
            </div>
          </label>

          <Field label="Bundle — include these products (optional, up to 5)" className="md:col-span-2">
            <div className="card p-3 max-h-48 overflow-y-auto space-y-1" data-testid="form-bundle">
              {allProducts.length === 0 ? (
                <div className="muted text-xs">No other products available.</div>
              ) : allProducts.map((p) => {
                const checked = form.bundle_of.includes(p.id);
                return (
                  <label key={p.id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...form.bundle_of, p.id].slice(0, 5)
                          : form.bundle_of.filter((id) => id !== p.id);
                        setForm({ ...form, bundle_of: next });
                      }}
                      data-testid={`bundle-pick-${p.id}`}
                    />
                    <div className="h-8 w-8 rounded overflow-hidden border border-token shrink-0">
                      <ProductImage src={p.image_url} name={p.name} />
                    </div>
                    <div className="flex-1 text-sm">{p.name}</div>
                    <div className="muted text-xs">{formatINR(p.price)}</div>
                  </label>
                );
              })}
            </div>
            {form.bundle_of.length > 0 && (
              <div className="mt-2 text-xs muted">
                Bundle savings preview — this bundle costs <span className="text-brand font-semibold">{formatINR(Number(form.price || 0))}</span>
                {" "}vs individual sum of{" "}
                <span className="line-through">{formatINR(form.bundle_of.reduce((s, id) => {
                  const p = allProducts.find((x) => x.id === id);
                  return s + (p ? p.price : 0);
                }, 0))}</span>
              </div>
            )}
          </Field>

          {err && <div className="md:col-span-2 text-sm text-red-500" data-testid="form-error">{err}</div>}

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={busy} className="btn-primary" data-testid="form-submit">
              <Save size={16} /> {busy ? "Saving…" : (isEdit ? "Save changes" : "Create product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, className = "", children }) {
  return (
    <div className={className}>
      <label className="label-caps muted">{label}{required && <span className="text-brand"> *</span>}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

// ---------- CATEGORIES ----------
function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get("/categories");
    setCats(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return;
    try {
      await api.post("/categories", { name: name.trim() });
      setName("");
      load();
    } catch (e2) { setErr(formatApiError(e2)); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <div className="mb-6">
        <div className="label-caps muted">Taxonomy</div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight">Categories</h1>
      </div>

      <form onSubmit={add} className="card p-4 flex flex-wrap gap-3 items-center">
        <input
          className="input flex-1 min-w-[200px]"
          placeholder="e.g. Earbuds"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="cat-name"
        />
        <button className="btn-primary" data-testid="cat-add"><Plus size={16} /> Add category</button>
        {err && <div className="basis-full text-sm text-red-500">{err}</div>}
      </form>

      <div className="mt-6 card divide-y divider overflow-hidden">
        {loading ? (
          <div className="p-6 muted text-sm">Loading…</div>
        ) : cats.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-brand/15 flex items-center justify-center"><Tags className="text-brand" size={20} /></div>
            <div className="mt-3 font-semibold">No categories yet</div>
            <div className="muted text-sm">Add categories to group your products.</div>
          </div>
        ) : cats.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between" data-testid={`cat-row-${c.id}`}>
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="muted text-xs font-mono">{c.slug}</div>
            </div>
            <button className="btn-ghost !py-2 !px-3 text-red-500" onClick={() => remove(c.id)} data-testid={`cat-delete-${c.id}`}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// ---------- ORDERS ----------
const STATUS_STYLE = {
  created: "bg-zinc-500/15 text-zinc-500 border-zinc-500/20",
  awaiting_verification: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  paid: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  shipped: "bg-sky-500/15 text-sky-500 border-sky-500/20",
  delivered: "bg-emerald-600/15 text-emerald-600 border-emerald-600/20",
  failed: "bg-red-500/15 text-red-500 border-red-500/20",
  cancelled: "bg-red-500/15 text-red-500 border-red-500/20",
  refunded: "bg-orange-500/15 text-orange-500 border-orange-500/20",
};

const NEXT_STATUS = ["created", "awaiting_verification", "paid", "shipped", "delivered", "failed", "cancelled", "refunded"];

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    await api.delete(`/admin/orders/${id}`);
    load();
  };

  const setStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}`, { status });
    load();
    setDetail((d) => (d && d.id === id ? { ...d, status } : d));
  };

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      o.id.toLowerCase().includes(s) ||
      o.customer?.name?.toLowerCase().includes(s) ||
      o.customer?.email?.toLowerCase().includes(s) ||
      o.customer?.phone?.toLowerCase().includes(s) ||
      (o.payment_id || "").toLowerCase().includes(s)
    );
  });

  const totals = orders.reduce(
    (a, o) => {
      a.count += 1;
      if (o.status === "paid" || o.status === "shipped" || o.status === "delivered") a.revenue += o.amount_paise / 100;
      if (["created", "awaiting_verification"].includes(o.status)) a.pending += 1;
      return a;
    },
    { count: 0, revenue: 0, pending: 0 }
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="label-caps muted">Sales</div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Orders</h1>
          <p className="muted text-sm mt-1">Every order, payment id and customer at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search id/email/phone/payment…" className="input pl-9 h-10 py-0 min-w-[280px]" data-testid="orders-search" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total orders" value={totals.count} />
        <StatCard label="Revenue" value={formatINR(totals.revenue)} accent />
        <StatCard label="Pending" value={totals.pending} />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {["all", "created", "awaiting_verification", "paid", "shipped", "delivered", "failed", "refunded"].map((s) => (
          <button
            key={s}
            data-testid={`orders-filter-${s}`}
            onClick={() => setFilter(s)}
            className={`chip whitespace-nowrap ${filter === s ? "!bg-brand !text-white !border-transparent" : ""}`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left label-caps muted border-b divider">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="px-4 py-10 text-center muted">Loading…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-brand/15 flex items-center justify-center"><Receipt className="text-brand" size={20} /></div>
                    <div className="mt-3 font-semibold">No orders yet</div>
                    <div className="muted text-sm">Once shoppers checkout, orders will appear here.</div>
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} className="border-b divider last:border-none hover:bg-black/[0.02] dark:hover:bg-white/[0.02]" data-testid={`order-row-${o.id}`}>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetail(o)} className="font-mono text-xs font-semibold hover:text-brand" data-testid={`order-open-${o.id}`}>
                      #{o.id.slice(0, 8).toUpperCase()}
                    </button>
                    <div className="text-[10px] muted font-mono truncate max-w-[120px]">{o.receipt}</div>
                  </td>
                  <td className="px-4 py-3 muted text-xs">
                    {new Date(o.created_at).toLocaleString("en-IN", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold truncate max-w-[180px]">{o.customer?.name}</div>
                    <div className="muted text-xs truncate max-w-[180px]">{o.customer?.email}</div>
                    <div className="muted text-xs">{o.customer?.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="chip">{(o.items || []).reduce((s, i) => s + i.quantity, 0)}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatINR(o.amount_paise / 100)}</td>
                  <td className="px-4 py-3">
                    <span className="chip text-[10px]">{o.payment_method === "upi_qr" ? "UPI QR" : "Razorpay"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`chip !border ${STATUS_STYLE[o.status] || ""}`}>{(o.status || "").replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => setDetail(o)} className="btn-ghost !py-2 !px-3" data-testid={`order-view-${o.id}`}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => remove(o.id)} className="btn-ghost !py-2 !px-3 text-red-500" data-testid={`order-delete-${o.id}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && <OrderDetailModal order={detail} onClose={() => setDetail(null)} onStatus={setStatus} />}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="card p-5">
      <div className="label-caps muted">{label}</div>
      <div className={`mt-2 font-display font-bold text-2xl ${accent ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onStatus }) {
  const c = order.customer || {};
  const items = order.items || [];
  const [tracking, setTracking] = useState({
    tracking_id: order.tracking_id || "",
    courier: order.courier || "",
    tracking_url: order.tracking_url || "",
  });
  const [saving, setSaving] = useState(false);

  const saveShipping = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/orders/${order.id}`, tracking);
    } finally { setSaving(false); }
    // let parent re-fetch
    onStatus(order.id, order.status);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-4" data-testid="order-detail-modal">
      <div className="w-full max-w-2xl card p-0 my-6">
        <div className="flex items-center justify-between p-5 border-b divider">
          <div>
            <div className="label-caps muted">Order</div>
            <h3 className="font-display text-xl font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</h3>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full border border-token flex items-center justify-center" data-testid="order-detail-close"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <InfoBox label="Date">{new Date(order.created_at).toLocaleString("en-IN")}</InfoBox>
            <InfoBox label="Method">
              {order.payment_method === "upi_qr" ? "UPI QR (direct)"
                : order.payment_method === "razorpay_link" ? "Razorpay Link"
                : "Razorpay"}
            </InfoBox>
            <InfoBox label="Amount"><span className="text-brand font-bold">{formatINR(order.amount_paise / 100)}</span></InfoBox>
            <InfoBox label="Status"><span className={`chip !border ${STATUS_STYLE[order.status] || ""}`}>{(order.status || "").replace(/_/g, " ")}</span></InfoBox>
            {order.razorpay_order_id && <InfoBox label="Razorpay Order Id"><span className="font-mono text-xs break-all">{order.razorpay_order_id}</span></InfoBox>}
            {order.payment_id && <InfoBox label="Payment Id"><span className="font-mono text-xs break-all">{order.payment_id}</span></InfoBox>}
            {order.upi_vpa && <InfoBox label="UPI VPA"><span className="font-mono text-xs">{order.upi_vpa}</span></InfoBox>}
            {order.payment_link && (
              <InfoBox label="Payment Link">
                <a href={order.payment_link} target="_blank" rel="noopener noreferrer" className="text-brand text-xs underline break-all">{order.payment_link}</a>
              </InfoBox>
            )}
          </div>

          <div>
            <div className="label-caps muted mb-2">Customer</div>
            <div className="card p-4 space-y-1 text-sm">
              <div className="font-semibold">{c.name}</div>
              <div className="muted">{c.email} · {c.phone}</div>
              <div className="muted whitespace-pre-line">{c.address}{c.city ? `, ${c.city}` : ""}{c.pincode ? ` — ${c.pincode}` : ""}</div>
            </div>
          </div>

          <div>
            <div className="label-caps muted mb-2">Items</div>
            <div className="card divide-y divider overflow-hidden">
              {items.map((i) => (
                <div key={i.product_id} className="p-3 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border border-token shrink-0">
                    <ProductImage src={i.image_url} name={i.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{i.name}</div>
                    <div className="text-xs muted">{formatINR(i.price)} × {i.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatINR(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="label-caps muted mb-2">Shipping</div>
            <div className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="label-caps muted text-[10px]">Tracking Id</div>
                <input className="input mt-1 text-sm" value={tracking.tracking_id}
                  onChange={(e) => setTracking({ ...tracking, tracking_id: e.target.value })}
                  data-testid="ship-tracking-id" placeholder="TSD-EXP-11421" />
              </div>
              <div>
                <div className="label-caps muted text-[10px]">Courier</div>
                <input className="input mt-1 text-sm" value={tracking.courier}
                  onChange={(e) => setTracking({ ...tracking, courier: e.target.value })}
                  data-testid="ship-courier" placeholder="BlueDart" />
              </div>
              <div>
                <div className="label-caps muted text-[10px]">Tracking URL</div>
                <input className="input mt-1 text-sm" value={tracking.tracking_url}
                  onChange={(e) => setTracking({ ...tracking, tracking_url: e.target.value })}
                  data-testid="ship-tracking-url" placeholder="https://…/track/…" />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button onClick={saveShipping} disabled={saving} className="btn-primary text-xs py-2" data-testid="ship-save">
                  <Save size={12} /> {saving ? "Saving…" : "Save shipping"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="label-caps muted mb-2">Timeline</div>
            <OrderTimeline
              history={order.status_history || [{ status: order.status, at: order.created_at, note: "Order placed" }]}
              trackingUrl={order.tracking_url}
              trackingId={order.tracking_id}
              courier={order.courier}
            />
          </div>

          <div>
            <div className="label-caps muted mb-2">Change status</div>
            <div className="flex flex-wrap gap-2">
              {NEXT_STATUS.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatus(order.id, s)}
                  data-testid={`order-status-${s}`}
                  className={`chip whitespace-nowrap ${order.status === s ? "!bg-brand !text-white !border-transparent" : ""}`}
                >
                  {s === "shipped" && <Truck size={12} />}
                  {s === "paid" && <BadgeCheck size={12} />}
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TIMELINE_ICON = {
  created: <ShoppingBag size={14} />,
  awaiting_verification: <Clock size={14} />,
  paid: <BadgeCheck size={14} />,
  shipped: <Truck size={14} />,
  delivered: <PackageCheck size={14} />,
  failed: <XCircle size={14} />,
  cancelled: <XCircle size={14} />,
  refunded: <RotateCcw size={14} />,
};

function OrderTimeline({ history = [], trackingUrl, trackingId, courier }) {
  if (!history.length) return <div className="muted text-sm">No history yet.</div>;
  return (
    <ol className="relative pl-6" data-testid="order-timeline">
      <span className="absolute left-[10px] top-2 bottom-2 w-px bg-[var(--border)]" />
      {history.map((h, i) => {
        const style = STATUS_STYLE[h.status] || "";
        const isLast = i === history.length - 1;
        const isShipped = h.status === "shipped";
        return (
          <li key={i} className="relative pb-5 last:pb-0" data-testid={`timeline-step-${h.status}-${i}`}>
            <span className={`absolute -left-[2px] top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
              isLast ? "bg-brand text-white border-brand shadow-glow" : "surface border-token"
            }`}>
              {TIMELINE_ICON[h.status] || <BadgeCheck size={14} />}
            </span>
            <div className="ml-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`chip !border !text-[10px] ${style}`}>{(h.status || "").replace(/_/g, " ")}</span>
                <span className="muted text-xs">
                  {new Date(h.at).toLocaleString("en-IN", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                </span>
                {isShipped && trackingUrl && (
                  <a href={trackingUrl} target="_blank" rel="noopener noreferrer"
                    data-testid="timeline-track-link"
                    className="chip !bg-brand/10 !text-brand !border-brand/20 text-[10px] hover:!bg-brand hover:!text-white transition">
                    <Truck size={11} /> Track your package →
                  </a>
                )}
              </div>
              {h.note && <div className="mt-1 text-xs muted">{h.note}</div>}
              {isShipped && (trackingId || courier) && (
                <div className="mt-1 text-xs muted">
                  {trackingId && <span className="font-mono">{trackingId}</span>}
                  {trackingId && courier && " · "}
                  {courier && <span>{courier}</span>}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function InfoBox({ label, children }) {
  return (
    <div className="card p-3">
      <div className="label-caps muted">{label}</div>
      <div className="mt-1 text-sm font-medium">{children}</div>
    </div>
  );
}

// ---------- DASHBOARD ----------
function DashboardPage() {
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="card animate-pulse h-64" />;
  if (!stats) return null;

  const t = stats.totals;
  const daily = stats.daily || [];
  const maxRev = Math.max(1, ...daily.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <div>
        <div className="label-caps muted">Overview</div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight">Dashboard</h1>
        <p className="muted text-sm mt-1">Last {stats.window_days} days at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BigStat
          icon={<IndianRupee size={16} />}
          label="Revenue this week"
          value={formatINR(t.revenue_window)}
          accent
          data-testid="stat-revenue-week"
        />
        <BigStat
          icon={<ShoppingBag size={16} />}
          label="Orders this week"
          value={t.orders_window}
          data-testid="stat-orders-week"
        />
        <BigStat
          icon={<Clock size={16} />}
          label="Pending"
          value={t.pending}
          data-testid="stat-pending"
        />
        <BigStat
          icon={<Package size={16} />}
          label="Products"
          value={t.products}
          data-testid="stat-products"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2" data-testid="revenue-chart">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="label-caps muted">Revenue</div>
              <div className="font-display text-2xl font-bold mt-1 text-brand">{formatINR(t.revenue_window)}</div>
            </div>
            <div className="chip"><TrendingUp size={12} /> {stats.window_days}d</div>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {daily.map((d) => {
              const h = Math.max(4, (d.revenue / maxRev) * 100);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative flex items-end h-full">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand/80 to-brand transition-all"
                      style={{ height: `${h}%` }}
                      title={`${d.label}: ${formatINR(d.revenue)}`}
                    />
                    {d.revenue > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono muted whitespace-nowrap">
                        {Math.round(d.revenue).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] muted uppercase tracking-wider">{d.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6" data-testid="top-products-widget">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="label-caps muted">Top Products</div>
              <div className="font-display text-lg font-bold mt-1">Best sellers</div>
            </div>
            <TrendingUp size={16} className="text-brand" />
          </div>
          {stats.top_products.length === 0 ? (
            <div className="text-sm muted py-8 text-center">No sales in window yet.</div>
          ) : (
            <div className="space-y-3">
              {stats.top_products.map((p, i) => (
                <div key={p.product_id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg overflow-hidden border border-token shrink-0">
                    <ProductImage src={p.image_url} name={p.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs muted">{p.units} units · {formatINR(p.revenue)}</div>
                  </div>
                  <div className="font-display font-bold text-lg text-brand">#{i + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6" data-testid="low-stock-widget">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="label-caps muted">Low stock</div>
            <div className="font-display text-lg font-bold mt-1">
              {stats.low_stock.length ? `${stats.low_stock.length} items need restock` : "You're fully stocked"}
            </div>
          </div>
          <AlertTriangle size={16} className={stats.low_stock.length ? "text-amber-500" : "muted"} />
        </div>
        {stats.low_stock.length === 0 ? (
          <div className="text-sm muted py-6">Nothing at or below {stats.low_stock_threshold} units — nice.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.low_stock.map((p) => (
              <button
                key={p.id}
                onClick={() => nav("/admin/products")}
                data-testid={`low-stock-${p.id}`}
                className="text-left card p-3 flex items-center gap-3 hover:border-brand transition"
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden border border-token shrink-0">
                  <ProductImage src={p.image_url} name={p.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className={`text-xs font-mono ${p.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                    {p.stock === 0 ? "Sold out" : `${p.stock} left`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BigStat({ icon, label, value, accent, ...rest }) {
  return (
    <div className="card p-5" {...rest}>
      <div className="flex items-center justify-between">
        <div className="label-caps muted">{label}</div>
        <span className="h-8 w-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center">{icon}</span>
      </div>
      <div className={`mt-3 font-display font-bold text-2xl ${accent ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}

