import type {Config} from 'tailwindcss';
import colors from 'tailwindcss/colors';
// @ts-ignore
import plugin from 'tw-neumorphism';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        screens: {
            xs: '375px', // mobile medium
            sm: '425px', // mobile large
            md: '768px',
            lg: '1024px',
            ms: '320px', // mobile small
            mm: '375px', // mobile medium
            ml: '425px', // mobile large
            desktop: '600px'
        },
        extend: {
            fontFamily: {
                mono: [
                    'Inter',
                    'Roboto',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Oxygen',
                    'Ubuntu',
                    'Cantarell',
                    '"Open Sans"',
                    '"Helvetica Neue"',
                    'sans-serif'
                ],
                logo: ['"Black Ops One"', 'cursive'],
                digits: ['var(--font-segment)']
            },
            gridTemplateColumns: {
                desktop: '7rem 20rem 7rem',
                mobile: '5rem minmax(10rem, 20rem) 5rem'
            },
            animation: {
                'bounce-once': 'bounce 0.5s ease-in-out 1'
            },
            keyframes: {
                bounce: {
                  '0%, 100%': {
                    transform: 'translateY(0)'
                  },
                  '50%': {
                    transform: 'translateY(-25%)'
                  }
                }
            }
        },
        colors: {
            // default Tailwind colors
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.stone,
            red: colors.red,
            yellow: colors.amber,
            green: colors.emerald,
            blue: colors.blue,
            indigo: colors.indigo,
            purple: colors.violet,
            pink: colors.pink,
            // Tetromino colors
            tetro_i: colors.cyan,
            tetro_o: colors.yellow,
            tetro_t: colors.purple,
            tetro_s: colors.green,
            tetro_z: colors.red,
            tetro_j: colors.blue,
            tetro_l: colors.orange
        }
    },
    plugins: [plugin]
};
export default config;
