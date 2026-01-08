import type { z } from "zod";

export const SlotConfigSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	component: z.string(),
	permissions: z.array(z.string()).default([]),
	defaultVisible: z.boolean().default(true),
	defaultOrder: z.number().default(0),
	category: z.string().optional(),
	tags: z.array(z.string()).default([]),
	metadata: z.record(z.any()).optional(),
});

export const SlotStateSchema = z.object({
	slotId: z.string(),
	visible: z.boolean(),
	order: z.number(),
	customTitle: z.string().optional(),
	customIcon: z.string().optional(),
	pinned: z.boolean().default(false),
});

export const SlotLayoutSchema = z.object({
	id: z.string(),
	userId: z.string(),
	projectContext: z.string().optional(),
	slots: z.array(SlotStateSchema),
	updatedAt: z.date(),
	createdAt: z.date(),
});

export const SlotTemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	category: z.string().optional(),
	slots: z.array(SlotConfigSchema),
	isDefault: z.boolean().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const SlotAnalyticsSchema = z.object({
	id: z.string(),
	userId: z.string(),
	slotId: z.string(),
	projectContext: z.string().optional(),
	viewCount: z.number().default(0),
	lastViewedAt: z.date().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const SlotVersionSchema = z.object({
	id: z.string(),
	layoutId: z.string(),
	userId: z.string(),
	version: z.number(),
	slots: z.array(SlotStateSchema),
	createdAt: z.date(),
});

export type SlotConfig = z.infer<typeof SlotConfigSchema>;
export type SlotState = z.infer<typeof SlotStateSchema>;
export type SlotLayout = z.infer<typeof SlotLayoutSchema>;
export type SlotTemplate = z.infer<typeof SlotTemplateSchema>;
export type SlotAnalytics = z.infer<typeof SlotAnalyticsSchema>;
export type SlotVersion = z.infer<typeof SlotVersionSchema>;

export interface SlotTabOptions {
	draggable?: boolean;
	resizable?: boolean;
	closable?: boolean;
	pinnable?: boolean;
	previewMode?: boolean;
}

export interface SlotManagerConfig {
	maxSlots?: number;
	enableAnalytics?: boolean;
	enableVersioning?: boolean;
	enableRealtimeSync?: boolean;
	defaultTemplate?: string;
}

export interface ProjectContext {
	id: string;
	name: string;
	type: string;
	metadata?: Record<string, any>;
}
