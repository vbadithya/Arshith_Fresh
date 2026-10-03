const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildAuthenticGheeJars() {
  const honeySrc = 'C:\\Users\\KRANTI\\.gemini\\antigravity-ide\\brain\\825c2531-0eff-4b78-80d4-3401ae54cf02\\.user_uploaded\\media_1791011795632.png';
  const outDir = path.resolve('../assets/images/products');
  const frontDir = path.resolve('../frontend/assets/images/products');

  function createLabelSvg({ curvedTitle, scriptName, gheePotColor = '#facc15' }) {
    return Buffer.from(`
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="potShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>

        <!-- 1. Mask over old "NATURAL HONEY" curved text on dark brown arch (y=455 to 540) -->
        <path d="M 338 520 Q 505 450 672 520 L 672 550 Q 505 480 338 550 Z" fill="#2e1810"/>
        
        <!-- Curved Title: "DESI BUFFALO GHEE" / "DESI COW GHEE" -->
        <path id="curvePath" d="M 345 528 Q 505 460 665 528" fill="none"/>
        <text font-family="Georgia, serif" font-weight="bold" font-size="25" fill="#fef08a" letter-spacing="1.5">
          <textPath href="#curvePath" startOffset="50%" text-anchor="middle">
            ${curvedTitle}
          </textPath>
        </text>

        <!-- 2. Mask over old honey dipper & "Honey" text in the yellow card (x: 338..672, y: 545..804) -->
        <!-- Seamlessly preserves the exact yellow honeycomb border and curved arch -->
        <path d="M 338 550 Q 505 510 672 550 L 672 805 L 338 805 Z" fill="#f59e0b"/>
        <path d="M 342 554 Q 505 515 668 554 L 668 801 L 342 801 Z" fill="#facc15"/>

        <!-- Center Ghee Pot Illustration with PotShadow -->
        <g filter="url(#potShadow)" transform="translate(505, 625)">
          <!-- Creamy Golden Glow Background -->
          <ellipse cx="0" cy="0" rx="100" ry="65" fill="#fef08a" opacity="0.95"/>
          
          <!-- Traditional Clay / Brass Handi -->
          <ellipse cx="0" cy="10" rx="60" ry="20" fill="#b45309"/>
          <path d="M -60 10 Q -70 48 -35 60 Q 0 66 35 60 Q 70 48 60 10 Z" fill="#d97706"/>
          <!-- Danedar Golden Ghee -->
          <ellipse cx="0" cy="9" rx="52" ry="16" fill="${gheePotColor}"/>
          <ellipse cx="-8" cy="7" rx="30" ry="8" fill="#ffffff" opacity="0.8"/>
          <!-- Wooden Bilona Churner / Spoon -->
          <line x1="12" y1="-38" x2="0" y2="10" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
          <circle cx="12" cy="-38" r="5" fill="#451a03"/>
          <!-- "A2 BILONA" Green Badge -->
          <g transform="translate(-75, -20)">
            <rect width="65" height="20" rx="10" fill="#15803d"/>
            <text x="32" y="14" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="8" text-anchor="middle" letter-spacing="0.5">A2 BILONA</text>
          </g>
        </g>

        <!-- Bold Stylized Name: "Buffalo Ghee" / "Cow Ghee" (Matching Honey Typography) -->
        <g transform="translate(505, 765)">
          <!-- Drop Shadow -->
          <text x="2" y="4" fill="#2e1810" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="52" text-anchor="middle">${scriptName}</text>
          <!-- White Outer Border -->
          <text x="0" y="0" fill="#ffffff" stroke="#ffffff" stroke-width="10" stroke-linejoin="round" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="52" text-anchor="middle">${scriptName}</text>
          <!-- Dark Brown Inner Text -->
          <text x="0" y="0" fill="#3a1e12" font-family="Arial Black, Impact, sans-serif" font-weight="bold" font-size="52" text-anchor="middle">${scriptName}</text>
        </g>
      </svg>
    `);
  }

  // 1. BUFFALO GHEE FRONT JAR
  console.log('Building Buffalo Ghee Front Jar from Honey photo...');
  const buffaloSvg = createLabelSvg({
    curvedTitle: 'PURE BUFFALO GHEE',
    scriptName: 'Buffalo Ghee',
    gheePotColor: '#fef08a'
  });
  const buffaloFrontPath = path.join(outDir, 'buffalo_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: buffaloSvg, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(buffaloFrontPath);
  console.log('Saved:', buffaloFrontPath);

  // 2. COW GHEE FRONT JAR
  console.log('Building Cow Ghee Front Jar from Honey photo...');
  const cowSvg = createLabelSvg({
    curvedTitle: 'PURE COW GHEE',
    scriptName: 'Cow Ghee',
    gheePotColor: '#fde047'
  });
  const cowFrontPath = path.join(outDir, 'cow_ghee_front.jpg');
  await sharp(honeySrc)
    .composite([{ input: cowSvg, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toFile(cowFrontPath);
  console.log('Saved:', cowFrontPath);

  // Copy to frontend
  if (fs.existsSync(frontDir)) {
    fs.copyFileSync(buffaloFrontPath, path.join(frontDir, 'buffalo_ghee_front.jpg'));
    fs.copyFileSync(cowFrontPath, path.join(frontDir, 'cow_ghee_front.jpg'));
    console.log('Copied both jars to frontend/assets/images/products');
  }
}

buildAuthenticGheeJars().catch(console.error);
