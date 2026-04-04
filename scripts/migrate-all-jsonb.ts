import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function migrate() {
  try {
    console.log("🚀 Starting manual column type migrations...");
    
    const migrations = [
      { table: "category", column: "name" },
      { table: "admin_customer_order_item", column: "name" },
      { table: "pos_cart_item", column: "name" },
      { table: "pos_order_item", column: "name" },
      { table: "admin_customer_cart_item", column: "name" },
    ];

    for (const m of migrations) {
      console.log(`Migrating ${m.table}.${m.column} to jsonb...`);
      await db.execute(sql.raw(`
        ALTER TABLE ${m.table} 
        ALTER COLUMN ${m.column} TYPE jsonb 
        USING ${m.column}::jsonb
      `));
    }
    
    console.log("🎉 All manual migrations completed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
