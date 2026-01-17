import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	base: "/commute-check/",
	plugins: [
		preact(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "icon.svg", "apple-touch-icon.png"],
			manifest: {
				name: "Commute Check",
				short_name: "CommuteCheck",
				description: "Compare your commute options and save time.",
				theme_color: "#121212",
				background_color: "#121212",
				display: "standalone",
				icons: [
					{
						src: "icon.svg",
						sizes: "any",
						type: "image/svg+xml",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			react: "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",
			"react/jsx-runtime": "preact/jsx-runtime",
		},
	},
});
