import { defineNuxtConfig } from "nuxt"
import Icons from 'unplugin-icons/vite'

export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [
      Icons({
        // the feature below is experimental ⬇️
        autoInstall: true
      })
    ]
  },
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  modules: [
    '@nuxtjs/dayjs'
  ],
  buildModules: [
    '@nuxtjs/pwa',
  ],
  app: {
    head: {
      title: 'StatCheck',
      link: [
        { hid: 'icon', rel: 'icon', type: 'image/png', href: 'assets/icons/icon-48x48.png' },
        { rel: 'apple-touch-icon', type: 'image/png', href: 'assets/icons/icon-512x512.png' },
        { rel: 'manifest', href: 'manifest.json' }
      ]
    }
  }
});