"use server";

import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { z } from "zod";

export type WaitlistResult =
  | { status: "ok"; firstName: string; email: string }
  | { status: "error"; message: string; fields?: Record<string, string>; values?: Record<string, string> };

const schema = z.object({
  firstName: z.string().trim().min(1, "Please tell us your first name.").max(60),
  whatsapp: z
    .string()
    .trim()
    .min(7, "Please enter your WhatsApp number.")
    .max(20)
    .regex(/^[+\d][\d\s()-]{6,}$/, "That doesn't look like a phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
});

// Tiny in-memory rate limit (per server instance) — enough to stop casual spam.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData,
): Promise<WaitlistResult> {
  // Honeypot: bots fill every field.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "ok", firstName: "", email: "" };
  }

  const values = {
    firstName: String(formData.get("firstName") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fields[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fields, values };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (limited(ip)) {
    return { status: "error", message: "Too many attempts. Please try again in a little while.", values };
  }

  const entry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...parsed.data,
    source: String(formData.get("source") ?? "landing"),
  };

  try {
    const hook = process.env.WAITLIST_WEBHOOK_URL;
    if (hook) {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "waitlist.jsonl"), JSON.stringify(entry) + "\n", "utf8");
    }
  } catch (err) {
    console.error("[waitlist] failed to store signup", err);
    return {
      status: "error",
      message: "Something went wrong on our side. Please try again, or message us on WhatsApp.",
      values,
    };
  }

  return { status: "ok", firstName: parsed.data.firstName, email: parsed.data.email };
}
