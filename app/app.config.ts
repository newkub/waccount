import { defineAppConfig } from "nuxt/app";

export default defineAppConfig({
	name: "waccount",
	description: "Your personal accounting app.",
	ui: {
		primary: "green",
		gray: "slate",
	},
	seo: {
		siteName: "waccount",
	},

	header: {
		logo: {
			alt: "waccount",
			light: "/logo-light.svg",
			dark: "/logo-dark.svg",
		},
		links: [
			{ label: "Features", to: "/#features" },
			{ label: "Pricing", to: "/pricing" },
			{ label: "Docs", to: "/docs" },
		],
	},

	footer: {
		credits: "Copyright © 2024",
		links: [
			{ label: "GitHub", to: "https://github.com/newkub/waccount", target: "_blank" },
		],
	},
});
