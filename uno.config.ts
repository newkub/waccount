import { defineConfig, presetWind, presetIcons } from "unocss";

export default defineConfig({
	presets: [
		presetWind({
			preflights: {
				reset: true,
			},
		}),
		presetIcons({
			collections: {
				mdi: () =>
					import("@iconify-json/mdi/icons.json").then((i) => i.default),
			},
		}),
	],
});
