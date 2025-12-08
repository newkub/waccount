import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	alias: {
		"~/shared": "./shared",
	},
	modules: [
		"@vueuse/nuxt",
		"@unocss/nuxt",
		"@nuxtjs/color-mode",
		"@scalar/nuxt",
		"@pinia/nuxt",
		"./modules/auth",
	],
	
	// Runtime configuration
	runtimeConfig: {
		// Private keys (server-side only)
		workosApiKey: process.env.WORKOS_API_KEY,
		
		// Public keys (available on client-side)
		public: {
			workosClientId: process.env.WORKOS_CLIENT_ID,
			workosRedirectUri: process.env.WORKOS_REDIRECT_URI || 'http://localhost:3000',
			appUrl: process.env.APP_URL || 'http://localhost:3000',
		},
	},
	
	nitro: {
		preset: "cloudflare",
		experimental: {
			openAPI: true,
		},
	},
	// Scalar API Documentation (optional)
	// scalar: {
	// 	theme: 'nuxt',
	// 	url: 'https://registry.scalar.com/@scalar/apis/galaxy/latest?format=yaml',
	// },

	// Vite configuration
	vite: {
		resolve: {
			alias: {
				"~/shared": "./shared",
			},
		},
		plugins: [
			checker({
				typescript : true,
				vueTsc: true,
			}),
		],
	},
});
