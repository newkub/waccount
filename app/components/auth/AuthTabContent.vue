<script setup lang="ts">


defineProps<{
  activeTab: 'login' | 'register';
}>();
</script>

<template>
  <div class="p-8">
    <div v-if="activeTab === 'login'">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับกลับมา</h1>
        <p class="text-gray-600">เข้าสู่ระบบเพื่อใช้งานบัญชีของคุณ</p>
      </div>
      <AuthLoginForm />
    </div>
    <div v-else-if="activeTab === 'register'">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">สร้างบัญชีใหม่</h1>
        <p class="text-gray-600">สมัครสมาชิกเพื่อเริ่มต้นใช้งาน</p>
      </div>
      <AuthRegisterForm />
    </div>
  </div>
</template>
