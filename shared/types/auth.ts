import type { z } from "zod";
import type { LoginFormDataSchema, RegisterFormDataSchema } from "./schemas";

export type LoginFormData = z.infer<typeof LoginFormDataSchema>;
export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>;

export type RegisterFormEmit = {
	(e: "success"): void;
	(e: "error", error: string): void;
};
