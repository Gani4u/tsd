import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import CheckoutForm from "../components/CheckoutForm";

export default function Checkout() {
  const { items, clear } = useCart();
  const [confirmed, setConfirmed] = useState(null);

  const handleSuccess = (orderId) => {
    setConfirmed(orderId);
    clear();
  };

  if (confirmed) {
    return (
      <div className="container-x py-24 flex items-center justify-center" data-testid="order-success">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/15 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold">Order placed successfully!</h3>
          <p className="muted mt-2 text-sm">We've received your order. We'll send your invoice and delivery tracking details shortly.</p>
          <div className="mt-4 chip font-mono text-xs">#{confirmed}</div>
          <Link to="/shop" className="btn-primary w-full justify-center mt-6" data-testid="order-success-close">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/15 flex items-center justify-center">
          <ShoppingBag className="text-brand" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Your bag is empty.</h2>
        <p className="muted text-sm mt-2">Add some items from the shop first to proceed to checkout.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <div className="mb-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm muted hover:text-brand mb-4">
          <ArrowLeft size={14} /> Back to shop
        </Link>
        <h1 className="font-display font-extrabold text-3xl tracking-tight md:text-4xl">Checkout</h1>
      </div>

      <CheckoutForm items={items} onSuccess={handleSuccess} />
    </div>
  );
}
