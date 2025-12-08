<script setup lang="ts">
import { onMounted } from 'vue'
import type { CallbackResponse } from '~/types/auth'
import { useUserStore } from '~/stores/auth'

useHead({
	title: "Processing Sign In - Account Wrikka",
});

const router = useRouter()
import { useAuth } from '~/composables/auth';

const { refreshUser } = useAuth()
const userStore = useUserStore()

onMounted(async () => {
	try {
		// Get the authorization code from URL
		const route = useRoute()
		const code = route.query.code as string
		const state = route.query.state as string | undefined

		if (!code) {
			throw new Error('No authorization code provided')
		}

		// Exchange code for session via API
		const response = await $fetch<CallbackResponse>('/api/auth/workos/callback', {
			query: { code, state },
		})

		if (response?.success && response?.user) {
			// Set user in Pinia store
			userStore.setUser(response.user)

			// Refresh user data from cookie
			await refreshUser()

			// Redirect to dashboard or home page
			await router.push('/account')
		} else {
			throw new Error('Failed to authenticate')
		}
	} catch (error) {
		console.error('OAuth callback error:', error)
		// Redirect to signin with error
		await router.push('/auth/signin?error=callback_failed')
	}
})
</script>

<template>
	<div class="min-h-screen flex items-center justify-center px-4">
		<div class="text-center">
			<div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
				<i class="i-mdi-loading w-6 h-6 text-blue-600 animate-spin"></i>
			</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Processing Sign In</h1>
			<p class="text-gray-600">Please wait while we complete your sign in...</p>
		</div>
	</div>
</template>
