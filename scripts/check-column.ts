import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function check() {
  try {
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'category' AND column_name = 'name';
    `);
    console.log("Column Info:", JSON.stringify(result.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
