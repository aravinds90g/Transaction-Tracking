import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "var(--font-geist-mono)", "SF Mono", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",

        /* ── Design-system tokens ───────────────────── */
        "accent-cyan":    "#22d3ee",
        "accent-emerald": "#34d399",
        "accent-rose":    "#fb7185",
        "accent-amber":   "#fbbf24",
        "accent-violet":  "#a78bfa",
        "accent-blue":    "#60a5fa",
        "accent-orange":  "#fb923c",

        /* Category palette */
        "cat-food":          "#fb923c",
        "cat-transport":     "#60a5fa",
        "cat-shopping":      "#a78bfa",
        "cat-bills":         "#fbbf24",
        "cat-entertainment": "#f472b6",
        "cat-others":        "#34d399",

        chart: {
          "1": "hsl(var(--chart-1, 189 85% 52%))",
          "2": "hsl(var(--chart-2, 160 84% 55%))",
          "3": "hsl(var(--chart-3, 348 80% 60%))",
          "4": "hsl(var(--chart-4, 280 65% 65%))",
          "5": "hsl(var(--chart-5, 30 90% 60%))",
        },
      },
      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "glow-sm":      "0 0 20px rgba(34, 211, 238, 0.12)",
        "glow-md":      "0 0 40px rgba(34, 211, 238, 0.18), 0 0 6px rgba(34, 211, 238, 0.06)",
        "glow-emerald": "0 0 20px rgba(52, 211, 153, 0.14)",
        "glow-rose":    "0 0 20px rgba(251, 113, 133, 0.14)",
        "glow-violet":  "0 0 20px rgba(167, 139, 250, 0.14)",
        "inner-subtle": "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      keyframes: {
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.05)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34,211,238,0.1)" },
          "50%":      { boxShadow: "0 0 40px rgba(34,211,238,0.28)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.45s ease-out forwards",
        shimmer:      "shimmer 1.8s linear infinite",
        "scale-pulse": "scale-pulse 3s ease-in-out infinite",
        "glow-pulse":  "glow-pulse 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-cyan-violet":
          "radial-gradient(at 30% 20%, rgba(34,211,238,0.08) 0, transparent 50%), " +
          "radial-gradient(at 80% 80%, rgba(167,139,250,0.08) 0, transparent 50%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
