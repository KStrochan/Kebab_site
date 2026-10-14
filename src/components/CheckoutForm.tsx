"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ZONES, type DeliveryZone } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { getOpenStatus } from "@/lib/hours";
import { normalizePhone } from "@/lib/order-schema";
import { calcOrder, type Method } from "@/lib/pricing";

const VENUE_PHONE = "0 (73) 088 80 87";

type Errors = Partial<Record<"name" | "phone" | "address", string>>;

const inputClass =
  "mt-1 min-h-12 w-full rounded-lg border border-line bg-bg-deep px-3 py-2.5 text-base text-text placeholder:text-text/40 focus-visible:outline-2 focus-visible:outline-gold";

export function CheckoutForm({ onSuccess }: { onSuccess: (orderId: string) => void }) {
  const { lines, clear } = useCart();
  const [method, setMethod] = useState<Method>("delivery");
  const [zone, setZone] = useState<DeliveryZone>("stryi");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const [status] = useState(() => getOpenStatus(new Date()));

  const totals = calcOrder(lines, method, method === "delivery" ? zone : undefined);

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Вкажіть ім'я";
    if (normalizePhone(phone) === null) e.phone = "Вкажіть коректний номер телефону";
    if (method === "delivery" && address.trim().length < 5) e.address = "Вкажіть адресу доставки";
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (inFlight.current || !totals) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    inFlight.current = true;
    setSubmitting(true);
    setFailed(false);
    setRejected(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          method,
          zone: method === "delivery" ? zone : undefined,
          address: method === "delivery" ? address.trim() : undefined,
          time: method === "pickup" && time.trim() ? time.trim() : undefined,
          comment: comment.trim() || undefined,
          lines,
          website,
        }),
      });
      if (res.status === 400 || res.status === 429) {
        // The guest can fix these (bad data, too many tries): show the server's reason, not "call us".
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setRejected(data.error ?? "Перевірте дані замовлення й спробуйте ще раз.");
        return;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as { orderId: string };
      clear();
      onSuccess(data.orderId);
    } catch {
      setFailed(true);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {!status.open && (
        <p className="rounded-lg border border-line bg-bg-deep p-3 text-sm text-text/80">
          Зараз зачинено. Замовлення ми приймемо, але приготуємо його після відкриття.
        </p>
      )}

      <fieldset className="flex gap-2">
        <legend className="sr-only">Спосіб отримання</legend>
        {(
          [
            ["delivery", "Доставка"],
            ["pickup", "Самовивіз"],
          ] as const
        ).map(([value, label]) => (
          <label
            key={value}
            className="flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-lg border border-line text-center transition has-[:checked]:border-gold has-[:checked]:bg-gold has-[:checked]:text-bg-deep has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold"
          >
            <input
              type="radio"
              name="method"
              value={value}
              checked={method === value}
              onChange={() => setMethod(value)}
              className="sr-only"
              aria-label={label}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <label className="block text-sm">
        Ім&apos;я
        <input
          className={inputClass}
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          enterKeyHint="next"
        />
        {errors.name && (
          <span role="alert" className="mt-1 block text-red-300">
            {errors.name}
          </span>
        )}
      </label>

      <label className="block text-sm">
        Телефон
        <input
          className={inputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="0XX XXX XX XX"
        />
        {errors.phone && (
          <span role="alert" className="mt-1 block text-red-300">
            {errors.phone}
          </span>
        )}
      </label>

      {method === "delivery" ? (
        <>
          <label className="block text-sm">
            Зона доставки
            <select
              className={inputClass}
              value={zone}
              onChange={(e) => setZone(e.target.value as DeliveryZone)}
            >
              {(Object.keys(ZONES) as DeliveryZone[]).map((z) => (
                <option key={z} value={z}>
                  {ZONES[z].label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Адреса
            <input
              className={inputClass}
              value={address}
              maxLength={200}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
              enterKeyHint="next"
              placeholder="Вулиця, будинок, квартира"
            />
            {errors.address && (
              <span role="alert" className="mt-1 block text-red-300">
                {errors.address}
              </span>
            )}
          </label>
        </>
      ) : (
        <label className="block text-sm">
          Час (необов&apos;язково)
          <input
            className={inputClass}
            value={time}
            maxLength={40}
            onChange={(e) => setTime(e.target.value)}
            placeholder="наприклад, 18:30"
          />
        </label>
      )}

      <label className="block text-sm">
        Коментар
        <textarea
          className={inputClass}
          rows={2}
          value={comment}
          maxLength={500}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Не заповнюйте це поле
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div className="sticky bottom-0 -mx-5 space-y-3 border-t border-line bg-bg px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
      <dl className="space-y-1 text-sm">
        <div className="flex justify-between">
          <dt>Страви</dt>
          <dd>{totals?.subtotal ?? 0} грн</dd>
        </div>
        {method === "delivery" && (
          <div className="flex justify-between">
            <dt>Доставка</dt>
            <dd>
              <span data-testid="delivery">{totals?.delivery ?? 0}</span> грн
              {totals?.deliveryNote ? ` (${totals.deliveryNote})` : ""}
            </dd>
          </div>
        )}
        <div className="flex justify-between text-lg text-gold">
          <dt>Разом</dt>
          <dd>
            <span data-testid="total">{totals?.total ?? 0}</span> грн
          </dd>
        </div>
        <p className="text-text/60">Оплата при отриманні.</p>
      </dl>

      {rejected && (
        <p role="alert" className="rounded-lg border border-red-300/60 p-3 text-sm text-red-200">
          {rejected}
        </p>
      )}

      {failed && (
        <p role="alert" className="rounded-lg border border-red-300/60 p-3 text-sm text-red-200">
          Не вдалося надіслати замовлення. Зателефонуйте нам:{" "}
          <a href="tel:+380730888087" className="underline">
            {VENUE_PHONE}
          </a>
          . Кошик збережено, можна спробувати ще раз.
        </p>
      )}

      <button
        type="submit"
        disabled={!totals || submitting}
        className="min-h-14 w-full rounded-full bg-gold font-semibold text-bg-deep transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Надсилаємо…" : "Надіслати замовлення"}
      </button>
      </div>
    </form>
  );
}
