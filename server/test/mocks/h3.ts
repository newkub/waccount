import { vi } from "vitest";

export type H3TestEvent = {
	context: {
		params?: Record<string, string | undefined>;
	};
	__body?: unknown;
	__query?: Record<string, unknown>;
	__headers?: Record<string, string | undefined>;
	__cookies?: Record<string, string | undefined>;
	__setCookies?: Array<{ name: string; value: string; options?: unknown }>;
	__deletedCookies?: Array<{ name: string; options?: unknown }>;
};

export const createTestEvent = (
	overrides: Partial<H3TestEvent> = {},
): H3TestEvent => {
	return {
		context: {
			params: {},
		},
		__headers: {},
		__cookies: {},
		__setCookies: [],
		__deletedCookies: [],
		...overrides,
	} satisfies H3TestEvent;
};

vi.mock("h3", () => {
	const createError = (opts: { statusCode: number; statusMessage: string }) => {
		const err = new Error(opts.statusMessage) as Error & {
			statusCode?: number;
			statusMessage?: string;
		};
		err.statusCode = opts.statusCode;
		err.statusMessage = opts.statusMessage;
		return err;
	};

	const defineEventHandler = <T extends (...args: any[]) => any>(handler: T) => handler;

	const readBody = async <T = unknown>(event: H3TestEvent): Promise<T> => event.__body as T;
	const getQuery = (event: H3TestEvent) => event.__query ?? {};
	const getHeader = (event: H3TestEvent, name: string) => event.__headers?.[name.toLowerCase()];

	const sendRedirect = async (
		_event: H3TestEvent,
		location: string,
		statusCode = 302,
	) => {
		return { location, statusCode };
	};

	const getCookie = (event: H3TestEvent, name: string) => event.__cookies?.[name];
	const setCookie = (
		event: H3TestEvent,
		name: string,
		value: string,
		options?: unknown,
	) => {
		if (!event.__cookies) {
			event.__cookies = {};
		}
		event.__cookies[name] = value;
		event.__setCookies = [
			...(event.__setCookies ?? []),
			{ name, value, options },
		];
	};
	const deleteCookie = (
		event: H3TestEvent,
		name: string,
		options?: unknown,
	) => {
		if (event.__cookies) event.__cookies[name] = undefined;
		event.__deletedCookies = [
			...(event.__deletedCookies ?? []),
			{ name, options },
		];
	};

	const getRouterParams = (event: H3TestEvent) => event.context.params ?? {};

	return {
		createError,
		defineEventHandler,
		readBody,
		getQuery,
		getHeader,
		sendRedirect,
		getCookie,
		setCookie,
		deleteCookie,
		getRouterParams,
	};
});
