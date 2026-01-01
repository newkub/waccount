// App-specific auth types
// Re-export shared auth types
export * from "../../shared/types/auth";

// Additional app-specific types
export interface CallbackResponse {
	success: boolean;
	user?: any;
	sessionToken?: string;
}
