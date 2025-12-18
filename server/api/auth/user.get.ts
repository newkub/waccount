import type { User } from "~/app/types/user";

export default defineEventHandler(async (event): Promise<User | null> => {
	const config = useRuntimeConfig(event);
	const session = await useSession(event, {
		password: config.nuxtSecret,
	});

	return (session.data.user as User | null) || null;
});
