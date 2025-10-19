
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        'inner-white': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.2)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'slide-down-fade-in': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-down-fade-in': 'slide-down-fade-in 0.3s ease-out forwards',
      },
      spacing: {
        '18': '4.5rem',
        '28': '7rem',
        '36': '9rem',
        '48': '12rem',
        '60': '15rem',
        '96': '24rem',
        '128': '32rem',
        '[14rem]': '14rem',
        '[18rem]': '18rem',
        '[20rem]': '20rem',
        '[22rem]': '22rem',
        '[24rem]': '24rem',
        '[26rem]': '26rem',
        '[28rem]': '28rem',
        '[30rem]': '30rem',
        '[32rem]': '32rem',
        '[34rem]': '34rem',
        '[36rem]': '36rem',
        '[42rem]': '42rem',
      }
    },
  },
  safelist: [
    { pattern: /bg-chart-(1|2|3|4|5)\/10/ },
    { pattern: /border-chart-(1|2|3|4|5)/ },
    'bg-accent/10',
    'border-accent',
    'bg-cyan-500/10',
    'border-cyan-500',
    'bg-indigo-500/10',
    'border-indigo-500',
    'bg-amber-500/10',
    'border-amber-500',
    'bg-lime-500/10',
    'border-lime-500',
    'bg-emerald-500/10',
    'border-emerald-500',
    'bg-sky-500/10',
    'border-sky-500',
    'bg-green-500',
    'bg-sky-500',
    'bg-amber-400',
    'bg-orange-500',
    'bg-rose-500',
    'bg-green-500/10',
    'bg-sky-500/10',
    'bg-amber-400/10',
    'bg-orange-500/10',
    'bg-rose-500/10',
    'text-green-700',
    'text-sky-700',
    'text-amber-700',
    'text-orange-700',
    'text-rose-700',
  ],
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
