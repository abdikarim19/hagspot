import { describe, expect, it } from "vitest";
import { getPresenceLabel, getPresenceLevel, PRESENCE_DURATION_MINUTES } from "./presence";

describe("presence aggregation", () => {
  it("keeps presence duration at exactly twenty minutes", () => {
    expect(PRESENCE_DURATION_MINUTES).toBe(20);
  });

  it.each([
    [0, "quiet"],
    [1, "active"],
    [3, "active"],
    [4, "busy"],
    [7, "busy"],
    [8, "full"],
  ] as const)("maps %i active check-ins to %s", (count, level) => {
    expect(getPresenceLevel(count)).toBe(level);
    expect(getPresenceLabel(level)).toBe(level[0].toUpperCase() + level.slice(1));
  });
});
