import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR, calculatePriceDetails } from "../lib/api";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { items, open, setOpen, remove, setQty, clear, subtotal, count } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  // Calculate MRP Total and Savings
  const mrpTotal = items.reduce((sum, item) => {
    const { mrp } = calculatePriceDetails(item);
    return sum + mrp * item.quantity;
  }, 0);

  const totalSavings = Math.max(0, mrpTotal - subtotal);

  return (
    <>
      <div className="fixed inset-0 z-[60] flex">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 bg-black/50 backdrop-blur-sm"
          aria-label="Close cart"
        />
        <aside className="w-full max-w-md h-full surface border-l border-token flex flex-col animate-fade-up">
          <div className="p-5 flex items-center justify-between border-b divider">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <h3 className="font-display text-lg font-bold">Your Bag</h3>
              <span className="chip">{count}</span>
            </div>
            <button
              data-testid="cart-close"
              onClick={() => setOpen(false)}
              className="h-9 w-9 rounded-full border border-token flex items-center justify-center hover:border-brand hover:text-brand transition"
            >
              <X size={16} />
            </button>
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
            ) : (
              items.map((i) => {
                const { mrp } = calculatePriceDetails(i);
                return (
                  <div
                    key={i.product_id}
                    className="flex gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                    data-testid={`cart-line-${i.product_id}`}
                  >
                    <div className="h-20 w-20 rounded-xl overflow-hidden border border-token shrink-0">
                      <ProductImage src={i.image_url} name={i.name} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold line-clamp-1">{i.name}</div>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-brand font-bold text-sm">
                              {formatINR(i.price)}
                            </span>
                            {mrp > i.price && (
                              <span className="text-xs muted line-through font-medium">
                                {formatINR(mrp)}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          data-testid={`cart-remove-${i.product_id}`}
                          onClick={() => remove(i.product_id)}
                          className="muted hover:text-red-500 shrink-0 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border border-token rounded-lg p-1">
                          <button
                            data-testid={`cart-qty-minus-${i.product_id}`}
                            onClick={() => setQty(i.product_id, i.quantity - 1)}
                            className="h-6 w-6 rounded flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 text-xs"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{i.quantity}</span>
                          <button
                            data-testid={`cart-qty-plus-${i.product_id}`}
                            onClick={() => setQty(i.product_id, i.quantity + 1)}
                            className="h-6 w-6 rounded flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 text-xs"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-xs font-semibold">
                          {formatINR(i.price * i.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t divider space-y-3">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-2 rounded-xl font-bold">
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} /> Special Offer Savings Applied
                  </span>
                  <span>- {formatINR(totalSavings)}</span>
                </div>
              )}

              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between text-xs muted">
                  <span>Total MRP</span>
                  <span className="line-through">{formatINR(mrpTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="muted text-sm">Final Amount</span>
                  <span className="font-display text-2xl font-bold text-brand">{formatINR(subtotal)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => clear()}
                  className="btn-ghost text-sm"
                  data-testid="cart-clear"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/checkout");
                  }}
                  className="btn-primary flex-1 justify-center shadow-glow"
                  data-testid="cart-checkout-btn"
                >
                  Checkout <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-[11px] muted text-center">Free Express Delivery · UPI & Cards Supported</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
