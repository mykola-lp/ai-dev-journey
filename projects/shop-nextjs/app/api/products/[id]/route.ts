import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = getProductById(params.id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
