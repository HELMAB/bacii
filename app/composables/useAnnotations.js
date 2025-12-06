import { ref, computed } from 'vue'

export function useAnnotations() {
  const bookmarks = ref([])
  const notes = ref([])
  const isAnnotationMode = ref(false)
  const currentTool = ref(null) // 'note', 'bookmark'
  const currentColor = ref('#FFEB3B') // Default yellow

  const colors = [
    { name: 'លឿង', value: '#FFEB3B', class: 'bg-yellow-300' },
    { name: 'បៃតង', value: '#4CAF50', class: 'bg-green-300' },
    { name: 'ខៀវ', value: '#2196F3', class: 'bg-blue-300' },
    { name: 'ស្វាយ', value: '#9C27B0', class: 'bg-purple-300' },
    { name: 'ទឹកក្រូច', value: '#FF9800', class: 'bg-orange-300' },
    { name: 'ផ្កាឈូក', value: '#E91E63', class: 'bg-pink-300' }
  ]

  function loadAnnotations(pdfPath) {
    if (!pdfPath) return

    try {
      const key = `annotations_${pdfPath}`
      const stored = localStorage.getItem(key)
      if (stored) {
        const data = JSON.parse(stored)
        bookmarks.value = data.bookmarks || []
        notes.value = data.notes || []
      } else {
        bookmarks.value = []
        notes.value = []
      }
    } catch (error) {
      console.error('Failed to load annotations:', error)
      bookmarks.value = []
      notes.value = []
    }
  }

  function saveAnnotations(pdfPath) {
    if (!pdfPath) return

    try {
      const key = `annotations_${pdfPath}`
      const data = {
        bookmarks: bookmarks.value,
        notes: notes.value,
        lastModified: new Date().toISOString()
      }
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save annotations:', error)
    }
  }

  function addNote(text, pageNumber, position, pdfPath) {
    const note = {
      id: Date.now(),
      text,
      page: pageNumber,
      position,
      color: currentColor.value,
      createdAt: new Date().toISOString()
    }
    notes.value.push(note)
    saveAnnotations(pdfPath)
    return note
  }

  function updateNote(noteId, text, pdfPath) {
    const note = notes.value.find(n => n.id === noteId)
    if (note) {
      note.text = text
      note.updatedAt = new Date().toISOString()
      saveAnnotations(pdfPath)
    }
  }

  function removeNote(noteId, pdfPath) {
    notes.value = notes.value.filter(n => n.id !== noteId)
    saveAnnotations(pdfPath)
  }

  function addBookmark(pageNumber, title, pdfPath) {
    const bookmark = {
      id: Date.now(),
      page: pageNumber,
      title: title || `ទំព័រ ${pageNumber}`,
      createdAt: new Date().toISOString()
    }
    bookmarks.value.push(bookmark)
    saveAnnotations(pdfPath)
    return bookmark
  }

  function removeBookmark(bookmarkId, pdfPath) {
    bookmarks.value = bookmarks.value.filter(b => b.id !== bookmarkId)
    saveAnnotations(pdfPath)
  }

  function toggleAnnotationMode() {
    isAnnotationMode.value = !isAnnotationMode.value
    if (!isAnnotationMode.value) {
      currentTool.value = null
    }
  }

  function setTool(tool) {
    currentTool.value = tool
    isAnnotationMode.value = true
  }

  function setColor(color) {
    currentColor.value = color
  }

  function clearAllAnnotations(pdfPath) {
    if (confirm('តើអ្នកប្រាកដថាចង់លុបការកត់ត្រាទាំងអស់ទេ?')) {
      bookmarks.value = []
      notes.value = []
      saveAnnotations(pdfPath)
    }
  }

  function exportAnnotations(pdfPath) {
    const data = {
      pdf: pdfPath,
      bookmarks: bookmarks.value,
      notes: notes.value,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `annotations_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function importAnnotations(file, pdfPath) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.bookmarks) bookmarks.value = data.bookmarks
        if (data.notes) notes.value = data.notes
        saveAnnotations(pdfPath)
      } catch (error) {
        console.error('Failed to import annotations:', error)
        alert('មានបញ្ហាក្នុងការនាំចូលការកត់ត្រា')
      }
    }
    reader.readAsText(file)
  }

  const totalAnnotations = computed(() =>
    bookmarks.value.length + notes.value.length
  )

  const annotationsByPage = computed(() => {
    const byPage = {}

    notes.value.forEach(n => {
      if (!byPage[n.page]) byPage[n.page] = { notes: [], bookmarks: [] }
      byPage[n.page].notes.push(n)
    })

    bookmarks.value.forEach(b => {
      if (!byPage[b.page]) byPage[b.page] = { notes: [], bookmarks: [] }
      byPage[b.page].bookmarks.push(b)
    })

    return byPage
  })

  return {
    bookmarks,
    notes,
    isAnnotationMode,
    currentTool,
    currentColor,
    colors,
    totalAnnotations,
    annotationsByPage,
    loadAnnotations,
    saveAnnotations,
    addNote,
    updateNote,
    removeNote,
    addBookmark,
    removeBookmark,
    toggleAnnotationMode,
    setTool,
    setColor,
    clearAllAnnotations,
    exportAnnotations,
    importAnnotations
  }
}
