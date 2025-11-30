// WorkOS initialization plugin
// Initializes WorkOS SDK when Nuxt server starts
import { initWorkOS } from "../lib/workos";

export default defineNitroPlugin((nitroApp) => {
  try {
    // Initialize WorkOS with runtime config
    // Note: runtimeConfig is available through process.env in Nitro
    initWorkOS(nitroApp)
    console.log('🚀 WorkOS plugin initialized successfully')
  } catch (error) {
    console.error('💥 Failed to initialize WorkOS plugin:', error)
    // Don't throw error here to allow server to start
    // WorkOS functions will throw when called if not properly initialized
  }
})
