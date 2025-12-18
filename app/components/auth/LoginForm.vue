<script setup lang="ts">
import type { LoginFormData } from "~/app/shared/types/auth";

interface Props {
	redirectTo?: string;
	showSignUpLink?: boolean;
	title?: string;
	subtitle?: string;
	noWrapper?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	redirectTo: "/profile",
	showSignUpLink: true,
	title: "Welcome Back",
	subtitle: "Sign in to your account",
	noWrapper: false,
});

const { signInWithPassword, loading, error, clearMessages } = useAuth();

const form = reactive<LoginFormData>({
	email: "",
	password: "",
});

const emit = defineEmits<{
	(e: "success"): void;
	(e: "error", error: string): void;
}>();

async function handleSubmit() {
	try {
		await signInWithPassword(form.email, form.password);
		emit("success");
	} catch (err: unknown) {
		emit("error", (err as Error)?.message || "Login failed");
	}
}
</script>

<template>
  <component :is="props.noWrapper ? 'div' : 'UiCard'" :class="{ 'p-8 max-w-md mx-auto': !props.noWrapper }">
    <div v-if="!noWrapper && (title || subtitle)" class="text-center mb-8">
      <h1 v-if="title" class="text-3xl font-bold text-gray-900 mb-2">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-gray-600">
        {{ subtitle }}
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <UiInput
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="loading"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <UiInput
          id="password"
          v-model="form.password"
          type="password"
          required
          :disabled="loading"
          placeholder="Enter your password"
        />
      </div>

      <UiButton
        type="submit"
        :loading="loading"
        :disabled="!form.email || !form.password"
      >
        Sign In
      </UiButton>
    </form>

    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <p class="text-red-700 text-sm">
          {{ error }}
        </p>
        <button
          class="ml-auto text-red-400 hover:text-red-600"
          @click="clearMessages"
        >
          ✕
        </button>
      </div>
    </div>

    <div v-if="!noWrapper && showSignUpLink" class="mt-6 text-center">
      <p class="text-gray-600">
        Don't have an account?
        <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </component>
</template>
