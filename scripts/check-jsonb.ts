import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function check() {
  try {
    const result = await db.execute(sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND data_type != 'jsonb' AND (column_name LIKE '%name%' OR column_name = 'description' OR column_name = 'features');
    `);
    console.log("Potential Text Columns that should be JSONB:", JSON.stringify(result.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
