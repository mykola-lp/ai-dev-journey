import productsData from "@/data/products.json";
import type { Product } from "./types";

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): { key: string; name: Product["category"] }[] {
  const seen = new Map<string, Product["category"]>();
  for (const p of products) {
    if (!seen.has(p.categoryKey)) seen.set(p.categoryKey, p.category);
  }
  return Array.from(seen, ([key, name]) => ({ key, name }));
}

export interface ProductFilters {
  category?: string | null;
  maxPrice?: number | null;
}

/**
 * Applies the (bonus) category/price filters. Kept as a pure function so it
 * can be unit-tested and is reused identically by both API route handlers.
 */
export function filterProducts(list: Product[], filters: ProductFilters): Product[] {
  return list.filter((p) => {
    if (filters.category && p.categoryKey !== filters.category) return false;
    if (typeof filters.maxPrice === "number" && p.price > filters.maxPrice) return false;
    return true;
  });
}

export function parseFiltersFromSearchParams(params: URLSearchParams): ProductFilters {
  const category = params.get("category");
  const maxPriceRaw = params.get("maxPrice");
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : null;
  return {
    category: category && category !== "all" ? category : null,
    maxPrice: maxPrice && !Number.isNaN(maxPrice) ? maxPrice : null,
  };
}
