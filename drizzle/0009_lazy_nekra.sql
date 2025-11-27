CREATE TABLE "pos_cart" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pos_cart_item" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"product_id" text NOT NULL,
	"name" text,
	"brand" text,
	"model" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_customer" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"address" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pos_order" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'INR',
	"status" text DEFAULT 'pending',
	"order_status" text DEFAULT 'pending',
	"stripe_checkout_session_id" text,
	"stripe_payment_intent_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pos_order_item" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"name" text,
	"brand" text,
	"model" text
);
--> statement-breakpoint
CREATE TABLE "pos_payment" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_checkout_session_id" text,
	"status" text DEFAULT 'requires_payment_method',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pos_cart" ADD CONSTRAINT "pos_cart_customer_id_pos_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."pos_customer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_cart_item" ADD CONSTRAINT "pos_cart_item_cart_id_pos_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."pos_cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_order" ADD CONSTRAINT "pos_order_customer_id_pos_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."pos_customer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_order_item" ADD CONSTRAINT "pos_order_item_order_id_pos_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pos_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_payment" ADD CONSTRAINT "pos_payment_order_id_pos_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pos_order"("id") ON DELETE set null ON UPDATE no action;