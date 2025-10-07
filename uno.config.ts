import { defineConfig, presetWind4, presetIcons } from "unocss";

export default defineConfig({
	presets: [
		presetWind4({}),
		presetIcons({
			collections: {
				mdi: () =>
					import("@iconify-json/mdi/icons.json").then((i) => i.default),
			},
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
		}),
	],
});
