<script setup>
import { LETTER_PATH } from '../constants/logo'

// The round brick stamp with the letter ឌ, used in the header, the empty state and
// the install prompt. Fixed brand colours, so it looks the same in both themes.
defineProps({
  size: { type: Number, default: 48 },
  // Ink outline, for use on the light rays background.
  outlined: Boolean
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="-14 -14 128 128"
    aria-hidden="true"
    focusable="false"
    class="shrink-0"
  >
    <circle
      cx="50"
      cy="50"
      :r="outlined ? 60 : 62"
      fill="#9E2F18"
      :stroke="outlined ? '#2A1D14' : 'none'"
      :stroke-width="outlined ? 3 : 0"
    />
    <circle
      cx="50"
      cy="50"
      r="54"
      fill="none"
      stroke="#F1E4C6"
      stroke-width="2"
      stroke-dasharray="4 4"
    />
    <path :d="LETTER_PATH" fill="#F1E4C6" transform="translate(18 18) scale(.64)" />
  </svg>
</template>
