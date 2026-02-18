/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        // Blue Lotus Brand Colors
                        'bl-glow': '#4CC3FF',
                        'bl-deep': '#003A66',
                        'bl-soft': '#7FDBFF',
                        'bl-midnight': '#020B14',
                        'bl-panel': '#03121F',
                        
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                fontFamily: {
                        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
                        'lotus-glow': {
                                '0%, 100%': {
                                        filter: 'drop-shadow(0 0 8px #4CC3FF)',
                                        transform: 'scale(1)'
                                },
                                '50%': {
                                        filter: 'drop-shadow(0 0 16px #4CC3FF) drop-shadow(0 0 24px #7FDBFF)',
                                        transform: 'scale(1.04)'
                                }
                        },
                        'lotus-bloom': {
                                '0%': {
                                        filter: 'drop-shadow(0 0 4px #4CC3FF)',
                                        transform: 'scale(1)'
                                },
                                '50%': {
                                        filter: 'drop-shadow(0 0 20px #4CC3FF) drop-shadow(0 0 30px #7FDBFF)',
                                        transform: 'scale(1.08)'
                                },
                                '100%': {
                                        filter: 'drop-shadow(0 0 4px #4CC3FF)',
                                        transform: 'scale(1)'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'lotus-glow': 'lotus-glow 2.4s ease-in-out infinite',
                        'lotus-bloom': 'lotus-bloom 1.8s ease-in-out'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};