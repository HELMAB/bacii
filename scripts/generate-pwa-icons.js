import { writeFileSync } from 'fs'
import { join } from 'path'

// SVG template for the icon
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#253c99" rx="${size * 0.15}"/>

  <!-- Icon Design - Book/Document -->
  <g transform="translate(${size * 0.25}, ${size * 0.2})">
    <!-- Book -->
    <rect x="0" y="0" width="${size * 0.5}" height="${size * 0.6}" fill="white" opacity="0.9" rx="${size * 0.05}"/>
    <rect x="${size * 0.05}" y="${size * 0.1}" width="${size * 0.4}" height="${size * 0.05}" fill="#253c99" opacity="0.7" rx="${size * 0.02}"/>
    <rect x="${size * 0.05}" y="${size * 0.2}" width="${size * 0.3}" height="${size * 0.03}" fill="#253c99" opacity="0.5" rx="${size * 0.015}"/>
    <rect x="${size * 0.05}" y="${size * 0.27}" width="${size * 0.35}" height="${size * 0.03}" fill="#253c99" opacity="0.5" rx="${size * 0.015}"/>

    <!-- Star accent -->
    <path d="M ${size * 0.42} ${size * 0.05} L ${size * 0.45} ${size * 0.12} L ${size * 0.52} ${size * 0.12} L ${size * 0.47} ${size * 0.17} L ${size * 0.49} ${size * 0.24} L ${size * 0.42} ${size * 0.19} L ${size * 0.35} ${size * 0.24} L ${size * 0.37} ${size * 0.17} L ${size * 0.32} ${size * 0.12} L ${size * 0.39} ${size * 0.12} Z"
          fill="#FCD34D" stroke="#F59E0B" stroke-width="${size * 0.005}"/>
  </g>

  <!-- Text "D" for Dobpi -->
  <text x="${size * 0.5}" y="${size * 0.88}"
        font-family="Arial, sans-serif"
        font-weight="bold"
        font-size="${size * 0.15}"
        fill="white"
        text-anchor="middle">D</text>
</svg>
`

// Icon sizes needed
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// Generate icons
console.log('🎨 Generating PWA icons...\n')

try {
  // Ensure public directory exists
  const publicDir = join(process.cwd(), 'public')

  sizes.forEach((size) => {
    const svg = createIconSVG(size)
    const filename = `icon-${size}x${size}.svg`
    const filepath = join(publicDir, filename)

    writeFileSync(filepath, svg.trim())
    console.log(`✅ Generated: ${filename}`)
  })

  // Create apple-touch-icon (180x180)
  const appleIcon = createIconSVG(180)
  writeFileSync(join(publicDir, 'apple-touch-icon.png.svg'), appleIcon.trim())
  console.log(`✅ Generated: apple-touch-icon.png.svg`)

  console.log('\n✨ All icons generated successfully!')
  console.log('\n📝 Note: SVG icons are being used. For better compatibility,')
  console.log('   you can convert them to PNG using an online tool or ImageMagick.')
  console.log('\n🔧 To convert to PNG with ImageMagick:')
  console.log('   for i in public/icon-*.svg; do convert $i ${i%.svg}.png && rm $i; done')
} catch (error) {
  console.error('❌ Error generating icons:', error)
  process.exit(1)
}
