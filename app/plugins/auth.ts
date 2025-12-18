export default defineNuxtPlugin(async (nuxtApp) => {
	const { fetchUser } = useAuth();

	// Skip user fetching on server-side for now
	if (process.server) {
		return;
	}

	try {
		await fetchUser();
	} catch (error) {
		console.error("Error fetching user on startup:", error);
	}
});
