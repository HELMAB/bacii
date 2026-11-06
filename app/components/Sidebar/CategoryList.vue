<template>
  <!--
    One tab panel per category, all kept in the markup (v-show) so crawlers and the
    server render see every document link, whichever tab is selected.
  -->
  <div
    v-for="(category, categoryIndex) in categories"
    v-show="!isSearching && category.label === activeCategory"
    :id="`${idPrefix}-panel-${categoryIndex}`"
    :key="category.label"
    role="tabpanel"
    :aria-labelledby="`${idPrefix}-tab-${categoryIndex}`"
    class="bg-ruled border-t border-system/20"
  >
    <nav :aria-label="`${stripCategoryPrefix(category.label)}: វិញ្ញាសាតាមឆ្នាំ`">
      <div v-for="year in category.children" :key="year.label">
        <!-- Year row: exactly 44px so it sits on the ruled lines -->
        <button
          type="button"
          class="w-full h-11 flex items-center text-left text-fg hover:bg-highlight/20 transition-colors"
          :aria-expanded="!!expandedYears[year.label]"
          :aria-label="`${year.label}, ${formatSubjectCount(year.children.length)}`"
          @click="$emit('toggleYear', year.label)"
        >
          <span :class="marginClass" class="flex flex-col items-center justify-center text-active">
            <span class="font-bold text-lg leading-none">
              {{ parseYearLabel(year.label).year }}
            </span>
            <span
              v-if="parseYearLabel(year.label).round"
              class="text-xs font-bold leading-tight mt-0.5"
            >
              {{ parseYearLabel(year.label).round }}
            </span>
          </span>
          <span
            :class="[
              'flex-1 pl-4 text-[15px]',
              expandedYears[year.label] ? 'font-bold text-fg' : 'text-fg-muted'
            ]"
          >
            {{ formatSubjectCount(year.children.length) }}
          </span>
          <ChevronDown
            v-if="expandedYears[year.label]"
            class="w-4 h-4 mr-4 sm:mr-6 shrink-0"
            :stroke-width="2.6"
            aria-hidden="true"
          />
          <ChevronRight
            v-else
            class="w-4 h-4 mr-4 sm:mr-6 shrink-0"
            :stroke-width="2.6"
            aria-hidden="true"
          />
        </button>

        <!-- Subjects: real links, kept in the markup while collapsed for crawlers -->
        <ol v-show="expandedYears[year.label]">
          <li
            v-for="(subject, subjectIndex) in year.children"
            :key="subject.pdf"
            class="h-11 flex items-center"
          >
            <span :class="marginClass" aria-hidden="true"></span>
            <a
              :href="getDocPath(subject.pdf)"
              :title="subject.label"
              :aria-current="selectedPdf === subject.pdf ? 'page' : undefined"
              :aria-label="isStamped(subject.pdf) ? `${subject.label} — បានទាញយក` : undefined"
              :class="[
                'flex-1 min-w-0 h-11 flex items-center gap-2 text-base',
                selectedPdf === subject.pdf
                  ? 'pl-3 pr-4 sm:pr-5 scroll-mt-4 scroll-mb-56'
                  : 'pl-6 pr-4 sm:pr-5 text-fg hover:bg-highlight/20 transition-colors'
              ]"
              @click.exact.prevent="$emit('selectPdf', subject, category.label, year.label)"
            >
              <!-- The current paper is an inset pill, inside a full 44px hit area -->
              <span
                :class="[
                  'flex-1 min-w-0 truncate',
                  selectedPdf === subject.pdf &&
                    'h-9 leading-9 px-3 bg-active text-on-active font-bold shadow-print-sm'
                ]"
              >
                {{ toKhmerDigits(subjectIndex + 1) }}. {{ subject.label }}
              </span>
              <span
                v-if="isStamped(subject.pdf) && selectedPdf !== subject.pdf"
                class="stamp stamp-system"
                aria-hidden="true"
              >
                បានទាញយក
              </span>
            </a>
          </li>
        </ol>
      </div>
    </nav>
  </div>

  <!-- Search results, from both categories -->
  <div v-if="isSearching && filteredData.length" class="px-4 sm:px-6 space-y-5">
    <section v-for="category in filteredData" :key="category.label">
      <h3 class="text-sm font-bold text-fg-muted pb-1 mb-1 border-b-2 border-line">
        {{ stripCategoryPrefix(category.label) }}
      </h3>
      <ul>
        <template v-for="year in category.children" :key="year.label">
          <li
            v-for="subject in year.children"
            :key="subject.pdf"
            class="border-b border-dashed border-line/40"
          >
            <a
              :href="getDocPath(subject.pdf)"
              :aria-current="selectedPdf === subject.pdf ? 'page' : undefined"
              :class="[
                'min-h-11 flex items-center gap-3 px-2 text-base transition-colors',
                selectedPdf === subject.pdf
                  ? 'bg-active text-on-active font-bold'
                  : 'text-fg hover:bg-highlight/20'
              ]"
              @click.exact.prevent="$emit('selectPdf', subject, category.label, year.label)"
            >
              <span class="flex-1 min-w-0 truncate">
                <template
                  v-for="(part, partIndex) in splitMatch(subject.label, searchQuery)"
                  :key="partIndex"
                >
                  <mark v-if="part.match" class="bg-highlight text-[#2A1D14] px-0.5">
                    {{ part.text }}
                  </mark>
                  <template v-else>{{ part.text }}</template>
                </template>
              </span>
              <span
                :class="[
                  'shrink-0 font-bold text-base',
                  selectedPdf === subject.pdf ? 'text-on-active' : 'text-active'
                ]"
              >
                {{ formatYearShort(year.label).replace('ឆ្នាំ', '') }}
              </span>
            </a>
          </li>
        </template>
      </ul>
    </section>
  </div>

  <!-- No Results -->
  <div
    v-if="isSearching && filteredData.length === 0"
    class="mx-4 sm:mx-6 p-5 border-2 border-dashed border-line text-center"
    role="status"
  >
    <SearchX class="w-8 h-8 mx-auto mb-2 text-fg-muted" :stroke-width="2" aria-hidden="true" />
    <p class="font-bold text-base leading-[1.7]">រកមិនឃើញលទ្ធផល</p>
    <p class="mt-1 text-sm text-fg-muted">សាកល្បងឈ្មោះមុខវិជ្ជា ឬឆ្នាំ ដូចជា «២០២២»</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronDown, ChevronRight, SearchX } from '@lucide/vue'
import { getDocPath } from '../../utils/docUrl'
import { splitMatch } from '../../utils/highlight'
import {
  formatSubjectCount,
  formatYearShort,
  parseYearLabel,
  stripCategoryPrefix,
  toKhmerDigits
} from '../../utils/khmer'

const props = defineProps({
  // The full docs tree (tab panels) and the search results.
  categories: { type: Array, default: () => [] },
  filteredData: { type: Array, default: () => [] },
  activeCategory: String,
  expandedYears: Object,
  selectedPdf: String,
  searchQuery: String,
  cachedPdfs: { type: Set, default: () => new Set() },
  // Off once every paper is saved: a stamp on every row says nothing.
  showSavedStamps: { type: Boolean, default: true },
  // Must match the CategoryTabs idPrefix so tabs and panels point at each other.
  idPrefix: { type: String, default: 'category' }
})

defineEmits(['toggleYear', 'selectPdf'])

// The red margin line of the exercise-book ledger.
const marginClass = 'w-[72px] sm:w-[84px] h-11 shrink-0 self-start border-r-2 border-active'

const isSearching = computed(() => !!props.searchQuery?.trim())

function isStamped(pdf) {
  return props.showSavedStamps && props.cachedPdfs.has(pdf)
}
</script>
