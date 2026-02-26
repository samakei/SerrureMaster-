const sharp = require('sharp');
const path = require('path');

const inputPng = path.join(__dirname, '..', 'assets', 'logo-512.png');
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
    await sharp(inputPng)
      .resize(output.size, output.size, {
        fit: 'contain',
        background: '#000000',
      })
      .png()
      .toFile(outPath);
  }
}

generate()
  .then(() => {
    console.log('Icon set generated in public/icons');
  })
  .catch((error) => {
    console.error('Failed to generate icons:', error);
    process.exit(1);
  });
