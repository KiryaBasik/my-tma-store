import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Важно для next-themes
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        primary: "#3b82f6",
        secondary: "var(--secondary)",
      },
    },
  },
  plugins: [],
};
export default config;
