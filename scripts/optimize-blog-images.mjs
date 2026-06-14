import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { unlinkSync } from 'node:fs'

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const jobs = [
  'blog-maintenance',
  'blog-tpo-repair',
  'blog-storm',
]
for (const name of jobs) {
  const src = join(pub, name + '.jpg')
  const out = join(pub, name + '.webp')
  await sharp(src).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out)
  unlinkSync(src) // remove the heavy source JPEG; ship only the webp
  console.log('wrote', name + '.webp')
}
