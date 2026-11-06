import { readFileSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { execFileSync } from 'child_process'
import { tmpdir } from 'os'

// Rasterizes the SVG source assets into the PNG and ICO files referenced by the
// manifest and <head> using headless Chrome, since no SVG toolchain
// (sharp/rsvg/imagemagick) is installed.

const publicDir = join(process.cwd(), 'public')

const targets = [
  { svg: 'og-image.svg', png: 'og-image.png', width: 1200, height: 630 },
  { svg: 'apple-touch-icon.png.svg', png: 'apple-touch-icon.png', width: 180, height: 180 },
  { svg: 'icon-192x192.svg', png: 'icon-192x192.png', width: 192, height: 192 },
  { svg: 'icon-512x512.svg', png: 'icon-512x512.png', width: 512, height: 512 }
]

const faviconSizes = [16, 32, 48]

const chromeBin = process.env.CHROME_BIN || 'google-chrome'

// Loaded from disk so Khmer text renders in the app's font rather than a system fallback.
const fontsDir = join(publicDir, 'fonts/PengHuoth')
const fontFaces = [
  { file: 'PengHuoth-Regular.ttf', weight: 400 },
  { file: 'PengHuoth-Bold.ttf', weight: 700 }
]
  .map(
    ({ file, weight }) =>
      `@font-face{font-family:'PengHuoth';font-weight:${weight};src:url('file://${join(fontsDir, file)}')}`
  )
  .join('')

function rasterize({ svg, png, width, height, dir = publicDir }) {
  const svgMarkup = readFileSync(join(publicDir, svg), 'utf8')

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    ${fontFaces}
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${width}px;height:${height}px;overflow:hidden}
    svg{display:block;width:${width}px;height:${height}px}
  </style></head><body>${svgMarkup}</body></html>`

  const htmlPath = join(tmpdir(), `dobpi-${png}.html`)
  const outPath = join(dir, png)
  writeFileSync(htmlPath, html)

  execFileSync(
    chromeBin,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--virtual-time-budget=3000',
      '--force-device-scale-factor=1',
      '--default-background-color=00000000',
      `--window-size=${width},${height}`,
      `--screenshot=${outPath}`,
      `file://${htmlPath}`
    ],
    { stdio: 'ignore' }
  )

  rmSync(htmlPath, { force: true })
  console.log(`✅ ${png} (${width}x${height}) from ${svg}`)
}

// An ICO file is a small directory followed by the images, which can be plain PNGs.
function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2) // Type: icon
  header.writeUInt16LE(images.length, 4)

  let offset = header.length + images.length * 16
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size, 0)
    entry.writeUInt8(size, 1)
    entry.writeUInt16LE(1, 4) // Colour planes
    entry.writeUInt16LE(32, 6) // Bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)])
}

function generateFaviconIco() {
  const images = faviconSizes.map((size) => {
    const png = `favicon-${size}.png`
    rasterize({ svg: 'favicon.svg', png, width: size, height: size, dir: tmpdir() })

    const path = join(tmpdir(), png)
    const data = readFileSync(path)
    rmSync(path, { force: true })
    return { size, data }
  })

  writeFileSync(join(publicDir, 'favicon.ico'), buildIco(images))
  console.log(`✅ favicon.ico (${faviconSizes.join(', ')})`)
}

console.log('🖼️  Generating PNG assets...\n')

for (const target of targets) {
  rasterize(target)
}

generateFaviconIco()

console.log('\n✨ Done.')
