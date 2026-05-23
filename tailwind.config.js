/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{ts,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                stone: {
                    50:  '#FAFAF9',
                    100: '#F5F5F4',
                    200: '#E7E5E0',
                    300: '#D6D3D0',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#292524',
                    900: '#1C1917',
                },
                teal: {
                    50:  '#F0FDFA',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#14B8A6',
                    600: '#0D9488',
                    700: '#0F766E',
                    800: '#115E59',
                    900: '#134E4A',
                },
                charcoal: {
                    50:  '#F8F8F8',
                    100: '#F0F0EF',
                    200: '#E4E4E3',
                    300: '#C0BFBE',
                    400: '#9B9A98',
                    500: '#737270',
                    600: '#525150',
                    700: '#363534',
                    800: '#242322',
                    900: '#18181B',
                },
            },
            fontFamily: {
                sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
            },
            borderRadius: {
                sm:   '4px',
                DEFAULT: '6px',
                md:   '8px',
                lg:   '10px',
                xl:   '14px',
                '2xl':'18px',
                full: '9999px',
            },
            boxShadow: {
                xs:   '0 1px 2px 0 rgb(0 0 0 / 0.04)',
                sm:   '0 1px 3px 0 rgb(0 0 0 / 0.07)',
                'teal-sm': '0 0 0 3px rgb(13 148 136 / 0.15)',
                'teal-md': '0 0 0 4px rgb(13 148 136 / 0.20)',
            },
            keyframes: {
                'bar-grow': {
                    '0%':   { width: '0%' },
                    '100%': { width: 'var(--bar-width)' },
                },
                'pulse-dot': {
                    '0%, 100%': { opacity: '1',   transform: 'scale(1)'    },
                    '50%':      { opacity: '0.5', transform: 'scale(1.15)' },
                },
                'slide-up': {
                    '0%':   { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)'   },
                },
                'fade-in': {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'bar-grow':  'bar-grow 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
                'slide-up':  'slide-up 200ms cubic-bezier(0, 0, 0.2, 1) forwards',
                'fade-in':   'fade-in 200ms ease-out forwards',
            },
            maxWidth: {
                'poll':  '560px',
                'form':  '480px',
                'page':  '720px',
            },
        },
    },
    plugins: [],
}