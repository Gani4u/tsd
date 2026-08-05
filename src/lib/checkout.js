import { api } from "./api";

const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export function loadRazorpay() {
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

/**
 * Runs the full Razorpay checkout flow.
 * items: [{ product_id, quantity }]  (backend re-validates + computes total)
 * customer: { name, email, phone, address, city, pincode }
 * Returns { ok, order_id, status } or { ok: false, error }
 */
export async function runCheckout({ items, customer, theme = "#FF4500" }) {
  const ok = await loadRazorpay();
  if (!ok) return { ok: false, error: "Failed to load Razorpay Checkout" };

  let order;
  try {
    const { data } = await api.post("/orders", {
      items: items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image_url: i.image_url || "",
      })),
      customer,
    });
    order = data;
  } catch (e) {
    const d = e?.response?.data?.detail;
    return { ok: false, error: typeof d === "string" ? d : "Could not create order" };
  }

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      order_id: order.razorpay_order_id,
      name: "TSD World",
      description: "Premium audio & tech",
      image: "/favicon.svg",
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      notes: {
        address: customer.address,
        city: customer.city || "",
        pincode: customer.pincode || "",
      },
      theme: { color: theme },
      modal: {
        ondismiss: () => resolve({ ok: false, error: "Payment cancelled" }),
      },
      handler: async (response) => {
        try {
          await api.post("/orders/verify", {
            order_id: order.order_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve({ ok: true, order_id: order.order_id, status: "paid", payment_id: response.razorpay_payment_id });
        } catch (e) {
          resolve({ ok: false, error: "Payment verification failed" });
        }
      },
    });
    rzp.open();
  });
}
