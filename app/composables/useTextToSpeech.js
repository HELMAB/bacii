import { ref, computed } from 'vue'
import { createWorker } from 'tesseract.js'

const isProcessing = ref(false)
const extractedText = ref('')
const isPlaying = ref(false)
const isPaused = ref(false)
const currentUtterance = ref(null)
const progress = ref(0)
const error = ref(null)
const selectedVoice = ref(null)
const availableVoices = ref([])

export const useTextToSpeech = () => {
  const initVoices = () => {
    const voices = window.speechSynthesis.getVoices()
    availableVoices.value = voices.filter(voice => 
      voice.lang.startsWith('km') || voice.lang.startsWith('en')
    )
    
    if (!selectedVoice.value && availableVoices.value.length > 0) {
      selectedVoice.value = availableVoices.value.find(v => v.lang.startsWith('km')) || availableVoices.value[0]
    }
  }

  if (typeof window !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = initVoices
    initVoices()
  }

  const extractTextFromPage = async (canvas, pageNumber) => {
    const worker = await createWorker('khm+eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          progress.value = Math.round(m.progress * 100)
        }
      }
    })

    try {
      const { data: { text } } = await worker.recognize(canvas)
      await worker.terminate()
      return text
    } catch (err) {
      await worker.terminate()
      throw err
    }
  }

  const extractTextFromCurrentPage = async (pdfDoc, pageNum) => {
    if (!pdfDoc) {
      throw new Error('No PDF document loaded')
    }

    isProcessing.value = true
    error.value = null
    progress.value = 0

    try {
      const page = await pdfDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2.0 })
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise

      const text = await extractTextFromPage(canvas, pageNum)
      extractedText.value = text.trim()
      
      return text.trim()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isProcessing.value = false
      progress.value = 0
    }
  }

  // Alternative method using PDF URL directly
  const extractTextFromPdfUrl = async (pdfUrl, pageNum) => {
    if (!pdfUrl) {
      throw new Error('No PDF URL provided')
    }

    isProcessing.value = true
    error.value = null
    progress.value = 0

    try {
      // Dynamically import PDF.js
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker source to use local worker file
      if (typeof window !== 'undefined') {
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url')
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
      }

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      const pdf = await loadingTask.promise

      const allText = []
      const totalPages = pdf.numPages

      // Extract text from all pages
      for (let i = 1; i <= totalPages; i++) {
        progress.value = Math.round((i / totalPages) * 100)
        
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2.0 })
        
        // Create canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        // Extract text using OCR
        const text = await extractTextFromPage(canvas, i)
        if (text.trim()) {
          allText.push(text.trim())
        }
      }

      const combinedText = allText.join('\n\n')
      extractedText.value = combinedText
      
      return combinedText
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isProcessing.value = false
      progress.value = 0
    }
  }

  const speak = (text = extractedText.value, rate = 1.0, pitch = 1.0) => {
    if (!text) return

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = selectedVoice.value
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.lang = selectedVoice.value?.lang || 'km-KH'

    utterance.onstart = () => {
      isPlaying.value = true
      isPaused.value = false
    }

    utterance.onend = () => {
      isPlaying.value = false
      isPaused.value = false
      currentUtterance.value = null
    }

    utterance.onerror = (e) => {
      error.value = `Speech error: ${e.error}`
      isPlaying.value = false
      isPaused.value = false
    }

    currentUtterance.value = utterance
    window.speechSynthesis.speak(utterance)
  }

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      isPaused.value = true
      isPlaying.value = false
    }
  }

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      isPaused.value = false
      isPlaying.value = true
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    isPlaying.value = false
    isPaused.value = false
    currentUtterance.value = null
  }

  const clearText = () => {
    extractedText.value = ''
    error.value = null
  }

  const canUseTTS = computed(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  })

  return {
    isProcessing,
    extractedText,
    isPlaying,
    isPaused,
    progress,
    error,
    selectedVoice,
    availableVoices,
    canUseTTS,
    extractTextFromCurrentPage,
    extractTextFromPdfUrl,
    speak,
    pause,
    resume,
    stop,
    clearText,
    initVoices
  }
}
