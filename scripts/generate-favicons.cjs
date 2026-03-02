const sharp = require('sharp');
const path = require('path');

const inputSvg = path.join(__dirname, '..', 'public', 'favicon.svg');
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

const outputs = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512 },
];

async function generate() {
  for (const output of outputs) {
    const outPath = path.join(iconsDir, output.name);
    await sharp(inputSvg, { density: 300 })
      .resize(output.size, output.size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(outPath);
    console.log(`✓ Generated ${output.name}`);
  }
}

generate()
  .then(() => {
    console.log('\n✅ Tous les favicons ont été générés avec succès!');
  })
  .catch((error) => {
    console.error('Erreur lors de la génération des favicons:', error);
    process.exit(1);
  });
