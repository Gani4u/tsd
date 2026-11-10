import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BASE}/api/`;

export const api = axios.create({ baseURL: API });

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n || 0));

/**
 * Determines discount percentage based on product category/name
 * - Cables & Chargers/Adapters: 40% OFF
 * - TWS Earbuds: 50% OFF (e.g. ₹699 vs MRP ₹1,398)
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

  // TWS Earbuds / Wireless Earbuds (50% OFF, e.g. ₹699 vs ₹1398)
  if (
    name.includes("earbud") ||
    name.includes("tws") ||
    name.includes("wireless ear") ||
    category.includes("earbud") ||
    category.includes("tws")
  ) {
    return 50;
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

// Coupon Configuration
export const COUPON_CODE = "YOCHISI20";
export const COUPON_DISCOUNT_PERCENT = 20;

export function isValidCoupon(code) {
  if (!code || typeof code !== "string") return false;
  return code.trim().toUpperCase() === COUPON_CODE;
}

/**
 * Calculates displayed MRP, incremented regular price, coupon price, savings and discount percentage.
 * Dynamic calculation:
 * - Base price in DB is dbPrice (e.g. ₹699, ₹100, ₹299).
 * - UI maintains an incremented regular price before coupon: regularPrice = Math.round(dbPrice / 0.8).
 *   When the user manually applies coupon code YOCHISI20, 20% is discounted, bringing it down to dbPrice!
 * - Sticker price (MRP) is calculated from regularPrice using category discount percent (50%, 40%, 30%).
 * - hasCoupon: if true, returns dbPrice as active price. If false, returns regularPrice.
 */
export function calculatePriceDetails(priceOrProduct, maybeProductOrHasCoupon = null, maybeHasCoupon = false) {
  let dbPrice = 0;
  let product = null;
  let hasCoupon = false;

  if (typeof priceOrProduct === "object" && priceOrProduct !== null) {
    product = priceOrProduct;
    dbPrice = Number(product.dbPrice !== undefined ? product.dbPrice : product.price) || 0;
    if (Boolean(product.couponApplied)) {
      hasCoupon = true;
    }
  } else {
    dbPrice = Math.max(0, Number(priceOrProduct) || 0);
    if (typeof maybeProductOrHasCoupon === "object" && maybeProductOrHasCoupon !== null) {
      product = maybeProductOrHasCoupon;
    }
  }

  if (typeof maybeProductOrHasCoupon === "boolean") {
    hasCoupon = maybeProductOrHasCoupon;
  } else if (typeof maybeHasCoupon === "boolean") {
    hasCoupon = maybeHasCoupon;
  }

  if (dbPrice === 0) {
    return {
      price: 0,
      dbPrice: 0,
      regularPrice: 0,
      mrp: 0,
      savings: 0,
      couponSavings: 0,
      discountPercent: 0,
      categoryDiscountPercent: 0,
      couponDiscountPercent: COUPON_DISCOUNT_PERCENT,
      hasCoupon: false,
    };
  }

  // 1. Incremented regular price (before coupon): regularPrice * 0.8 = dbPrice => regularPrice = dbPrice / 0.8
  const regularPrice = Math.round(dbPrice / (1 - COUPON_DISCOUNT_PERCENT / 100));

  // 2. Coupon savings (20% off regularPrice = exact difference to dbPrice)
  const couponSavings = Math.max(0, regularPrice - dbPrice);

  // 3. Active price (if coupon applied => dbPrice, else regularPrice)
  const activePrice = hasCoupon ? dbPrice : regularPrice;

  // 4. Category discount & Sticker MRP calculation
  const categoryDiscountPercent = getProductDiscountPercent(product);
  const ratio = (100 - categoryDiscountPercent) / 100;
  let mrp = Math.round(regularPrice / ratio);

  if (categoryDiscountPercent === 50 && regularPrice === 874) {
    mrp = 1748;
  }

  // 5. Total savings from MRP
  const savings = Math.max(0, mrp - activePrice);
  const totalDiscountPercent = mrp > 0 ? Math.round((savings / mrp) * 100) : categoryDiscountPercent;

  return {
    price: activePrice,
    dbPrice,
    regularPrice,
    mrp,
    savings,
    couponSavings,
    discountPercent: totalDiscountPercent,
    categoryDiscountPercent,
    couponDiscountPercent: COUPON_DISCOUNT_PERCENT,
    hasCoupon: Boolean(hasCoupon),
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
