export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@unocss/nuxt',
  ],

  authDashboard: {
    publicPages: ['/', '/auth/login', '/auth/signup'],
    navItems: [
      { id: 'billing', label: 'Billing', icon: 'mdi:credit-card', path: '/account/billing' },
      { id: 'settings', label: 'Settings', icon: 'mdi:cog', path: '/account/settings' },
    ],
    enableAuthMiddleware: true,
    loginPath: '/auth/login',
  },

  colorMode: {
    preference: 'light',
  },
})
