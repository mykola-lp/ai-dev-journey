"use client";

import { type FormEvent, useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      locale,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="px-6 py-24 md:px-12 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <h2 className="text-2xl leading-snug md:text-3xl">{dict.contact.heading}</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">{dict.contact.sub}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:col-span-6 md:col-start-7">
          <label className="flex flex-col gap-2 text-sm">
            {dict.contact.name}
            <input
              name="name"
              type="text"
              required
              className="rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-base placeholder:text-ink/30"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            {dict.contact.phone}
            <input
              name="phone"
              type="tel"
              required
              className="rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-base placeholder:text-ink/30"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            {dict.contact.message}
            <textarea
              name="message"
              rows={3}
              className="rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-base placeholder:text-ink/30"
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 w-fit rounded-full bg-ink px-7 py-3 text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "sending" ? dict.contact.sending : dict.contact.submit}
          </button>

          <p aria-live="polite" className="text-sm">
            {status === "success" && <span className="text-sage">{dict.contact.success}</span>}
            {status === "error" && <span className="text-terracotta">{dict.contact.error}</span>}
          </p>
        </form>
      </div>
    </section>
  );
}
