/** @type {import('@tailwindcss/postcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontSize: {
        'title': ['24px', {
          lineHeight: '1.4',
          fontWeight: '600',
        }],
        'subtitle': ['18px', {
          lineHeight: '1.5',
          fontWeight: '500',
        }],
        'body': ['14px', {
          lineHeight: '1.6',
          fontWeight: '400',
        }],
        'caption': ['12px', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
      },
      spacing: {
        'base': '4px',
        'component': '16px',
        'layout': '24px',
        'section': '32px',
      },
      backdropBlur: {
        DEFAULT: '10px',
      },
      transitionDuration: {
        'natural': '250ms',
      },
    },
  },
  plugins: [],
}