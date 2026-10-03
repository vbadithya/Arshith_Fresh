const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source: new buffalo ghee image uploaded by user (768x987)
// We need to replace "DESI BUFFALO GHEE" with "DESI COW GHEE"
// The label background is cream colored (#f5ecbb / #f0e4a0 area)
// 
// Image dimensions: 768 x 987
// Label is roughly x=75..690, y=295..830
// "DESI BUFFALO GHEE" title text is roughly at y=395-455 area
// "100% Pure" is roughly y=470-500
//
// Strategy: place a cream rectangle over the title text area,
// then write "DESI COW GHEE" in the same bold style

const SOURCE = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02/.user_uploaded/media_1791020367082.jpg';

const TARGET_DIRS = [
  'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/assets/images/products',
  'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/frontend/assets/images/products',
];

// SVG overlay sized to match 768x987
// "DESI BUFFALO GHEE" in original is at approx y=435-495
// "100% Pure" is at approx y=500-530
// We cover the title line only and rewrite with COW
const overlay = `<svg width="768" height="987" viewBox="0 0 768 987" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Match the cream label background exactly -->
    <linearGradient id="labelCream" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f5e8be"/>
      <stop offset="50%" stop-color="#f0e0a8"/>
      <stop offset="100%" stop-color="#ead898"/>
    </linearGradient>
  </defs>

  <!-- Cover "DESI BUFFALO GHEE" title text with cream rectangle -->
  <rect x="85" y="430" width="600" height="72" fill="url(#labelCream)"/>

  <!-- Write "DESI COW GHEE" in same bold dark style as original -->
  <text x="385" y="493"
        font-family="'Arial Black', 'Helvetica Neue', Impact, sans-serif"
        font-size="60"
        font-weight="900"
        fill="#0e0600"
        text-anchor="middle"
        letter-spacing="-0.5">DESI COW GHEE</text>
</svg>`;

async function buildCowGheeFront() {
  const svgBuf = Buffer.from(overlay);

  const outBuf = await sharp(SOURCE)
    .composite([{ input: svgBuf, top: 0, left: 0 }])
    .jpeg({ quality: 97 })
    .toBuffer();

  // Save preview to artifact dir
  const artifactDir = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02';
  fs.writeFileSync(path.join(artifactDir, 'cow_ghee_front_exact.jpg'), outBuf);

  for (const dir of TARGET_DIRS) {
    fs.writeFileSync(path.join(dir, 'cow_ghee_front.jpg'), outBuf);
    console.log('Saved to:', dir);
  }

  console.log('Done!');
}

buildCowGheeFront().catch(console.error);
