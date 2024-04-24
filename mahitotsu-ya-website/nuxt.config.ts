// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true,

  nitro: {
    preset: 'aws-lambda',
    serveStatic: false,
  },

  modules: ["nuxt-security", "@nuxt/ui"],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/vnd.microsoft.icon', href: 'data:image/x-icon;base64,AA' }
      ]
    }
  },

  runtimeConfig: {
    contents_bucket_name: '',
    contents_key_prefix: '',
    session_table_name: '',
    agent_id: '',
    agent_alias_id: '',
  },

  security: {

  },
})