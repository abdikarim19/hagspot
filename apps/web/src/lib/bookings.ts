export const BOOKING_DURATIONS = [30, 60, 90] as const;
export type BookingDuration = (typeof BOOKING_DURATIONS)[number];

export type TimeSlot = {
  startsAt: string;
  endsAt: string;
  label: string;
  isAvailable: boolean;
};

const OPENING_HOUR = 8;
const CLOSING_HOUR = 18;

function formatTime(hour: number, minute: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function getTimeSlots(spaceId: string, date: string, duration: BookingDuration): TimeSlot[] {
  const blocked = new Set(
    spaceId === "room-168" ? ["10:00", "13:30"] : spaceId === "room-274" ? ["09:00", "15:00"] : ["11:30"],
  );
  const slots: TimeSlot[] = [];

  for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour += 1) {
    for (const minute of [0, 30]) {
      const start = new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
      const end = new Date(start.getTime() + duration * 60_000);
      if (end.getHours() > CLOSING_HOUR || (end.getHours() === CLOSING_HOUR && end.getMinutes() > 0)) continue;

      const startTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push({
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        label: `${formatTime(hour, minute)} - ${formatTime(end.getHours(), end.getMinutes())}`,
        isAvailable: !blocked.has(startTime),
      });
    }
  }

  return slots;
}
