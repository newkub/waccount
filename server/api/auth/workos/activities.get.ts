import type { Activity } from "#shared/types";
import { defineEventHandler } from "h3";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { createWorkos } from "../../../utils/workos";

const toActivity = (evt: {
	id: string;
	event: string;
	createdAt: string;
	data: any;
}): Activity => {
	// This is a temporary mapping. You might want to create a more robust mapping.
	const typeMap: Record<string, Activity["type"]> = {
		"user.signed_in": "login",
	};

	return {
		id: evt.id,
		type: typeMap[evt.event] || "security", // Default to 'security' or another appropriate type
		timestamp: evt.createdAt,
		action: evt.event,
		description: `User event: ${evt.event}`,
		ipAddress: evt.data?.ip_address || "N/A",
		location: "N/A",
		userAgent: evt.data?.user_agent || "N/A",
		success: true,
		metadata: evt.data,
	};
};

const getUserIdFromEventData = (data: unknown) => {
	if (!data || typeof data !== "object") return null;
	const anyData = data as Record<string, unknown>;
	const maybeUser = anyData.user;
	if (maybeUser && typeof maybeUser === "object") {
		const maybeUserId = (maybeUser as Record<string, unknown>).id;
		return typeof maybeUserId === "string" ? maybeUserId : null;
	}
	const maybeUserId = anyData.userId;
	return typeof maybeUserId === "string" ? maybeUserId : null;
};

const mapWorkosEventToActivityType = (eventName: string) => {
	if (eventName === "authentication.user_signed_in") return "user.signed_in";
	if (eventName === "authentication.user_signed_out") return "user.signed_out";
	return eventName;
};

export default defineEventHandler(async (event) => {
	const { user } = await requireAuthenticatedAuthkitSession(event);
	const workos = createWorkos(event);

	const eventsResponse = await workos.events.listEvents({
		events: [
			"authentication.user_signed_in" as any,
			"authentication.user_signed_out" as any,
			"dsync.user.created" as any,
			"dsync.user.updated" as any,
		],
		limit: 50,
	});

	const activities = eventsResponse.data
		.map((evt: any) =>
			toActivity({
				id: evt.id,
				event: mapWorkosEventToActivityType(evt.event),
				createdAt: evt.createdAt,
				data: evt.data,
			})
		)
		.filter((a: any) => {
			const eventUserId = getUserIdFromEventData(a.metadata);
			if (!eventUserId) {
				return true;
			}
			return eventUserId === user.id;
		});

	return { activities };
});
