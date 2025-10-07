// https://nuxt.com/docs/api/configuration/nuxt-config
import { presetWind } from 'unocss'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt'
  ],
  css: [
    '@unocss/reset/tailwind-compat.css'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@unocss/reset/tailwind-compat.css";'
        }
      }
    }
  }
})