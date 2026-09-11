import { NextRequest, NextResponse } from "next/server";

import { insertCallbackRequest } from "@/lib/db";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { name, phone, message, locale } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name_required" }, { status: 400 });
  }
  if (typeof phone !== "string" || phone.trim().length < 5) {
    return NextResponse.json({ error: "phone_required" }, { status: 400 });
  }

  const safeLocale = typeof locale === "string" && isLocale(locale) ? locale : defaultLocale;

  try {
    const id = insertCallbackRequest({
      name: name.trim().slice(0, 200),
      phone: phone.trim().slice(0, 40),
      message: typeof message === "string" ? message.trim().slice(0, 2000) : undefined,
      locale: safeLocale,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("callback_request_insert_failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
