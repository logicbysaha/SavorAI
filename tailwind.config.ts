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
        background: "var(--background)",
        foreground: "var(--foreground)",
        sage: { DEFAULT: '#2A4D38', dark: '#1E3828', light: '#E8EFEA' },
        terracotta: { DEFAULT: '#E06343', light: '#FDF0EC' },
        oatmeal: '#F0EFEA', cream: '#FAFA99', charcoal: '#141715', mutedAsh: '#8A8E8B'
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px'
      }
    },
  },
  plugins: [],
};
export default config;
