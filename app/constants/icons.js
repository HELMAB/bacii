export const subjectIcons = {
  'អក្សរសាស្ត្រខ្មែរ': '📚',
  'គណិតវិទ្យា': '🧮',
  'រូបវិទ្យា': '⚛️',
  'គីមីវិទ្យា': '🧪',
  'ជីវវិទ្យា': '🧬',
  'ប្រវត្តិសាស្ត្រ': '📜',
  'ភូមិវិទ្យា': '🌍',
  'ផែនដីវិទ្យា': '⛰️',
  'សីលធម៌': '🕊️',
  'សីលធម៌-ពលរដ្ឋ': '❤️',
  'ភាសាអង់គ្លេស': '🇬🇧',
  'ភាសាបារាំង': '🇫🇷'
}

export const categoryGradients = {
  'វិទ្យាសាស្ត្រសង្គម': 'from-blue-500 to-indigo-600',
  'វិទ្យាសាស្ត្រធម្មជាតិ': 'from-green-500 to-teal-600',
  'គណិតវិទ្យា': 'from-purple-500 to-pink-600',
  'ប្រវត្តិសាស្ត្រ': 'from-amber-500 to-orange-600'
}

export function getCategoryGradient(categoryLabel) {
  return categoryGradients[categoryLabel] || 'from-blue-500 to-purple-600'
}

export function getSubjectIcon(label) {
  return subjectIcons[label] || '📄'
}
