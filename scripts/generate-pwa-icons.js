import { writeFileSync } from 'fs'
import { join } from 'path'
import { LETTER_PATH } from '../app/constants/logo.js'

// The logo: the letter ឌ, the sound Dobpi starts with, on a red and black record
// label, after 1970s Khmer record sleeves. Run `npm run generate-png-assets` afterwards
// to rebuild the PNG and ICO versions.

const RED = '#c7231f'
const MUSTARD = '#e8c34a'
const INK = '#14110d'
const WHITE = '#ffffff'

const BEAD_COUNT = 32

const letter = (size, fill, offset = 0) => {
  const position = 50 - size / 2 + offset
  return `<path d="${LETTER_PATH}" fill="${fill}" transform="translate(${position} ${position}) scale(${size / 100})"/>`
}

function createBeads() {
  const beads = []
  for (let index = 0; index < BEAD_COUNT; index++) {
    const angle = (index / BEAD_COUNT) * Math.PI * 2
    const x = (50 + 36.4 * Math.cos(angle)).toFixed(2)
    const y = (50 + 36.4 * Math.sin(angle)).toFixed(2)
    beads.push(`<circle cx="${x}" cy="${y}" r="1.15" fill="${MUSTARD}"/>`)
  }
  return beads.join('')
}

// Full logo for app icons. The background bleeds to the edges and the label stays
// inside the central 80% circle, so it survives Android's maskable crop.
const createIconSVG = (
  size
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${MUSTARD}"/>
  <circle cx="50" cy="50" r="39.5" fill="${INK}"/>
  ${createBeads()}
  <circle cx="50" cy="50" r="33" fill="${RED}"/>
  ${letter(42, INK, 1.6)}
  ${letter(42, WHITE)}
</svg>
`

// Simplified for browser tabs: no fine detail, a larger letter, transparent corners.
const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="${MUSTARD}"/>
  <circle cx="50" cy="50" r="46" fill="${INK}"/>
  <circle cx="50" cy="50" r="41" fill="${RED}"/>
  ${letter(58, WHITE)}
</svg>
`

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const publicDir = join(process.cwd(), 'public')

console.log('🎨 Generating PWA icons...\n')

for (const size of sizes) {
  writeFileSync(join(publicDir, `icon-${size}x${size}.svg`), createIconSVG(size))
  console.log(`✅ icon-${size}x${size}.svg`)
}

writeFileSync(join(publicDir, 'apple-touch-icon.png.svg'), createIconSVG(180))
console.log('✅ apple-touch-icon.png.svg')

writeFileSync(join(publicDir, 'favicon.svg'), faviconSVG)
console.log('✅ favicon.svg')

console.log('\n✨ Done. Now run: npm run generate-png-assets')
