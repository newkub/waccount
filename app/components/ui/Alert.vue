<script setup lang="ts">
interface Props {
	type: "success" | "error";
	message: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);

const isSuccess = computed(() => props.type === "success");
</script>

<template>
	<div class="fixed top-4 right-4 z-50 max-w-sm w-full">
		<Transition
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="opacity-0 translate-x-4"
			enter-to-class="opacity-100 translate-x-0"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="opacity-100 translate-x-0"
			leave-to-class="opacity-0 translate-x-4"
		>
			<div
				:class="[
					'backdrop-blur-md rounded-xl p-4 shadow-lg border',
					isSuccess
						? 'bg-green-50/80 dark:bg-green-900/80 border-green-200 dark:border-green-800'
						: 'bg-red-50/80 dark:bg-red-900/80 border-red-200 dark:border-red-800',
				]"
			>
				<div class="flex items-start">
					<div class="flex-shrink-0">
						<Icon
							:name="isSuccess ? 'mdi:check-circle' : 'mdi:alert-circle'"
							:class="['text-xl', isSuccess ? 'text-green-500' : 'text-red-500']"
						/>
					</div>
					<div class="ml-3 w-0 flex-1 pt-0.5">
						<p
							:class="[
								'text-sm font-medium',
								isSuccess
									? 'text-green-800 dark:text-green-100'
									: 'text-red-800 dark:text-red-100',
							]"
						>
							{{ isSuccess ? "Success" : "Error" }}
						</p>
						<p
							:class="[
								'mt-1 text-sm',
								isSuccess
									? 'text-green-700 dark:text-green-200'
									: 'text-red-700 dark:text-red-200',
							]"
						>
							{{ message }}
						</p>
					</div>
					<div class="ml-4 flex-shrink-0 flex">
						<button
							@click="emit('close')"
							:class="[
								'inline-flex rounded-md p-1.5 transition',
								isSuccess
									? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 dark:focus:ring-offset-green-900 focus:ring-green-600'
									: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-red-900 focus:ring-red-600',
							]"
						>
							<span class="sr-only">Close</span>
							<Icon name="mdi:close" class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
