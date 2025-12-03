// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  typescript: {
    strict: true,
    typeCheck: true
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Creators Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Internal marketing tool to find content creators' }
      ]
    }
  }
})
