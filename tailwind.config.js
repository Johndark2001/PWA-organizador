// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef6ff',
          100: '#d9edff',
          200: '#b6dbff',
          300: '#8cc4ff',
          400: '#4f97ff',
          500: '#2563eb', // base azul tipo MS To Do
          600: '#1f4fc0',
          700: '#183b95',
          800: '#11286b',
          900: '#0b173f'
        },
        ui: {
          bg: '#fafafa',
          panel: '#ffffff',
          muted: '#f3f4f6'
        }
      },
      boxShadow: {
        'soft': '0 6px 18px rgba(16,24,40,0.06)',
        'soft-sm': '0 2px 8px rgba(16,24,40,0.04)'
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial']
      },
      borderRadius: {
        xl: '14px'
      }
    }
  },
  plugins: []
}
