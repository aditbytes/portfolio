// Generates responsive AVIF / WebP / JPEG portrait crops from the originals in
// assets-src/portraits into public/assets/portraits.
//
//   npm run images
//
// Outputs are committed, so a normal `npm run build` never needs sharp.
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets-src/portraits';
const OUT = 'public/assets/portraits';

/**
 * name:    output basename
 * file:    source file
 * extract: crop region in source pixels (null = full frame)
 * widths:  output widths
 */
const JOBS = [
  {
    // Laptop / marina photo. The source is a circle on a white square, so we
    // take the largest portrait rectangle inscribed in that circle.
    name: 'hero',
    file: '01-laptop-marina.jpg',
    extract: { left: 202, top: 107, width: 620, height: 810 },
    widths: [420, 620],
  },
  {
    // Black & white side profile — editorial image for "The Signal".
    name: 'profile',
    file: '02-profile-bw.jpg',
    extract: { left: 0, top: 0, width: 864, height: 1080 },
    widths: [480, 864],
  },
  {
    // Formal portrait — About section.
    name: 'about',
    file: '03-suit.jpg',
    extract: { left: 0, top: 0, width: 864, height: 1080 },
    widths: [480, 864],
  },
];

const FORMATS = [
  ['avif', (s) => s.avif({ quality: 52, effort: 6 })],
  ['webp', (s) => s.webp({ quality: 74 })],
  ['jpg', (s) => s.jpeg({ quality: 80, mozjpeg: true, progressive: true })],
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  for (const width of job.widths) {
    for (const [ext, encode] of FORMATS) {
      let pipeline = sharp(path.join(SRC, job.file));
      if (job.extract) pipeline = pipeline.extract(job.extract);
      pipeline = pipeline.resize({ width, withoutEnlargement: true });
      const out = path.join(OUT, `${job.name}-${width}.${ext}`);
      await encode(pipeline).toFile(out);
      const { size } = await stat(out);
      console.log(`${out.padEnd(44)} ${(size / 1024).toFixed(1).padStart(7)} KB`);
    }
  }
}
