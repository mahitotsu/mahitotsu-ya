// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true,
  nitro: {
    preset: 'node-cluster',
    serveStatic: false,
  },
  experimental: {
    componentIslands: true,
  },

  modules: ["nuxt-security"],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/vnd.microsoft.icon', href: 'data:image/x-icon;base64,AA' }
      ]
    }
  }
})