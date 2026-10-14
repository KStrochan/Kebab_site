"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";
import { Ornament, Stripes } from "./Ornament";

export function Hero() {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    // Computed after mount: the status depends on the current time, so SSR output would mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(getOpenStatus(new Date()));
    const id = setInterval(() => setStatus(getOpenStatus(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative isolate overflow-hidden bg-bg-deep">
      <Stripes />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-14 text-center sm:pt-20">
        <div className="rounded-full border border-line p-2 shadow-[0_0_60px_rgba(232,201,138,0.12)]">
          <Image
            src="/logo.jpg"
            alt="Kebab Bro"
            width={168}
            height={168}
            priority
            className="rounded-full"
          />
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-wide text-gold sm:text-5xl">
          Kebab Bro
        </h1>
        <p className="mt-3 text-lg tracking-[0.2em] text-text/80">#Кебабтвогоміста</p>
        <Ornament className="mt-6" />
        <p className="mt-6 max-w-md text-text/75">
          Шаурма, хот-доги та бургери в Стрию. Замовляйте з доставкою або забирайте у нас.
        </p>
        <div className="mt-6 min-h-8">
          {status && (
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
                status.open
                  ? "border-emerald-400/50 text-emerald-200"
                  : "border-line text-text/70"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${status.open ? "bg-emerald-400" : "bg-gold-dim"}`}
              />
              {status.label}
            </span>
          )}
        </div>
        <a
          href="#menu"
          className="mt-8 inline-block rounded-full bg-gold px-10 py-3.5 text-base font-semibold text-bg-deep transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          Замовити
        </a>
      </div>
    </header>
  );
}
