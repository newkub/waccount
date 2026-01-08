import { boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

export const slotConfigs = pgTable("slot_configs", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	icon: text("icon"),
	component: text("component").notNull(),
	permissions: jsonb("permissions").$type<string[]>().default([]),
	defaultVisible: boolean("default_visible").notNull().default(true),
	defaultOrder: integer("default_order").notNull().default(0),
	category: text("category"),
	tags: jsonb("tags").$type<string[]>().default([]),
	metadata: jsonb("metadata").$type<Record<string, any>>(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const slotLayouts = pgTable(
	"slot_layouts",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id").notNull().references(() => users.id),
		projectContext: text("project_context"),
		slots: jsonb("slots").$type<
			Array<{
				slotId: string;
				visible: boolean;
				order: number;
				customTitle?: string;
				customIcon?: string;
				pinned: boolean;
			}>
		>().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index("slot_layouts_user_id_idx").on(table.userId),
		projectContextIdx: index("slot_layouts_project_context_idx").on(table.projectContext),
	}),
);

export const slotTemplates = pgTable(
	"slot_templates",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		description: text("description"),
		category: text("category"),
		slots: jsonb("slots").notNull(),
		isDefault: boolean("is_default").notNull().default(false),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		categoryIdx: index("slot_templates_category_idx").on(table.category),
	}),
);

export const slotAnalytics = pgTable(
	"slot_analytics",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id").notNull().references(() => users.id),
		slotId: text("slot_id").notNull(),
		projectContext: text("project_context"),
		viewCount: integer("view_count").notNull().default(0),
		lastViewedAt: timestamp("last_viewed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index("slot_analytics_user_id_idx").on(table.userId),
		slotIdIdx: index("slot_analytics_slot_id_idx").on(table.slotId),
	}),
);

export const slotVersions = pgTable(
	"slot_versions",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		layoutId: uuid("layout_id").notNull().references(() => slotLayouts.id),
		userId: text("user_id").notNull().references(() => users.id),
		version: integer("version").notNull(),
		slots: jsonb("slots").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		layoutIdIdx: index("slot_versions_layout_id_idx").on(table.layoutId),
		versionIdx: index("slot_versions_version_idx").on(table.version),
	}),
);

export const projectContexts = pgTable(
	"project_contexts",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id").notNull().references(() => users.id),
		name: text("name").notNull(),
		type: text("type").notNull(),
		metadata: jsonb("metadata").$type<Record<string, any>>(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index("project_contexts_user_id_idx").on(table.userId),
	}),
);
