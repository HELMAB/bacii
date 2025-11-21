import { ref } from 'vue'

export function useComparison() {
  const isComparisonMode = ref(false)
  const comparisonPdf1 = ref(null)
  const comparisonPdf2 = ref(null)
  const comparisonPdf1Title = ref('')
  const comparisonPdf2Title = ref('')
  const comparisonPdf1Category = ref('')
  const comparisonPdf2Category = ref('')
  const comparisonPdf1Year = ref('')
  const comparisonPdf2Year = ref('')

  function toggleComparisonMode() {
    isComparisonMode.value = !isComparisonMode.value
    if (!isComparisonMode.value) {
      clearComparison()
    }
  }

  function setComparisonPdf1(subject, category, year) {
    comparisonPdf1.value = subject.pdf
    comparisonPdf1Title.value = subject.label
    comparisonPdf1Category.value = category
    comparisonPdf1Year.value = year
  }

  function setComparisonPdf2(subject, category, year) {
    comparisonPdf2.value = subject.pdf
    comparisonPdf2Title.value = subject.label
    comparisonPdf2Category.value = category
    comparisonPdf2Year.value = year
  }

  function clearComparison() {
    comparisonPdf1.value = null
    comparisonPdf2.value = null
    comparisonPdf1Title.value = ''
    comparisonPdf2Title.value = ''
    comparisonPdf1Category.value = ''
    comparisonPdf2Category.value = ''
    comparisonPdf1Year.value = ''
    comparisonPdf2Year.value = ''
  }

  function swapPdfs() {
    const tempPdf = comparisonPdf1.value
    const tempTitle = comparisonPdf1Title.value
    const tempCategory = comparisonPdf1Category.value
    const tempYear = comparisonPdf1Year.value

    comparisonPdf1.value = comparisonPdf2.value
    comparisonPdf1Title.value = comparisonPdf2Title.value
    comparisonPdf1Category.value = comparisonPdf2Category.value
    comparisonPdf1Year.value = comparisonPdf2Year.value

    comparisonPdf2.value = tempPdf
    comparisonPdf2Title.value = tempTitle
    comparisonPdf2Category.value = tempCategory
    comparisonPdf2Year.value = tempYear
  }

  return {
    isComparisonMode,
    comparisonPdf1,
    comparisonPdf2,
    comparisonPdf1Title,
    comparisonPdf2Title,
    comparisonPdf1Category,
    comparisonPdf2Category,
    comparisonPdf1Year,
    comparisonPdf2Year,
    toggleComparisonMode,
    setComparisonPdf1,
    setComparisonPdf2,
    clearComparison,
    swapPdfs
  }
}
