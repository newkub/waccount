<script setup lang="ts">
import type { User } from "#shared/types";

const props = defineProps<{
	user: User;
	loading?: boolean;
	formData: { firstName: string; lastName: string };
	isChanged: boolean;
}>();

const emit = defineEmits<{
	(e: "submit"): void;
	(e: "upload-avatar", file: File): void;
}>();
</script>

<template>
	<div class="space-y-8">
		<ProfileAvatarUploader
			:user="user"
			:loading="loading"
			@upload-avatar="(file: File) => emit('upload-avatar', file)"
		/>

		<form @submit.prevent="emit('submit')" class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label
						for="firstName"
						class="block text-sm font-medium text-gray-700 mb-1"
					>First Name</label>
					<UiInput
						id="firstName"
						v-model="props.formData.firstName"
						type="text"
						:disabled="loading"
						placeholder="Enter first name"
					/>
				</div>
				<div>
					<label
						for="lastName"
						class="block text-sm font-medium text-gray-700 mb-1"
					>Last Name</label>
					<UiInput
						id="lastName"
						v-model="props.formData.lastName"
						type="text"
						:disabled="loading"
						placeholder="Enter last name"
					/>
				</div>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1"
				>Email Address</label>
				<UiInput
					id="email"
					:model-value="user.email"
					type="email"
					readonly
					disabled
				/>
			</div>

			<div class="flex items-center justify-end">
				<UiButton
					type="submit"
					:disabled="!isChanged || loading"
					:loading="loading"
				>
					Save Changes
				</UiButton>
			</div>
		</form>
	</div>
</template>
