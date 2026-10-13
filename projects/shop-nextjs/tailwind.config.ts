import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Small, named palette instead of ad-hoc hex values scattered through
      // components. "forest" is the brand/primary accent, "rust" is used
      // sparingly for price emphasis and destructive actions.
      colors: {
        paper: "#F7F4EC",
        ink: "#211D18",
        stone: "#7A7267",
        sand: "#E5DFD2",
        forest: {
          DEFAULT: "#2F5233",
          dark: "#1F3A23",
          light: "#3F6B45",
        },
        rust: {
          DEFAULT: "#A8492F",
          dark: "#8A3A25",
        },
      },
      // Font stacks list a display serif / grotesque sans first for intent,
      // but every fallback after them is a system font. No @font-face or
      // Google Fonts <link> is used anywhere, so the app never makes a
      // network request for type -- it degrades to the system stack
      // silently, which matches the "no external services" constraint.
      fontFamily: {
        display: [
          "Fraunces",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        shell: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
