const sharp = require('sharp');

async function checkCoords() {
  const honeyPath = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02/.user_uploaded/media_1791011795632.png';
  const { data, info } = await sharp(honeyPath).raw().toBuffer({ resolveWithObject: true });

  console.log('--- Vertical Center (x=500) ---');
  for (let y = 200; y <= 920; y += 10) {
    const idx = (y * info.width + 500) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    console.log(`y=${y}: rgb(${r},${g},${b})`);
  }

  console.log('--- Horizontal at y=700 ---');
  for (let x = 200; x <= 800; x += 20) {
    const idx = (700 * info.width + x) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    console.log(`x=${x}: rgb(${r},${g},${b})`);
  }
}
checkCoords();
