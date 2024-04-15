export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  nitro: {
    preset: 'aws-lambda',
    serveStatic: false,
  },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: 'data:image/png;base64,iVBORw0KGgo=' }]
    }
  },
});