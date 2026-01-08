<script setup lang="ts">
definePageMeta({
	layout: "account",
});

const { getReferral, loading } = useReferral();

const referral = ref<any>(null);

onMounted(async () => {
	try {
		const response = await getReferral();
		referral.value = response.referral;
	} catch (error) {
		console.error("Failed to fetch referral:", error);
	}
});

const copyReferralLink = () => {
	if (referral.value?.code) {
		const link = `${window.location.origin}?ref=${referral.value.code}`;
		navigator.clipboard.writeText(link);
	}
};
</script>

<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-2xl font-bold">Referral Program</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Earn rewards by referring friends to WAccount
			</p>
		</div>

		<div v-if="referral" class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
			<h2 class="text-xl font-bold mb-2">Your Referral Code</h2>
			<div class="flex items-center gap-4">
				code class="text-3xl font-mono bg-white bg-opacity-20 px-4 py-2 rounded">
					{{ referral.code }}
				</code>
				<button
					class="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100"
					@click="copyReferralLink"
				>
					Copy Link
				</button>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
				<h3 class="text-lg font-semibold mb-4">Referral Stats</h3>
				<div class="space-y-4">
					div class="flex justify-between items-center">
						<span class="text-gray-600 dark:text-gray-400">Total Referrals</span>
						<span class="text-2xl font-bold">{{ referral?.referralCount || 0 }}</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-gray-600 dark:text-gray-400">Total Rewards</span>
						<span class="text-2xl font-bold">${{ referral?.totalRewards || 0 }}</span>
					</div>
				</div>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
				<h3 class="text-lg font-semibold mb-4">How It Works</h3>
				ol class="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
					<li>Share your referral link with friends</li>
					<li>Friends sign up using your link</li>
					<li>You earn $10 for each successful referral</li>
					<li>Friends get $5 credit on their first purchase</li>
				</ol>
			</div>
		</div>
	</div>
</template>
