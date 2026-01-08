<script setup lang="ts">
interface NotificationSectionProps {
	title: string;
	description: string;
	icon: string;
	color: string;
	enabled: boolean;
}

const props = defineProps<NotificationSectionProps>();

const enabled = defineModel<boolean>('enabled');

defineSlots<{
	default?: () => any;
}>();
</script>

<template>
	<div class="bg-white rounded-lg border border-gray-200 p-6">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div :class="`w-10 h-10 ${color}-100 rounded-lg flex items-center justify-center`">
					<Icon :name="icon" :class="`w-5 h-5 ${color}-600`" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
					<p class="text-sm text-gray-600">{{ description }}</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					v-model="enabled"
					type="checkbox"
					class="sr-only peer"
				/>
				<div
					:class="[
						'w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
						`peer-focus:ring-${color}-300`,
						`peer-checked:bg-${color}-600`
					]"
				></div>
			</label>
		</div>

		<div v-if="enabled" class="space-y-3 mt-4 pt-4 border-t border-gray-200">
			<slot />
		</div>
	</div>
</template>
