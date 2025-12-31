import type { User } from "#shared/types/user";

export const useUser = () => {
	const user = useState<User | null>("user", () => null);

	const { data: _data, refresh } = useFetch<User | null>("/api/auth/me", {
		onResponse: ({ response }) => {
			user.value = response._data ?? null;
		},
	});

	const isLoggedIn = computed(() => !!user.value);

	async function logout() {
		await $fetch("/api/auth/logout", { method: "POST" });
		user.value = null;
		await navigateTo("/");
	}

	return {
		user,
		isLoggedIn,
		refresh,
		logout,
	};
};
