/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#F5F5F7",
          secondary: "#FFFFFF",
          surface_tinted: "#F9F9FB"
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
      }
    },
  },
  plugins: [],
}