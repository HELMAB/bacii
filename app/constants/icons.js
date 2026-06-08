import {
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Scroll,
  Globe,
  Mountain,
  Scale,
  HeartHandshake,
  Languages,
  FileText
} from '@lucide/vue'

export const subjectIcons = {
  អក្សរសាស្ត្រខ្មែរ: BookOpen,
  គណិតវិទ្យា: Calculator,
  រូបវិទ្យា: Atom,
  គីមីវិទ្យា: FlaskConical,
  ជីវវិទ្យា: Dna,
  ប្រវត្តិសាស្ត្រ: Scroll,
  ភូមិវិទ្យា: Globe,
  ផែនដីវិទ្យា: Mountain,
  សីលធម៌: Scale,
  'សីលធម៌-ពលរដ្ឋ': HeartHandshake,
  ភាសាអង់គ្លេស: Languages,
  ភាសាបារាំង: Languages
}

export function getSubjectIcon(label) {
  return subjectIcons[label] || FileText
}
