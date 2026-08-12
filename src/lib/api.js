import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BASE}/api/`;

export const api = axios.create({ baseURL: API });

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n || 0));

/**
 * Determines discount percentage based on product category/name
 * - Cables & Chargers/Adapters: 40% OFF
 * - TWS Earbuds: 47% OFF (e.g. ₹799 vs MRP ₹1,499)
 * - Wired Earphones: 30% OFF
 * - Default: 30% OFF
 */
export function getProductDiscountPercent(productOrItem) {
  if (!productOrItem) return 30;
  if (typeof productOrItem === "number" || typeof productOrItem === "string") {
    return 30;
  }
  const name = String(productOrItem.name || productOrItem.title || "").toLowerCase();
  const category = String(productOrItem.category || "").toLowerCase();
  const desc = String(productOrItem.description || "").toLowerCase();

  // TWS Earbuds / Wireless Earbuds (47% OFF, e.g. ₹799 vs ₹1499)
  if (
    name.includes("earbud") ||
    name.includes("tws") ||
    name.includes("wireless ear") ||
    category.includes("earbud") ||
    category.includes("tws")
  ) {
    return 47;
  }

  // Chargers / Adapters (40% OFF)
  if (
    name.includes("charger") ||
    name.includes("adapter") ||
    category.includes("charger") ||
    category.includes("adapter") ||
    desc.includes("dual port")
  ) {
    return 40;
  }

  // Charger Cables (40% OFF)
  if (
    name.includes("cable") ||
    category.includes("cable") ||
    name.includes("usb-a to type-c") ||
    name.includes("type-c to")
  ) {
    return 40;
  }

  // Wired Earphones (30% OFF)
  if (
    name.includes("earphone") ||
    name.includes("wired") ||
    category.includes("earphone") ||
    name.includes("headphone")
  ) {
    return 30;
  }

  return 30;
}

/**
 * Calculates displayed MRP, discounted price, savings and discount percentage
 * Dynamic calculation: UI shows increased MRP and applies discount to yield DB price
 */
export function calculatePriceDetails(priceOrProduct, maybeProduct = null) {
  let sellingPrice = 0;
  let product = null;

  if (typeof priceOrProduct === "object" && priceOrProduct !== null) {
    sellingPrice = Number(priceOrProduct.price) || 0;
    product = priceOrProduct;
  } else {
    sellingPrice = Math.max(0, Number(priceOrProduct) || 0);
    product = maybeProduct;
  }

  if (sellingPrice === 0) {
    return { price: 0, mrp: 0, savings: 0, discountPercent: 0 };
  }

  const discountPercent = getProductDiscountPercent(product);
  const ratio = (100 - discountPercent) / 100;
  
  let mrp = Math.round(sellingPrice / ratio);
  if (discountPercent === 47 && sellingPrice === 799) {
    mrp = 1499;
  }

  const savings = Math.max(0, mrp - sellingPrice);
  const actualDiscountPercent = mrp > 0 ? Math.round((savings / mrp) * 100) : discountPercent;

  return {
    price: sellingPrice,
    mrp,
    savings,
    discountPercent: actualDiscountPercent,
  };
}

export function formatApiError(err) {
  const d = err?.response?.data?.detail;
  if (!d) return err?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return typeof d === "object" ? (d.msg || JSON.stringify(d)) : String(d);
}

export const getProducts = async (searchOrParams = "") => {
  const params =
    typeof searchOrParams === "string"
      ? (searchOrParams ? { search: searchOrParams } : {})
      : (searchOrParams || {});
  const response = await api.get("/products", { params });
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.products)) return data.products;
  return [];
};

export const getProductById = async (id) => {
  const response = await api.get("/products", { params: { id } });
  const data = response.data;
  if (Array.isArray(data)) {
    return data.find((p) => String(p.id) === String(id)) || null;
  }
  if (data && Array.isArray(data.products)) {
    return data.products.find((p) => String(p.id) === String(id)) || null;
  }
  if (data && data.product) {
    return data.product;
  }
  if (data && typeof data === "object" && data.id) {
    return data;
  }
  return null;
};

export default api;
