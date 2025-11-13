CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "address" (
	"addressid" text PRIMARY KEY NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"country" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_item" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"product_id" text NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_cart_product" UNIQUE("cart_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "category" (
	"categoryid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discount" (
	"discountid" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text NOT NULL,
	"percentage" text NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_to" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorite_item" (
	"id" text PRIMARY KEY NOT NULL,
	"favorites_id" text NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"notificationid" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderitem" (
	"orderitemid" text PRIMARY KEY NOT NULL,
	"quantity" text NOT NULL,
	"price" text NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"orderid" text PRIMARY KEY NOT NULL,
	"order_items" json,
	"total_amount" text NOT NULL,
	"shipping_address" json NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"paymentid" text PRIMARY KEY NOT NULL,
	"amount" text NOT NULL,
	"method" text NOT NULL,
	"status" text NOT NULL,
	"paid_at" timestamp NOT NULL,
	"order_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paymentmethod" (
	"paymentmethodid" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"account_number" text NOT NULL,
	"expiry_date" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"images" text[],
	"currency" text DEFAULT 'INR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"product_discount" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productcategory" (
	"product_id" text NOT NULL,
	"category_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productdiscount" (
	"product_id" text NOT NULL,
	"discount_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productimage" (
	"imageid" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"alt_text" text NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productinventory" (
	"inventoryid" text PRIMARY KEY NOT NULL,
	"quantity" text NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refund" (
	"refundid" text PRIMARY KEY NOT NULL,
	"amount" text NOT NULL,
	"reason" text NOT NULL,
	"status" text NOT NULL,
	"requested_at" timestamp NOT NULL,
	"processed_at" timestamp,
	"order_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review" (
	"reviewid" text PRIMARY KEY NOT NULL,
	"rating" text NOT NULL,
	"comment" text NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviewhelpful" (
	"reviewhelpfulid" text PRIMARY KEY NOT NULL,
	"is_helpful" boolean NOT NULL,
	"user_id" text NOT NULL,
	"review_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviewimage" (
	"reviewimageid" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"alt_text" text NOT NULL,
	"review_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "shipment" (
	"shipmentid" text PRIMARY KEY NOT NULL,
	"tracking_number" text NOT NULL,
	"carrier" text NOT NULL,
	"status" text NOT NULL,
	"estimated_delivery" timestamp NOT NULL,
	"order_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"wishlistid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlistitem" (
	"wishlist_id" text NOT NULL,
	"product_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_item" ADD CONSTRAINT "favorite_item_favorites_id_favorites_id_fk" FOREIGN KEY ("favorites_id") REFERENCES "public"."favorites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_item" ADD CONSTRAINT "favorite_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderitem" ADD CONSTRAINT "orderitem_order_id_orders_orderid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("orderid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderitem" ADD CONSTRAINT "orderitem_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_orders_orderid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("orderid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentmethod" ADD CONSTRAINT "paymentmethod_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productcategory" ADD CONSTRAINT "productcategory_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productcategory" ADD CONSTRAINT "productcategory_category_id_category_categoryid_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("categoryid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productdiscount" ADD CONSTRAINT "productdiscount_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productdiscount" ADD CONSTRAINT "productdiscount_discount_id_discount_discountid_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("discountid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productimage" ADD CONSTRAINT "productimage_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productinventory" ADD CONSTRAINT "productinventory_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_order_id_orders_orderid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("orderid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewhelpful" ADD CONSTRAINT "reviewhelpful_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewhelpful" ADD CONSTRAINT "reviewhelpful_review_id_review_reviewid_fk" FOREIGN KEY ("review_id") REFERENCES "public"."review"("reviewid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewimage" ADD CONSTRAINT "reviewimage_review_id_review_reviewid_fk" FOREIGN KEY ("review_id") REFERENCES "public"."review"("reviewid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_order_id_orders_orderid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("orderid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlistitem" ADD CONSTRAINT "wishlistitem_wishlist_id_wishlist_wishlistid_fk" FOREIGN KEY ("wishlist_id") REFERENCES "public"."wishlist"("wishlistid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlistitem" ADD CONSTRAINT "wishlistitem_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_cart_user_id" ON "cart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_cart_item_cart_id" ON "cart_item" USING btree ("cart_id");