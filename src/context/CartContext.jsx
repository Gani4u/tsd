import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { calculatePriceDetails, isValidCoupon, COUPON_CODE } from "../lib/api";

const CartContext = createContext(null);
const KEY = "tsd-cart-v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.map((item) => {
        const hasCoupon = Boolean(item.couponApplied);
        const details = calculatePriceDetails(item, null, hasCoupon);
        return {
          ...item,
          dbPrice: details.dbPrice,
          regularPrice: details.regularPrice,
          price: details.price,
          mrp: details.mrp,
          couponApplied: hasCoupon,
          couponCode: hasCoupon ? item.couponCode || COUPON_CODE : "",
        };
      });
    } catch {
      return [];
    }
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = useCallback((product, qty = 1, withCoupon = false) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product_id === product.id);
      const details = calculatePriceDetails(product, null, withCoupon);

      if (idx >= 0) {
        const next = [...prev];
        const existing = next[idx];
        const newQty = Math.min(existing.quantity + qty, product.stock || existing.stock || 99);
        const shouldApplyCoupon = withCoupon || Boolean(existing.couponApplied);

        next[idx] = {
          ...existing,
          dbPrice: details.dbPrice,
          regularPrice: details.regularPrice,
          price: shouldApplyCoupon ? details.dbPrice : details.regularPrice,
          mrp: details.mrp,
          couponApplied: shouldApplyCoupon,
          couponCode: shouldApplyCoupon ? COUPON_CODE : "",
          quantity: newQty,
          stock: product.stock !== undefined ? product.stock : existing.stock,
        };
        return next;
      }

      const firstImg =
        product.thumbnail ||
        (Array.isArray(product.images) && product.images[0]
          ? typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0]?.image_url || product.images[0]?.url || ""
          : "") ||
        product.image_url ||
        product.image ||
        "";

      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          dbPrice: details.dbPrice,
          regularPrice: details.regularPrice,
          price: details.price,
          mrp: details.mrp,
          couponApplied: Boolean(withCoupon),
          couponCode: withCoupon ? COUPON_CODE : "",
          image_url: firstImg,
          quantity: qty,
          stock: product.stock,
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((product_id) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  }, []);

  const setQty = useCallback((product_id, qty) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product_id !== product_id) return item;
        return {
          ...item,
          quantity: Math.min(Math.max(1, qty), item.stock || 99),
        };
      })
    );
  }, []);

  const applyCouponToItem = useCallback((product_id, code) => {
    if (!isValidCoupon(code)) {
      return { success: false, message: "Coupon not applicable" };
    }

    let found = false;
    setItems((prev) =>
      prev.map((item) => {
        if (item.product_id !== product_id) return item;
        found = true;
        return {
          ...item,
          couponApplied: true,
          couponCode: COUPON_CODE,
          price: item.dbPrice,
        };
      })
    );

    return found
      ? { success: true, message: "20% OFF coupon applied!" }
      : { success: false, message: "Product not in cart." };
  }, []);

  const removeCouponFromItem = useCallback((product_id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product_id !== product_id) return item;
        return {
          ...item,
          couponApplied: false,
          couponCode: "",
          price: item.regularPrice,
        };
      })
    );
  }, []);

  const applyCouponToAll = useCallback((code) => {
    if (!isValidCoupon(code)) {
      return { success: false, message: "Coupon not applicable" };
    }

    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        couponApplied: true,
        couponCode: COUPON_CODE,
        price: item.dbPrice,
      }))
    );

    return { success: true, message: "20% OFF coupon applied to all items!" };
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const mrpTotal = useMemo(
    () => items.reduce((s, i) => s + (i.mrp || calculatePriceDetails(i).mrp) * i.quantity, 0),
    [items]
  );
  const couponSavingsTotal = useMemo(
    () =>
      items.reduce(
        (s, i) => (i.couponApplied ? s + (i.regularPrice - i.dbPrice) * i.quantity : s),
        0
      ),
    [items]
  );
  const totalSavings = useMemo(() => Math.max(0, mrpTotal - subtotal), [mrpTotal, subtotal]);

  const value = {
    items,
    count,
    subtotal,
    mrpTotal,
    totalSavings,
    couponSavingsTotal,
    open,
    setOpen,
    add,
    remove,
    setQty,
    clear,
    applyCouponToItem,
    removeCouponFromItem,
    applyCouponToAll,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
