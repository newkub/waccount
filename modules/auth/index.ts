import { defineNuxtModule } from '@nuxt/kit'
import type { Plugin } from 'vite';

export interface AuthConfig {
  provider?: 'workos' | 'clerk' | 'auth0';
  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
}

export interface ModuleOptions {
  auth?: AuthConfig;
}

function createVitePluginAuth(
  options: ModuleOptions = {}
): Plugin {
  const config = {
    auth: { provider: 'workos', ...options.auth },
  };

  return {
    name: 'vite-plugin-auth',
    config() {
      return {
        define: {
          __AUTH_CONFIG__: JSON.stringify(config.auth),
        },
      };
    },
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'auth-module',
    configKey: 'authModule'
  },
  setup(options, nuxt) {
    nuxt.options.vite.plugins = nuxt.options.vite.plugins || []
    nuxt.options.vite.plugins.push(createVitePluginAuth(options))
  }
})
