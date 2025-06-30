/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxembourg flag colors
        'lux-red': '#ED2939',
        'lux-white': '#FFFFFF',
        'lux-blue': '#00A1DE',
        // Additional theme colors
        'primary': '#00A1DE',
        'secondary': '#ED2939',
        'accent': '#FFD700',
        'neutral': '#6B7280',
        'base-100': '#FFFFFF',
        'base-200': '#F3F4F6',
        'base-300': '#E5E7EB',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'luxembourgish': ['Georgia', 'serif'],
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.4s ease-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0%)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-5%)' }
        }
      }
    },
  },
  plugins: [],
}
