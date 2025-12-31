<script setup lang="ts">
import { getUserHandle } from "#shared/utils/user-handle";
import { useAuth } from "~/composables/facade/useAuth";
import { useProfilePage } from "~/composables/facade/useProfilePage";
import type { User } from "../../../shared/types";
definePageMeta({
	layout: "dashboard",
	middleware: ["auth"],
});

const route = useRoute();
const { user: authedUser } = useAuth();

const handle = computed(() => String(route.params.user ?? ""));

const authedHandle = computed(() => {
	if (!authedUser.value) return null;
	return getUserHandle(authedUser.value);
});

const isOwnerView = computed(() => {
	if (!authedUser.value) return false;
	if (handle.value === "me") return true;
	return !!authedHandle.value && handle.value === authedHandle.value;
});

const resolvedUserId = computed(() => {
	if (!authedUser.value) return null;
	if (isOwnerView.value) return authedUser.value.id;
	return handle.value;
});

const canFetchPublicUser = computed(() => {
	if (!resolvedUserId.value) return false;
	if (isOwnerView.value) return false;
	return resolvedUserId.value.startsWith("user_");
});

const {
	data: publicUserRes,
	pending: publicUserPending,
	error: publicUserError,
	refresh: refreshPublicUser,
} = useFetch<{ user: User }>(
	() => {
		if (!resolvedUserId.value) return "/api/users/";
		return "/api/users/" + resolvedUserId.value;
	},
	{ immediate: false },
);

const publicUser = computed(() => publicUserRes.value?.user ?? null);

watch(
	[resolvedUserId, canFetchPublicUser],
	([id, canFetch]) => {
		if (!id || !canFetch) return;
		refreshPublicUser();
	},
	{ immediate: true },
);

const {
	user,
	activities,
	activitiesLoading,
	loading,
	form,
	isFormChanged,
	handleSubmit,
	handleUploadAvatar,
	handleResendVerification,
} = useProfilePage();
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div v-if="isOwnerView && user" class="space-y-8">
				<ProfileHeader />

				<div class="space-y-8">
					<ProfileForm
						:user="user"
						:loading="loading"
						:form-data="form"
						:is-changed="isFormChanged"
						@submit="handleSubmit"
						@upload-avatar="handleUploadAvatar"
					/>
					<ProfileEmailVerification @resend="handleResendVerification" />
					<ProfileStatistics :user="user" />
					<UserActivityLog
						:activities="activities || []"
						:loading="activitiesLoading"
					/>
				</div>
			</div>

			<div v-else class="space-y-8">
				<div
					v-if="publicUserPending"
					class="p-6 rounded-2xl bg-white/80 border border-gray-200"
				>
					<p class="text-gray-600">Loading user...</p>
				</div>

				<div
					v-else-if="publicUserError"
					class="p-6 rounded-2xl bg-white/80 border border-gray-200"
				>
					<p class="text-red-600">Failed to load user.</p>
					<div class="mt-4">
						<UiButton variant="secondary" @click="refreshPublicUser()">
							Retry
						</UiButton>
					</div>
				</div>

				<div v-else-if="publicUser" class="space-y-6">
					<div class="p-6 rounded-2xl bg-white/80 border border-gray-200">
						<h1 class="text-3xl font-bold text-gray-900">
							{{ publicUser.firstName || publicUser.email }}
						</h1>
						<p class="text-gray-600 mt-1">@{{ handle }}</p>
						<div class="mt-4 grid gap-3 sm:grid-cols-2">
							<div class="p-4 rounded-xl bg-gray-50">
								<div class="text-xs text-gray-500">Email</div>
								<div class="font-medium text-gray-900">
									{{ publicUser.email }}
								</div>
							</div>
							<div class="p-4 rounded-xl bg-gray-50">
								<div class="text-xs text-gray-500">Status</div>
								<div class="font-medium text-gray-900">
									{{ publicUser.emailVerified ? "Verified" : "Pending" }}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-else class="space-y-8">
					<ProfileHeaderSkeleton />
					<ProfileFormSkeleton />
					<ProfileStatisticsSkeleton />
					<UserActivityLogSkeleton />
				</div>
			</div>
		</div>
	</div>
</template>
