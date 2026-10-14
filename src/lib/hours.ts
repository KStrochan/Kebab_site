export type OpenStatus = { open: boolean; label: string };

// Index 0 = Sunday. [openMinutes, closeMinutes].
const SCHEDULE: [number, number][] = [
  [11 * 60, 23 * 60], // Нд
  [10 * 60, 22 * 60], // Пн
  [10 * 60, 22 * 60], // Вт
  [10 * 60, 22 * 60], // Ср
  [10 * 60, 22 * 60], // Чт
  [10 * 60, 23 * 60], // Пт
  [10 * 60, 23 * 60], // Сб
];

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const fmt = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

function kyivParts(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Kyiv",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return {
    day: WEEKDAYS[get("weekday")],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function getOpenStatus(now: Date): OpenStatus {
  const { day, minutes } = kyivParts(now);
  const [open, close] = SCHEDULE[day];
  if (minutes >= open && minutes < close) {
    return { open: true, label: `Відкрито до ${fmt(close)}` };
  }
  if (minutes < open) {
    return { open: false, label: `Зачинено, відкриємось сьогодні о ${fmt(open)}` };
  }
  const nextOpen = SCHEDULE[(day + 1) % 7][0];
  return { open: false, label: `Зачинено, відкриємось завтра о ${fmt(nextOpen)}` };
}
