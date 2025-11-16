CREATE TABLE "review" (
	"reviewid" text PRIMARY KEY NOT NULL,
	"rating" text NOT NULL,
	"comment" text NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;