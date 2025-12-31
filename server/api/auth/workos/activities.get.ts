import { defineEventHandler } from "h3";
import type { Activity } from "../../../../shared/types";
import { requireAuthenticatedAuthkitSession } from "../../../utils/authkit-guard";
import { getWorkosAuthkitConfig } from "../../../utils/authkit-session";

const toActivity = (evt: {
	id: string;
	event: string;
	createdAt: string;
	data: unknown;
}): Activity => {
	return {
		id: evt.id,
		type: evt.event,
		timestamp: evt.createdAt,
		data: evt.data,
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
	const { workos } = getWorkosAuthkitConfig();

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
		.map((evt) =>
			toActivity({
				id: evt.id,
				event: mapWorkosEventToActivityType(evt.event),
				createdAt: evt.createdAt,
				data: evt.data,
			})
		)
		.filter((a) => {
			const eventUserId = getUserIdFromEventData(a.data);
			if (!eventUserId) {
				return true;
			}
			return eventUserId === user.id;
		});

	return { activities };
});
