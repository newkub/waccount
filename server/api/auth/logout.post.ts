export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const session = await useSession(event, {
		password: config.nuxtSecret,
	});

	await session.clear();

	return { success: true };
});
