const sharp = require('sharp');
const path = require('path');

const inputSvg = path.join(__dirname, '..', 'assets', 'logo.svg');
const outputPng = path.join(__dirname, '..', 'assets', 'logo-512.png');

sharp(inputSvg, { density: 300 })
  .resize(512, 512, {
    fit: 'contain',
    background: '#000000',
  })
  .png()
  .toFile(outputPng)
  .then(() => {
    console.log(`Logo PNG generated: ${outputPng}`);
  })
  .catch((error) => {
    console.error('Failed to generate PNG:', error);
    process.exit(1);
  });
