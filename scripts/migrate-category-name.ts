import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function migrate() {
  try {
    console.log("🚀 Starting manual column type migration...");
    
    // Fix category name type
    await db.execute(sql`
      ALTER TABLE category 
      ALTER COLUMN name TYPE jsonb 
      USING name::jsonb
    `);
    
    console.log("✅ Category name migration done.");

    // Also check pos_cart_item and pos_order_item if they were previously text
    // Based on the schema view, they are already jsonb, but if the DB is out of sync, this helps.
    
    console.log("🎉 All manual migrations completed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
