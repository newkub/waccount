<script setup lang="ts">
import type { Activity } from "~/shared/types";

const props = defineProps<{
	activities: Activity[];
	loading?: boolean;
}>();

const { getActivityIcon } = useActivity();

const formattedActivities = computed(() =>
	props.activities.map((activity) => ({
		...activity,
		icon: getActivityIcon(activity.type),
		formattedTimestamp: formatTimestamp(activity.timestamp),
		formattedType: activity.type
			.replace(/\./g, " ")
			.replace(/\b\w/g, (l: string) => l.toUpperCase()),
	}))
);
</script>

<template>
	<SettingsSection title="Activity Log" icon="mdi:history">
		<div v-if="loading" class="text-center py-8">
			<Icon name="mdi:loading" class="animate-spin text-3xl text-primary-500" />
			<p class="mt-2 text-gray-500 dark:text-gray-400">Loading activities...</p>
		</div>
		<div
			v-else-if="activities.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			No recent activities found.
		</div>
		<TransitionGroup v-else tag="ul" name="list" class="space-y-3">
			<li
				v-for="activity in formattedActivities"
				:key="activity.id"
				class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50"
			>
				<div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
					<Icon
						:name="activity.icon"
						class="text-xl text-gray-500 dark:text-gray-400"
					/>
				</div>
				<div class="flex-1">
					<p class="font-medium text-gray-800 dark:text-gray-100">
						{{ activity.formattedType }}
					</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{{ activity.formattedTimestamp }}
					</p>
				</div>
			</li>
		</TransitionGroup>
	</SettingsSection>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
.list-leave-active {
	position: absolute;
}
</style>
