import { calcOrder } from "@/lib/pricing";
import { orderSchema } from "@/lib/order-schema";
import { allow } from "@/lib/rate-limit";
import { formatOrderMessage, sendTelegram } from "@/lib/telegram";

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

function newOrderId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `KB-${Array.from(bytes, (b) => ID_CHARS[b % ID_CHARS.length]).join("")}`;
}

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!allow(ip)) return fail(429, "Забагато спроб. Спробуйте за хвилину.");

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return fail(400, "Некоректний запит.");
  }

  const parsed = orderSchema.safeParse(json);
  if (!parsed.success) return fail(400, "Перевірте дані замовлення.");
  const order = parsed.data;

  const orderId = newOrderId();
  if (order.website) return Response.json({ orderId });

  const totals = calcOrder(order.lines, order.method, order.zone);
  if (!totals) return fail(400, "Перевірте дані замовлення.");

  try {
    await sendTelegram(formatOrderMessage(order, orderId, totals));
  } catch (err) {
    console.error("order delivery to telegram failed", err);
    return fail(502, "Не вдалося надіслати замовлення.");
  }
  return Response.json({ orderId });
}
