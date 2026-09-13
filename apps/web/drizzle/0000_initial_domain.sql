CREATE TYPE "public"."profile_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'cancelled');--> statement-breakpoint
CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY NOT NULL,
  "display_name" text,
  "role" "profile_role" DEFAULT 'user' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "floors" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "level" integer NOT NULL,
  "map_image_path" text NOT NULL
);--> statement-breakpoint
CREATE TABLE "bookable_spaces" (
  "id" text PRIMARY KEY NOT NULL,
  "floor_id" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "capacity" integer NOT NULL,
  "image_path" text,
  "is_active" boolean DEFAULT true NOT NULL
);--> statement-breakpoint
CREATE TABLE "occupancy_areas" (
  "id" text PRIMARY KEY NOT NULL,
  "floor_id" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "map_region" jsonb NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL
);--> statement-breakpoint
CREATE TABLE "bookings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "bookable_space_id" text NOT NULL,
  "starts_at" timestamp with time zone NOT NULL,
  "ends_at" timestamp with time zone NOT NULL,
  "status" "booking_status" DEFAULT 'confirmed' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "cancelled_at" timestamp with time zone,
  CONSTRAINT "bookings_end_after_start" CHECK ("bookings"."ends_at" > "bookings"."starts_at")
);--> statement-breakpoint
CREATE TABLE "presence_check_ins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "occupancy_area_id" text NOT NULL,
  "checked_in_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "ended_at" timestamp with time zone,
  CONSTRAINT "presence_expiry_after_check_in" CHECK ("presence_check_ins"."expires_at" > "presence_check_ins"."checked_in_at")
);--> statement-breakpoint
ALTER TABLE "bookable_spaces" ADD CONSTRAINT "bookable_spaces_floor_id_floors_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occupancy_areas" ADD CONSTRAINT "occupancy_areas_floor_id_floors_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_bookable_space_id_bookable_spaces_id_fk" FOREIGN KEY ("bookable_space_id") REFERENCES "public"."bookable_spaces"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presence_check_ins" ADD CONSTRAINT "presence_check_ins_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presence_check_ins" ADD CONSTRAINT "presence_check_ins_occupancy_area_id_occupancy_areas_id_fk" FOREIGN KEY ("occupancy_area_id") REFERENCES "public"."occupancy_areas"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookable_spaces_floor_idx" ON "bookable_spaces" USING btree ("floor_id");--> statement-breakpoint
CREATE INDEX "occupancy_areas_floor_idx" ON "occupancy_areas" USING btree ("floor_id");--> statement-breakpoint
CREATE INDEX "bookings_space_time_idx" ON "bookings" USING btree ("bookable_space_id", "starts_at", "ends_at");--> statement-breakpoint
CREATE INDEX "bookings_user_idx" ON "bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "presence_area_expiry_idx" ON "presence_check_ins" USING btree ("occupancy_area_id", "expires_at");--> statement-breakpoint
CREATE INDEX "presence_user_idx" ON "presence_check_ins" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "bookable_spaces" ADD CONSTRAINT "bookable_spaces_capacity_positive" CHECK ("bookable_spaces"."capacity" > 0);--> statement-breakpoint
