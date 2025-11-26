/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    },
    extend: {
      colors: {
        primary: '#2196F3',
        primaryDark: '#1976D2',
        primaryLight: '#BBDEFB',
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        textPrimary: '#212121',
        textSecondary: '#757575',
        background: '#FFFFFF',
        backgroundGray: '#F5F5F5',
        border: '#E0E0E0',
        disabled: '#BDBDBD',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

