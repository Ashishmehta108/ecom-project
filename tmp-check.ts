import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function run() {
  const r = await db.execute(sql`SELECT id, name FROM category`);
  console.log(r.rows);
  process.exit(0);
}

run().catch(console.error);
