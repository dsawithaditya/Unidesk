/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./app.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif']
      },
      colors: {
        bg: '#080a07',
        card: '#121810',
        lime: '#a3ff12',
        cyan: '#a3ff12',
        teal: '#487512',
        ink: '#0c0f0a'
      }
    }
  },
  safelist: [
    'bg-amber-400/15', 'text-amber-300', 'border-amber-400/25', 'border-amber-400/40', 'bg-amber-400/20',
    'bg-[#a3ff12]/15', 'text-[#a3ff12]', 'border-[#a3ff12]/30', 'border-[#a3ff12]/25', 'bg-[#a3ff12]/20',
    'bg-emerald-400/15', 'text-emerald-300', 'border-emerald-400/25',
    'bg-rose-400/15', 'text-rose-300', 'border-rose-400/25',
    'bg-white/10', 'text-gray-300', 'text-gray-400', 'border-white/10',
    'sla-normal', 'sla-warning', 'sla-breached'
  ],
  plugins: []
};

