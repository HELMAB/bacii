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
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-950 border-t-2 border-primary-500"
    >
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between gap-4">
          <!-- Icon & Content -->
          <div class="flex items-center gap-4 flex-1">
            <!-- App Icon -->
            <div class="flex-shrink-0 w-14 h-14 bg-primary-600 flex items-center justify-center">
              <GraduationCap class="w-8 h-8 text-white" />
            </div>

            <!-- Text Content -->
            <div class="text-white flex-1">
              <h3 class="font-bold text-base mb-0.5">ដំឡើង Dobpi</h3>
              <p class="text-sm text-white/70">
                ប្រើប្រាស់កម្មវិធីដោយមិនចាំបាច់មានអ៊ីនធឺណិត និងចូលប្រើបានលឿនជាងមុន
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              class="px-6 py-3 bg-white text-gray-900 font-bold hover:bg-gray-200 transition-colors"
              @click="installApp"
            >
              ដំឡើង
            </button>
            <button
              class="px-4 py-3 text-white hover:bg-white/10 transition-colors"
              aria-label="បិទ"
              @click="dismissPrompt"
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
  setTimeout(
    () => {
      localStorage.removeItem('pwa-install-dismissed')
    },
    7 * 24 * 60 * 60 * 1000
  )
}
</script>
