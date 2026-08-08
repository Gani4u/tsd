import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BASE}/api/`;

export const api = axios.create({ baseURL: API });

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n || 0));

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
