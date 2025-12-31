import { vi } from "vitest";

export type MockOrgDashboardLayoutRow = {
	id: string;
	orgExternalId: string;
	userId: string;
	layout: unknown;
	updatedAt?: Date;
	createdAt?: Date;
};

const state = {
	row: null as MockOrgDashboardLayoutRow | null,
};

export const setMockOrgDashboardLayoutRow = (row: MockOrgDashboardLayoutRow | null) => {
	state.row = row;
};

export const mockDb = {
	query: {
		orgDashboardLayouts: {
			findFirst: vi.fn(async () => state.row),
		},
	},
	insert: vi.fn(() => ({
		values: vi.fn(async (values: any) => {
			state.row = {
				id: values.id,
				orgExternalId: values.orgExternalId,
				userId: values.userId,
				layout: values.layout,
				createdAt: values.createdAt ?? new Date(),
				updatedAt: values.updatedAt ?? new Date(),
			};
			return state.row;
		}),
	})),
	update: vi.fn(() => ({
		set: vi.fn((values: any) => ({
			where: vi.fn(async () => {
				if (state.row) {
					state.row = {
						...state.row,
						layout: values.layout ?? state.row.layout,
						updatedAt: values.updatedAt ?? state.row.updatedAt,
					};
				}
				return state.row;
			}),
		})),
	})),
};

vi.mock("~~/server/db", () => {
	return { db: mockDb };
});
