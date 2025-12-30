import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function migrateProductsToMultilingual() {
  console.log("Starting product migration to multilingual format...");

  try {
    // Fetch all products
    const products = await db.query.product.findMany();

    console.log(`Found ${products.length} products to migrate`);

    const untranslated: Array<{ id: string; field: string }> = [];

    for (const p of products) {
      const updates: any = {};

      // Migrate productName
      if (typeof p.productName === 'string') {
        updates.productName = { en: p.productName, pt: '' };
        untranslated.push({ id: p.id, field: 'productName' });
      }

      // Migrate description
      if (typeof p.description === 'string') {
        updates.description = { en: p.description, pt: '' };
        untranslated.push({ id: p.id, field: 'description' });
      }

      // Migrate features
      if (Array.isArray(p.features)) {
        updates.features = { en: p.features, pt: [] };
        untranslated.push({ id: p.id, field: 'features' });
      }

      // Migrate tags
      if (Array.isArray(p.tags)) {
        updates.tags = { en: p.tags, pt: [] };
        untranslated.push({ id: p.id, field: 'tags' });
      }

      if (Object.keys(updates).length > 0) {
        await db.update(product).set(updates).where(sql`${product.id} = ${p.id}`);
        console.log(`✓ Migrated product ${p.id}`);
      }
    }

    console.log("\n✅ Migration completed!");
    console.log("\n⚠️  Untranslated fields (Portuguese translations needed):");
    untranslated.forEach(({ id, field }) => {
      console.log(`  - Product ${id}: ${field}`);
    });

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateProductsToMultilingual()
  .then(() => {
    console.log("Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });
