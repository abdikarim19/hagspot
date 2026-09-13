export type FloorId = string;
export type BookableSpaceId = string;
export type OccupancyAreaId = string;

export type ProfileRole = "user" | "admin";
export type BookingStatus = "confirmed" | "cancelled";
export type OccupancyLevel = "quiet" | "active" | "busy" | "full";

export type MapRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OccupancySummary = {
  level: OccupancyLevel;
  activeCheckIns: number;
};
