<template>
  <Transition name="slide">
    <div
      v-if="show"
      class="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          ការកត់ត្រា
        </h3>
        <button
          @click="emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-300 dark:border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
        >
          {{ tab.label }} ({{ tab.count }})
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Highlights Tab -->
        <div v-if="activeTab === 'highlights'">
          <div v-if="highlights.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm">មិនមានការសម្គាល់នៅឡើយទេ</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="highlight in sortedHighlights"
              :key="highlight.id"
              class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              @click="emit('goToPage', highlight.page)"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">ទំព័រ {{ highlight.page }}</span>
                <button
                  @click.stop="emit('removeHighlight', highlight.id)"
                  class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div
                class="p-2 rounded text-sm"
                :style="{ backgroundColor: highlight.color + '40', borderLeft: `4px solid ${highlight.color}` }"
              >
                {{ highlight.text }}
              </div>
              <div class="mt-2 text-xs text-gray-400">
                {{ formatDate(highlight.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Tab -->
        <div v-if="activeTab === 'notes'">
          <div v-if="notes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p class="text-sm">មិនមានកំណត់ចំណាំនៅឡើយទេ</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="note in sortedNotes"
              :key="note.id"
              class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between mb-2">
                <span
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600"
                  @click="emit('goToPage', note.page)"
                >
                  ទំព័រ {{ note.page }}
                </span>
                <button
                  @click="emit('removeNote', note.id)"
                  class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div
                v-if="editingNoteId !== note.id"
                class="p-2 rounded text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900"
                @dblclick="startEdit(note.id)"
              >
                {{ note.text }}
              </div>
              <textarea
                v-else
                v-model="editingNoteText"
                @blur="saveEdit(note.id)"
                @keydown.enter.ctrl="saveEdit(note.id)"
                class="w-full p-2 rounded text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                rows="3"
                autofocus
              />
              <div class="mt-2 text-xs text-gray-400">
                {{ formatDate(note.createdAt) }}
                <span v-if="note.updatedAt"> • កែប្រែ</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookmarks Tab -->
        <div v-if="activeTab === 'bookmarks'">
          <div v-if="bookmarks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <p class="text-sm">មិនមានចំណាំទំព័រនៅឡើយទេ</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="bookmark in sortedBookmarks"
              :key="bookmark.id"
              class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
              @click="emit('goToPage', bookmark.page)"
            >
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ bookmark.title }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(bookmark.createdAt) }}</div>
                </div>
              </div>
              <button
                @click.stop="emit('removeBookmark', bookmark.id)"
                class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="show"
      @click="emit('close')"
      class="fixed inset-0 bg-black bg-opacity-30 z-40"
    ></div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  notes: Array,
  bookmarks: Array
})

const emit = defineEmits(['close', 'goToPage', 'removeNote', 'updateNote', 'removeBookmark'])

const activeTab = ref('notes')
const editingNoteId = ref(null)
const editingNoteText = ref('')

const tabs = computed(() => [
  { id: 'notes', label: 'កំណត់ចំណាំ', count: props.notes.length },
  { id: 'bookmarks', label: 'ចំណាំទំព័រ', count: props.bookmarks.length }
])

const sortedNotes = computed(() =>
  [...props.notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
)

const sortedBookmarks = computed(() =>
  [...props.bookmarks].sort((a, b) => a.page - b.page)
)

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'ឥឡូវនេះ'
  if (minutes < 60) return `${minutes} នាទីមុន`
  if (hours < 24) return `${hours} ម៉ោងមុន`
  if (days < 7) return `${days} ថ្ងៃមុន`

  return date.toLocaleDateString('km-KH')
}

function startEdit(noteId) {
  const note = props.notes.find(n => n.id === noteId)
  if (note) {
    editingNoteId.value = noteId
    editingNoteText.value = note.text
  }
}

function saveEdit(noteId) {
  if (editingNoteText.value.trim()) {
    emit('updateNote', noteId, editingNoteText.value)
  }
  editingNoteId.value = null
  editingNoteText.value = ''
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
