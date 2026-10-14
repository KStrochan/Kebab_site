export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 24"
      className={`mx-auto h-5 w-72 text-gold ${className}`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M0 12H168M232 12H400" opacity="0.6" />
      <path d="M0 7H150M250 7H400M0 17H150M250 17H400" opacity="0.3" />
      <path d="M200 2l10 10-10 10-10-10z" />
      <path d="M200 7l5 5-5 5-5-5z" fill="currentColor" />
    </svg>
  );
}

export function Stripes({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.14] ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--gold) 0 1.5px, transparent 1.5px 14px)",
        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
      }}
    />
  );
}
