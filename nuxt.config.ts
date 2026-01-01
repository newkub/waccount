// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import VueMacros from "unplugin-vue-macros/vite";
import checker from "vite-plugin-checker";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const isVitest = process.env.VITEST === "true";

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
		...(isVitest ? [] : ["@nuxtjs/color-mode"]),
		"@vueuse/motion/nuxt",
		"@pinia/nuxt",
		"@scalar/nuxt",
		"./modules/auth",
	],

	css: ["@unocss/reset/tailwind-compat.css"],

	imports: {
		dirs: ["composables/**", "stores", "utils", "vue-macros/api"],
	},

	alias: {
		"#shared": resolve(projectRoot, "shared"),
		"~/shared": "./shared",
	},

	typescript: {
		strict: true,
		typeCheck: true,
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
		resolve: {
			alias: {
				"~/shared": "./shared",
			},
		},
		plugins: [
			VueMacros(),
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
		workosClientId: process.env.NUXT_WORKOS_CLIENT_ID,
		workosRedirectUri: process.env.NUXT_WORKOS_REDIRECT_URI,
		workosCookiePassword: process.env.NUXT_WORKOS_COOKIE_PASSWORD,
		luciaSessionPassword: process.env.NUXT_LUCIA_SESSION_PASSWORD,
		public: {
			baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
			adminEmails: process.env.NUXT_PUBLIC_ADMIN_EMAILS,
		},
	},
});
