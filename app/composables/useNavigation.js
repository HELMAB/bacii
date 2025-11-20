import { computed } from 'vue'

export function useNavigation(data, selectedPdf, selectPdf, showToastNotification) {
  const allPdfs = computed(() => {
    const pdfs = []
    data.value.forEach(category => {
      category.children.forEach(year => {
        year.children.forEach(subject => {
          pdfs.push({
            ...subject,
            category: category.label,
            year: year.label
          })
        })
      })
    })
    return pdfs
  })

  const currentPdfIndex = computed(() => {
    if (!selectedPdf.value) return -1
    return allPdfs.value.findIndex(pdf => pdf.pdf === selectedPdf.value)
  })

  const totalPdfsCount = computed(() => allPdfs.value.length)

  const canGoPrevious = computed(() => currentPdfIndex.value > 0)
  const canGoNext = computed(() => currentPdfIndex.value < totalPdfsCount.value - 1)

  function goToPreviousPdf() {
    if (canGoPrevious.value) {
      const prevPdf = allPdfs.value[currentPdfIndex.value - 1]
      selectPdf(prevPdf, prevPdf.category, prevPdf.year)
      showToastNotification('ឯកសារមុន')
    }
  }

  function goToNextPdf() {
    if (canGoNext.value) {
      const nextPdf = allPdfs.value[currentPdfIndex.value + 1]
      selectPdf(nextPdf, nextPdf.category, nextPdf.year)
      showToastNotification('ឯកសារបន្ទាប់')
    }
  }

  return {
    allPdfs,
    currentPdfIndex,
    totalPdfsCount,
    canGoPrevious,
    canGoNext,
    goToPreviousPdf,
    goToNextPdf
  }
}
