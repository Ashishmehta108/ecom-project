CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'eur' NOT NULL,
	"status" varchar(50) DEFAULT 'requires_payment_method' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
