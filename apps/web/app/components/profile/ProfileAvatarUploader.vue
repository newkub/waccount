<script setup lang="ts">
import type { User } from "~/shared/types";

interface Props {
	user: User;
	loading?: boolean;
}

type Emits = (e: "upload-avatar", file: File) => void;

const props = withDefaults(defineProps<Props>(), {
	loading: false,
});

const emit = defineEmits<Emits>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file?.type.startsWith("image/")) {
		emit("upload-avatar", file);
	}
};

const handleDrop = (event: DragEvent) => {
	event.preventDefault();
	isDragOver.value = false;

	const file = event.dataTransfer?.files[0];
	if (file?.type.startsWith("image/")) {
		emit("upload-avatar", file);
	}
};

const handleDragOver = (event: DragEvent) => {
	event.preventDefault();
	isDragOver.value = true;
};

const handleDragLeave = () => {
	isDragOver.value = false;
};

const triggerFileInput = () => {
	fileInput.value?.click();
};
</script>

<template>
	<div>
		<label class="block text-sm font-medium text-gray-700 mb-3"
		>Profile Picture</label>
		<div class="flex items-center gap-6">
			<div class="relative">
				<div
					v-if="props.user.avatar"
					class="w-20 h-20 rounded-full overflow-hidden bg-gray-100"
				>
					<img
						:src="props.user.avatar"
						:alt="props.user.firstName || 'Avatar'"
						class="w-full h-full object-cover"
					>
				</div>
				<div
					v-else
					class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"
				>
					<Icon name="mdi:account" class="text-3xl text-gray-400" />
				</div>

				<div
					@drop.prevent="handleDrop"
					@dragover.prevent="handleDragOver"
					@dragleave.prevent="handleDragLeave"
					@click="triggerFileInput"
					:class="[
						'absolute inset-0 rounded-full border-2 border-dashed cursor-pointer transition-colors flex items-center justify-center',
						isDragOver
							? 'border-primary-500 bg-primary-50/50'
							: 'border-transparent hover:border-gray-300 hover:bg-gray-500/20',
					]"
				>
					<Icon
						name="mdi:camera"
						class="text-white text-lg transition-opacity"
						:class="isDragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
					/>
				</div>
			</div>

			<div>
				<button
					type="button"
					@click="triggerFileInput"
					:disabled="props.loading"
					class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Change Picture
				</button>
				<p class="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
			</div>

			<input
				ref="fileInput"
				type="file"
				accept="image/*"
				class="hidden"
				@change="handleFileSelect"
			/>
		</div>
	</div>
</template>
