<script setup lang="ts">
import type { User } from '~/types';

interface Props {
	user: User;
	loading?: boolean;
}

interface Emits {
	'update-profile': [data: { firstName?: string; lastName?: string; profilePictureUrl?: string }];
	'upload-avatar': [file: File];
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
});

const emit = defineEmits<Emits>();

const form = reactive({
	firstName: props.user.name?.split(' ')[0] || '',
	lastName: props.user.name?.split(' ').slice(1).join(' ') || '',
	profilePictureUrl: props.user.avatar || '',
});

const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);

const isFormChanged = computed(() => {
	return (
		form.firstName !== (props.user.name?.split(' ')[0] || '') ||
		form.lastName !== (props.user.name?.split(' ').slice(1).join(' ') || '') ||
		form.profilePictureUrl !== (props.user.avatar || '')
	);
});

const handleSubmit = () => {
	if (isFormChanged.value) {
		emit('update-profile', {
			firstName: form.firstName.trim() || undefined,
			lastName: form.lastName.trim() || undefined,
			profilePictureUrl: form.profilePictureUrl.trim() || undefined,
		});
	}
};

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file?.type.startsWith('image/')) {
		emit('upload-avatar', file);
	}
};

const handleDrop = (event: DragEvent) => {
	event.preventDefault();
	isDragOver.value = false;

	const file = event.dataTransfer?.files[0];
	if (file?.type.startsWith('image/')) {
		emit('upload-avatar', file);
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

// Watch for user prop changes to update form
watch(
	() => props.user,
	(newUser) => {
		form.firstName = newUser.name?.split(' ')[0] || '';
		form.lastName = newUser.name?.split(' ').slice(1).join(' ') || '';
		form.profilePictureUrl = newUser.avatar || '';
	},
	{ deep: true },
);
</script>

<template>
	<div class="space-y-8">
		<!-- Profile Picture Section -->
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
			<div class="flex items-center gap-6">
				<div class="relative">
					<div v-if="form.profilePictureUrl" class="w-20 h-20 rounded-full overflow-hidden">
						<img :src="form.profilePictureUrl" :alt="form.firstName" class="w-full h-full object-cover">
					</div>
					<div v-else class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
						<i class="i-mdi-account text-3xl text-gray-400"></i>
					</div>

					<div
						@drop="handleDrop"
						@dragover="handleDragOver"
						@dragleave="handleDragLeave"
						@click="triggerFileInput"
						:class="[
							'absolute inset-0 rounded-full border-2 border-dashed cursor-pointer transition-colors',
							isDragOver ? 'border-primary-500 bg-primary-50' : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
						]"
					>
						<div class="w-full h-full flex items-center justify-center">
							<i class="i-mdi-camera text-white text-lg bg-black bg-opacity-50 rounded-full p-1"></i>
						</div>
					</div>
				</div>

				<div>
					<button
						type="button"
						@click="triggerFileInput"
						:disabled="loading"
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

		<!-- Basic Information Form -->
		<form @submit.prevent="handleSubmit" class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
						First Name
					</label>
					<input
						id="firstName"
						v-model="form.firstName"
						type="text"
						:disabled="loading"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
						placeholder="Enter first name"
					/>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
						Last Name
					</label>
					<input
						id="lastName"
						v-model="form.lastName"
						type="text"
						:disabled="loading"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
						placeholder="Enter last name"
					/>
				</div>
			</div>

			<!-- Email (Read-only) -->
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
					Email Address
				</label>
				<input
					id="email"
					:value="user.email"
					type="email"
					readonly
					disabled
					class="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg cursor-not-allowed"
				/>
			</div>

			<!-- Submit Button -->
			<div class="flex items-center justify-end">
				<button
					type="submit"
					:disabled="!isFormChanged || loading"
					class="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<i v-if="loading" class="i-mdi-loading animate-spin mr-2"></i>
					{{ loading ? 'Saving...' : 'Save Changes' }}
				</button>
			</div>
		</form>
	</div>
</template>
