import type { MapRegion, OccupancyLevel } from "@/lib/domain";

export type BrowseSpace = {
  id: string;
  floorId: string;
  name: string;
  kind: "bookable" | "occupancy";
  description: string;
  capacity?: number;
  imagePath?: string;
  mapRegion: MapRegion;
  occupancy: OccupancyLevel;
  equipment: string[];
};

export type BrowseFloor = {
  id: string;
  name: string;
  level: number;
  mapImagePath: string;
  summary: string;
};

export const floors: BrowseFloor[] = [
  {
    id: "ground",
    name: "Ground floor",
    level: 0,
    mapImagePath: "/images/first-floor.png",
    summary: "The busiest floor, close to the entrance and café.",
  },
  {
    id: "second",
    name: "Second floor",
    level: 1,
    mapImagePath: "/images/second-floor.png",
    summary: "Quiet rooms for focused work and small groups.",
  },
  {
    id: "third",
    name: "Third floor",
    level: 2,
    mapImagePath: "/images/third-floor.png",
    summary: "Bright corners and open tables for longer sessions.",
  },
];

export const spaces: BrowseSpace[] = [
  {
    id: "room-168",
    floorId: "ground",
    name: "Room 168",
    kind: "bookable",
    description: "A compact study room for solo work or a focused pair.",
    capacity: 2,
    imagePath: "/images/room-168.jpeg",
    mapRegion: { x: 16, y: 31, width: 18, height: 15 },
    occupancy: "quiet",
    equipment: ["Whiteboard", "Power outlets"],
  },
  {
    id: "north-lounge",
    floorId: "ground",
    name: "North lounge",
    kind: "occupancy",
    description: "Informal tables beside the north windows. Check in on arrival.",
    mapRegion: { x: 54, y: 18, width: 25, height: 20 },
    occupancy: "active",
    equipment: ["Open tables", "Natural light"],
  },
  {
    id: "room-274",
    floorId: "second",
    name: "Room 274",
    kind: "bookable",
    description: "A flexible room for a small group or a quiet solo session.",
    capacity: 6,
    imagePath: "/images/room-274.jpeg",
    mapRegion: { x: 27, y: 24, width: 19, height: 18 },
    occupancy: "busy",
    equipment: ["Display", "Whiteboard", "Power outlets"],
  },
  {
    id: "east-studio",
    floorId: "second",
    name: "East studio",
    kind: "occupancy",
    description: "Open study area with long shared tables and soft seating.",
    mapRegion: { x: 65, y: 47, width: 21, height: 24 },
    occupancy: "quiet",
    equipment: ["Shared tables", "Power outlets"],
  },
  {
    id: "room-324",
    floorId: "third",
    name: "Room 324",
    kind: "bookable",
    description: "A larger room suited to project work and collaborative study.",
    capacity: 8,
    imagePath: "/images/room-324.jpeg",
    mapRegion: { x: 43, y: 26, width: 22, height: 17 },
    occupancy: "active",
    equipment: ["Display", "Whiteboard", "Video call setup"],
  },
  {
    id: "south-tables",
    floorId: "third",
    name: "South tables",
    kind: "occupancy",
    description: "An informal zone with a view toward the main stairwell.",
    mapRegion: { x: 13, y: 59, width: 28, height: 19 },
    occupancy: "full",
    equipment: ["Open tables", "Power outlets"],
  },
];
