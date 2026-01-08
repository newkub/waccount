<template>
	<div class="fixed top-4 right-4 space-y-4 z-50 w-full max-w-sm">
		<transition-group name="toast">
			<UiToast
				v-for="toast in toasts"
				:key="toast.id"
				:message="toast.message"
				:type="toast.type"
				@close="removeToast(toast.id)"
			/>
		</transition-group>
	</div>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToastsFacade();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
	transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
	opacity: 0;
	transform: translateX(100%);
}
</style>
