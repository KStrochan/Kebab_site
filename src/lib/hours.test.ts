import { describe, expect, it } from "vitest";
import { getOpenStatus } from "./hours";

// Winter 2027: Kyiv is UTC+2. Jan 4 = Monday, Jan 9 = Saturday, Jan 10 = Sunday.
const kyiv = (day: number, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(2027, 0, day, h - 2, m));
};

describe("getOpenStatus", () => {
  it("is open on Monday noon until 22:00", () => {
    expect(getOpenStatus(kyiv(4, "12:00"))).toEqual({ open: true, label: "Відкрито до 22:00" });
  });
  it("is closed on Monday 22:30 and reopens tomorrow at 10:00", () => {
    expect(getOpenStatus(kyiv(4, "22:30"))).toEqual({
      open: false,
      label: "Зачинено, відкриємось завтра о 10:00",
    });
  });
  it("is closed exactly at closing time (exclusive)", () => {
    expect(getOpenStatus(kyiv(4, "22:00")).open).toBe(false);
  });
  it("is open exactly at opening time (inclusive)", () => {
    expect(getOpenStatus(kyiv(4, "10:00")).open).toBe(true);
  });
  it("is closed Monday 09:59 and opens today at 10:00", () => {
    expect(getOpenStatus(kyiv(4, "09:59"))).toEqual({
      open: false,
      label: "Зачинено, відкриємось сьогодні о 10:00",
    });
  });
  it("is open Saturday 22:30 until 23:00", () => {
    expect(getOpenStatus(kyiv(9, "22:30"))).toEqual({ open: true, label: "Відкрито до 23:00" });
  });
  it("opens Sunday at 11:00", () => {
    expect(getOpenStatus(kyiv(10, "10:30"))).toEqual({
      open: false,
      label: "Зачинено, відкриємось сьогодні о 11:00",
    });
  });
  it("is closed Sunday 23:00 and reopens Monday at 10:00", () => {
    expect(getOpenStatus(kyiv(10, "23:00"))).toEqual({
      open: false,
      label: "Зачинено, відкриємось завтра о 10:00",
    });
  });
  it("is closed after midnight Saturday into Sunday before 11:00", () => {
    expect(getOpenStatus(kyiv(10, "00:30")).open).toBe(false);
  });
});
