export interface SSOConnection {
	id: string;
	type: "sso";
	provider: string;
	status: string;
	email?: string; // Email is not directly available on the WorkOS connection object
	connectedAt: string | number | Date;
	lastUsed: string | number | Date;
}

export interface Integration {
	id: string;
	type: "integration";
	provider: string;
	status: string;
	workspace?: string;
	connectedAt: string | number | Date;
	lastUsed: string | number | Date;
	permissions: string[];
}

export type Connection = SSOConnection | Integration;

export interface Provider {
	id: string;
	name: string;
	type: "sso" | "integration";
	description: string;
	icon: string;
}
