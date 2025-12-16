/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Aliases for backward compatibility
                primary: {
                    DEFAULT: '#FF9933', // Saffron
                    light: '#FFB86C',
                    dark: '#995C1F',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#138808', // India Green
                    light: '#4ADE80',
                    dark: '#0B5205',
                    foreground: '#FFFFFF',
                },
                accent: {
                    DEFAULT: '#000080', // Navy Blue
                    light: '#1A1A99',
                    dark: '#000033',
                    foreground: '#FFFFFF',
                },

                // Indian Tricolor Palette - Neon/Glow optimized
                saffron: {
                    DEFAULT: '#FF9933',
                    glow: '#FFB86C', // Lighter for neon effects
                    dim: '#995C1F',
                    glass: 'rgba(255, 153, 51, 0.15)',
                },
                indiaGreen: {
                    DEFAULT: '#138808',
                    glow: '#4ADE80', // Lighter for neon effects
                    dim: '#0B5205',
                    glass: 'rgba(19, 136, 8, 0.15)',
                },
                navy: {
                    DEFAULT: '#000080',
                    light: '#1A1A99',
                    dark: '#000033', // Deep background
                    glass: 'rgba(0, 0, 128, 0.3)',
                },
                // Glassmorphism specific
                glass: {
                    white: 'rgba(255, 255, 255, 0.05)',
                    whiteHover: 'rgba(255, 255, 255, 0.1)',
                    border: 'rgba(255, 255, 255, 0.1)',
                    borderLight: 'rgba(255, 255, 255, 0.2)',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #FF9933 0deg, #FFFFFF 180deg, #138808 360deg)',
                'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            },
            boxShadow: {
                'neon-saffron': '0 0 20px rgba(255, 153, 51, 0.4), 0 0 40px rgba(255, 153, 51, 0.2)',
                'neon-green': '0 0 20px rgba(19, 136, 8, 0.4), 0 0 40px rgba(19, 136, 8, 0.2)',
                'neon-blue': '0 0 20px rgba(0, 0, 128, 0.5), 0 0 40px rgba(0, 0, 128, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}
