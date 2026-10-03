const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createCleanPhotographicGhee() {
  const honeySrc = 'C:\\Users\\KRANTI\\.gemini\\antigravity-ide\\brain\\825c2531-0eff-4b78-80d4-3401ae54cf02\\.user_uploaded\\media_1791011795632.png';
  const outDir = path.resolve('../assets/images/products');
  const frontDir = path.resolve('../frontend/assets/images/products');

  function buildLabelSvg(curvedTitle, scriptName) {
    return Buffer.from(`
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="yellowCard" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="35%" stop-color="#fbbf24"/>
            <stop offset="70%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#eab308"/>
          </linearGradient>

          <filter id="handiGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- 1. Dark Brown Arch masking "NATURAL HONEY" (x: 338..672, y: 460..545) -->
        <path d="M 338 540 Q 505 460 672 540 L 672 555 Q 505 475 338 555 Z" fill="#30150b"/>
        
        <!-- Curved Title: "PURE BUFFALO GHEE" or "PURE COW GHEE" -->
        <path id="brownCurve" d="M 345 528 Q 505 455 665 528" fill="none"/>
        <text font-family="Georgia, serif" font-weight="bold" font-size="24" fill="#ffffff" letter-spacing="1.5">
          <textPath href="#brownCurve" startOffset="50%" text-anchor="middle">
            ${curvedTitle}
          </textPath>
        </text>

        <!-- 2. Yellow Honeycomb Card (x: 338..672, corners at y:600, apex at y:538, bottom at y:806) -->
        <path d="M 338 600 Q 505 538 672 600 L 672 806 L 338 806 Z" fill="url(#yellowCard)"/>

        <!-- Honeycomb Geometric Pattern -->
        <g opacity="0.18" stroke="#78350f" stroke-width="1.8" fill="none">
          ${Array.from({ length: 7 }).flatMap((_, row) => 
            Array.from({ length: 7 }).map((_, col) => {
              const cx = 358 + col * 52 + (row % 2) * 26;
              const cy = 560 + row * 36;
              return `<polygon points="${cx},${cy-16} ${cx+14},${cy-8} ${cx+14},${cy+8} ${cx},${cy+16} ${cx-14},${cy+8} ${cx-14},${cy-8}"/>`;
            })
          ).join('')}
        </g>

        <!-- Center Ghee Handi / Pot with Wooden Bilona Spoon (filter=handiGlow) -->
        <g filter="url(#handiGlow)" transform="translate(505, 640)">
          <!-- Golden Aura Glow -->
          <ellipse cx="0" cy="5" rx="85" ry="50" fill="#fef08a" opacity="0.95"/>
          
          <!-- Traditional Brass / Earthen Pot -->
          <ellipse cx="0" cy="14" rx="55" ry="18" fill="#78350f"/>
          <path d="M -55 14 Q -65 44 -32 55 Q 0 60 32 55 Q 65 44 55 14 Z" fill="#92400e"/>
          <ellipse cx="0" cy="14" rx="48" ry="15" fill="#b45309"/>
          
          <!-- Danedar Golden Ghee -->
          <ellipse cx="0" cy="13" rx="42" ry="13" fill="#fde047"/>
          <ellipse cx="-8" cy="10" rx="26" ry="6" fill="#ffffff" opacity="0.85"/>
          
          <!-- Wooden Bilona Spoon -->
          <line x1="12" y1="-28" x2="0" y2="10" stroke="#78350f" stroke-width="6.5" stroke-linecap="round"/>
          <circle cx="12" cy="-28" r="4.5" fill="#451a03"/>
          
          <!-- "BILONA A2" Badge -->
          <g transform="translate(-65, -18)">
            <rect width="60" height="18" rx="9" fill="#15803d"/>
            <text x="30" y="13" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="8" text-anchor="middle" letter-spacing="0.5">BILONA A2</text>
          </g>
        </g>

        <!-- Large Stylized Script Name (Matching "Honey" in reference with white border and dark drop shadow) -->
        <g transform="translate(505, 755)">
          <!-- Deep Drop Shadow -->
          <text x="2" y="3" fill="#2e1810" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="42" text-anchor="middle">${scriptName}</text>
          <!-- Thick Crisp White Border -->
          <text x="0" y="0" fill="#ffffff" stroke="#ffffff" stroke-width="10" stroke-linejoin="round" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="42" text-anchor="middle">${scriptName}</text>
          <!-- Rich Dark Brown Inner Lettering -->
          <text x="0" y="0" fill="#3a1e12" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="42" text-anchor="middle">${scriptName}</text>
        </g>
      </svg>
    `);
  }

  // 1. Generate Buffalo Ghee Jar
  console.log('Generating clean Buffalo Ghee jar...');
  const buffaloSvg = buildLabelSvg('PURE BUFFALO GHEE', 'Buffalo Ghee');
  const buffaloPath = path.join(outDir, 'buffalo_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: buffaloSvg, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(buffaloPath);
  console.log('Saved Buffalo Ghee to:', buffaloPath);

  // 2. Generate Cow Ghee Jar
  console.log('Generating clean Cow Ghee jar...');
  const cowSvg = buildLabelSvg('PURE COW GHEE', 'Cow Ghee');
  const cowPath = path.join(outDir, 'cow_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: cowSvg, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(cowPath);
  console.log('Saved Cow Ghee to:', cowPath);

  // Copy to frontend
  if (fs.existsSync(frontDir)) {
    fs.copyFileSync(buffaloPath, path.join(frontDir, 'buffalo_ghee_front.jpg'));
    fs.copyFileSync(cowPath, path.join(frontDir, 'cow_ghee_front.jpg'));
    console.log('Copied both jars to frontend/assets/images/products');
  }
}

createCleanPhotographicGhee().catch(console.error);
