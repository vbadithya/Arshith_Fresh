const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createGheeAssets() {
  console.log('Generating matching Cow Ghee & Buffalo Ghee jars and infographics...');

  // Helper function to build Jar SVG matching the Honey Jar reference
  function getGheeJarSvg({ type, title, subtitle, scriptName, gheeGradColors, lidColor = '#facc15' }) {
    return `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="studioBg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="75%" stop-color="#f8f9fa"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>

        <linearGradient id="gheeBody_${type}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${gheeGradColors[0]}"/>
          <stop offset="15%" stop-color="${gheeGradColors[1]}"/>
          <stop offset="35%" stop-color="${gheeGradColors[2]}"/>
          <stop offset="65%" stop-color="${gheeGradColors[3]}"/>
          <stop offset="85%" stop-color="${gheeGradColors[1]}"/>
          <stop offset="100%" stop-color="${gheeGradColors[0]}"/>
        </linearGradient>

        <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
          <stop offset="20%" stop-color="#ffffff" stop-opacity="0.1"/>
          <stop offset="80%" stop-color="#ffffff" stop-opacity="0.0"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.35"/>
        </linearGradient>

        <linearGradient id="yellowLid" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ca8a04"/>
          <stop offset="20%" stop-color="#fde047"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="80%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#a16207"/>
        </linearGradient>

        <filter id="jarShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="25" stdDeviation="22" flood-color="#000000" flood-opacity="0.22"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1024" height="1024" fill="url(#studioBg)"/>

      <!-- Floor Shadows -->
      <ellipse cx="512" cy="940" rx="300" ry="32" fill="#000000" opacity="0.18"/>
      <ellipse cx="512" cy="930" rx="230" ry="18" fill="#000000" opacity="0.12"/>

      <!-- JAR GROUP -->
      <g filter="url(#jarShadow)">
        <!-- Glass Jar Outline / Ghee Content -->
        <rect x="262" y="180" width="500" height="730" rx="75" fill="url(#gheeBody_${type})"/>
        <rect x="262" y="180" width="500" height="730" rx="75" fill="url(#glassShine)"/>

        <!-- Glass Shoulder & Neck -->
        <rect x="282" y="150" width="460" height="70" rx="25" fill="url(#gheeBody_${type})"/>
        <rect x="282" y="150" width="460" height="70" rx="25" fill="url(#glassShine)"/>

        <!-- Top Yellow Cap -->
        <rect x="252" y="35" width="520" height="140" rx="28" fill="url(#yellowLid)"/>
        <!-- Cap Vertical Ribs Texture -->
        ${Array.from({ length: 26 }).map((_, i) => `<line x1="${272 + i * 19}" y1="50" x2="${272 + i * 19}" y2="160" stroke="#a16207" stroke-width="2.5" opacity="0.45"/>`).join('')}
        <line x1="252" y1="45" x2="772" y2="45" stroke="#fef08a" stroke-width="5" opacity="0.8"/>
        <line x1="252" y1="165" x2="772" y2="165" stroke="#854d0e" stroke-width="4" opacity="0.7"/>

        <!-- FRONT ARCHED LABEL (Matching Honey Reference) -->
        <!-- Label Brown Arched Header Container -->
        <path d="M 332 320 Q 512 210 692 320 L 692 860 Q 512 870 332 860 Z" fill="#3a1e12" stroke="#23120b" stroke-width="3"/>
        
        <!-- Label Yellow Lower Body -->
        <path d="M 332 540 Q 512 500 692 540 L 692 860 L 332 860 Z" fill="#facc15"/>

        <!-- Top Arshith Logo Emblem Badge -->
        <g transform="translate(407, 285)">
          <path d="M 15 0 L 195 0 Q 210 0 215 15 L 220 40 Q 225 55 210 70 L 195 70 L 15 70 L 0 70 Q -15 55 -10 40 L -5 15 Q 0 0 15 0 Z" fill="#0e3820" stroke="#ffffff" stroke-width="2.5"/>
          <text x="105" y="46" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="28" text-anchor="middle" letter-spacing="3">ARSHITH</text>
          <!-- Pink dot on I -->
          <circle cx="140" cy="31" r="4.5" fill="#e11d48"/>
          <!-- Logo underline -->
          <line x1="50" y1="57" x2="160" y2="57" stroke="#ffffff" stroke-width="2"/>
        </g>

        <!-- Vegetarian Logo Mark -->
        <rect x="635" y="440" width="34" height="34" fill="#ffffff" stroke="#15803d" stroke-width="2" rx="3"/>
        <circle cx="652" cy="457" r="9" fill="#15803d"/>

        <!-- Arched Top Text: "NATURAL GHEE" or "DESI COW GHEE" -->
        <text x="512" y="475" fill="#fef08a" font-family="Georgia, serif" font-weight="bold" font-size="28" text-anchor="middle" letter-spacing="2">${title}</text>
        <text x="512" y="510" fill="#ffffff" font-family="Georgia, serif" font-size="16" text-anchor="middle" letter-spacing="1">${subtitle}</text>

        <!-- Center Round Illustration Vignette -->
        <ellipse cx="512" cy="635" rx="140" ry="105" fill="#fef08a" opacity="0.6"/>
        
        <!-- Bilona / Ghee Pot Icon Graphic -->
        <g transform="translate(512, 630)">
          <!-- Traditional Brass Pot -->
          <ellipse cx="0" cy="15" rx="70" ry="25" fill="#b45309"/>
          <path d="M -70 15 Q -80 60 -45 75 Q 0 85 45 75 Q 80 60 70 15 Z" fill="#d97706"/>
          <!-- Ghee overflow texture -->
          <ellipse cx="0" cy="15" rx="62" ry="20" fill="#fde047"/>
          <ellipse cx="0" cy="12" rx="35" ry="10" fill="#ffffff" opacity="0.7"/>
          <!-- Wooden Bilona Churner / Spoon -->
          <line x1="0" y1="-50" x2="0" y2="15" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
          <rect x="-18" y="-10" width="36" height="12" rx="4" fill="#92400e"/>
        </g>

        <!-- Script Product Name: "Cow Ghee" or "Buffalo Ghee" -->
        <text x="512" y="775" fill="#3a1e12" font-family="Brush Script MT, cursive, Georgia, serif" font-weight="bold" font-size="58" text-anchor="middle">${scriptName}</text>
        <text x="512" y="775" fill="#ffffff" font-family="Brush Script MT, cursive, Georgia, serif" font-weight="bold" font-size="58" text-anchor="middle" stroke="#3a1e12" stroke-width="1.5" fill-opacity="0">${scriptName}</text>

        <!-- Green Bottom Bar: "100% PURITY GUARANTEED" -->
        <rect x="332" y="805" width="360" height="55" fill="#0e3820"/>
        <text x="512" y="841" fill="#facc15" font-family="Arial, sans-serif" font-weight="bold" font-size="18" text-anchor="middle" letter-spacing="2">100% PURITY GUARANTEED</text>

        <!-- Glass Highlights -->
        <rect x="282" y="210" width="35" height="660" rx="17" fill="#ffffff" opacity="0.3"/>
      </g>
    </svg>
    `;
  }

  // Helper for Comparison Infographic (50/50 straight split)
  function getGheeInfographicSvg({ brandTitle, bulletLeft, bulletRight, gheePotColor = '#facc15' }) {
    return `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>

      <!-- 50/50 Split Background -->
      <rect x="0" y="0" width="512" height="1024" fill="#1b4d3e"/>
      <rect x="512" y="0" width="512" height="1024" fill="#fbf7ee"/>

      <!-- Watermarks -->
      <g opacity="0.08" fill="#ffffff" transform="translate(60, 200) scale(1.4)">
        <path d="M 150 0 C 80 0 30 60 50 120 C 10 160 20 220 70 250 C 40 300 80 370 140 370 L 140 450 L 160 450 L 160 370 C 220 370 260 300 230 250 C 280 220 290 160 250 120 C 270 60 220 0 150 0 Z"/>
      </g>
      <g opacity="0.07" fill="#1b4d3e" transform="translate(600, 200) scale(1.4)">
        <path d="M 150 0 C 80 0 30 60 50 120 C 10 160 20 220 70 250 C 40 300 80 370 140 370 L 140 450 L 160 450 L 160 370 C 220 370 260 300 230 250 C 280 220 290 160 250 120 C 270 60 220 0 150 0 Z"/>
      </g>

      <!-- Left Header Pill -->
      <g transform="translate(50, 60)">
        <rect width="412" height="100" rx="50" fill="#ffffff"/>
        <text x="206" y="48" fill="#1b4d3e" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">ARSHITH</text>
        <text x="206" y="80" fill="#1b4d3e" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">${brandTitle}</text>
      </g>

      <!-- Right Header Pill -->
      <g transform="translate(562, 60)">
        <rect width="412" height="100" rx="50" fill="#1b4d3e"/>
        <text x="206" y="48" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">ORDINARY</text>
        <text x="206" y="80" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">GHEE</text>
      </g>

      <!-- Left Bullet Points & Arrows -->
      <path d="M 330 230 Q 300 220 280 245 L 290 245 M 280 245 L 285 235" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="256" y="295" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[0][0]}</text>
      <text x="256" y="325" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[0][1]}</text>

      <path d="M 230 390 Q 200 380 180 405 L 190 405 M 180 405 L 185 395" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="256" y="465" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[1][0]}</text>
      <text x="256" y="495" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[1][1]}</text>

      <path d="M 230 580 Q 200 570 180 595 L 190 595 M 180 595 L 185 585" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="256" y="655" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[2][0]}</text>
      <text x="256" y="685" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[2][1]}</text>

      <path d="M 270 780 Q 240 790 250 820 L 242 815 M 250 820 L 258 815" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="256" y="875" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[3][0]}</text>
      <text x="256" y="905" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletLeft[3][1]}</text>

      <!-- Right Bullet Points & Arrows -->
      <path d="M 690 230 Q 720 220 740 245 L 730 245 M 740 245 L 735 235" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="768" y="295" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[0][0]}</text>
      <text x="768" y="325" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[0][1]}</text>

      <path d="M 790 390 Q 820 400 810 430 L 818 425 M 810 430 L 802 425" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="768" y="465" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[1][0]}</text>
      <text x="768" y="495" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[1][1]}</text>

      <path d="M 790 600 Q 820 610 810 640 L 818 635 M 810 640 L 802 635" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="768" y="675" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[2][0]}</text>
      <text x="768" y="705" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[2][1]}</text>

      <path d="M 750 780 Q 780 790 770 820 L 778 815 M 770 820 L 762 815" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="768" y="865" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[3][0]}</text>
      <text x="768" y="895" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">${bulletRight[3][1]}</text>

      <!-- Center Brass Vessel Element -->
      <g filter="url(#dropShadow)" transform="translate(512, 530)">
        <ellipse cx="0" cy="115" rx="140" ry="25" fill="#000000" opacity="0.3"/>
        <ellipse cx="0" cy="20" rx="145" ry="50" fill="#b45309"/>
        <path d="M -145 20 Q -155 90 -90 120 Q 0 135 90 120 Q 155 90 145 20 Z" fill="#d97706"/>
        <ellipse cx="0" cy="20" rx="135" ry="40" fill="#b45309"/>
        <!-- Golden Granular Ghee -->
        <ellipse cx="0" cy="25" rx="125" ry="34" fill="${gheePotColor}"/>
        <ellipse cx="-15" cy="22" rx="90" ry="22" fill="#fef08a"/>
        <ellipse cx="-20" cy="20" rx="50" ry="12" fill="#ffffff" opacity="0.8"/>
        <!-- Wooden spoon -->
        <g transform="translate(20, -70) rotate(45)">
          <rect x="-8" y="-120" width="16" height="150" rx="8" fill="#78350f"/>
          <ellipse cx="0" cy="50" rx="35" ry="50" fill="#92400e"/>
          <ellipse cx="0" cy="50" rx="28" ry="40" fill="${gheePotColor}"/>
        </g>
      </g>

      <!-- Bottom Right Logo Badge -->
      <g transform="translate(740, 880)">
        <rect width="230" height="85" rx="10" fill="#0e3820" stroke="#0e3820" stroke-width="2"/>
        <rect x="6" y="6" width="218" height="73" rx="7" fill="none" stroke="#ffffff" stroke-width="2"/>
        <text x="115" y="53" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="28" text-anchor="middle" letter-spacing="3">ARSHITH</text>
        <circle cx="150" cy="38" r="4.5" fill="#e11d48"/>
        <line x1="55" y1="64" x2="175" y2="64" stroke="#ffffff" stroke-width="2"/>
      </g>
    </svg>
    `;
  }

  // Generate Cow Ghee Front Jar SVG
  const cowGheeFront = getGheeJarSvg({
    type: 'cow',
    title: 'DESI COW GHEE',
    subtitle: 'TRADITIONAL BILONA METHOD',
    scriptName: 'Cow Ghee',
    gheeGradColors: ['#b45309', '#f59e0b', '#fde047', '#fef08a']
  });

  // Generate Buffalo Ghee Front Jar SVG
  const buffaloGheeFront = getGheeJarSvg({
    type: 'buffalo',
    title: 'PURE BUFFALO GHEE',
    subtitle: 'TRADITIONAL BILONA METHOD',
    scriptName: 'Buffalo Ghee',
    gheeGradColors: ['#a16207', '#eab308', '#fef08a', '#fef9c3']
  });

  // Generate Cow Ghee Back Infographic SVG
  const cowGheeBack = getGheeInfographicSvg({
    brandTitle: 'COW GHEE',
    gheePotColor: '#facc15',
    bulletLeft: [
      ['Made from 100% pure A2 Gir', 'cow curd churned Bilona method'],
      ['Rich golden, natural danedar', '(granular) aromatic texture'],
      ['Zero palm oil, dalda, or', 'synthetic chemical essences'],
      ['Rich in authentic traditional', 'nutty aroma &amp; Vedic nutrients']
    ],
    bulletRight: [
      ['Made from commercial cream', '&amp; rapid machine boiling'],
      ['Watery or paste texture', 'without natural granules'],
      ['Adulterated with palm oil,', 'starch or artificial essence'],
      ['Lacks authentic digestive', 'qualities &amp; Vedic goodness']
    ]
  });

  // Generate Buffalo Ghee Back Infographic SVG
  const buffaloGheeBack = getGheeInfographicSvg({
    brandTitle: 'BUFFALO GHEE',
    gheePotColor: '#fef08a',
    bulletLeft: [
      ['Made from 100% pure rich A2', 'buffalo curd churned Bilona method'],
      ['Rich golden, thick danedar', '(granular) fragrant texture'],
      ['Zero palm oil, dalda, or', 'preservatives added'],
      ['High smoke point ideal for', 'traditional Indian sweets &amp; cooking']
    ],
    bulletRight: [
      ['Made with artificial milk fats', '&amp; continuous machine processing'],
      ['Flat, greasy paste texture', 'without traditional aroma'],
      ['Bulked with vegetable fat or', 'synthetic aroma enhancers'],
      ['Loses freshness quickly and', 'lacks authentic taste']
    ]
  });

  const outDir = path.resolve('../assets/images/products');
  const frontDir = path.resolve('../frontend/assets/images/products');

  const files = [
    { name: 'cow_ghee_front.jpg', svg: cowGheeFront },
    { name: 'cow_ghee_back.jpg', svg: cowGheeBack },
    { name: 'buffalo_ghee_front.jpg', svg: buffaloGheeFront },
    { name: 'buffalo_ghee_back.jpg', svg: buffaloGheeBack }
  ];

  for (const f of files) {
    const dest1 = path.join(outDir, f.name);
    await sharp(Buffer.from(f.svg)).jpeg({ quality: 95 }).toFile(dest1);
    console.log('Written:', dest1);
    if (fs.existsSync(frontDir)) {
      const dest2 = path.join(frontDir, f.name);
      fs.copyFileSync(dest1, dest2);
      console.log('Copied to frontend:', dest2);
    }
  }
}

createGheeAssets().catch(console.error);
