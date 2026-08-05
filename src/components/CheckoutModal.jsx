import React, { useState } from "react";
import { X, Shield, ArrowRight, CreditCard, Smartphone, Copy, Check, ExternalLink, Link2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { api, formatINR } from "../lib/api";
import { runCheckout } from "../lib/checkout";
import ProductImage from "./ProductImage";

/**
 * items: [{ product_id, name, price, quantity, image_url }]
 */
export default function CheckoutModal({ items, onClose, onSuccess }) {
  const [method, setMethod] = useState("razorpay_link"); // 'razorpay' | 'upi_qr' | 'razorpay_link'
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [upi, setUpi] = useState(null);   // UPI QR screen data
  const [link, setLink] = useState(null); // Razorpay Link screen data

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const payItems = items.map((i) => ({
    product_id: i.product_id, name: i.name, price: i.price,
    quantity: i.quantity, image_url: i.image_url || "",
  }));

  const submitRazorpay = async () => {
    setErr(""); setBusy(true);
    const res = await runCheckout({ items, customer: form });
    setBusy(false);
    if (res.ok) onSuccess(res.order_id);
    else setErr(res.error || "Payment failed");
  };

  const submitUpi = async () => {
    setErr(""); setBusy(true);
    try {
      const { data } = await api.post("/orders/upi", { items: payItems, customer: form });
      setUpi(data);
    } catch (e) {
      const d = e?.response?.data?.detail;
      setErr(typeof d === "string" ? d : "Could not create UPI order");
    } finally { setBusy(false); }
  };

  const submitLink = async () => {
    setErr(""); setBusy(true);
    try {
      const { data } = await api.post("/orders/razorpay-link", { items: payItems, customer: form });
      setLink(data);
      window.open(data.payment_link, "_blank", "noopener,noreferrer");
    } catch (e) {
      const d = e?.response?.data?.detail;
      setErr(typeof d === "string" ? d : "Could not create Razorpay link order");
    } finally { setBusy(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (method === "razorpay") submitRazorpay();
    else if (method === "upi_qr") submitUpi();
    else submitLink();
  };

  const confirmUpiPaid = async () => {
    if (!upi) return;
    setBusy(true);
    try {
      await api.post("/orders/upi/submitted", { order_id: upi.order_id, upi_txn_ref: "" });
      onSuccess(upi.order_id);
    } catch { setErr("Could not mark as paid"); } finally { setBusy(false); }
  };

  const confirmLinkPaid = async () => {
    if (!link) return;
    setBusy(true);
    try {
      await api.post("/orders/razorpay-link/submitted", { order_id: link.order_id, reference: "" });
      onSuccess(link.order_id);
    } catch { setErr("Could not confirm payment"); } finally { setBusy(false); }
  };

  // UPI QR screen
  if (upi) {
    return (
      <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-3" data-testid="upi-pay-modal">
        <div className="w-full max-w-md card p-6 my-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="label-caps muted">UPI QR</div>
              <h3 className="font-display text-xl font-bold">Scan to pay</h3>
            </div>
            <button onClick={onClose} className="h-9 w-9 rounded-full border border-token flex items-center justify-center"><X size={16} /></button>
          </div>
          <div className="bg-white rounded-2xl p-4 flex items-center justify-center" data-testid="upi-qr">
            <QRCodeSVG value={upi.upi_uri} size={240} level="M" includeMargin={false} />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-3xl font-black text-brand">{formatINR(upi.amount_inr)}</div>
            <div className="muted text-xs mt-1">to</div>
            <UpiVpaRow vpa={upi.upi_vpa} />
          </div>
          <div className="mt-5 card p-3 text-xs muted">Open GPay / PhonePe / Paytm / any UPI app and scan the code. Amount is pre-filled.</div>
          {err && <div className="mt-3 text-sm text-red-500" data-testid="upi-error">{err}</div>}
          <button onClick={confirmUpiPaid} disabled={busy} className="btn-primary w-full justify-center mt-4" data-testid="upi-ive-paid">
            <Check size={16} /> {busy ? "Confirming…" : "I've paid — confirm"}
          </button>
          <button onClick={() => setUpi(null)} className="btn-ghost w-full justify-center mt-2 text-sm" data-testid="upi-back">Back to methods</button>
          <p className="text-[10px] muted text-center mt-3">Order will be verified by our team within 10 minutes.</p>
        </div>
      </div>
    );
  }

  // Razorpay Link screen
  if (link) {
    return (
      <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-3" data-testid="link-pay-modal">
        <div className="w-full max-w-md card p-6 my-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="label-caps muted">Razorpay Link</div>
              <h3 className="font-display text-xl font-bold">Complete payment</h3>
            </div>
            <button onClick={onClose} className="h-9 w-9 rounded-full border border-token flex items-center justify-center"><X size={16} /></button>
          </div>
          <div className="card p-5 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-brand/15 flex items-center justify-center">
              <Link2 size={22} className="text-brand" />
            </div>
            <div className="mt-3 font-display text-2xl font-black text-brand">{formatINR(link.amount_inr)}</div>
            <div className="muted text-sm mt-1">Reference · <span className="font-mono">{link.receipt}</span></div>
          </div>
          <p className="mt-4 text-sm muted">
            We opened Razorpay in a new tab. Finish payment there (UPI, Card, Netbanking, Wallets) and come back to confirm.
          </p>
          <a href={link.payment_link} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full justify-center mt-4" data-testid="link-open">
            <ExternalLink size={14} /> Open payment page again
          </a>
          {err && <div className="mt-3 text-sm text-red-500" data-testid="link-error">{err}</div>}
          <button onClick={confirmLinkPaid} disabled={busy} className="btn-primary w-full justify-center mt-4" data-testid="link-ive-paid">
            <Check size={16} /> {busy ? "Confirming…" : "I've paid — confirm"}
          </button>
          <button onClick={() => setLink(null)} className="btn-ghost w-full justify-center mt-2 text-sm" data-testid="link-back">Back to methods</button>
          <p className="text-[10px] muted text-center mt-3">Our team verifies each payment within 10 minutes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-3" data-testid="checkout-modal">
      <div className="w-full max-w-3xl card p-0 my-6">
        <div className="flex items-center justify-between p-5 border-b divider">
          <div>
            <div className="label-caps muted">Secure Checkout</div>
            <h3 className="font-display text-xl font-bold">Almost there.</h3>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full border border-token flex items-center justify-center" data-testid="checkout-close"><X size={16} /></button>
        </div>

        <div className="grid md:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="p-5 md:p-6 space-y-4">
            {/* Payment method tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl border border-token surface">
              <PmTab active={method==="razorpay_link"} onClick={() => setMethod("razorpay_link")} icon={<Link2 size={14} />} label="Razorpay Link" testid="pm-link" />
              <PmTab active={method==="upi_qr"} onClick={() => setMethod("upi_qr")} icon={<Smartphone size={14} />} label="UPI QR" testid="pm-upi-qr" />
              <PmTab active={method==="razorpay"} onClick={() => setMethod("razorpay")} icon={<CreditCard size={14} />} label="Checkout" testid="pm-razorpay" />
            </div>

            <div>
              <label className="label-caps muted">Full Name</label>
              <input required data-testid="co-name" className="input mt-2" value={form.name} onChange={set("name")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps muted">Email</label>
                <input required type="email" data-testid="co-email" className="input mt-2" value={form.email} onChange={set("email")} />
              </div>
              <div>
                <label className="label-caps muted">Phone</label>
                <input required data-testid="co-phone" className="input mt-2" value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="+91 …" />
              </div>
            </div>
            <div>
              <label className="label-caps muted">Address</label>
              <textarea required rows={2} data-testid="co-address" className="input mt-2" value={form.address} onChange={set("address")} placeholder="Building, Street, Locality" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps muted">City</label>
                <input data-testid="co-city" className="input mt-2" value={form.city} onChange={set("city")} />
              </div>
              <div>
                <label className="label-caps muted">Pincode</label>
                <input data-testid="co-pincode" className="input mt-2" value={form.pincode} onChange={set("pincode")} inputMode="numeric" />
              </div>
            </div>
            {err && <div className="text-sm text-red-500" data-testid="checkout-error">{err}</div>}
            <button type="submit" disabled={busy || items.length === 0} data-testid="checkout-pay-btn" className="btn-primary w-full justify-center">
              {busy
                ? (method === "razorpay" ? "Opening Razorpay…" : method === "upi_qr" ? "Generating QR…" : "Opening payment page…")
                : (<>{method === "razorpay" ? "Pay" : method === "upi_qr" ? "Show UPI QR for" : "Continue to pay"} {formatINR(total)} <ArrowRight size={16} /></>)}
            </button>
            <div className="flex items-center gap-2 text-xs muted">
              <Shield size={14} className="text-brand" />
              {method === "razorpay" ? "Secured by Razorpay · Test Mode"
                : method === "upi_qr" ? "Direct UPI · Confirmation within 10 min"
                : "Hosted by Razorpay · UPI, Card, Netbanking"}
            </div>
          </form>

          <aside className="p-5 md:p-6 border-t md:border-t-0 md:border-l divider">
            <div className="label-caps muted mb-3">Your order</div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.product_id} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border border-token shrink-0">
                    <ProductImage src={i.image_url} name={i.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{i.name}</div>
                    <div className="text-xs muted">Qty {i.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatINR(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t divider space-y-2 text-sm">
              <div className="flex justify-between"><span className="muted">Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="muted">Shipping</span><span className="text-brand">Free</span></div>
              <div className="flex justify-between font-display font-bold text-lg pt-2 border-t divider mt-2">
                <span>Total</span><span>{formatINR(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PmTab({ active, onClick, icon, label, testid }) {
  return (
    <button type="button" data-testid={testid} onClick={onClick}
      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${active ? "bg-brand text-white shadow-glow" : "muted hover:text-current"}`}>
      {icon} {label}
    </button>
  );
}

function UpiVpaRow({ vpa }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(vpa);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button onClick={copy} data-testid="upi-vpa" className="mt-1 inline-flex items-center gap-2 chip font-mono text-sm">
      {vpa} {copied ? <Check size={12} className="text-brand" /> : <Copy size={12} />}
    </button>
  );
}
