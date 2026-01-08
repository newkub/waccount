// https://nuxt.com/docs/api/configuration/nuxt-config
import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "latest",
	devtools: { enabled: true },

	routeRules: {
		"/account": { redirect: "/me" },
		"/account/**": { redirect: "/me" },
	},

	modules: [
		"@vue-macros/nuxt",
		"@vueuse/nuxt",
		"@unocss/nuxt",
		"@nuxt/icon",
		"@nuxtjs/color-mode",
		"@vueuse/motion/nuxt",
		"@pinia/nuxt",
		"@scalar/nuxt",
		"nuxt-mcp-dev",
		"@waccount/auth-dashboard",
	],

	imports: {
		dirs: ["composables/**", "stores", "utils", "vue-macros/api"],
	},

	alias: {
		"~/shared": "./shared",
	},

	typescript: {
		strict: true,
		typeCheck: true,
	},

	scalar: {
		url: "https://registry.scalar.com/@scalar/apis/galaxy?format=yaml",
	},

	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},

	nitro: {
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: {
				routes: [
					{
						pattern: "*account.wrikka.com",
						custom_domain: true,
					},
				],
			},
		},
		experimental: {
			openAPI: true,
		},
	},

	vite: {
		plugins: [
			checker({
				overlay: {
					initialIsOpen: false,
				},
				typescript: true,
				vueTsc: true,
				oxlint: true,
			}),
		],
	},

	runtimeConfig: {
		workosApiKey: process.env.NUXT_WORKOS_API_KEY,
		workosRedirectUri: process.env.NUXT_WORKOS_REDIRECT_URI,
		workosCookiePassword: process.env.NUXT_WORKOS_COOKIE_PASSWORD,
		luciaSessionPassword: process.env.NUXT_LUCIA_SESSION_PASSWORD,
		stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
		public: {
			baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
			adminEmails: process.env.NUXT_PUBLIC_ADMIN_EMAILS,
			workosClientId: process.env.NUXT_WORKOS_CLIENT_ID,
			authDashboard: {
				publicPages: [
					"/",
					"/auth/login",
					"/auth/signup",
					"/auth/reset-password",
				],
				navItems: [
					{ id: "billing", label: "Billing", icon: "mdi:credit-card", path: "/billing" },
					{ id: "connections", label: "Connections", icon: "mdi:link", path: "/connections" },
				],
				enableAuthMiddleware: true,
				loginPath: "/auth/login",
			},
		},
	},
});
