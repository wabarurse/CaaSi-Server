import { pgTable, uuid, timestamp, text, date, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Example users table schema
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isKycCompleted: boolean("is_kyc_completed").default(false).notNull(),

  // kyc information
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: date("date_of_birth"),
});

export const wallets = pgTable("wallets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  address: text("address").notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;