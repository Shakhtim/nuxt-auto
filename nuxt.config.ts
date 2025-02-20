// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image', 'nuxt-easy-lightbox'],

  image: {
    dir: 'public',
  },

  devtools: { enabled: true },

  css: [
    '@/assets/styles/app.scss'
  ],

  compatibilityDate: '2024-12-23',

  runtimeConfig: {
    // apiKey: process.env.API_KEY,

    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:8000',
    },
  },
});