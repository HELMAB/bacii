<script setup>
import { nextTick, useTemplateRef } from 'vue'
import { stripCategoryPrefix } from '../../utils/khmer'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  activeCategory: String,
  // Prefix for the tab and panel ids, unique per instance.
  idPrefix: { type: String, default: 'category' }
})

const emit = defineEmits(['select'])

const tabs = useTemplateRef('tabs')

function tabId(index) {
  return `${props.idPrefix}-tab-${index}`
}

function panelId(index) {
  return `${props.idPrefix}-panel-${index}`
}

// WAI-ARIA tabs with automatic activation: arrows move focus and select.
async function handleKeydown(event, index) {
  const last = props.categories.length - 1
  const next = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last
  }[event.key]

  if (next === undefined) return
  // Keep ←/→ from also reaching the global prev/next-paper shortcuts.
  event.preventDefault()
  event.stopPropagation()
  emit('select', props.categories[next].label)
  await nextTick()
  tabs.value?.[next]?.focus()
}

defineExpose({ tabId, panelId })
</script>

<template>
  <div role="tablist" aria-label="ថ្នាក់" class="grid grid-cols-2">
    <button
      v-for="(category, index) in categories"
      :id="tabId(index)"
      ref="tabs"
      :key="category.label"
      type="button"
      role="tab"
      :aria-selected="category.label === activeCategory"
      :aria-controls="panelId(index)"
      :tabindex="category.label === activeCategory ? 0 : -1"
      :class="[
        'min-h-12 px-2 border-2 border-line text-base font-bold leading-snug transition-colors',
        index > 0 && 'border-l-0',
        category.label === activeCategory
          ? 'bg-active text-on-active'
          : 'bg-surface-raised text-fg hover:bg-highlight/25'
      ]"
      @click="$emit('select', category.label)"
      @keydown="handleKeydown($event, index)"
    >
      {{ stripCategoryPrefix(category.label) }}
    </button>
  </div>
</template>
