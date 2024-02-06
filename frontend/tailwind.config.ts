import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        CusColor_light: '#f6f6f9',
        CusColor_primary: '#1976D2',
        CusColor_light_primary: '#CFE8FF',
        CusColor_grey: '#eee',
        CusColor_dark_grey: '#AAAAAA',
        CusColor_dark: '#363949',
        CusColor_danger: '#D32F2F',
        CusColor_light_danger: '#FECDD3',
        CusColor_warning: '#FBC02D',
        CusColor_light_warning: '#FFF2C6',
        CusColor_success: '#388E3C',
        CusColor_light_success: '#BBF7D0',
      },

    },
  },
  // plugins: [],
  darkMode: 'class',
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
export default config
