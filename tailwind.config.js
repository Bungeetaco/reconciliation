/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
      },
      height: {
        'table-container': 'calc(100vh - 600px)',
      },
      scrollbar: {
        DEFAULT: {
          size: '16px',
          track: {
            background: 'rgb(229 231 235)',
            borderRadius: '8px'
          },
          thumb: {
            background: 'rgb(156 163 175)',
            borderRadius: '8px',
            border: '4px solid transparent',
            backgroundClip: 'content-box'
          },
          hover: {
            thumb: {
              background: 'rgb(107 114 128)'
            }
          }
        },
        dark: {
          track: {
            background: 'rgb(31 41 55)'
          },
          thumb: {
            background: 'rgb(75 85 99)'
          },
          hover: {
            thumb: {
              background: 'rgb(107 114 128)'
            }
          }
        },
        width: {
          '4': '16px',
          '5': '20px',
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('tailwind-scrollbar')({ 
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
      scrollbarWidth: 'auto' 
    }),
  ],
}