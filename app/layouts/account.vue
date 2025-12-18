<script setup lang="ts">
const { user } = useAuth();
const { currentTab, navItems, isMobileMenuOpen } = useAccountNavigation();
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <LayoutAccountMobileMenu 
      v-if="isMobileMenuOpen" 
      :user="user" 
      :nav-items="navItems" 
      :current-tab="currentTab"
      @close="isMobileMenuOpen = false"
    />

    <div class="lg:grid lg:grid-cols-[280px_1fr]">
      <!-- Sidebar (Desktop) -->
      <aside class="hidden lg:block lg:h-screen lg:sticky lg:top-0">
        <LayoutAccountSidebar :user="user" :nav-items="navItems" :current-tab="currentTab" />
      </aside>

      <!-- Main Content -->
      <main class="flex-1">
        <LayoutAccountHeader :current-tab="currentTab" @toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen" />
        <div class="p-4 sm:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
