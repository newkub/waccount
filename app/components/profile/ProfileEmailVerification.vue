<script setup lang="ts">
const { user, loading } = useAuth();

defineEmits(['resend']);
</script>

<template>
  <div v-if="user && !user.emailVerified" class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-lg">
    <div class="flex items-start gap-4">
      <i class="i-mdi-email-alert text-amber-500 text-2xl mt-1"></i>
      <div class="flex-1">
        <h3 class="text-lg font-medium text-amber-800">Verify your email</h3>
        <p class="text-amber-700 mt-1">
          We have sent a verification link to your email {{ user.email }}. Please check your email and click the link to verify your account.
        </p>
        <button
          @click="$emit('resend')"
          :disabled="loading"
          class="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <i v-if="loading" class="i-mdi-loading animate-spin mr-2"></i>
          Resend verification email
        </button>
      </div>
    </div>
  </div>
</template>
