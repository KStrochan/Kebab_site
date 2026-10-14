import { Ornament } from "./Ornament";

export function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-gold-dim">{kicker}</p>
      <h2 className="mt-3 text-4xl text-gold-gradient sm:text-5xl">{children}</h2>
      <Ornament className="mt-5" />
    </div>
  );
}
