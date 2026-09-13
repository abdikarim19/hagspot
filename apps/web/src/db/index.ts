import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDatabase() {
  if (!database) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not configured.");

    database = drizzle(postgres(url, { prepare: false }), { schema });
  }

  return database;
}
