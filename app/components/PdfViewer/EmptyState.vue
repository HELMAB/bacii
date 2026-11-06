<template>
  <div class="flex-1 relative overflow-auto bg-rays flex items-center justify-center px-4 py-10">
    <div class="flex flex-col items-center text-center gap-5 max-w-md">
      <BrandStamp :size="152" outlined />

      <h2
        class="font-bold text-5xl leading-[1.5] text-fg [text-shadow:3px_3px_0_rgb(var(--c-surface))]"
      >
        បាក់ឌុប
      </h2>

      <p
        class="bg-ink-bar text-on-ink-bar font-bold text-base leading-[1.7] px-4 py-1 -rotate-2 shadow-print-sm"
      >
        វិញ្ញាសាប្រឡងទុតិយភូមិ
      </p>

      <!-- Loading the document list -->
      <div v-if="isLoading" class="w-64 max-w-full mt-2 space-y-2" role="status">
        <p class="font-bold">កំពុងរៀបចំវិញ្ញាសា…</p>
        <div class="h-3.5 border-2 border-line bg-surface overflow-hidden" aria-hidden="true">
          <div class="h-full bg-stripes progress-indeterminate"></div>
        </div>
      </div>

      <p
        v-else
        class="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 border-2 border-dashed border-line bg-surface-raised/90"
      >
        ចុច
        <Menu class="w-5 h-5" :stroke-width="2.4" aria-label="បញ្ជីឯកសារ" role="img" />
        ដើម្បីជ្រើសរើសឯកសារ
      </p>
    </div>
  </div>
</template>

<script setup>
import { Menu } from '@lucide/vue'
import BrandStamp from '../BrandStamp.vue'

defineProps({
  isLoading: Boolean
})
</script>
