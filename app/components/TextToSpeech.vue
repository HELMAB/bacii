<template>
  <div v-if="canUseTTS" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        🔊 អានឮសៀង (Text to Speech)
      </h3>
      <button
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <!-- Extract Button -->
    <div class="mb-4">
      <button
        @click="handleExtract"
        :disabled="isProcessing || !currentPage"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <span v-if="isProcessing">⏳</span>
        <span v-else>📄</span>
        <span v-if="isProcessing">កំពុងស្កេន... {{ progress }}%</span>
        <span v-else>ស្កេនអត្ថបទពីទំព័រ {{ currentPage }}</span>
      </button>
    </div>

    <!-- Progress Bar -->
    <div v-if="isProcessing" class="mb-4">
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
      {{ error }}
    </div>

    <!-- Extracted Text -->
    <div v-if="extractedText" class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        អត្ថបទស្កេនបាន:
      </label>
      <textarea
        v-model="extractedText"
        rows="6"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="អត្ថបទនឹងបង្ហាញនៅទីនេះ..."
      ></textarea>
    </div>

    <!-- Voice Selection -->
    <div v-if="extractedText && availableVoices.length > 0" class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        ជ្រើសរើសសំលេង:
      </label>
      <select
        v-model="selectedVoice"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="voice in availableVoices" :key="voice.name" :value="voice">
          {{ voice.name }} ({{ voice.lang }})
        </option>
      </select>
    </div>

    <!-- Playback Controls -->
    <div v-if="extractedText" class="flex gap-2">
      <button
        v-if="!isPlaying && !isPaused"
        @click="handleSpeak"
        class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        ▶️ ចាប់ផ្តើម
      </button>
      
      <button
        v-if="isPlaying"
        @click="handlePause"
        class="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        ⏸️ ផ្អាក
      </button>
      
      <button
        v-if="isPaused"
        @click="handleResume"
        class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        ▶️ បន្ត
      </button>
      
      <button
        v-if="isPlaying || isPaused"
        @click="handleStop"
        class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        ⏹️ បញ្ឈប់
      </button>
      
      <button
        @click="handleClear"
        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        title="Clear text"
      >
        🗑️
      </button>
    </div>

    <!-- Info Message -->
    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
      💡 <strong>ជំនួយ:</strong> ចុចប៊ូតុង "ស្កេនអត្ថបទ" ដើម្បីស្កេនអត្ថបទពីទំព័រ PDF បច្ចុប្បន្ន។ បន្ទាប់មកអ្នកអាចកែសម្រួលអត្ថបទ និងស្តាប់វាតាមរយៈការចុច "ចាប់ផ្តើម"។
    </div>
  </div>
  
  <div v-else class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
    ⚠️ សូមទោស! កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រមុខងារ Text-to-Speech ទេ។
  </div>
</template>

<script setup>
import { useTextToSpeech } from '~/composables/useTextToSpeech'

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['close'])

const {
  isProcessing,
  extractedText,
  isPlaying,
  isPaused,
  progress,
  error,
  selectedVoice,
  availableVoices,
  canUseTTS,
  extractTextFromPdfUrl,
  speak,
  pause,
  resume,
  stop,
  clearText
} = useTextToSpeech()

const handleExtract = async () => {
  if (!props.pdfUrl) {
    error.value = 'No PDF URL provided'
    return
  }
  
  try {
    await extractTextFromPdfUrl(props.pdfUrl, props.currentPage)
  } catch (err) {
    console.error('Extraction error:', err)
  }
}

const handleSpeak = () => {
  speak()
}

const handlePause = () => {
  pause()
}

const handleResume = () => {
  resume()
}

const handleStop = () => {
  stop()
}

const handleClear = () => {
  clearText()
}
</script>
