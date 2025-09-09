CREATE TABLE "model_response" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"politicalAlignment" varchar,
	"credibilityScore" numeric NOT NULL,
	"credibilityReason" varchar NOT NULL,
	"sarcasmOrSatire" varchar NOT NULL,
	"recommendedAction" varchar NOT NULL,
	"image_url" text,
	"author" text
);
--> statement-breakpoint
CREATE TABLE "queuedAnalysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text,
	"user_id" integer NOT NULL,
	"analysis_id" integer NOT NULL,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL,
	CONSTRAINT "queuedAnalysis_analysis_id_unique" UNIQUE("analysis_id")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analyze_logs" RENAME COLUMN "model_response" TO "model_response_id";--> statement-breakpoint
ALTER TABLE "analyze_logs" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "analyze_logs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "analyze_logs" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "analyze_logs" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "analyze_logs" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "analyze_logs" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "analyze_logs" ADD COLUMN "author" text;--> statement-breakpoint
ALTER TABLE "queuedAnalysis" ADD CONSTRAINT "queuedAnalysis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queuedAnalysis" ADD CONSTRAINT "queuedAnalysis_analysis_id_analyze_logs_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyze_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyze_logs" ADD CONSTRAINT "analyze_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyze_logs" ADD CONSTRAINT "analyze_logs_model_response_id_model_response_id_fk" FOREIGN KEY ("model_response_id") REFERENCES "public"."model_response"("id") ON DELETE no action ON UPDATE no action;