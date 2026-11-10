import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR, calculatePriceDetails } from "../lib/api";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const {
    items,
    open,
    setOpen,
    remove,
    setQty,
    clear,
    subtotal,
    count,
    mrpTotal,
    totalSavings,
    couponSavingsTotal,
    removeCouponFromItem,
    applyCouponToAll,
  } = useCart();
  const navigate = useNavigate();
  const [bagCouponInput, setBagCouponInput] = useState("");
  const [bagCouponMsg, setBagCouponMsg] = useState("");

  if (!open) return null;

  const handleApplyBagCoupon = (e) => {
    e.preventDefault();
    if (!bagCouponInput.trim()) return;
    const res = applyCouponToAll(bagCouponInput);
    if (!res.success) {
      setBagCouponMsg(res.message);
    } else {
      setBagCouponMsg("");
      setBagCouponInput("");
    }
  };

  const hasAnyItemWithoutCoupon = items.some((i) => !i.couponApplied);

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
                <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
                  <ShoppingBag className="text-brand" />
                </div>
                <h4 className="mt-4 font-display text-xl font-bold">Nothing in here yet.</h4>
                <p className="muted text-sm mt-1">Browse the shop and drop your favourites in.</p>
              </div>
            ) : (
              items.map((i) => {
                const details = calculatePriceDetails(i, null, Boolean(i.couponApplied));
                const itemMrp = i.mrp || details.mrp;
                const regularPrice = i.regularPrice || details.regularPrice;

                return (
                  <div
                    key={i.product_id}
                    className="flex gap-3 p-3 rounded-2xl border border-token surface-subtle hover:border-brand/30 transition"
                    data-testid={`cart-line-${i.product_id}`}
                  >
                    <div className="h-20 w-20 rounded-xl overflow-hidden border border-token shrink-0">
                      <ProductImage src={i.image_url} name={i.name} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{i.name}</div>
                          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                            <span className="text-brand font-bold text-sm font-mono">
                              {formatINR(i.price)}
                            </span>
                            {i.couponApplied ? (
                              <span className="text-xs muted line-through font-mono" title="Price without coupon">
                                {formatINR(regularPrice)}
                              </span>
                            ) : (
                              itemMrp > i.price && (
                                <span className="text-xs muted line-through font-mono">
                                  {formatINR(itemMrp)}
                                </span>
                              )
                            )}
                          </div>

                          {/* Applied Coupon Badge */}
                          {i.couponApplied && (
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="chip !bg-emerald-500/15 !border-emerald-500/30 !text-emerald-500 text-[10px] font-bold py-0.5 px-2">
                                <Sparkles size={10} /> 20% OFF Applied
                              </span>
                              <button
                                type="button"
                                onClick={() => removeCouponFromItem(i.product_id)}
                                className="text-[10px] muted hover:text-red-400 underline transition"
                              >
                                Remove
                              </button>
                            </div>
                          )}
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

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-token/50">
                        <div className="flex items-center gap-2 border border-token rounded-lg p-1 bg-surface">
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
                        <span className="text-xs font-bold font-mono">
                          {formatINR(i.price * i.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Bag Coupon Input */}
            {items.length > 0 && hasAnyItemWithoutCoupon && (
              <div className="p-3.5 rounded-2xl border border-dashed border-token surface-subtle space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <Tag size={13} className="text-brand" /> Have a coupon code?
                  </span>
                </div>
                <form onSubmit={handleApplyBagCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={bagCouponInput}
                    onChange={(e) => {
                      setBagCouponInput(e.target.value);
                      if (bagCouponMsg) setBagCouponMsg("");
                    }}
                    placeholder="Enter coupon code"
                    className="input flex-1 uppercase font-mono tracking-wider text-xs py-1.5 px-3"
                  />
                  <button
                    type="submit"
                    className="btn-primary py-1.5 px-3.5 text-xs font-bold shrink-0"
                  >
                    Apply
                  </button>
                </form>
                {bagCouponMsg && <p className="text-[11px] text-red-400 font-medium">{bagCouponMsg}</p>}
              </div>
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

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-xs muted">
                  <span>Total MRP</span>
                  <span className="line-through font-mono">{formatINR(mrpTotal)}</span>
                </div>
                {couponSavingsTotal > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles size={11} /> Coupon Discount (20% OFF)
                    </span>
                    <span className="font-mono">- {formatINR(couponSavingsTotal)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t divider">
                  <span className="muted text-sm font-semibold">Final Amount</span>
                  <span className="font-mono text-2xl font-bold text-brand">{formatINR(subtotal)}</span>
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
