<script setup lang="ts">
const features = [
  {
    title: "Secure by Design",
    icon: "i-mdi-shield-check-outline",
    description:
      "Enterprise-grade security powered by WorkOS, ensuring your data is always protected.",
  },
  {
    title: "Blazing Fast",
    icon: "i-mdi-rocket-launch-outline",
    description:
      "A highly optimized, snappy user experience from login to logout, built on Nuxt 3.",
  },
  {
    title: "Developer First",
    icon: "i-mdi-code-braces",
    description:
      "Built with developers in mind. Easy to integrate, extend, and manage.",
  },
] as const;

// Dummy function to satisfy the linter
</script>

<template>
  <section class="py-20 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Everything You Need</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">One platform for all your account needs.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
          class="relative group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center overflow-hidden transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 dark:hover:border-primary-500/50"
        >
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-transform duration-300 group-hover:scale-110">
              <i :class="[feature.icon, 'text-3xl text-primary-600 dark:text-primary-400']"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
