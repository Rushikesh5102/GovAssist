export const tokens = {
    colors: {
        primary: {
            DEFAULT: '#FF9933', // India Saffron
            light: '#FFB366',
            dark: '#CC7A29',
            glow: 'rgba(255, 153, 51, 0.5)',
        },
        secondary: {
            DEFAULT: '#138808', // India Green
            light: '#33A329',
            dark: '#0E6606',
            glow: 'rgba(19, 136, 8, 0.5)',
        },
        accent: {
            DEFAULT: '#000080', // India Blue
            light: '#333399',
            dark: '#000066',
            glow: 'rgba(0, 0, 128, 0.5)',
        },
        background: {
            light: '#F8FAFC',
            dark: '#0F172A',
            glass: 'rgba(255, 255, 255, 0.7)',
            glassDark: 'rgba(15, 23, 42, 0.7)',
        },
        surface: {
            light: '#FFFFFF',
            dark: '#1E293B',
            glass: 'rgba(255, 255, 255, 0.5)',
            glassDark: 'rgba(30, 41, 59, 0.5)',
        },
        text: {
            primary: {
                light: '#1E293B',
                dark: '#F8FAFC',
            },
            secondary: {
                light: '#64748B',
                dark: '#94A3B8',
            },
        },
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
    },
    borderRadius: {
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 15px rgba(255, 153, 51, 0.3)',
        glowGreen: '0 0 15px rgba(19, 136, 8, 0.3)',
        glowBlue: '0 0 15px rgba(0, 0, 128, 0.3)',
    },
    transitions: {
        default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
};
