<script setup lang="ts">
import type { RegisterFormData } from "#shared/types/auth";
import { RegisterFormDataSchema } from "#shared/types/schemas";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, Field, useForm } from "vee-validate";

const emit = defineEmits<{ (e: "submit", data: RegisterFormData): void }>();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(RegisterFormDataSchema),
});

const onSubmit = handleSubmit((values) => {
	emit("submit", values as RegisterFormData);
});
</script>

<template>
	<form class="p-6 space-y-4" @submit="onSubmit">
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="space-y-1.5">
				<label class="text-sm font-medium text-gray-700" for="firstName"
				>First name</label>
				<Field name="firstName" v-slot="{ field, meta }">
					<UiInput
						id="firstName"
						placeholder="John"
						v-bind="field"
						:class="{ 'border-red-500': !meta.valid && meta.touched }"
					/>
				</Field>
				<ErrorMessage name="firstName" class="text-sm text-red-600" />
			</div>
			<div class="space-y-1.5">
				<label class="text-sm font-medium text-gray-700" for="lastName"
				>Last name</label>
				<Field name="lastName" v-slot="{ field, meta }">
					<UiInput
						id="lastName"
						placeholder="Doe"
						v-bind="field"
						:class="{ 'border-red-500': !meta.valid && meta.touched }"
					/>
				</Field>
				<ErrorMessage name="lastName" class="text-sm text-red-600" />
			</div>
		</div>

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
					placeholder="At least 8 characters"
					v-bind="field"
					:class="{ 'border-red-500': !meta.valid && meta.touched }"
				/>
			</Field>
			<ErrorMessage name="password" class="text-sm text-red-600" />
		</div>

		<div class="space-y-1.5">
			<label class="text-sm font-medium text-gray-700" for="confirmPassword"
			>Confirm password</label>
			<Field name="confirmPassword" v-slot="{ field, meta }">
				<UiInput
					id="confirmPassword"
					type="password"
					placeholder="Repeat your password"
					v-bind="field"
					:class="{ 'border-red-500': !meta.valid && meta.touched }"
				/>
			</Field>
			<ErrorMessage name="confirmPassword" class="text-sm text-red-600" />
		</div>

		<UiButton type="submit" class="w-full">Create account</UiButton>

		<div class="text-center text-sm text-gray-600">
			Already have an account?
			<NuxtLink
				to="/auth/login"
				class="font-medium text-primary-600 hover:underline"
			>Sign in</NuxtLink>
		</div>
	</form>
</template>
