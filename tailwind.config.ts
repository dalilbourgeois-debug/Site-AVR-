import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#000000",
          dark: "#000000",
          light: "#1e3a6a",
          accent: "#FF0000"
        },
        // Tons ivoire/crème chauds — accordés au body #FAF7F4
        // À utiliser à la place de gray-50 / gray-100 pour les fonds alternés
        cream: {
          50:  "#FDFBF9",  // presque blanc, à peine plus chaud que body
          100: "#FAF7F4",  // = body
          200: "#F4EFE9",  // gris ivoire pour alternance
          300: "#E8E0D6"   // pour bordures subtiles
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
