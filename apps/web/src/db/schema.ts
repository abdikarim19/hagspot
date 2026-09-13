import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { gt, relations } from "drizzle-orm";
import type { MapRegion } from "../lib/domain";

export const profileRole = pgEnum("profile_role", ["user", "admin"]);
export const bookingStatus = pgEnum("booking_status", ["confirmed", "cancelled"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name"),
  role: profileRole("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const floors = pgTable("floors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  mapImagePath: text("map_image_path").notNull(),
});

export const bookableSpaces = pgTable(
  "bookable_spaces",
  {
    id: text("id").primaryKey(),
    floorId: text("floor_id")
      .notNull()
      .references(() => floors.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    description: text("description"),
    capacity: integer("capacity").notNull(),
    imagePath: text("image_path"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    index("bookable_spaces_floor_idx").on(table.floorId),
    check("bookable_spaces_capacity_positive", gt(table.capacity, 0)),
  ],
);

export const occupancyAreas = pgTable(
  "occupancy_areas",
  {
    id: text("id").primaryKey(),
    floorId: text("floor_id")
      .notNull()
      .references(() => floors.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    description: text("description"),
    mapRegion: jsonb("map_region").$type<MapRegion>().notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [index("occupancy_areas_floor_idx").on(table.floorId)],
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    bookableSpaceId: text("bookable_space_id")
      .notNull()
      .references(() => bookableSpaces.id, { onDelete: "restrict" }),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    status: bookingStatus("status").notNull().default("confirmed"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  },
  (table) => [
    index("bookings_space_time_idx").on(table.bookableSpaceId, table.startsAt, table.endsAt),
    index("bookings_user_idx").on(table.userId),
    check("bookings_end_after_start", gt(table.endsAt, table.startsAt)),
  ],
);

export const presenceCheckIns = pgTable(
  "presence_check_ins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    occupancyAreaId: text("occupancy_area_id")
      .notNull()
      .references(() => occupancyAreas.id, { onDelete: "restrict" }),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (table) => [
    index("presence_area_expiry_idx").on(table.occupancyAreaId, table.expiresAt),
    index("presence_user_idx").on(table.userId),
    check("presence_expiry_after_check_in", gt(table.expiresAt, table.checkedInAt)),
  ],
);

export const floorRelations = relations(floors, ({ many }) => ({
  bookableSpaces: many(bookableSpaces),
  occupancyAreas: many(occupancyAreas),
}));

export const bookableSpaceRelations = relations(bookableSpaces, ({ one, many }) => ({
  floor: one(floors, {
    fields: [bookableSpaces.floorId],
    references: [floors.id],
  }),
  bookings: many(bookings),
}));

export const occupancyAreaRelations = relations(occupancyAreas, ({ one, many }) => ({
  floor: one(floors, {
    fields: [occupancyAreas.floorId],
    references: [floors.id],
  }),
  presenceCheckIns: many(presenceCheckIns),
}));

export const profileRelations = relations(profiles, ({ many }) => ({
  bookings: many(bookings),
  presenceCheckIns: many(presenceCheckIns),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
  profile: one(profiles, {
    fields: [bookings.userId],
    references: [profiles.id],
  }),
  bookableSpace: one(bookableSpaces, {
    fields: [bookings.bookableSpaceId],
    references: [bookableSpaces.id],
  }),
}));

export const presenceCheckInRelations = relations(presenceCheckIns, ({ one }) => ({
  profile: one(profiles, {
    fields: [presenceCheckIns.userId],
    references: [profiles.id],
  }),
  occupancyArea: one(occupancyAreas, {
    fields: [presenceCheckIns.occupancyAreaId],
    references: [occupancyAreas.id],
  }),
}));
