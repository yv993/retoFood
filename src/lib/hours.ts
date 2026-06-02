import { HOURS } from "./site";

export interface OpenStatus {
  open: boolean;
  /** e.g. "Open now" / "Closed" */
  label: string;
  /** e.g. "until 23:00" / "opens 11:00" */
  detail: string;
}

function fmt(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Compute open/closed status from local time, handling after-midnight windows.
 * Pass a Date (defaults to now). Pure + deterministic for testability.
 */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const day = now.getDay(); // 0 = Sun
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = HOURS[day];

  // Continuation from the previous day spilling past midnight (close > 1440).
  const prev = HOURS[(day + 6) % 7];
  if (prev.close > 1440 && mins < prev.close - 1440) {
    return { open: true, label: "Open now", detail: `until ${fmt(prev.close)}` };
  }

  if (mins >= today.open && mins < today.close) {
    return { open: true, label: "Open now", detail: `until ${fmt(today.close)}` };
  }

  if (mins < today.open) {
    return { open: false, label: "Closed", detail: `opens ${fmt(today.open)}` };
  }

  // After close today → next day's opening.
  const next = HOURS[(day + 1) % 7];
  return { open: false, label: "Closed", detail: `opens ${fmt(next.open)}` };
}

/** True if the given datetime falls within opening hours (handles after-midnight). */
export function isOpenAt(when: Date): boolean {
  const day = when.getDay();
  const mins = when.getHours() * 60 + when.getMinutes();
  const today = HOURS[day];
  const prev = HOURS[(day + 6) % 7];
  if (prev.close > 1440 && mins < prev.close - 1440) return true;
  return mins >= today.open && mins < today.close;
}

/** Generate selectable HH:MM slots for a given weekday index (every 30 min). */
export function slotsForDay(day: number, stepMin = 30): string[] {
  const { open, close } = HOURS[day];
  const end = Math.min(close, 1440); // same-day slots only (no after-midnight picker)
  const out: string[] = [];
  for (let m = open; m + stepMin <= end || m < end; m += stepMin) {
    if (m >= end) break;
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}
