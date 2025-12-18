<script setup lang="ts">
import AccountSidebar from '~/app/components/layout/AccountSidebar.vue';
import AccountMobileMenu from '~/app/components/layout/AccountMobileMenu.vue';

const { user } = useAuth();
const { currentTab, navItems, isMobileMenuOpen } = useAccountNavigation();
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
    <!-- Mobile Menu Button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 bg-white/80 backdrop-blur-md rounded-lg shadow-lg border border-primary-100"
      >
        <i class="i-mdi-menu text-xl text-gray-700"></i>
      </button>
    </div>

    <AccountMobileMenu 
      v-if="isMobileMenuOpen" 
      :user="user" 
      :nav-items="navItems" 
      :current-tab="currentTab"
      @close="isMobileMenuOpen = false"
    />

    <!-- Sidebar (Desktop) -->
    <div class="hidden lg:block fixed lg:sticky lg:top-8 lg:left-0 lg:h-fit z-40">
      <AccountSidebar :user="user" :nav-items="navItems" :current-tab="currentTab" />
    </div>

    <!-- Main Content -->
    <div class="lg:ml-80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AccountHeader :current-tab="currentTab" :user="user" />

        <!-- Page Content -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary-100 p-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
