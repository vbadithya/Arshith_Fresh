const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildPhotorealisticGheeImages() {
  const brainDir = 'C:\\Users\\KRANTI\\.gemini\\antigravity-ide\\brain\\825c2531-0eff-4b78-80d4-3401ae54cf02';
  const outDir = path.resolve('../assets/images/products');
  const frontDir = path.resolve('../frontend/assets/images/products');

  const buffaloInfographicSrc = path.join(brainDir, 'buffalo_ghee_infographic_1791011352401.jpg');
  const buffaloJarSrc = path.join(brainDir, 'buffalo_ghee_front_jar_1791011302166.jpg');

  // 1. BUFFALO GHEE INFOGRAPHIC (Use exact photorealistic AI image)
  const buffaloBackDest = path.join(outDir, 'buffalo_ghee_back.jpg');
  fs.copyFileSync(buffaloInfographicSrc, buffaloBackDest);
  console.log('Saved photorealistic Buffalo Ghee Infographic to:', buffaloBackDest);

  // 2. BUFFALO GHEE FRONT JAR (Use exact photorealistic AI jar)
  const buffaloFrontDest = path.join(outDir, 'buffalo_ghee_front.jpg');
  fs.copyFileSync(buffaloJarSrc, buffaloFrontDest);
  console.log('Saved photorealistic Buffalo Ghee Front Jar to:', buffaloFrontDest);

  // 3. COW GHEE INFOGRAPHIC (Composite from the photorealistic base with "ARSHITH COW GHEE")
  const cowPillOverlay = Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Replace left pill with "ARSHITH COW GHEE" -->
      <g transform="translate(60, 50)">
        <rect width="390" height="120" rx="60" fill="#ffffff"/>
        <text x="195" y="52" fill="#1b4d3e" font-family="Georgia, serif" font-weight="bold" font-size="30" text-anchor="middle" letter-spacing="1.5">ARSHITH</text>
        <text x="195" y="92" fill="#1b4d3e" font-family="Georgia, serif" font-weight="bold" font-size="30" text-anchor="middle" letter-spacing="1.5">COW GHEE</text>
      </g>
    </svg>
  `);

  const cowBackDest = path.join(outDir, 'cow_ghee_back.jpg');
  await sharp(buffaloInfographicSrc)
    .composite([{ input: cowPillOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toFile(cowBackDest);
  console.log('Saved photorealistic Cow Ghee Infographic to:', cowBackDest);

  // 4. COW GHEE FRONT JAR (Composite with "PURE COW GHEE" label)
  const cowJarOverlay = Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <!-- Label overlay for Cow Ghee title -->
      <rect x="315" y="565" width="395" height="95" fill="#0e3820"/>
      <text x="512" y="605" fill="#eab308" font-family="Georgia, serif" font-weight="bold" font-size="38" text-anchor="middle" letter-spacing="2">PURE</text>
      <text x="512" y="645" fill="#fef08a" font-family="Georgia, serif" font-weight="bold" font-size="38" text-anchor="middle" letter-spacing="2">COW GHEE</text>
    </svg>
  `);

  const cowFrontDest = path.join(outDir, 'cow_ghee_front.jpg');
  await sharp(buffaloJarSrc)
    .composite([{ input: cowJarOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toFile(cowFrontDest);
  console.log('Saved photorealistic Cow Ghee Front Jar to:', cowFrontDest);

  // Copy all 4 to frontend directory
  if (fs.existsSync(frontDir)) {
    fs.copyFileSync(buffaloBackDest, path.join(frontDir, 'buffalo_ghee_back.jpg'));
    fs.copyFileSync(buffaloFrontDest, path.join(frontDir, 'buffalo_ghee_front.jpg'));
    fs.copyFileSync(cowBackDest, path.join(frontDir, 'cow_ghee_back.jpg'));
    fs.copyFileSync(cowFrontDest, path.join(frontDir, 'cow_ghee_front.jpg'));
    console.log('Copied all 4 photorealistic images to frontend/assets/images/products');
  }
}

buildPhotorealisticGheeImages().catch(console.error);
