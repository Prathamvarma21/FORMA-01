import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gallery: {
          bg: "#F7F6F2",
          surface: "#FBFBFA",
          card: "#FFFFFF",
          primary: "#111111",
          secondary: "#777777",
          muted: "#999999",
          border: "#E5E3DE",
          borderDark: "#CCCCCC",
          accent: "#C8A77B",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "-apple-system", "sans-serif"],
        serif: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        mono: ["var(--font-montserrat)", "ui-monospace", "monospace"],
      },
      aspectRatio: {
        '4/5': '4 / 5',
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
};
export default config;
