<script setup lang="ts">
interface Step {
	step: number;
	label: string;
	completed: boolean | null;
}

defineProps<{
	steps: Step[];
}>();
</script>

<template>
	<div class="flex items-center justify-between">
		<div
			v-for="(step, index) in steps"
			:key="step.step"
			class="flex items-center"
		>
			<div class="flex items-center">
				<div
					:class="[
						'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
						step.completed
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 text-gray-500',
					]"
				>
					<Icon v-if="step.completed" name="mdi:check" class="w-4 h-4" />
					<span v-else>{{ step.step }}</span>
				</div>
				<span
					:class="[
						'ml-2 text-sm font-medium',
						step.completed ? 'text-blue-600' : 'text-gray-500',
					]"
				>
					{{ step.label }}
				</span>
			</div>
			<div
				v-if="index < steps.length - 1"
				class="w-8 h-0.5 mx-4"
				:class="step.completed ? 'bg-blue-600' : 'bg-gray-200'"
			>
			</div>
		</div>
	</div>
</template>
