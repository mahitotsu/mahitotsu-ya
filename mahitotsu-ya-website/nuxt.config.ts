// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true,

  nitro: {
    preset: 'node-server',
    serveStatic: false,
  },
  experimental: {
    componentIslands: true,
  },

  modules: ["nuxt-security", "@nuxt/ui"],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/vnd.microsoft.icon', href: 'data:image/x-icon;base64,AA' }
      ]
    }
  },

  security: {

  },
})