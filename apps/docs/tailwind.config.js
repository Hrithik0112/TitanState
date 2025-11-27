/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Next.js inspired color palette
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#525252',
            '[class~="lead"]': {
              color: '#737373',
            },
            a: {
              color: '#171717',
              textDecoration: 'underline',
              textDecorationColor: '#d4d4d4',
              textUnderlineOffset: '0.125em',
              '&:hover': {
                textDecorationColor: '#171717',
              },
            },
            strong: {
              color: '#171717',
              fontWeight: '600',
            },
            'ol > li::before': {
              color: '#737373',
            },
            'ul > li::before': {
              backgroundColor: '#d4d4d4',
            },
            hr: {
              borderColor: '#e5e5e5',
            },
            blockquote: {
              color: '#404040',
              borderLeftColor: '#d4d4d4',
            },
            h1: {
              color: '#171717',
              fontWeight: '700',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '1.5rem',
            },
            h2: {
              color: '#171717',
              fontWeight: '600',
              fontSize: '1.875em',
              marginTop: '3rem',
              marginBottom: '1rem',
            },
            h3: {
              color: '#171717',
              fontWeight: '600',
              fontSize: '1.5em',
              marginTop: '2rem',
              marginBottom: '0.75rem',
            },
            h4: {
              color: '#171717',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            code: {
              color: '#171717',
              backgroundColor: '#f5f5f5',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
              fontSize: '0.875em',
            },
            'a code': {
              color: '#171717',
            },
            pre: {
              color: '#fafafa',
              backgroundColor: '#171717',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

