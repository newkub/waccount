<script setup lang="ts">
import { useAuthUI } from "~/composables/facade/useAuthUI";
import SocialButton from "~/components/auth/SocialButton.vue";

definePageMeta({
	layout: false,
});

interface Props {
	mode?: "signin" | "signup" | "forgot-password";
}

const props = withDefaults(defineProps<Props>(), {
	mode: "signin",
});

// Use color mode detection
const colorMode = useColorMode();

// Use the new useAuthUI composable
const {
	title,
	subtitle,
	activeTab,
	form,
	loading,
	handleSocialAuth,
	clearMessages,
	setMode,
} = useAuthUI(props.mode as "signin" | "signup");

// Set initial mode
setMode(props.mode as "signin" | "signup");
</script>

<template>
	<div
		:class="[
			'flex items-center justify-center p-4 rounded-2xl',
			colorMode.preference === 'dark'
				? 'bg-gray-800/50'
				: 'bg-gray-100/50',
		]"
	>
		<div class="w-full max-w-md">
			<!-- Header -->
			<div class="mb-8">
				<h1
					:class="[
						'text-3xl font-bold mb-2',
						colorMode.preference === 'dark' ? 'text-white' : 'text-gray-900',
					]"
				>
					{{ title }}
				</h1>
				<p
					:class="[
						colorMode.preference === 'dark' ? 'text-gray-400' : 'text-gray-600',
					]"
				>
					{{ subtitle }}
				</p>
			</div>

			<!-- Email Input -->
			<div class="mb-6">
				<label
					:class="[
						'block text-sm font-medium mb-3',
						colorMode.preference === 'dark' ? 'text-white' : 'text-gray-900',
					]"
				>Email</label>
				<input
					v-model="form.email"
					type="email"
					placeholder="Your email address"
					:class="[
						'w-full px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-1',
						colorMode.preference === 'dark'
							? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-gray-600'
							: 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400',
					]"
				/>
			</div>

			<!-- Continue Button -->
			<button
				:disabled="loading"
				:class="[
					'w-full py-3 px-4 font-semibold rounded-lg transition-colors mb-6 cursor-pointer',
					loading ? 'opacity-50 cursor-not-allowed' : '',
					colorMode.preference === 'dark'
						? 'bg-white text-black hover:bg-gray-100'
						: 'bg-gray-900 text-white hover:bg-gray-800',
				]"
			>
				{{ loading ? "Loading..." : "Continue" }}
			</button>

			<!-- OR Divider -->
			<div class="flex items-center gap-4 mb-6">
				<div
					:class="[
						'flex-1 h-px',
						colorMode.preference === 'dark' ? 'bg-gray-700' : 'bg-gray-300',
					]"
				>
				</div>
				<span
					:class="[
						'text-sm font-medium',
						colorMode.preference === 'dark' ? 'text-gray-400' : 'text-gray-600',
					]"
				>OR</span>
				<div
					:class="[
						'flex-1 h-px',
						colorMode.preference === 'dark' ? 'bg-gray-700' : 'bg-gray-300',
					]"
				>
				</div>
			</div>

			<!-- Social Buttons -->
			<div class="space-y-3">
				<SocialButton
					provider="google"
					:mode="activeTab"
					@click="handleSocialAuth('google')"
				/>
				<SocialButton
					provider="github"
					:mode="activeTab"
					@click="handleSocialAuth('github')"
				/>
			</div>

		</div>
	</div>
</template>
