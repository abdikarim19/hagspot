"use server";

import { and, eq, gt, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDatabase } from "@/db";
import { bookings, profiles } from "@/db/schema";

export type BookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; message: string; code: "auth" | "validation" | "conflict" | "configuration" };

export async function createBooking(
  bookableSpaceId: string,
  startsAt: string,
  endsAt: string,
): Promise<BookingResult> {
  const starts = new Date(startsAt);
  const ends = new Date(endsAt);
  if (!bookableSpaceId || Number.isNaN(starts.valueOf()) || Number.isNaN(ends.valueOf()) || ends <= starts) {
    return { ok: false, code: "validation", message: "Choose a valid time slot." };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return { ok: false, code: "configuration", message: "Booking services are not configured yet." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, code: "auth", message: "Sign in before reserving a room." };
  }

  let database: ReturnType<typeof getDatabase>;
  try {
    database = getDatabase();
  } catch {
    return { ok: false, code: "configuration", message: "Booking services are not configured yet." };
  }

  const conflictingBooking = await database.query.bookings.findFirst({
    where: and(
      eq(bookings.bookableSpaceId, bookableSpaceId),
      eq(bookings.status, "confirmed"),
      lt(bookings.startsAt, ends),
      gt(bookings.endsAt, starts),
    ),
    columns: { id: true },
  });

  if (conflictingBooking) {
    return { ok: false, code: "conflict", message: "That time was just taken. Choose another slot." };
  }

  await database.insert(profiles).values({ id: user.id }).onConflictDoNothing();
  const [booking] = await database
    .insert(bookings)
    .values({ userId: user.id, bookableSpaceId, startsAt: starts, endsAt: ends })
    .returning({ id: bookings.id });

  revalidatePath("/");
  return { ok: true, bookingId: booking.id };
}
