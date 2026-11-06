<template>
  <Transition
    enter-active-class="motion-safe:transition duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="motion-safe:transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-5 opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-24 right-4 z-50 max-w-[calc(100vw-2rem)] bg-ink-bar text-on-ink-bar px-4 py-2.5 flex items-center gap-2.5 border-2 border-on-ink-bar/30 shadow-[3px_3px_0_rgb(var(--c-system))]"
      role="status"
    >
      <Check class="w-5 h-5 shrink-0 text-system" :stroke-width="2.6" aria-hidden="true" />
      <span class="text-[15px] leading-snug">{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { Check } from '@lucide/vue'

defineProps({
  show: Boolean,
  message: String
})
</script>
