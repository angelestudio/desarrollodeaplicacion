/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'tablet': '1180px',
      'sm':'300px',
      'md': '768px'
    },
    extend: {
      backgroundImage: {
        'buildings-login': 'url("./assets/bg_buildings.webp")' ,
        'buildings-profile': 'url("./assets/bg_buildings_grayout.jpg")'
      },
      colors: {
        primary: {
          
        },
      }
    }
  },
  plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/forms')]
}
