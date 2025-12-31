import type { User } from "../types";

const toSlugPart = (value: string) => {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
};

export const getUserHandle = (user: Pick<User, "firstName" | "lastName" | "email">) => {
	const fullName = [user.firstName ?? "", user.lastName ?? ""]
		.map((s) => s.trim())
		.filter(Boolean)
		.join(" ");

	if (fullName) {
		const slug = toSlugPart(fullName);
		if (slug) return slug;
	}

	const emailPrefix = user.email.split("@")[0] ?? "";
	const emailSlug = toSlugPart(emailPrefix);
	if (emailSlug) return emailSlug;

	return "user";
};
