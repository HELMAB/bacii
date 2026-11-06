<script setup>
import { toKhmerDigits } from '../../utils/khmer'

// Page position in the open PDF. Silent for screen readers: it changes on every
// scroll, which would be noisy if announced.
defineProps({
  currentPage: Number,
  totalPages: Number
})
</script>

<template>
  <div
    class="ink-chip absolute left-4 bottom-[92px] sm:left-6 sm:bottom-6 z-20 text-[15px] pointer-events-none"
  >
    ទំព័រ
    <b class="ml-1.5 font-bold text-lg leading-none">
      {{ toKhmerDigits(`${currentPage} / ${totalPages}`) }}
    </b>
  </div>
</template>
