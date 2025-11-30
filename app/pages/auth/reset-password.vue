<script setup lang="ts">
import { ref } from 'vue'

useHead({
	title: "Reset Password - Account Wrikka",
});

definePageMeta({
	middleware: ["guest"],
});

const { resetPassword, loading, error, success, clearMessages } = useAuth()

const form = ref({
  email: '',
})

const handleSubmit = async () => {
  try {
    clearMessages()
    await resetPassword(form.value.email)
  } catch (err: any) {
    // Error is handled by useAuth composable
    console.error('Reset password error:', err)
  }
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center px-4">
		<div class="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto overflow-hidden p-8">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
				<p class="text-gray-600">Enter your email to receive password reset instructions</p>
			</div>

			<form @submit.prevent="handleSubmit" class="space-y-6">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input 
						id="email" 
						v-model="form.email" 
						type="email" 
						autocomplete="email" 
						required 
						placeholder="example@email.com"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
					/>
				</div>

				<div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-sm text-red-600">{{ error }}</p>
				</div>

				<div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
					<p class="text-sm text-green-600">{{ success }}</p>
				</div>

				<button 
					type="submit" 
					:disabled="loading" 
					class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{{ loading ? 'Sending...' : 'Send Reset Email' }}
				</button>
			</form>

			<div class="mt-6 text-center">
				<NuxtLink to="/auth/signin" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
					Back to Sign In
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
