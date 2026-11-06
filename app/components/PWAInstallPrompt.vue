<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div v-if="showPrompt" class="shrink-0 p-3 sm:p-4 bg-surface text-fg border-t-2 border-line">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between gap-2 sm:gap-4">
          <!-- Icon & Content -->
          <div class="flex items-center gap-4 flex-1">
            <!-- App Icon -->
            <BrandStamp :size="56" class="hidden sm:block" />

            <!-- Text Content -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-base leading-snug mb-0.5">ដំឡើង Dobpi</h3>
              <p class="text-sm leading-[1.6] text-fg-muted">
                ប្រើប្រាស់កម្មវិធីដោយមិនចាំបាច់មានអ៊ីនធឺណិត និងចូលប្រើបានលឿនជាងមុន
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button type="button" class="btn btn-ink sm:px-6" @click="installApp">ដំឡើង</button>
            <button
              type="button"
              class="btn btn-icon btn-outline"
              aria-label="បិទ"
              @click="dismissPrompt"
            >
              <X class="w-5 h-5" :stroke-width="2.6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { X } from '@lucide/vue'
import BrandStamp from './BrandStamp.vue'

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
