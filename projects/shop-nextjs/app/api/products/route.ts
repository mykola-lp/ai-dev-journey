import { NextRequest, NextResponse } from "next/server";
import {
  filterProducts,
  getAllProducts,
  parseFiltersFromSearchParams,
} from "@/lib/products";

/**
 * GET /api/products
 * Optional query params (bonus filtering requirement):
 *   ?category=chairs   -> only that categoryKey
 *   ?maxPrice=200       -> price <= 200
 * Both can be combined. Data is read from the local JSON file only --
 * no outbound network call, per the "local only" constraint.
 */
export async function GET(request: NextRequest) {
  const filters = parseFiltersFromSearchParams(request.nextUrl.searchParams);
  const result = filterProducts(getAllProducts(), filters);

  return NextResponse.json({ products: result, total: result.length });
}
