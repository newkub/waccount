<script setup lang="ts">
interface Props {
  mode?: 'signin' | 'signup' | 'forgot-password'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'signin'
})

// Use the new useAuthUI composable
const {
  title,
  subtitle,
  activeTab,
  showEmailForm,
  form,
  loading,
  error,
  success,
  switchTab,
  toggleEmailForm,
  handleAuth,
  handleSocialAuth,
  setMode,
} = useAuthUI(props.mode as 'signin' | 'signup')

// Set initial mode
setMode(props.mode as 'signin' | 'signup')
</script>

<template>
	<div class="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-3xl mx-auto overflow-hidden">
		<!-- Tab Headers -->
		<div class="flex border-b border-gray-200">
			<button
				@click="switchTab('signin')"
				:class="[
					'flex-1 py-4 px-6 text-center font-medium transition-colors',
					activeTab === 'signin'
						? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
						: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
				]"
			>
				Sign In
			</button>
			<button
				@click="switchTab('signup')"
				:class="[
					'flex-1 py-4 px-6 text-center font-medium transition-colors',
					activeTab === 'signup'
						? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
						: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
				]"
			>
				Sign Up
			</button>
		</div>

		<!-- Tab Content -->
		<div class="p-8">
			<!-- Header -->
			<AuthHeader :title="title" :subtitle="subtitle" />

			<!-- Social Sign In (Primary) -->
			<div class="space-y-4">
				<SocialButton 
					provider="google" 
					:mode="activeTab"
					@click="handleSocialAuth('google')"
				/>
			</div>

			<!-- Divider -->
			<Divider text="Or" />

			<!-- Email Sign In Toggle -->
			<EmailToggle 
				:mode="activeTab"
				@toggle="toggleEmailForm"
			/>

			<!-- Email Form (Collapsible) -->
			<div v-if="showEmailForm" class="mt-6">
				<EmailForm 
					:mode="activeTab"
					:loading="loading"
					:error="error"
					:success="success"
					v-model:form="form"
					@submit="handleAuth"
				/>
			</div>
		</div>
	</div>
</template>