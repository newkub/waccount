<script setup lang="ts">
import type {
	OrgMembership,
	OrgMembershipsResponse,
	OrgMembersResponse,
} from "#shared/types";

definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();
const org = computed(() => String(route.params.org ?? ""));

const membersFetch = useFetch<OrgMembersResponse>(
	() => `/api/orgs/${org.value}/members`,
);

const membershipsFetch = useFetch<OrgMembershipsResponse>(
	() => `/api/orgs/${org.value}/memberships`,
);

const pending = computed(
	() => membersFetch.pending.value || membershipsFetch.pending.value,
);

const error = computed(
	() => membersFetch.error.value || membershipsFetch.error.value,
);

const refreshAll = async () => {
	await Promise.all([membersFetch.refresh(), membershipsFetch.refresh()]);
};

const membershipsByUserId = computed(() => {
	const map = new Map<string, OrgMembership>();
	for (const m of membershipsFetch.data.value?.memberships ?? []) {
		map.set(m.userId, m);
	}
	return map;
});

const getRoleLabel = (m: OrgMembership | undefined) => {
	const role = m?.role;
	if (!role) return "-";
	if (typeof role === "string") return role;
	try {
		return JSON.stringify(role);
	} catch {
		return String(role);
	}
};
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
			<p class="mt-1 text-gray-600 dark:text-gray-300">
				Manage members and roles for <code>{{ org }}</code>
			</p>
		</div>

		<UiCard class="p-6" v-if="pending">
			<p class="text-gray-600 dark:text-gray-300">Loading members...</p>
		</UiCard>

		<UiCard class="p-6" v-else-if="error">
			<div class="space-y-4">
				<p class="text-red-600">Failed to load members.</p>
				<UiButton variant="secondary" @click="refreshAll()">Retry</UiButton>
			</div>
		</UiCard>

		<UiCard class="p-6" v-else>
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
					Organization Members
				</h2>
				<span class="text-sm text-gray-600 dark:text-gray-300">
					{{ membersFetch.data.value?.members?.length ?? 0 }}
				</span>
			</div>

			<div
				v-if="(membersFetch.data.value?.members?.length ?? 0) === 0"
				class="mt-4"
			>
				<p class="text-sm text-gray-600 dark:text-gray-300">
					No members found.
				</p>
			</div>

			<div v-else class="mt-4 grid gap-3">
				<div
					v-for="u in membersFetch.data.value?.members ?? []"
					:key="u.id"
					class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<div class="font-medium text-gray-900 dark:text-white">
								{{ u.firstName || u.email }}
							</div>
							<div class="text-sm text-gray-600 dark:text-gray-300">
								{{ u.email }}
							</div>
							<div class="mt-2 text-xs text-gray-500">
								Status:
								{{ u.emailVerified ? "Verified" : "Pending" }}
								• Membership:
								{{ membershipsByUserId.get(u.id)?.status ?? "-" }}
								• Role:
								{{ getRoleLabel(membershipsByUserId.get(u.id)) }}
							</div>
						</div>
						<code class="text-xs text-gray-500">{{ u.id }}</code>
					</div>
				</div>
			</div>
		</UiCard>
	</div>
</template>
