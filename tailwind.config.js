/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: {
          DEFAULT: "var(--color-background)",
          primary: "#F5F5F7",
          secondary: "#FFFFFF",
          surface_tinted: "#F9F9FB"
        },
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        text: {
          primary: "#1D1D1F",
          secondary: "#6E6E73",
          link: "#0066CC",
          button_dark: "#FFFFFF",
          button_light: "#1D1D1F"
        },
        accents: {
          neutral_border: "rgba(0,0,0,0.1)",
          dot_inactive: "rgba(0,0,0,0.2)",
          dot_active: "#1D1D1F"
        },
        brand: {
          blue: "#0066CC",
          hover: "#0052A3"
        }
      },
      fontFamily: {
        sans: ["SF Pro", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'section': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'card': ['18px', { lineHeight: '1.25', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.4', fontWeight: '400' }],
        'body': ['15px', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '40px',
        'xl': '64px',
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        'soft': '12px',
        'card': '16px',
        'image': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0,0,0,0.08)',
        'minimal': '0 2px 6px rgba(0,0,0,0.05)',
        'hover-card': '0 10px 28px rgba(0,0,0,0.12)',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}