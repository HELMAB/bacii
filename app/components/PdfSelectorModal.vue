<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-bar/60"
    @click.self="$emit('close')"
  >
    <div
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-selector-title"
      class="bg-surface text-fg border-2 border-line shadow-print max-w-4xl w-full max-h-[90dvh] overflow-hidden flex flex-col"
      @keydown="handleKeydown"
    >
      <!-- Header -->
      <div class="shrink-0">
        <div class="flex items-center gap-3 pl-5 pr-2.5 py-2 bg-ink-bar text-on-ink-bar">
          <div class="flex-1 min-w-0">
            <h2 id="pdf-selector-title" class="font-display text-lg leading-[1.7]">
              ជ្រើសរើសឯកសារ {{ pdfNumber === 1 ? '១' : '២' }}
            </h2>
            <p class="text-sm text-on-ink-bar/80">ជ្រើសរើសឯកសារប្រឡងដើម្បីប្រៀបធៀប</p>
          </div>
          <button
            ref="closeRef"
            type="button"
            class="btn btn-icon border-on-ink-bar/50 hover:bg-on-ink-bar/10"
            aria-label="បិទ"
            @click="$emit('close')"
          >
            <X class="w-5 h-5" :stroke-width="2.6" aria-hidden="true" />
          </button>
        </div>
        <div class="bg-zigzag h-2.5" aria-hidden="true"></div>
      </div>

      <div class="shrink-0 px-4 sm:px-6 pt-4">
        <CategoryTabs
          :categories="data"
          :active-category="activeCategory"
          :id-prefix="TABS_ID"
          @select="activeCategory = $event"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div
          v-for="(category, categoryIndex) in data"
          v-show="category.label === activeCategory"
          :id="`${TABS_ID}-panel-${categoryIndex}`"
          :key="category.label"
          role="tabpanel"
          :aria-labelledby="`${TABS_ID}-tab-${categoryIndex}`"
          class="space-y-6"
        >
          <section v-for="year in category.children" :key="year.label">
            <h3 class="flex items-baseline gap-2 pb-1 mb-3 border-b-2 border-line text-active">
              <span class="font-numeral text-xl leading-none">
                {{ parseYearLabel(year.label).year }}
              </span>
              <span v-if="parseYearLabel(year.label).round" class="text-sm font-bold">
                {{ parseYearLabel(year.label).round }}
              </span>
              <span class="sr-only">{{ year.label }}</span>
            </h3>

            <!-- Subjects -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                v-for="subject in year.children"
                :key="subject.pdf"
                type="button"
                class="min-h-11 flex items-center gap-2.5 px-3 py-2 text-left border-2 border-line bg-surface-raised shadow-print-sm hover:bg-highlight/25 transition-colors"
                @click="handleSelect(subject, category.label, year.label)"
              >
                <component
                  :is="getSubjectIcon(subject.label)"
                  class="w-5 h-5 shrink-0 text-active"
                  :stroke-width="2.2"
                  aria-hidden="true"
                />
                <span>{{ subject.label }}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, shallowRef, watch } from 'vue'
import { X } from '@lucide/vue'
import CategoryTabs from './Sidebar/CategoryTabs.vue'
import { getSubjectIcon } from '../constants/icons'
import { parseYearLabel } from '../utils/khmer'

const TABS_ID = 'selector-category'

const props = defineProps({
  show: Boolean,
  pdfNumber: Number,
  data: Array
})

const emit = defineEmits(['close', 'select'])

const activeCategory = shallowRef('')
const dialogRef = ref(null)
const closeRef = ref(null)
let returnFocusTo = null

watch(
  () => props.show,
  async (show) => {
    if (show) {
      if (!activeCategory.value) activeCategory.value = props.data?.[0]?.label ?? ''
      returnFocusTo = document.activeElement
      await nextTick()
      closeRef.value?.focus()
    } else {
      returnFocusTo?.focus?.()
      returnFocusTo = null
    }
  }
)

function handleSelect(subject, category, year) {
  emit('select', subject, category, year)
  emit('close')
}

// Escape closes; Tab stays inside the dialog.
function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
    return
  }

  if (event.key !== 'Tab') return

  const focusable = [
    ...dialogRef.value.querySelectorAll('button:not([disabled]), [href], [tabindex="0"]')
  ].filter((element) => element.offsetParent !== null)
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>
