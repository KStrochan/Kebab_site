import { Ornament } from "./Ornament";

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
    <section id="info" className="bg-bg-deep px-4 pb-32 pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl text-gold">Як нас знайти</h2>
        <Ornament className="mt-4" />
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:text-left">
          <div>
            <h3 className="text-xl text-gold">Графік роботи</h3>
            <dl className="mt-4 space-y-2">
              {HOURS.map(([days, time]) => (
                <div key={days} className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-text/80">{days}</dt>
                  <dd className="font-medium">{time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="text-xl text-gold">Контакти</h3>
            <p className="mt-4">м. Стрий, вул. Бобикевича 11/1</p>
            <p className="mt-2">
              <a
                href="tel:+380730888087"
                className="inline-flex min-h-11 items-center text-lg text-gold underline-offset-4 hover:underline"
              >
                0 (73) 088 80 87
              </a>
            </p>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full border border-gold px-6 py-2.5 text-gold transition hover:bg-gold hover:text-bg-deep"
            >
              Показати на карті
            </a>
          </div>
        </div>
        <p className="mt-14 text-sm text-text/50">© Kebab Bro, Стрий</p>
      </div>
    </section>
  );
}
