import { describe, expect, it } from "vitest";
import { getTimeSlots } from "./bookings";

describe("booking time slots", () => {
  it("creates one-hour slots inside opening hours", () => {
    const slots = getTimeSlots("room-168", "2026-09-14", 60);
    expect(slots[0].label).toBe("8:00 AM - 9:00 AM");
    expect(slots.at(-1)?.label).toBe("5:00 PM - 6:00 PM");
    expect(slots.every((slot) => new Date(slot.endsAt) > new Date(slot.startsAt))).toBe(true);
  });

  it("marks known occupied windows unavailable", () => {
    const slots = getTimeSlots("room-168", "2026-09-14", 60);
    expect(slots.find((slot) => slot.label === "10:00 AM - 11:00 AM")?.isAvailable).toBe(false);
    expect(slots.find((slot) => slot.label === "10:30 AM - 11:30 AM")?.isAvailable).toBe(true);
  });
});
