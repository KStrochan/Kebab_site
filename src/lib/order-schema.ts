import { z } from "zod";

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("380")) return `0${digits.slice(3)}`;
  if (digits.length === 10 && digits.startsWith("0")) return digits;
  return null;
}

const lineSchema = z.object({
  itemId: z.string().min(1).max(64),
  variantId: z.string().max(32).optional(),
  addonIds: z.array(z.string().max(32)).max(12).default([]),
  qty: z.number().int().min(1).max(20),
});

export const orderSchema = z
  .object({
    name: z.string().trim().min(2).max(60),
    phone: z
      .string()
      .refine((p) => normalizePhone(p) !== null, "Невірний номер телефону")
      .transform((p) => normalizePhone(p)!),
    method: z.enum(["delivery", "pickup"]),
    zone: z.enum(["stryi", "near", "far"]).optional(),
    address: z.string().trim().max(200).optional(),
    time: z.string().trim().max(40).optional(),
    comment: z.string().trim().max(500).optional(),
    lines: z.array(lineSchema).min(1).max(30),
    website: z.string().max(200).optional(),
  })
  .superRefine((o, ctx) => {
    if (o.method !== "delivery") return;
    if (!o.zone) ctx.addIssue({ code: "custom", path: ["zone"], message: "Оберіть зону доставки" });
    if (!o.address || o.address.length < 5) {
      ctx.addIssue({ code: "custom", path: ["address"], message: "Вкажіть адресу" });
    }
  });

export type OrderInput = z.infer<typeof orderSchema>;
