import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcdcff',
          300: '#8ec4ff',
          400: '#59a4ff',
          500: '#3182ff',
          600: '#1b63f2',
          700: '#164dd6',
          800: '#1840ab',
          900: '#1a3a87',
          950: '#142452'
        }
      }
    }
  },
  plugins: []
}
