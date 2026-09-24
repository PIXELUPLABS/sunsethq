// Preserve vector geometry, blend modes, and original texture pixels. Replace
// embedded PNG payloads with lossless WebP; do not rasterize SVG blend effects.
// Retain design originals to make the conversion reproducible and reviewable.
import sharp from 'sharp';
import { readFile, writeFile, stat } from 'node:fs/promises';
const vectors = ['images/grain-light-texture.svg', 'images/hero/btn-pattern.svg', 'images/hover-card-grey-bg.svg', 'images/careers/practical-stuff-cube-grid.svg'];
const rasters = ['images/texture-grain-white.png', 'images/valuation/value/grain-overlay.png', 'images/footer/grain.png', 'images/texture-grain-light.png', 'images/texture-canvas-blue.png'];
for (const source of vectors) {
  let svg = await readFile(`public/${source}`, 'utf8');
  for (const match of [...svg.matchAll(/data:image\/png;base64,([^"\s]+)/g)]) {
    let image = sharp(Buffer.from(match[1], 'base64'));
    if (source === 'images/hero/btn-pattern.svg') {
      // The 59px button only shows source rows 265.6–454.4. Retain a
      // filtering margin and compensate the pattern translation exactly.
      image = image.extract({ left: 0, top: 264, width: 960, height: 192 });
      svg = svg.replace('width="960" height="720"', 'width="960" height="192"')
        .replace('0 -1.40678)', '0 -0.00847496)');
    }
    const webp = await image.webp({ lossless: true, effort: 6 }).toBuffer();
    svg = svg.replace(match[0], `data:image/webp;base64,${webp.toString('base64')}`);
  }
  const target = source.replace('.svg', '-optimized.svg');
  await writeFile(`public/${target}`, svg);
  console.log(source, (await stat(`public/${source}`)).size, '→', Buffer.byteLength(svg));
}
for (const source of rasters) {
  const target = source.replace('.png', '.webp');
  await sharp(`public/${source}`).webp({ lossless: true, effort: 6 }).toFile(`public/${target}`);
  console.log(source, (await stat(`public/${source}`)).size, '→', (await stat(`public/${target}`)).size);
}
