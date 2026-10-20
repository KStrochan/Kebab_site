"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";
import { Embers } from "./Embers";
import { Ornament } from "./Ornament";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

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
    <header className="grain relative isolate overflow-hidden bg-bg-deep">
      <div className="hero-stripes" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <Embers />
      <div className="relative mx-auto flex min-h-[92svh] max-w-3xl flex-col items-center justify-center px-4 pb-20 pt-14 text-center">
        <div
          className="fade-up relative h-60 w-60 sm:h-64 sm:w-64"
          style={delay(100)}
        >
          <div className="logo-float absolute inset-0">
            <svg
              viewBox="0 0 260 260"
              className="absolute inset-0 h-full w-full"
              fill="none"
              stroke="var(--gold)"
              aria-hidden="true"
            >
              <circle
                cx="130"
                cy="130"
                r="122"
                strokeWidth="1.5"
                className="ring-draw"
                style={
                  {
                    "--len": 767,
                    animationDelay: "300ms",
                  } as React.CSSProperties
                }
              />
              <circle
                cx="130"
                cy="130"
                r="112"
                strokeWidth="0.75"
                strokeDasharray="2 7"
                opacity="0.7"
                className="ring-spin"
              />
              <circle
                cx="130"
                cy="130"
                r="104"
                strokeWidth="1"
                className="ring-draw"
                style={
                  {
                    "--len": 654,
                    animationDelay: "700ms",
                  } as React.CSSProperties
                }
              />
              <path
                d="M130 2l5 5-5 5-5-5zM130 248l5 5-5 5-5-5zM2 130l5-5 5 5-5 5zM248 130l5-5 5 5-5 5z"
                fill="var(--gold)"
                stroke="none"
              />
            </svg>
            <Image
              src="/logo.jpg"
              alt="Kebab Bro"
              width={168}
              height={168}
              priority
              className="absolute left-1/2 top-1/2 h-[168px] w-[168px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[176px] sm:w-[176px]"
            />
          </div>
        </div>

        <h1
          className="fade-up text-gold-gradient mt-9 text-5xl font-semibold uppercase tracking-[0.14em] sm:text-6xl"
          style={delay(700)}
        >
          Kebab Bro
        </h1>
        <p
          className="fade-up mt-4 text-base tracking-[0.3em] text-text/80 sm:text-lg"
          style={delay(900)}
        >
          #Кебабтвогоміста
        </p>
        <div className="fade-up w-full" style={delay(1050)}>
          <Ornament className="mt-7" />
        </div>
        <p
          className="fade-up mt-7 max-w-md text-lg leading-relaxed text-text/80"
          style={delay(1200)}
        >
          Шаурма, хот-доги та бургери в Стрию. Замовляйте з доставкою або
          забирайте у нас.
        </p>

        <div className="fade-up mt-6 min-h-9" style={delay(1350)}>
          {status && (
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                status.open
                  ? "border-emerald-400/50 text-emerald-200"
                  : "border-line text-text/70"
              }`}
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                {status.open && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    status.open ? "bg-emerald-400" : "bg-gold-dim"
                  }`}
                />
              </span>
              {status.label}
            </span>
          )}
        </div>

        <div
          className="fade-up mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          style={delay(1500)}
        >
          <a
            href="#menu"
            className="btn-gold btn-shine flex min-h-14 items-center justify-center rounded-full px-12 text-base font-semibold tracking-wide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            Замовити
          </a>
          <a
            href="tel:+380730888087"
            className="btn-ghost flex min-h-14 items-center justify-center rounded-full px-8 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            Подзвонити
          </a>
        </div>

        <div
          className="scroll-cue absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
          aria-hidden="true"
        >
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.5"
          >
            <rect x="1" y="1" width="18" height="26" rx="9" />
            <path d="M10 7v5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </header>
  );
}
