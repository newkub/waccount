import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	name: text("name"),
	avatarUrl: text("avatar_url"),
	emailVerified: boolean("email_verified").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => users.id),
	expiresAt: timestamp("expires_at").notNull(),
});

export const orgDashboardLayouts = pgTable("org_dashboard_layouts", {
	id: text("id").primaryKey(),
	orgExternalId: text("org_external_id").notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	layout: jsonb("layout").notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
