import { WorkOS } from "@workos-inc/node";
import type { H3Event } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";

export function getWorkos(config: { workosApiKey: string; workosClientId: string }) {
	return new WorkOS(config.workosApiKey, {
		clientId: config.workosClientId,
	});
}

export function createWorkos(event: H3Event) {
	const config = useRuntimeConfig(event);

	return new WorkOS(config.workosApiKey, {
		clientId: config.public.workosClientId,
	});
}
