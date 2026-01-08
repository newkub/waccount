import { createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from '../types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@waccount/auth-dashboard',
    configKey: 'authDashboard',
    compatibility: {
      nuxt: '^4.0.0',
    },
  },

  defaults: {
    publicPages: [],
    navItems: [],
    enableAuthMiddleware: true,
    loginPath: '/auth/login',
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger('@waccount/auth-dashboard')

    // Merge user options with defaults
    const config = defu(nuxt.options.runtimeConfig.public.authDashboard, options)

    // Add runtime config
    nuxt.options.runtimeConfig.public.authDashboard = {
      publicPages: config.publicPages ?? [],
      navItems: config.navItems ?? [],
      enableAuthMiddleware: config.enableAuthMiddleware ?? true,
      loginPath: config.loginPath ?? '/auth/login',
    }

    // Add composables
    nuxt.hook('app:resolve', (app) => {
      app.composables.push({
        name: 'useAuthDashboard',
        path: resolver.resolve('./runtime/composables/useAuthDashboard'),
      })
    })

    // Add components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolver.resolve('./runtime/components'),
        prefix: 'AuthDashboard',
      })
    })

    // Add middleware
    nuxt.hook('app:resolve', (app) => {
      if (config.enableAuthMiddleware) {
        app.middleware.push({
          name: 'auth-dashboard',
          path: resolver.resolve('./runtime/middleware/auth'),
        })
      }
    })

    // Add types
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        types: resolver.resolve('../types'),
      })
    })

    logger.success('Auth Dashboard module loaded')
  },
})
