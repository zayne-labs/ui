import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],

	corePlugins: { preflight: false },

	theme: {
		extend: {
			colors: {
				shadcn: {
					accent: "hsl(210, 40%, 96.1%)",
					"accent-foreground": "hsl(222.2, 47.4%, 11.2%)",
					background: "hsl(0, 0%, 100%)",
					border: "hsl(214.3, 31.8%, 91.4%)",
					foreground: "hsl(222.2, 47.4%, 11.2%)",
					input: "hsl(214.3, 31.8%, 91.4%)",
					muted: "hsl(210, 40%, 96.1%)",
					"muted-foreground": "hsl(215.4, 16.3%, 46.9%)",
					popover: "hsl(0, 0%, 100%)",
					"popover-foreground": "hsl(222.2, 47.4%, 11.2%)",
					primary: "hsl(222.2, 47.4%, 11.2%)",
					"primary-foreground": "hsl(210, 40%, 98%)",
					ring: "hsl(215, 20.2%, 65.1%)",
					secondary: "hsl(210, 40%, 96.1%)",
					"secondary-foreground": "hsl(222.2, 47.4%, 11.2%)",
				},
			},
		},
	},
} satisfies Config;

export default config;
