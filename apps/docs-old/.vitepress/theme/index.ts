import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
	// enhanceApp({ app }) {
	// 	// Register global components here if needed
	// },
	extends: DefaultTheme,
} satisfies Theme;
