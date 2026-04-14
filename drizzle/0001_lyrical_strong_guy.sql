ALTER TABLE "admin_customer_cart_item" DROP CONSTRAINT "admin_customer_cart_item_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "admin_customer_cart_item" ADD CONSTRAINT "admin_customer_cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;