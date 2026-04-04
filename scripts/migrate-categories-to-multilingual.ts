import { db } from "@/lib/db";
import { category } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function migrateCategoriesToMultilingual() {
  console.log("Starting category migration to multilingual format...");

  try {
    // We must fetch via raw SQL to avoid Drizzle's jsonb parser failing on text data
    const result = await db.execute(sql`SELECT id, name FROM category`);
    const categories = result.rows;

    console.log(`Found ${categories.length} categories to migrate`);

    const untranslated: Array<{ id: string; field: string }> = [];

    for (const c of categories) {
      if (typeof c.name === 'string' && !c.name.startsWith('{')) {
        // Assume plain string, needs migrating
        const updates = {
          name: { en: c.name, pt: '' }
        };
        untranslated.push({ id: String(c.id), field: 'name' });

        await db.update(category).set(updates).where(sql`${category.id} = ${c.id}`);
        console.log(`✓ Migrated category ${c.id}`);
      }
    }

    console.log("\n✅ Category Migration completed!");
    console.log("\n⚠️  Untranslated fields (Portuguese translations needed):");
    untranslated.forEach(({ id, field }) => {
      console.log(`  - Category ${id}: ${field}`);
    });

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateCategoriesToMultilingual()
  .then(() => {
    console.log("Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });
