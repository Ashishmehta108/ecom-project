CREATE TABLE "appointment" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"customer_name" varchar(120) NOT NULL,
	"customer_email" varchar(160) NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"device_type" varchar(120) NOT NULL,
	"issue_description" text NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"status" varchar(40) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
