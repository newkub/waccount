<script setup lang="ts">
import { LoginFormDataSchema } from "~/shared/schemas";
import type { LoginFormData } from "~/shared/types/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, Field, useForm } from "vee-validate";

const emit = defineEmits<{ (e: "submit", data: LoginFormData): void }>();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(LoginFormDataSchema),
});

const onSubmit = handleSubmit((values) => {
	emit("submit", values);
});
</script>

<template>
	<form class="p-6 space-y-4" @submit="onSubmit">
		<div class="space-y-1.5">
			<label class="text-sm font-medium text-gray-700" for="email">Email</label>
			<Field name="email" v-slot="{ field, meta }">
				<UiInput
					id="email"
					type="email"
					placeholder="you@company.com"
					v-bind="field"
					:class="{ 'border-red-500': !meta.valid && meta.touched }"
				/>
			</Field>
			<ErrorMessage name="email" class="text-sm text-red-600" />
		</div>

		<div class="space-y-1.5">
			<label class="text-sm font-medium text-gray-700" for="password"
			>Password</label>
			<Field name="password" v-slot="{ field, meta }">
				<UiInput
					id="password"
					type="password"
					placeholder="••••••••"
					v-bind="field"
					:class="{ 'border-red-500': !meta.valid && meta.touched }"
				/>
			</Field>
			<ErrorMessage name="password" class="text-sm text-red-600" />
		</div>

		<div class="flex items-center justify-end">
			<NuxtLink
				to="/auth/forgot-password"
				class="text-sm font-medium text-primary-600 hover:underline"
			>
				Forgot password?
			</NuxtLink>
		</div>

		<UiButton type="submit" class="w-full">
			Sign in
		</UiButton>

		<div class="text-center text-sm text-gray-600">
			Don’t have an account?
			<NuxtLink
				to="/auth/signup"
				class="font-medium text-primary-600 hover:underline"
			>Create one</NuxtLink>
		</div>
	</form>
</template>
