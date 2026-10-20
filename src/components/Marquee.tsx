const WORDS = [
  "Шаурма",
  "Хот-доги",
  "Бургери",
  "Снеки",
  "Напої",
  "Доставка по Стрию",
];

// Slow ribbon of menu categories between the hero and the menu. Decorative only.
export function Marquee() {
  const row = (key: string) => (
    <ul key={key} className="marquee-row" aria-hidden="true">
      {WORDS.map((w) => (
        <li key={w} className="flex items-center gap-8">
          <span>{w}</span>
          <span className="text-gold-dim">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee border-y border-line bg-bg-deep" aria-hidden="true">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
