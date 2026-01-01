<script setup lang="ts">
const { messages, removeMessage } = useFeedback();

const getIcon = (type: string) => {
	switch (type) {
		case "success":
			return "mdi:check-circle-outline";
		case "error":
			return "mdi:alert-circle-outline";
		case "warning":
			return "mdi:alert-outline";
		default:
			return "mdi:information-outline";
	}
};

const getClasses = (type: string) => {
	switch (type) {
		case "success":
			return "bg-green-500 border-green-600";
		case "error":
			return "bg-red-500 border-red-600";
		case "warning":
			return "bg-yellow-500 border-yellow-600";
		default:
			return "bg-blue-500 border-blue-600";
	}
};
</script>

<template>
	<div class="fixed top-5 right-5 z-50 space-y-3 w-80">
		<TransitionGroup name="list" tag="div">
			<div
				v-for="message in messages"
				:key="message.id"
				class="relative flex items-start gap-3 p-4 text-white rounded-lg shadow-lg overflow-hidden border-l-4"
				:class="getClasses(message.type)"
			>
				<Icon :name="getIcon(message.type)" class="w-6 h-6 shrink-0 mt-0.5" />
				<p class="text-sm font-medium">{{ message.message }}</p>
				<button
					@click="removeMessage(message.id)"
					class="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
				>
					<Icon name="mdi:close" class="w-4 h-4" />
				</button>
			</div>
		</TransitionGroup>
	</div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
