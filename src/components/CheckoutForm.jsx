import React, { useState } from "react";
import { Shield, ArrowRight, CreditCard, Smartphone, Tag } from "lucide-react";
import { api, formatINR, formatApiError, calculatePriceDetails } from "../lib/api";
import ProductImage from "./ProductImage";

const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${RZP_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = RZP_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutForm({ items, onSuccess }) {
  const [method, setMethod] = useState("cod"); // 'razorpay' | 'cod'
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal;

  // Calculate MRP Total and Savings
  const mrpTotal = items.reduce((sum, item) => {
    const { mrp } = calculatePriceDetails(item);
    return sum + mrp * item.quantity;
  }, 0);
  const totalSavings = Math.max(0, mrpTotal - total);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const payItems = items.map((i) => ({
    product_id: i.product_id,
    quantity: i.quantity,
  }));

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setErr("");
    setBusy(true);
    try {
      // 1. Create order on PHP Backend
      let order;
      if (method === "cod") {
        const res = await api.post("/orders", {
          customer: form,
          items: payItems,
          payment_method: "COD",
        });
        order = res.data;
      } else {
        const res = await api.post("/payment/create-order", {
          customer: form,
          items: payItems,
        });
        order = res.data;
      }

      if (method === "cod") {
        setBusy(false);
        onSuccess(order.order_id || order.id);
      } else {
        // 2. Razorpay Flow
        const ok = await loadRazorpay();
        if (!ok) {
          setErr("Failed to load Razorpay Checkout SDK");
          setBusy(false);
          return;
        }

        const rzp = new window.Razorpay({
          key: order.key_id,
          amount: order.amount,
          currency: order.currency || "INR",
          order_id: order.razorpay_order_id,
          name: "TSD World",
          description: "Premium audio & tech",
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#00DFD8" },
          modal: {
            ondismiss: () => {
              setErr("Payment cancelled by user");
              setBusy(false);
            },
          },
          handler: async (response) => {
            try {
              const verify = await api.post("/payment/verify", {
                customer: form,
                items: payItems,
                payment_method: "RAZORPAY",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              setBusy(false);
              onSuccess(verify.data.order_id);
            } catch (err) {
              console.error("VERIFY ERROR", err);
              setBusy(false);
              setErr(
                err.response?.data?.message ||
                "Payment verification failed"
              );
            }
          },
        });
        rzp.open();
      }
    } catch (apiErr) {
      setErr(formatApiError(apiErr) || "Failed to create order. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
      <form onSubmit={submit} className="card p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold">Shipping Details</h2>
          <p className="muted text-xs sm:text-sm mt-1">Where should we deliver your sound gear?</p>
        </div>

        {/* Payment method selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setMethod("cod")}
            className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition ${
              method === "cod" ? "border-brand bg-brand/5 text-current shadow-glow" : "border-token muted hover:text-current"
            }`}
          >
            <Smartphone size={20} className={method === "cod" ? "text-brand" : ""} />
            <span className="text-sm font-semibold mt-2">Cash on Delivery</span>
            <span className="text-[10px] muted mt-0.5">Pay upon delivery</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod("razorpay")}
            className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition ${
              method === "razorpay" ? "border-brand bg-brand/5 text-current shadow-glow" : "border-token muted hover:text-current"
            }`}
          >
            <CreditCard size={20} className={method === "razorpay" ? "text-brand" : ""} />
            <span className="text-sm font-semibold mt-2">Pay Online</span>
            <span className="text-[10px] muted mt-0.5">UPI, Cards, Netbanking</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-caps muted">Full Name</label>
            <input
              required
              data-testid="co-name"
              className="input mt-1.5"
              value={form.name}
              onChange={set("name")}
              placeholder="Aravind Kumar"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="label-caps muted">Email Address</label>
              <input
                required
                type="email"
                data-testid="co-email"
                className="input mt-1.5"
                value={form.email}
                onChange={set("email")}
                placeholder="you@gmail.com"
              />
            </div>
            <div>
              <label className="label-caps muted">Phone Number</label>
              <input
                required
                data-testid="co-phone"
                className="input mt-1.5"
                value={form.phone}
                onChange={set("phone")}
                inputMode="tel"
                placeholder="+91 99000 00000"
              />
            </div>
          </div>
          <div>
            <label className="label-caps muted">Street Address</label>
            <textarea
              required
              rows={2}
              data-testid="co-address"
              className="input mt-1.5"
              value={form.address}
              onChange={set("address")}
              placeholder="House/Flat No, Apartment/Street, Landmark"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="label-caps muted">City</label>
              <input
                required
                data-testid="co-city"
                className="input mt-1.5"
                value={form.city}
                onChange={set("city")}
                placeholder="Bengaluru"
              />
            </div>
            <div>
              <label className="label-caps muted">State</label>
              <input
                required
                data-testid="co-state"
                className="input mt-1.5"
                value={form.state}
                onChange={set("state")}
                placeholder="Karnataka"
              />
            </div>
            <div>
              <label className="label-caps muted">Pincode</label>
              <input
                required
                data-testid="co-pincode"
                className="input mt-1.5"
                value={form.pincode}
                onChange={set("pincode")}
                inputMode="numeric"
                placeholder="560001"
              />
            </div>
          </div>
        </div>

        {err && <div className="text-sm text-red-500 font-semibold" data-testid="checkout-error">{err}</div>}

        <button
          type="submit"
          disabled={busy || items.length === 0}
          data-testid="checkout-pay-btn"
          className="btn-primary w-full justify-center py-3.5 text-base shadow-glow font-bold"
        >
          {busy
            ? (method === "razorpay" ? "Loading payment screen..." : "Booking order...")
            : (
              <>
                Confirm order · {formatINR(total)} <ArrowRight size={16} />
              </>
            )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs muted text-center">
          <Shield size={14} className="text-brand shrink-0" />
          Secure checkout handled by direct TSD systems.
        </div>
      </form>

      {/* ORDER SUMMARY SIDEBAR */}
      <aside className="card p-4 sm:p-6 divide-y divider space-y-4">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg">Order Summary</h3>
          <p className="muted text-xs mt-0.5">{items.reduce((s, i) => s + i.quantity, 0)} items in bag</p>
        </div>

        <div className="pt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
          {items.map((i) => {
            const { mrp } = calculatePriceDetails(i);
            return (
              <div key={i.product_id} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden border border-token shrink-0">
                  <ProductImage src={i.image_url} name={i.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{i.name}</div>
                  <div className="text-xs muted">Qty {i.quantity}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-brand">{formatINR(i.price * i.quantity)}</div>
                  {mrp > i.price && (
                    <div className="text-[11px] muted line-through">{formatINR(mrp * i.quantity)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {totalSavings > 0 && (
          <div className="pt-3">
            <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-2 rounded-xl font-bold">
              <span className="flex items-center gap-1.5">
                <Tag size={13} /> Special Offer Savings Applied
              </span>
              <span>- {formatINR(totalSavings)}</span>
            </div>
          </div>
        )}

        <div className="pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-xs muted">
            <span>Total MRP</span>
            <span className="line-through">{formatINR(mrpTotal)}</span>
          </div>
          {totalSavings > 0 && (
            <div className="flex justify-between text-xs text-emerald-500 font-semibold">
              <span>Instant Discount</span>
              <span>- {formatINR(totalSavings)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="muted">Delivery Fee</span>
            <span className="text-brand font-semibold">FREE</span>
          </div>
          <div className="flex justify-between font-display font-bold text-lg pt-2 border-t divider mt-2">
            <span>Total Payable</span>
            <span className="text-brand">{formatINR(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}