export const PRESENCE_DURATION_MINUTES = 20;

export type PresenceLevel = "quiet" | "active" | "busy" | "full";

export function getPresenceLevel(activeCheckIns: number): PresenceLevel {
  if (activeCheckIns === 0) return "quiet";
  if (activeCheckIns <= 3) return "active";
  if (activeCheckIns <= 7) return "busy";
  return "full";
}

export function getPresenceLabel(level: PresenceLevel) {
  return { quiet: "Quiet", active: "Active", busy: "Busy", full: "Full" }[level];
}
