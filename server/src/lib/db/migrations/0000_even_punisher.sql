CREATE TABLE "analyze_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"url" text NOT NULL,
	"article_text" text,
	"model_response" jsonb,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
