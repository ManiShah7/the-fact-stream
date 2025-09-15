CREATE TABLE "analysis_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"analysis_id" integer,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analysis_statuses_analysis_id_unique" UNIQUE("analysis_id")
);
--> statement-breakpoint
DROP TABLE "queued_analysis" CASCADE;--> statement-breakpoint
ALTER TABLE "analysis_statuses" ADD CONSTRAINT "analysis_statuses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_statuses" ADD CONSTRAINT "analysis_statuses_analysis_id_analyze_logs_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyze_logs"("id") ON DELETE no action ON UPDATE no action;