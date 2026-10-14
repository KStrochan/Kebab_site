import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Kebab Bro, вул. Бобикевича 11/1, Стрий");

const HOURS = [
  ["Пн – Чт", "10:00 – 22:00"],
  ["Пт – Сб", "10:00 – 23:00"],
  ["Нд", "11:00 – 23:00"],
];

export function InfoSection() {
  return (
    <section id="info" className="grain relative isolate overflow-hidden bg-bg-deep px-4 pb-32 pt-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionTitle kicker="Графік і контакти">Як нас знайти</SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Reveal className="flex">
            <div className="card-gold w-full p-6">
              <h3 className="text-2xl text-gold">Графік роботи</h3>
              <dl className="mt-5 space-y-3">
                {HOURS.map(([days, time]) => (
                  <div key={days} className="flex justify-between gap-4 border-b border-line pb-3">
                    <dt className="text-text/80">{days}</dt>
                    <dd className="font-medium tabular-nums">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={90} className="flex">
            <div className="card-gold w-full p-6">
              <h3 className="text-2xl text-gold">Контакти</h3>
              <p className="mt-5">м. Стрий, вул. Бобикевича 11/1</p>
              <a
                href="tel:+380730888087"
                className="mt-1 inline-flex min-h-11 items-center text-xl text-gold underline-offset-4 hover:underline"
              >
                0 (73) 088 80 87
              </a>
              <div>
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost mt-3 inline-flex min-h-12 items-center rounded-full px-7"
                >
                  Показати на карті
                </a>
              </div>
            </div>
          </Reveal>
        </div>
        <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-text/40">
          © Kebab Bro · Стрий
        </p>
      </div>
    </section>
  );
}
