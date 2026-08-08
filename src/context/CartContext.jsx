import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);
const KEY = "tsd-cart-v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product_id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        const newQty = Math.min(
        next[idx].quantity + qty,
        product.stock
    );

    next[idx] = {
        ...next[idx],
        quantity: newQty,
        stock: product.stock
    };
        return next;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url || "",
          quantity: qty,
          stock: product.stock
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((product_id) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  }, []);

  const setQty = useCallback((product_id, qty) => {
    setItems(prev =>
        prev.map(item => {
            if(item.product_id !== product_id)
                return item;
            return {
                ...item,
                quantity: Math.min(
                    Math.max(1, qty),
                    item.stock
                )
            };
        })
    );
}, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const value = { items, count, subtotal, open, setOpen, add, remove, setQty, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }
