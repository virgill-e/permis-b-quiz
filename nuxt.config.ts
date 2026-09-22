// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  ssr: true,
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Permis B Belgique — Entraînement théorique',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: "Entraînement au code de la route belge (permis B) : QCM par leçon et simulation d'examen officiel, avec référence exacte au support de cours pour chaque question."
        }
      ]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
