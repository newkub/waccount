import type { SlotConfig } from "~/shared/types/slots";

export const defaultSlotConfigs: SlotConfig[] = [
	{
		id: "profile",
		title: "Profile",
		description: "User profile information",
		icon: "mdi:account",
		component: "ProfileSlot",
		permissions: [],
		defaultVisible: true,
		defaultOrder: 0,
		category: "account",
		tags: ["user", "profile"],
	},
	{
		id: "settings",
		title: "Settings",
		description: "Account settings",
		icon: "mdi:cog",
		component: "SettingsSlot",
		permissions: [],
		defaultVisible: true,
		defaultOrder: 1,
		category: "account",
		tags: ["settings", "config"],
	},
	{
		id: "security",
		title: "Security",
		description: "Security settings",
		icon: "mdi:shield-account",
		component: "SecuritySlot",
		permissions: [],
		defaultVisible: true,
		defaultOrder: 2,
		category: "account",
		tags: ["security", "auth"],
	},
	{
		id: "billing",
		title: "Billing",
		description: "Billing and subscription",
		icon: "mdi:credit-card",
		component: "BillingSlot",
		permissions: ["billing:read"],
		defaultVisible: true,
		defaultOrder: 3,
		category: "account",
		tags: ["billing", "payment"],
	},
	{
		id: "notifications",
		title: "Notifications",
		description: "Notification preferences",
		icon: "mdi:bell",
		component: "NotificationsSlot",
		permissions: [],
		defaultVisible: true,
		defaultOrder: 4,
		category: "account",
		tags: ["notifications", "alerts"],
	},
	{
		id: "integrations",
		title: "Integrations",
		description: "Third-party integrations",
		icon: "mdi:puzzle",
		component: "IntegrationsSlot",
		permissions: ["integrations:read"],
		defaultVisible: false,
		defaultOrder: 5,
		category: "account",
		tags: ["integrations", "api"],
	},
	{
		id: "audit-log",
		title: "Audit Log",
		description: "Activity history",
		icon: "mdi:history",
		component: "AuditLogSlot",
		permissions: ["audit:read"],
		defaultVisible: false,
		defaultOrder: 6,
		category: "account",
		tags: ["audit", "logs"],
	},
	{
		id: "api-keys",
		title: "API Keys",
		description: "Manage API keys",
		icon: "mdi:key",
		component: "ApiKeysSlot",
		permissions: ["api:manage"],
		defaultVisible: false,
		defaultOrder: 7,
		category: "account",
		tags: ["api", "keys"],
	},
	{
		id: "teams",
		title: "Teams",
		description: "Team management",
		icon: "mdi:account-group",
		component: "TeamsSlot",
		permissions: ["teams:read"],
		defaultVisible: false,
		defaultOrder: 8,
		category: "account",
		tags: ["teams", "collaboration"],
	},
	{
		id: "developer",
		title: "Developer",
		description: "Developer tools",
		icon: "mdi:code-braces",
		component: "DeveloperSlot",
		permissions: ["developer:access"],
		defaultVisible: false,
		defaultOrder: 9,
		category: "account",
		tags: ["developer", "tools"],
	},
];

export const defaultTemplates = [
	{
		name: "Basic",
		description: "Basic account slots",
		category: "default",
		isDefault: true,
		slots: defaultSlotConfigs
			.filter((s) => ["profile", "settings", "security"].includes(s.id))
			.map((config) => ({
				slotId: config.id,
				visible: true,
				order: config.defaultOrder,
				pinned: false,
			})),
	},
	{
		name: "Developer",
		description: "Developer-focused slots",
		category: "developer",
		isDefault: true,
		slots: defaultSlotConfigs
			.filter((s) => ["profile", "settings", "security", "api-keys", "developer"].includes(s.id))
			.map((config) => ({
				slotId: config.id,
				visible: true,
				order: config.defaultOrder,
				pinned: false,
			})),
	},
	{
		name: "Manager",
		description: "Manager-focused slots",
		category: "manager",
		isDefault: true,
		slots: defaultSlotConfigs
			.filter((s) => ["profile", "settings", "billing", "teams", "notifications"].includes(s.id))
			.map((config) => ({
				slotId: config.id,
				visible: true,
				order: config.defaultOrder,
				pinned: false,
			})),
	},
	{
		name: "Full Access",
		description: "All available slots",
		category: "full",
		isDefault: true,
		slots: defaultSlotConfigs.map((config) => ({
			slotId: config.id,
			visible: true,
			order: config.defaultOrder,
			pinned: false,
		})),
	},
];

export async function seedDefaultSlots() {
	const db = await useDatabase();
	const { slotConfigs, slotTemplates } = await import("~/server/db/schema");
	const { eq } = await import("drizzle-orm");

	for (const config of defaultSlotConfigs) {
		const existing = await db
			.select()
			.from(slotConfigs)
			.where(eq(slotConfigs.id, config.id))
			.limit(1);

		if (existing.length === 0) {
			await db.insert(slotConfigs).values(config);
		}
	}

	for (const template of defaultTemplates) {
		const existing = await db
			.select()
			.from(slotTemplates)
			.where(eq(slotTemplates.name, template.name))
			.limit(1);

		if (existing.length === 0) {
			await db.insert(slotTemplates).values(template);
		}
	}
}
