"use server";

import { and, eq, gt, isNull } from "drizzle-orm";
import { getDatabase } from "@/db";
import { occupancyAreas, presenceCheckIns } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { PRESENCE_DURATION_MINUTES } from "@/lib/presence";

export type PresenceResult =
  | { ok: true; checkInId: string; expiresAt: string }
  | { ok: false; message: string; code: "auth" | "configuration" | "validation" };

export async function checkInToArea(occupancyAreaId: string): Promise<PresenceResult> {
  if (!occupancyAreaId) return { ok: false, code: "validation", message: "Scan a valid HagSpot QR code." };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || !process.env.DATABASE_URL) {
    return { ok: false, code: "configuration", message: "Presence services are not configured yet." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, code: "auth", message: "Sign in before checking in." };

  let database: ReturnType<typeof getDatabase>;
  try { database = getDatabase(); } catch { return { ok: false, code: "configuration", message: "Presence services are not configured yet." }; }

  const area = await database.query.occupancyAreas.findFirst({ where: eq(occupancyAreas.id, occupancyAreaId), columns: { id: true } });
  if (!area) return { ok: false, code: "validation", message: "That QR code is not linked to an active study area." };

  const now = new Date();
  const expiresAt = new Date(now.getTime() + PRESENCE_DURATION_MINUTES * 60_000);
  const current = await database.query.presenceCheckIns.findFirst({
    where: and(eq(presenceCheckIns.userId, user.id), eq(presenceCheckIns.occupancyAreaId, occupancyAreaId), isNull(presenceCheckIns.endedAt), gt(presenceCheckIns.expiresAt, now)),
    columns: { id: true },
  });

  if (current) {
    await database.update(presenceCheckIns).set({ checkedInAt: now, expiresAt }).where(eq(presenceCheckIns.id, current.id));
    return { ok: true, checkInId: current.id, expiresAt: expiresAt.toISOString() };
  }

  const [checkIn] = await database.insert(presenceCheckIns).values({ userId: user.id, occupancyAreaId, checkedInAt: now, expiresAt }).returning({ id: presenceCheckIns.id });
  return { ok: true, checkInId: checkIn.id, expiresAt: expiresAt.toISOString() };
}

export async function endPresence(checkInId: string) {
  if (!checkInId || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || !process.env.DATABASE_URL) {
    return { ok: false, message: "Presence services are not configured yet." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in to manage your presence." };

  const database = getDatabase();
  await database.update(presenceCheckIns).set({ endedAt: new Date() }).where(and(eq(presenceCheckIns.id, checkInId), eq(presenceCheckIns.userId, user.id), isNull(presenceCheckIns.endedAt)));
  return { ok: true, message: "You are no longer counted in this area." };
}
