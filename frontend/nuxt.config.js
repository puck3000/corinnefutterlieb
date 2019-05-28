const pkg = require('./package')


module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: "Corinne Futterlieb",
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Corinne Futterlieb. Foto - Kunst - Labor. Portfolio Website'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        value: '/CorinneFutterlieb_mobileScreenshot.png'
      }, {
        hid: 'twitter:description',
        name: 'twitter:description',
        value: 'Corinne Futterlieb. Foto - Kunst - Labor. Portfolio Website'
      }, {
        hid: 'og:title',
        name: 'og:title',
        content: 'Corinne Futterlieb'
      }, {
        name: 'og:type',
        content: 'article'
      }, {
        hid: 'og:url',
        name: 'og:url',
        content: 'https://corinne-futterlieb.com'
      }, {
        hid: 'og:image',
        name: 'og:image',
        content: '/CorinneFutterlieb_mobileScreenshot.png'
      }, {
        hid: 'og:description',
        name: 'og:description',
        content: 'Corinne Futterlieb. Foto - Kunst - Labor. Portfolio Website'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Global CSS
   */
  css: [
    '@/assets/reset.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [],

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
