import type { H3Event } from "h3";
import { createError, deleteCookie, getCookie, setCookie } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import { getWorkos } from "./workos";

export const WORKOS_SESSION_COOKIE_NAME = "wos-session";

const getRuntimeConfigOrThrow = () => {
	const runtimeConfig = useRuntimeConfig();

	if (!runtimeConfig.workosApiKey) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing NUXT_WORKOS_API_KEY",
		});
	}
	if (!runtimeConfig.public.workosClientId) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing NUXT_WORKOS_CLIENT_ID",
		});
	}
	if (!runtimeConfig.workosCookiePassword) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing NUXT_WORKOS_COOKIE_PASSWORD",
		});
	}

	return {
		workosApiKey: runtimeConfig.workosApiKey,
		workosClientId: runtimeConfig.public.workosClientId,
		workosCookiePassword: runtimeConfig.workosCookiePassword,
	};
};

export const getWorkosAuthkitConfig = () => {
	const cfg = getRuntimeConfigOrThrow();
	return {
		workos: getWorkos({
			workosApiKey: cfg.workosApiKey,
			workosClientId: cfg.workosClientId,
		}),
		clientId: cfg.workosClientId,
		cookiePassword: cfg.workosCookiePassword,
	};
};

export const setSealedSessionCookie = (
	event: H3Event,
	sealedSession: string,
) => {
	const isProd = process.env.NODE_ENV === "production";
	setCookie(event, WORKOS_SESSION_COOKIE_NAME, sealedSession, {
		httpOnly: true,
		secure: isProd,
		sameSite: "lax",
		path: "/",
	});
};

export const clearSealedSessionCookie = (event: H3Event) => {
	deleteCookie(event, WORKOS_SESSION_COOKIE_NAME, { path: "/" });
};

export const loadSessionFromCookie = async (event: H3Event) => {
	const { workos, cookiePassword } = getWorkosAuthkitConfig();
	const sessionData = getCookie(event, WORKOS_SESSION_COOKIE_NAME);

	if (!sessionData) {
		return null;
	}

	return workos.userManagement.loadSealedSession({
		sessionData,
		cookiePassword,
	});
};
