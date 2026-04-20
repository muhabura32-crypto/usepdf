const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const publicDir = path.join(__dirname, '..', 'public')
const images = [
  {
    input: path.join(publicDir, 'background-usepdf-image.png'),
    output: path.join(publicDir, 'background-usepdf-image.webp'),
    width: 1920,
    quality: 80,
    format: 'webp',
  },
  {
    input: path.join(publicDir, 'logo.png'),
    output: path.join(publicDir, 'logo.webp'),
    width: 256,
    quality: 80,
    format: 'webp',
  },
]

;(async () => {
  for (const image of images) {
    if (!fs.existsSync(image.input)) {
      console.warn(`Input file not found: ${image.input}`)
      continue
    }

    try {
      console.log(`Optimizing ${path.basename(image.input)} -> ${path.basename(image.output)}`)
      let pipeline = sharp(image.input)
        .rotate()
        .resize({ width: image.width, withoutEnlargement: true })

      if (image.format === 'webp') {
        pipeline = pipeline.webp({ quality: image.quality })
      }

      await pipeline.toFile(image.output)
      const stats = fs.statSync(image.output)
      console.log(`  Saved ${stats.size} bytes`)
    } catch (err) {
      console.error(`Failed to optimize ${image.input}:`, err)
    }
  }
})()
