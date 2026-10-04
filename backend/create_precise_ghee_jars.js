const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createPreciseGheeJars() {
  const honeySrc = 'C:\\Users\\KRANTI\\.gemini\\antigravity-ide\\brain\\825c2531-0eff-4b78-80d4-3401ae54cf02\\.user_uploaded\\media_1791011795632.png';
  const outDir = path.resolve('../assets/images/products');
  const frontDir = path.resolve('../frontend/assets/images/products');

  // Exact coordinates matching label_inner:
  // Label X: 344 to 688 (width 344, center 516)
  // Label Y: 450 to 810 (height 360)
  
  function getLabelPatchSvg(curvedTitle, scriptName, gheePotColor = '#facc15') {
    return Buffer.from(`
      <svg width="344" height="360" viewBox="0 0 344 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brownBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3b1d12"/>
            <stop offset="50%" stop-color="#3d1d11"/>
            <stop offset="100%" stop-color="#2c140c"/>
          </linearGradient>

          <linearGradient id="yellowBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="40%" stop-color="#fbbf24"/>
            <stop offset="80%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#eab308"/>
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- 1. Dark Brown Arch Area for Curved Title (y: 0 to 95) -->
        <rect width="344" height="96" fill="url(#brownBg)"/>
        
        <!-- Curved Title -->
        <path id="patchCurve" d="M 12 76 Q 172 15 332 76" fill="none"/>
        <text font-family="Georgia, serif" font-weight="bold" font-size="23" fill="#ffffff" letter-spacing="1.5">
          <textPath href="#patchCurve" startOffset="50%" text-anchor="middle">
            ${curvedTitle}
          </textPath>
        </text>

        <!-- 2. Yellow Honeycomb Card Area (y: 95 to 360) -->
        <!-- Arched Top boundary -->
        <path d="M 0 95 Q 172 52 344 95 L 344 360 L 0 360 Z" fill="url(#yellowBg)"/>

        <!-- Honeycomb Geometric Pattern -->
        <g opacity="0.16" stroke="#78350f" stroke-width="1.5" fill="none">
          ${Array.from({ length: 7 }).flatMap((_, row) => 
            Array.from({ length: 7 }).map((_, col) => {
              const cx = 24 + col * 52 + (row % 2) * 26;
              const cy = 110 + row * 36;
              return `<polygon points="${cx},${cy-16} ${cx+14},${cy-8} ${cx+14},${cy+8} ${cx},${cy+16} ${cx-14},${cy+8} ${cx-14},${cy-8}"/>`;
            })
          ).join('')}
        </g>

        <!-- Center Ghee Pot / Brass Handi with Wooden Bilona Churner -->
        <g filter="url(#glow)" transform="translate(172, 195)">
          <!-- Golden Aura Background -->
          <ellipse cx="0" cy="5" rx="95" ry="60" fill="#fef08a" opacity="0.95"/>
          
          <!-- Traditional Brass / Earthen Pot -->
          <ellipse cx="0" cy="14" rx="60" ry="20" fill="#78350f"/>
          <path d="M -60 14 Q -70 48 -35 60 Q 0 66 35 60 Q 70 48 60 14 Z" fill="#92400e"/>
          <ellipse cx="0" cy="14" rx="52" ry="16" fill="#b45309"/>
          
          <!-- Golden Granular Ghee -->
          <ellipse cx="0" cy="13" rx="46" ry="14" fill="${gheePotColor}"/>
          <ellipse cx="-8" cy="10" rx="30" ry="7" fill="#ffffff" opacity="0.85"/>
          
          <!-- Wooden Bilona Spoon -->
          <line x1="14" y1="-32" x2="0" y2="12" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
          <circle cx="14" cy="-32" r="5" fill="#451a03"/>
          
          <!-- "BILONA A2" Green Badge -->
          <g transform="translate(-70, -20)">
            <rect width="65" height="20" rx="10" fill="#15803d"/>
            <text x="32" y="14" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="8.5" text-anchor="middle" letter-spacing="0.5">BILONA A2</text>
          </g>
        </g>

        <!-- Large Stylized Script Name (Matching "Honey" in reference with white border and dark drop shadow) -->
        <g transform="translate(172, 318)">
          <!-- Deep Drop Shadow -->
          <text x="2" y="3" fill="#2e1810" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="44" text-anchor="middle">${scriptName}</text>
          <!-- Thick Crisp White Border -->
          <text x="0" y="0" fill="#ffffff" stroke="#ffffff" stroke-width="10" stroke-linejoin="round" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="44" text-anchor="middle">${scriptName}</text>
          <!-- Rich Dark Brown Inner Lettering -->
          <text x="0" y="0" fill="#3a1e12" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="44" text-anchor="middle">${scriptName}</text>
        </g>
      </svg>
    `);
  }

  // 1. Generate Buffalo Ghee Jar
  console.log('Generating precise Buffalo Ghee jar...');
  const buffaloPatch = getLabelPatchSvg('PURE BUFFALO GHEE', 'Buffalo Ghee', '#fef08a');
  const buffaloPath = path.join(outDir, 'buffalo_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: buffaloPatch, top: 450, left: 344 }])
    .jpeg({ quality: 96 })
    .toFile(buffaloPath);
  console.log('Saved Buffalo Ghee to:', buffaloPath);

  // 2. Generate Cow Ghee Jar
  console.log('Generating precise Cow Ghee jar...');
  const cowPatch = getLabelPatchSvg('PURE COW GHEE', 'Cow Ghee', '#fde047');
  const cowPath = path.join(outDir, 'cow_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: cowPatch, top: 450, left: 344 }])
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

createPreciseGheeJars().catch(console.error);
