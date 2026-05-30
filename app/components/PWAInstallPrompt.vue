<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="showPrompt"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-primary-600 shadow-2xl border-t-4 border-white"
    >
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between gap-4">
          <!-- Icon & Content -->
          <div class="flex items-center gap-4 flex-1">
            <!-- App Icon -->
            <div class="flex-shrink-0 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <GraduationCap class="w-10 h-10 text-primary-600" />
            </div>

            <!-- Text Content -->
            <div class="text-white flex-1">
              <h3 class="font-bold text-lg mb-1">ដំឡើង Dobpi</h3>
              <p class="text-sm opacity-90">ប្រើប្រាស់កម្មវិធីដោយមិនចាំបាច់មានអ៊ីនធឺណិត និងចូលប្រើបានលឿនជាងមុន</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="installApp"
              class="px-6 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              ដំឡើង
            </button>
            <button
              @click="dismissPrompt"
              class="px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="បិទ"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GraduationCap, X } from '@lucide/vue'

const showPrompt = ref(false)
const deferredPrompt = ref(null)

onMounted(() => {
  // Check if already dismissed
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  const installed = localStorage.getItem('pwa-installed')

  if (dismissed || installed) {
    return
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e

    // Show prompt after 5 seconds
    setTimeout(() => {
      showPrompt.value = true
    }, 5000)
  })

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully')
    localStorage.setItem('pwa-installed', 'true')
    showPrompt.value = false
    deferredPrompt.value = null
  })
})

async function installApp() {
  if (!deferredPrompt.value) {
    return
  }

  deferredPrompt.value.prompt()

  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
    localStorage.setItem('pwa-installed', 'true')
  }

  showPrompt.value = false
  deferredPrompt.value = null
}

function dismissPrompt() {
  showPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', 'true')

  // Show again after 7 days
  setTimeout(() => {
    localStorage.removeItem('pwa-install-dismissed')
  }, 7 * 24 * 60 * 60 * 1000)
}
</script>
