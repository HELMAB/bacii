import { readFileSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { execFileSync } from 'child_process'
import { tmpdir } from 'os'

// Rasterizes the SVG source assets into the PNGs referenced by the manifest and
// <head> (og-image.png, apple-touch-icon.png) using headless Chrome, since no
// SVG toolchain (sharp/rsvg/imagemagick) is installed.

const publicDir = join(process.cwd(), 'public')

const targets = [
  { svg: 'og-image.svg', png: 'og-image.png', width: 1200, height: 630 },
  { svg: 'apple-touch-icon.png.svg', png: 'apple-touch-icon.png', width: 180, height: 180 }
]

const chromeBin = process.env.CHROME_BIN || 'google-chrome'

function rasterize({ svg, png, width, height }) {
  const svgMarkup = readFileSync(join(publicDir, svg), 'utf8')

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${width}px;height:${height}px;overflow:hidden}
    svg{display:block;width:${width}px;height:${height}px}
  </style></head><body>${svgMarkup}</body></html>`

  const htmlPath = join(tmpdir(), `dobpi-${png}.html`)
  const outPath = join(publicDir, png)
  writeFileSync(htmlPath, html)

  execFileSync(chromeBin, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--default-background-color=00000000',
    `--window-size=${width},${height}`,
    `--screenshot=${outPath}`,
    `file://${htmlPath}`
  ], { stdio: 'ignore' })

  rmSync(htmlPath, { force: true })
  console.log(`✅ ${png} (${width}x${height}) from ${svg}`)
}

console.log('🖼️  Generating PNG assets...\n')

for (const target of targets) {
  rasterize(target)
}

console.log('\n✨ Done.')
