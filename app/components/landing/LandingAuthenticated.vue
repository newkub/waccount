<script setup lang="ts">
import type { User } from '#shared/types';

defineProps<{
    user: User | null;
}>();
</script>

<template>
    <div class="space-y-8">
        <!-- GitHub Icon Link -->
        <div class="flex justify-center">
            <a
                href="https://github.com/newkub/account.wrikka.com"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 hover:scale-110 transform transition-all duration-300 shadow-lg"
                title="View on GitHub"
            >
                <i class="i-mdi-github text-3xl"></i>
            </a>
        </div>

        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 dark:border-gray-700/50">
            <div class="text-center">
                <div class="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mb-8 mx-auto">
                    <i
                        class="i-mdi-account text-4xl text-primary-600 dark:text-primary-400"
                    ></i>
                </div>
                <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Welcome back, {{ user?.firstName }}!
                </h2>

                <p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                    You're successfully logged in and can now manage your account
                    settings
                </p>

                <div class="flex flex-col sm:flex-row gap-6 justify-center">
                    <NuxtLink
                        to="/account"
                        class="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
                    >
                        <span class="relative flex items-center gap-3">
                            <i class="i-mdi-account text-xl"></i>
                            My Account
                        </span>
                    </NuxtLink>

                    <NuxtLink
                        to="/account/settings"
                        class="group relative px-8 py-4 bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 font-bold rounded-2xl shadow-xl border-2 border-primary-200 dark:border-gray-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-600 hover:scale-105 transform transition-all duration-300"
                    >
                        <span class="relative flex items-center gap-3">
                            <i class="i-mdi-cog text-xl"></i>
                            Settings
                        </span>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
