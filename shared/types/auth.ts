import type { z } from "zod";
import type { LoginFormDataSchema, RegisterFormDataSchema } from "../schemas";

export type LoginFormData = z.infer<typeof LoginFormDataSchema>;
export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>;


export interface AuthConfig {
	provider?: "workos" | "clerk" | "auth0";
	clientId?: string;
	redirectUri?: string;
	apiKey?: string;
}

export interface ModuleOptions {
	auth?: AuthConfig;
}
