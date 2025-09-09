ALTER TABLE "queuedAnalysis" RENAME TO "queued_analysis";--> statement-breakpoint
ALTER TABLE "queued_analysis" DROP CONSTRAINT "queuedAnalysis_analysis_id_unique";--> statement-breakpoint
ALTER TABLE "queued_analysis" DROP CONSTRAINT "queuedAnalysis_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "queued_analysis" DROP CONSTRAINT "queuedAnalysis_analysis_id_analyze_logs_id_fk";
--> statement-breakpoint
ALTER TABLE "queued_analysis" ADD CONSTRAINT "queued_analysis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queued_analysis" ADD CONSTRAINT "queued_analysis_analysis_id_analyze_logs_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyze_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queued_analysis" ADD CONSTRAINT "queued_analysis_analysis_id_unique" UNIQUE("analysis_id");