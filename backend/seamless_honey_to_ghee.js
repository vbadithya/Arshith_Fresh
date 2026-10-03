const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createSeamlessGheeJars() {
  const honeySrc = 'C:\\Users\\KRANTI\\.gemini\\antigravity-ide\\brain\\825c2531-0eff-4b78-80d4-3401ae54cf02\\.user_uploaded\\media_1791011795632.png';
  const outDir = path.resolve('../assets/images/products');
  const frontDir = path.resolve('../frontend/assets/images/products');

  function buildSeamlessOverlay(curvedTitle, scriptName) {
    return Buffer.from(`
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="archGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3d1e13"/>
            <stop offset="100%" stop-color="#2a140b"/>
          </linearGradient>

          <linearGradient id="honeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#facc15"/>
          </linearGradient>

          <filter id="potGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- 1. Mask over old "NATURAL HONEY" curved text on dark brown arch (x: 250..750, y: 460..555) -->
        <path d="M 252 505 Q 500 425 748 505 L 748 555 Q 500 480 252 555 Z" fill="url(#archGrad)"/>

        <!-- New Curved Title -->
        <path id="archPath" d="M 265 520 Q 500 445 735 520" fill="none"/>
        <text font-family="Georgia, serif" font-weight="bold" font-size="30" fill="#ffffff" letter-spacing="2">
          <textPath href="#archPath" startOffset="50%" text-anchor="middle">
            ${curvedTitle}
          </textPath>
        </text>

        <!-- 2. Seamlessly cover old honey dipper & "Honey" text (x: 248..752, y: 550..808) -->
        <path d="M 250 550 Q 500 505 750 550 L 750 808 L 250 808 Z" fill="url(#honeyGrad)"/>

        <!-- Honeycomb Geometric Pattern Texture -->
        <g opacity="0.16" stroke="#78350f" stroke-width="1.8" fill="none">
          ${Array.from({ length: 7 }).flatMap((_, row) => 
            Array.from({ length: 9 }).map((_, col) => {
              const cx = 270 + col * 55 + (row % 2) * 27;
              const cy = 565 + row * 38;
              return `<polygon points="${cx},${cy-18} ${cx+16},${cy-9} ${cx+16},${cy+9} ${cx},${cy+18} ${cx-16},${cy+9} ${cx-16},${cy-9}"/>`;
            })
          ).join('')}
        </g>

        <!-- Center Ghee Pot / Handi with Bilona Spoon (filter=potGlow) -->
        <g filter="url(#potGlow)" transform="translate(500, 630)">
          <!-- Golden Aura Glow -->
          <ellipse cx="0" cy="5" rx="120" ry="75" fill="#fef08a" opacity="0.95"/>
          
          <!-- Earthen Pot / Brass Matka Base -->
          <ellipse cx="0" cy="15" rx="75" ry="26" fill="#78350f"/>
          <path d="M -75 15 Q -85 58 -45 74 Q 0 82 45 74 Q 85 58 75 15 Z" fill="#92400e"/>
          <ellipse cx="0" cy="15" rx="66" ry="21" fill="#b45309"/>
          
          <!-- Golden Granular Ghee -->
          <ellipse cx="0" cy="14" rx="60" ry="18" fill="#fde047"/>
          <ellipse cx="-10" cy="11" rx="40" ry="10" fill="#ffffff" opacity="0.85"/>
          
          <!-- Wooden Bilona Spoon -->
          <line x1="16" y1="-42" x2="0" y2="12" stroke="#78350f" stroke-width="9" stroke-linecap="round"/>
          <circle cx="16" cy="-42" r="7" fill="#451a03"/>
          
          <!-- "BILONA A2" Green Badge -->
          <g transform="translate(-90, -25)">
            <rect width="80" height="24" rx="12" fill="#15803d"/>
            <text x="40" y="16" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="10" text-anchor="middle" letter-spacing="0.5">BILONA A2</text>
          </g>
        </g>

        <!-- Large Stylized Script Text (Matching "Honey" in reference with white border and dark drop shadow) -->
        <g transform="translate(500, 775)">
          <!-- Deep Shadow -->
          <text x="3" y="4" fill="#2e1810" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="58" text-anchor="middle">${scriptName}</text>
          <!-- Thick Crisp White Border -->
          <text x="0" y="0" fill="#ffffff" stroke="#ffffff" stroke-width="14" stroke-linejoin="round" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="58" text-anchor="middle">${scriptName}</text>
          <!-- Rich Dark Brown Inner Lettering -->
          <text x="0" y="0" fill="#3a1e12" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="58" text-anchor="middle">${scriptName}</text>
        </g>
      </svg>
    `);
  }

  // Generate Buffalo Ghee
  console.log('Generating exact-fit Buffalo Ghee jar...');
  const buffaloSvg = buildSeamlessOverlay('PURE BUFFALO GHEE', 'Buffalo Ghee');
  const buffaloPath = path.join(outDir, 'buffalo_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: buffaloSvg, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(buffaloPath);
  console.log('Saved:', buffaloPath);

  // Generate Cow Ghee
  console.log('Generating exact-fit Cow Ghee jar...');
  const cowSvg = buildSeamlessOverlay('PURE COW GHEE', 'Cow Ghee');
  const cowPath = path.join(outDir, 'cow_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: cowSvg, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(cowPath);
  console.log('Saved:', cowPath);

  // Copy to frontend
  if (fs.existsSync(frontDir)) {
    fs.copyFileSync(buffaloPath, path.join(frontDir, 'buffalo_ghee_front.jpg'));
    fs.copyFileSync(cowPath, path.join(frontDir, 'cow_ghee_front.jpg'));
    console.log('Copied both jars to frontend/assets/images/products');
  }
}

createSeamlessGheeJars().catch(console.error);
