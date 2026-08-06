import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR } from "../lib/api";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { items, open, setOpen, remove, setQty, clear, subtotal, count } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex">
        <button onClick={() => setOpen(false)} className="flex-1 bg-black/50 backdrop-blur-sm" aria-label="Close cart" />
        <aside className="w-full max-w-md h-full surface border-l border-token flex flex-col animate-fade-up">
          <div className="p-5 flex items-center justify-between border-b divider">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <h3 className="font-display text-lg font-bold">Your Bag</h3>
              <span className="chip">{count}</span>
            </div>
            <button data-testid="cart-close" onClick={() => setOpen(false)} className="h-9 w-9 rounded-full border border-token flex items-center justify-center"><X size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/15 flex items-center justify-center">
                  <ShoppingBag className="text-brand" />
                </div>
                <h4 className="mt-4 font-display text-xl font-bold">Nothing in here yet.</h4>
                <p className="muted text-sm mt-1">Browse the shop and drop your favourites in.</p>
              </div>
            ) : items.map((i) => (
              <div key={i.product_id} className="flex gap-3" data-testid={`cart-line-${i.product_id}`}>
                <div className="h-20 w-20 rounded-xl overflow-hidden border border-token shrink-0">
                  <ProductImage src={i.image_url} name={i.name} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold line-clamp-2">{i.name}</div>
                      <div className="text-brand font-bold text-sm mt-1">{formatINR(i.price)}</div>
                    </div>
                    <button data-testid={`cart-remove-${i.product_id}`} onClick={() => remove(i.product_id)} className="muted hover:text-red-500 shrink-0"><Trash2 size={14} /></button>
                  </div>
                  <div className="mt-auto flex items-center gap-2">
                    <button data-testid={`cart-dec-${i.product_id}`} onClick={() => setQty(i.product_id, i.quantity - 1)} className="h-7 w-7 rounded-full border border-token flex items-center justify-center"><Minus size={12} /></button>
                    <span className="text-sm font-semibold w-6 text-center">{i.quantity}</span>
                    <button data-testid={`cart-inc-${i.product_id}`} onClick={() => setQty(i.product_id, i.quantity + 1)} className="h-7 w-7 rounded-full border border-token flex items-center justify-center"><Plus size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t divider space-y-3">
              <div className="flex items-center justify-between">
                <div className="muted text-sm">Subtotal</div>
                <div className="font-display text-2xl font-bold">{formatINR(subtotal)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => clear()} className="btn-ghost text-sm" data-testid="cart-clear">Clear</button>
                <button
                  onClick={() => { setOpen(false); navigate("/checkout"); }}
                  className="btn-primary flex-1 justify-center"
                  data-testid="cart-checkout-btn"
                >
                  Checkout <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-xs muted text-center">Checkout · UPI & Cards supported</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
