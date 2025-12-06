import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VuePdfEmbed', VuePdfEmbed)
})
