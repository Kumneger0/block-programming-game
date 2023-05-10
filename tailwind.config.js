/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      screens: {
        'sm': { 'max': '767px'},
  
        'md': {'max': '1023px'},
  
        'lg': {'max': '1279px'},
  
        'xl': {'max': '1535px'},
  
        '2xl': {'min': '1536px'},
      },
    
  },
  plugins: [],
}