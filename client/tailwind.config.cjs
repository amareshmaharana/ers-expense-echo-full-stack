module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#1a1a2e',
        accent: {
          electric: '#00d4ff',
          purple: '#a78bfa',
          cyan: '#06b6d4',
        },
        border: '#2a2a3e',
        glass: 'rgba(255, 255, 255, 0.05)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(167, 139, 250, 0.3)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        editorial: '0 24px 80px -32px rgba(0, 212, 255, 0.2)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.15), transparent 50%)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
}
