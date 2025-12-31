import { vi } from "vitest";

vi.mock("#imports", async (importOriginal) => {
	const original = await importOriginal<typeof import("#imports")>();
	return {
		...original,
		useColorMode: () => ({ preference: "light" }),
	};
});
