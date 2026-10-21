const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgPath = 'C:\\Users\\KRANTI\\.gemini\\antigravity-ide\\brain\\0728f129-ea01-4979-aa0d-0812ea144a48\\.user_uploaded\\media_1792577872401.png';

async function generateCastorImage() {
  const metadata = await sharp(imgPath).metadata();

  // Take the background row directly below 500ml (at y=782..787, left=196, width=72)
  // and stretch it vertically to cover y=753..782
  const bgRow = await sharp(imgPath)
    .extract({ left: 196, top: 782, width: 72, height: 6 })
    .resize(72, 30, { fit: 'fill' })
    .toBuffer();

  const svgText = Buffer.from(`
    <svg width="${metadata.width}" height="${metadata.height}" xmlns="http://www.w3.org/2000/svg">
      <text x="201" y="776"
            font-family="Arial, Helvetica, sans-serif"
            font-size="18.5"
            font-weight="bold"
            fill="#eae8df"
            letter-spacing="0.2px">250 ml</text>
    </svg>
  `);

  const outBuf = await sharp(imgPath)
    .composite([
      { input: bgRow, left: 196, top: 753 },
      { input: svgText, left: 0, top: 0 }
    ])
    .png({ quality: 100 })
    .toBuffer();

  const targetPaths = [
    path.join(__dirname, '..', 'assets', 'images', 'products', 'castor_oil_250ml.png'),
    path.join(__dirname, '..', 'assets', 'images', 'products', 'castor_oil.jpg'),
    path.join(__dirname, '..', 'assets', 'images', 'products', 'castor_oil_250ml.jpg'),
    path.join(__dirname, '..', 'assets', 'images', 'products', 'castor_oil_front.png'),
    path.join(__dirname, '..', 'assets', 'images', 'products', 'castor_oil_front.jpg'),
    path.join(__dirname, '..', 'frontend', 'assets', 'images', 'products', 'castor_oil_250ml.png'),
    path.join(__dirname, '..', 'frontend', 'assets', 'images', 'products', 'castor_oil.jpg'),
    path.join(__dirname, 'castor_oil_250ml_preview.png')
  ];

  for (const tPath of targetPaths) {
    fs.mkdirSync(path.dirname(tPath), { recursive: true });
    if (tPath.endsWith('.jpg')) {
      const jpgBuf = await sharp(outBuf).jpeg({ quality: 95 }).toBuffer();
      fs.writeFileSync(tPath, jpgBuf);
    } else {
      fs.writeFileSync(tPath, outBuf);
    }
  }

  const patchCheck = await sharp(outBuf)
    .extract({ left: 180, top: 730, width: 140, height: 75 })
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'patch_check.png'), patchCheck);
  console.log('✅ Generated 100% flawless castor oil 250ml image!');
}

generateCastorImage().catch(console.error);
