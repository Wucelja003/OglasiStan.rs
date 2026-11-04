/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // OglasiStan paleta (ista kao na originalnom sajtu)
      colors: {
        cream: '#FAF7F2',     // pozadina stranice
        card: '#FDF9F4',      // kartice / paneli
        sand: '#F2EDE3',      // polja, utisnute površine
        line: '#DDD7CC',      // ivice
        espresso: '#221E1A',  // tamne sekcije i dugmad
        ink: '#1A1612',       // glavni tekst
        muted: '#6B6158',     // sekundarni tekst
        dim: '#9A9086',       // tercijarni tekst / placeholder
        accent: {
          DEFAULT: '#E07B2A',
          soft: '#EA9150',
          deep: '#C45F12',
          amber: '#F5A623',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.75)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.08)' },
        },
        reveal: {
          from: { transform: 'translateY(110%)' },
          to: { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--r, 0deg))' },
          '50%': { transform: 'translateY(-14px) rotate(var(--r, 0deg))' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        drift: 'drift 14s ease-in-out infinite',
        reveal: 'reveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
