import type { CategoryId } from "@/data/menu";

// Thin line illustrations in the same gold hairline style as the logo.
const ICONS: Record<CategoryId, React.ReactNode> = {
  shawarma: (
    <>
      <path d="M24 4v6" />
      <path d="M13 10h22l-3 30H16z" />
      <path d="M15 17c6 3 12-3 18 0M15.5 24c6 3 11-3 17 0M16 31c6 3 10-3 16 0" />
      <path d="M12 44h24" />
    </>
  ),
  hotdogs: (
    <>
      <rect x="4" y="19" width="40" height="12" rx="6" />
      <path d="M4 25c0-8 8-12 20-12s20 4 20 12" />
      <path d="M4 25c0 8 8 12 20 12s20-4 20-12" />
      <path d="M9 25c3-3 6 3 9 0s6 3 9 0 6 3 9 0" />
    </>
  ),
  burgers: (
    <>
      <path d="M6 22c0-9 8-15 18-15s18 6 18 15z" />
      <path d="M10 14h.01M18 11h.01M26 10h.01M33 13h.01M38 17h.01" />
      <path d="M4 28c4 3 7-3 10 0s6 3 10 0 6 3 10 0 7 3 10 0" />
      <path d="M6 33h36" />
      <path d="M6 37c0 5 4 7 8 7h20c4 0 8-2 8-7z" />
    </>
  ),
  snacks: (
    <>
      <path d="M12 16l3 28h18l3-28z" />
      <path d="M16 16V6M21 16V4M26 16V7M31 16V5M35 16V9" />
      <path d="M12 24h24" />
    </>
  ),
  drinks: (
    <>
      <path d="M11 14h26l-3 30H14z" />
      <path d="M9 14h30" />
      <path d="M27 14l5-10h7" />
      <path d="M13 24h22" />
      <circle cx="21" cy="33" r="2" />
      <circle cx="28" cy="36" r="1.5" />
    </>
  ),
};

export function CategoryIcon({ id, className = "" }: { id: CategoryId; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-10 w-10 shrink-0 text-gold ${className}`}
    >
      {ICONS[id]}
    </svg>
  );
}
