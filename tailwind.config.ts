import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ... (ваши цвета)
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
  plugins: [
    require("@tailwindcss/typography"), // <--- ДОБАВИТЬ ЭТУ СТРОКУ
  ],
};
export default config;
