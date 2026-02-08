ALTER TABLE "posts" RENAME TO "wallets";--> statement-breakpoint
ALTER TABLE "wallets" RENAME COLUMN "title" TO "user_id";--> statement-breakpoint
ALTER TABLE "wallets" RENAME COLUMN "content" TO "address";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "name" TO "is_kyc_completed";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updated_at" TO "first_name";--> statement-breakpoint
ALTER TABLE "wallets" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" DROP COLUMN "author_id";--> statement-breakpoint
ALTER TABLE "wallets" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "wallets" DROP COLUMN "updated_at";