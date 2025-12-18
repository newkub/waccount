<script setup lang="ts">
const activeTab = ref<"login" | "register">("login");

const switchTab = (tab: "login" | "register") => {
	activeTab.value = tab;
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto overflow-hidden">
    <div class="p-8">
      <AuthOAuthProviders />
    </div>
    <!-- Tab Headers -->
    <div class="flex border-b border-gray-200">
      <button
        @click="switchTab('login')"
        :class="[
          'flex-1 py-4 px-6 text-center font-medium transition-colors',
          activeTab === 'login'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
        ]"
      >
        เข้าสู่ระบบ
      </button>
      <button
        @click="switchTab('register')"
        :class="[
          'flex-1 py-4 px-6 text-center font-medium transition-colors',
          activeTab === 'register'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
        ]"
      >
        สมัครสมาชิก
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-8">
      <div v-if="activeTab === 'login'">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับกลับมา</h1>
          <p class="text-gray-600">เข้าสู่ระบบเพื่อใช้งานบัญชีของคุณ</p>
        </div>

        <LoginForm :no-wrapper="true" :show-sign-up-link="false" title="" subtitle="" />
      </div>

      <div v-else-if="activeTab === 'register'">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">สร้างบัญชีใหม่</h1>
          <p class="text-gray-600">สมัครสมาชิกเพื่อเริ่มต้นใช้งาน</p>
        </div>

        <RegisterForm :no-wrapper="true" :show-sign-in-link="false" title="" subtitle="" />
      </div>
    </div>
  </div>
</template>

