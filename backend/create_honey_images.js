const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createHoneyImages() {
  console.log('Generating high-res Honey Front & Back images...');

  // 1. HONEY FRONT JAR IMAGE (1024x1024)
  const honeyFrontSvg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background studio gradient -->
      <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="70%" stop-color="#f8f9fa"/>
        <stop offset="100%" stop-color="#e9ecef"/>
      </radialGradient>

      <!-- Glass Jar Gradients -->
      <linearGradient id="honeyBody" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#995804"/>
        <stop offset="15%" stop-color="#d97706"/>
        <stop offset="35%" stop-color="#f59e0b"/>
        <stop offset="65%" stop-color="#fbbf24"/>
        <stop offset="85%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>

      <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
        <stop offset="25%" stop-color="#ffffff" stop-opacity="0.1"/>
        <stop offset="75%" stop-color="#ffffff" stop-opacity="0.0"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.4"/>
      </linearGradient>

      <linearGradient id="goldLid" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#78350f"/>
        <stop offset="20%" stop-color="#d97706"/>
        <stop offset="40%" stop-color="#fef08a"/>
        <stop offset="60%" stop-color="#f59e0b"/>
        <stop offset="80%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#451a03"/>
      </linearGradient>

      <linearGradient id="labelBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0e3820"/>
        <stop offset="100%" stop-color="#062413"/>
      </linearGradient>

      <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#000000" flood-opacity="0.25"/>
      </filter>
    </defs>

    <!-- Studio Background -->
    <rect width="1024" height="1024" fill="url(#bgGrad)"/>

    <!-- Ground Floor Shadow -->
    <ellipse cx="512" cy="890" rx="280" ry="32" fill="#000000" opacity="0.18"/>
    <ellipse cx="512" cy="880" rx="220" ry="18" fill="#000000" opacity="0.12"/>

    <!-- JAR GROUP -->
    <g filter="url(#shadow)">
      <!-- Jar Glass Body -->
      <rect x="292" y="240" width="440" height="630" rx="60" fill="url(#honeyBody)"/>
      <rect x="292" y="240" width="440" height="630" rx="60" fill="url(#glassReflection)"/>

      <!-- Jar Neck & Collar -->
      <rect x="342" y="190" width="340" height="70" rx="15" fill="url(#honeyBody)"/>
      <rect x="342" y="190" width="340" height="70" rx="15" fill="url(#glassReflection)"/>

      <!-- Gold Metal Lid -->
      <rect x="312" y="125" width="400" height="85" rx="20" fill="url(#goldLid)"/>
      <!-- Lid Rim Details -->
      <line x1="312" y1="185" x2="712" y2="185" stroke="#fef08a" stroke-width="3" opacity="0.6"/>
      <line x1="312" y1="135" x2="712" y2="135" stroke="#ffffff" stroke-width="4" opacity="0.8"/>

      <!-- Freshness Seal Strip -->
      <rect x="477" y="90" width="70" height="150" fill="#0e3820" rx="4"/>
      <text x="512" y="170" fill="#fef08a" font-family="Arial, sans-serif" font-weight="bold" font-size="13" text-anchor="middle" letter-spacing="2" transform="rotate(-90 512 170)">SEALED</text>

      <!-- Glass Thickness Base -->
      <path d="M 292 810 Q 512 830 732 810 L 732 820 Q 732 870 672 870 L 352 870 Q 292 870 292 820 Z" fill="#b45309" opacity="0.7"/>

      <!-- FRONT LABEL -->
      <!-- Label Gold Border Background -->
      <rect x="337" y="340" width="350" height="460" rx="20" fill="#fef08a" stroke="#d97706" stroke-width="3"/>
      <!-- Label Dark Green Inner Body -->
      <rect x="342" y="345" width="340" height="450" rx="18" fill="url(#labelBg)"/>
      <!-- Gold Inner Inset Border -->
      <rect x="350" y="353" width="324" height="434" rx="14" fill="none" stroke="#d97706" stroke-width="1.5"/>

      <!-- Top Emblem Brand Box -->
      <path d="M 432 385 L 592 385 Q 602 385 607 395 L 612 415 Q 617 425 607 435 L 592 445 L 432 445 L 417 435 Q 407 425 412 415 L 417 395 Q 422 385 432 385 Z" fill="#062413" stroke="#fef08a" stroke-width="1.5"/>
      <text x="512" y="415" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="22" text-anchor="middle" letter-spacing="3">ARSHITH</text>
      <!-- Pink Dot on I -->
      <circle cx="538" cy="402" r="3.5" fill="#e11d48"/>
      <!-- Underline -->
      <line x1="462" y1="424" x2="562" y2="424" stroke="#ffffff" stroke-width="1.5"/>

      <text x="512" y="468" fill="#fef08a" font-family="Georgia, serif" font-size="12" text-anchor="middle" letter-spacing="1">-THE BEST IS INSIDE-</text>

      <!-- Ribbon Subheader -->
      <text x="512" y="500" fill="#ffffff" font-family="Georgia, serif" font-style="italic" font-size="13" text-anchor="middle">Naturally Pure, Freshly Delivered</text>

      <!-- Main Product Title -->
      <text x="512" y="550" fill="#fef08a" font-family="Georgia, serif" font-weight="bold" font-size="28" text-anchor="middle" letter-spacing="1">RAW WILD</text>
      <text x="512" y="585" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="32" text-anchor="middle" letter-spacing="2">HONEY</text>

      <!-- Category Pill -->
      <rect x="372" y="615" width="280" height="34" rx="17" fill="#fef08a"/>
      <text x="512" y="638" fill="#062413" font-family="Arial, sans-serif" font-weight="bold" font-size="14" text-anchor="middle" letter-spacing="1.5">100% UNPROCESSED</text>

      <!-- USP Details -->
      <text x="512" y="685" fill="#ffffff" font-family="Georgia, serif" font-size="14" text-anchor="middle">100% NATURAL • NO ADDED SUGAR</text>
      <line x1="392" y1="705" x2="632" y2="705" stroke="#fef08a" stroke-width="1" opacity="0.4"/>

      <!-- FSSAI & Net Content -->
      <text x="512" y="735" fill="#fef08a" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="20" text-anchor="middle">fssai</text>
      <text x="512" y="755" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">Lic. No. 10022011000543</text>
      <text x="512" y="774" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="13" text-anchor="middle">NET WEIGHT: 500 g (370 ml)</text>

      <!-- Vertical Glass Highlight -->
      <rect x="312" y="270" width="30" height="570" rx="15" fill="#ffffff" opacity="0.25"/>
    </g>

    <!-- Wooden Honey Dipper Side Graphic -->
    <g transform="translate(680, 580) rotate(-35)">
      <ellipse cx="60" cy="180" rx="40" ry="20" fill="#000000" opacity="0.1"/>
      <!-- Dipper Handle -->
      <rect x="55" y="10" width="10" height="160" rx="5" fill="#b45309"/>
      <!-- Dipper Head Ribs -->
      <rect x="40" y="130" width="40" height="12" rx="4" fill="#78350f"/>
      <rect x="35" y="145" width="50" height="14" rx="5" fill="#92400e"/>
      <rect x="38" y="162" width="44" height="13" rx="4" fill="#78350f"/>
      <rect x="42" y="178" width="36" height="10" rx="4" fill="#92400e"/>
      <!-- Drizzling Honey -->
      <path d="M 60 190 Q 65 220 58 240 Q 55 255 60 260 Q 65 255 62 240 Z" fill="#fbbf24"/>
      <circle cx="60" cy="275" r="7" fill="#fbbf24"/>
    </g>
  </svg>
  `;

  // 2. HONEY BACK INFOGRAPHIC (1024x1024)
  const honeyBackSvg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="drop" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>

    <!-- 50/50 Straight Split Background -->
    <rect x="0" y="0" width="512" height="1024" fill="#1b4d3e"/>
    <rect x="512" y="0" width="512" height="1024" fill="#fbf7ee"/>

    <!-- Subtle Tree Watermark Left -->
    <g opacity="0.08" fill="#ffffff" transform="translate(60, 200) scale(1.4)">
      <path d="M 150 0 C 80 0 30 60 50 120 C 10 160 20 220 70 250 C 40 300 80 370 140 370 L 140 450 L 160 450 L 160 370 C 220 370 260 300 230 250 C 280 220 290 160 250 120 C 270 60 220 0 150 0 Z"/>
    </g>

    <!-- Subtle Foliage Watermark Right -->
    <g opacity="0.07" fill="#1b4d3e" transform="translate(600, 200) scale(1.4)">
      <path d="M 150 0 C 80 0 30 60 50 120 C 10 160 20 220 70 250 C 40 300 80 370 140 370 L 140 450 L 160 450 L 160 370 C 220 370 260 300 230 250 C 280 220 290 160 250 120 C 270 60 220 0 150 0 Z"/>
    </g>

    <!-- LEFT HEADER PILL -->
    <g transform="translate(50, 60)">
      <rect width="412" height="100" rx="50" fill="#ffffff"/>
      <text x="206" y="48" fill="#1b4d3e" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">ARSHITH RAW</text>
      <text x="206" y="80" fill="#1b4d3e" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">WILD HONEY</text>
    </g>

    <!-- RIGHT HEADER PILL -->
    <g transform="translate(562, 60)">
      <rect width="412" height="100" rx="50" fill="#1b4d3e"/>
      <text x="206" y="48" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">ORDINARY</text>
      <text x="206" y="80" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="25" text-anchor="middle" letter-spacing="1">HONEY</text>
    </g>

    <!-- LEFT BULLET POINTS & ARROWS -->
    <!-- Point 1 -->
    <path d="M 330 230 Q 300 220 280 245 L 290 245 M 280 245 L 285 235" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="256" y="295" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">Made with 100% pure raw,</text>
    <text x="256" y="325" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">unfiltered forest honey</text>

    <!-- Point 2 -->
    <path d="M 230 390 Q 200 380 180 405 L 190 405 M 180 405 L 185 395" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="256" y="465" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">Directly sourced from</text>
    <text x="256" y="495" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">indigenous wild hives</text>

    <!-- Point 3 -->
    <path d="M 230 580 Q 200 570 180 595 L 190 595 M 180 595 L 185 585" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="256" y="655" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">Zero corn syrup, sugar,</text>
    <text x="256" y="685" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">or artificial sweeteners</text>

    <!-- Point 4 -->
    <path d="M 270 780 Q 240 790 250 820 L 242 815 M 250 820 L 258 815" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="256" y="875" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">Rich in natural enzymes,</text>
    <text x="256" y="905" fill="#ffffff" font-family="Georgia, serif" font-size="22" text-anchor="middle">pollen &amp; antioxidants</text>

    <!-- RIGHT BULLET POINTS & ARROWS -->
    <!-- Point 1 -->
    <path d="M 690 230 Q 720 220 740 245 L 730 245 M 740 245 L 735 235" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="768" y="295" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">Diluted with high-fructose</text>
    <text x="768" y="325" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">corn or rice syrup</text>

    <!-- Point 2 -->
    <path d="M 790 390 Q 820 400 810 430 L 818 425 M 810 430 L 802 425" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="768" y="465" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">Ultra-filtered and boiled,</text>
    <text x="768" y="495" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">destroying pollen &amp; nutrients</text>

    <!-- Point 3 -->
    <path d="M 790 600 Q 820 610 810 640 L 818 635 M 810 640 L 802 635" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="768" y="675" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">Often watery or crystallized</text>
    <text x="768" y="705" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">with synthetic colors</text>

    <!-- Point 4 -->
    <path d="M 750 780 Q 780 790 770 820 L 778 815 M 770 820 L 762 815" stroke="#1b4d3e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="768" y="865" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">No clarity on hive origin</text>
    <text x="768" y="895" fill="#2d3748" font-family="Georgia, serif" font-size="22" text-anchor="middle">or purity verification</text>

    <!-- CENTER ELEMENT: HONEY POT WITH DIPPER (filter=drop) -->
    <g filter="url(#drop)" transform="translate(512, 530)">
      <!-- Bowl shadow -->
      <ellipse cx="0" cy="115" rx="140" ry="25" fill="#000000" opacity="0.3"/>

      <!-- Traditional Clay Pot / Brass Bowl -->
      <ellipse cx="0" cy="20" rx="145" ry="50" fill="#78350f"/>
      <path d="M -145 20 Q -155 90 -90 120 Q 0 135 90 120 Q 155 90 145 20 Z" fill="#92400e"/>
      <ellipse cx="0" cy="20" rx="135" ry="40" fill="#b45309"/>

      <!-- Liquid Golden Amber Honey Inside -->
      <ellipse cx="0" cy="25" rx="125" ry="34" fill="#f59e0b"/>
      <ellipse cx="-15" cy="22" rx="90" ry="22" fill="#fbbf24"/>
      <ellipse cx="-20" cy="20" rx="50" ry="12" fill="#fef08a" opacity="0.6"/>

      <!-- Wooden Honey Dipper Dipping In -->
      <g transform="translate(20, -70) rotate(45)">
        <rect x="-8" y="-120" width="16" height="150" rx="8" fill="#d97706"/>
        <rect x="-24" y="20" width="48" height="16" rx="6" fill="#92400e"/>
        <rect x="-30" y="38" width="60" height="18" rx="7" fill="#b45309"/>
        <rect x="-26" y="58" width="52" height="16" rx="6" fill="#92400e"/>
        <rect x="-20" y="76" width="40" height="14" rx="5" fill="#b45309"/>
        <!-- Dripping Golden Honey Coating -->
        <path d="M -25 45 Q 0 100 20 85 Q 35 110 0 120 Q -30 110 -25 45 Z" fill="#fbbf24" opacity="0.9"/>
        <circle cx="5" cy="135" r="9" fill="#f59e0b"/>
      </g>
    </g>

    <!-- BOTTOM RIGHT ARSHITH LOGO BADGE -->
    <g transform="translate(740, 880)">
      <rect width="230" height="85" rx="10" fill="#0e3820" stroke="#0e3820" stroke-width="2"/>
      <rect x="6" y="6" width="218" height="73" rx="7" fill="none" stroke="#ffffff" stroke-width="2"/>
      <text x="115" y="53" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="28" text-anchor="middle" letter-spacing="3">ARSHITH</text>
      <!-- Pink Dot on I -->
      <circle cx="150" cy="38" r="4.5" fill="#e11d48"/>
      <!-- Underline -->
      <line x1="55" y1="64" x2="175" y2="64" stroke="#ffffff" stroke-width="2"/>
    </g>
  </svg>
  `;

  // Render using sharp to JPEG
  const outDir = path.resolve('../assets/images/products');
  const frontJpg = path.join(outDir, 'natural_honey_front.jpg');
  const backJpg = path.join(outDir, 'natural_honey_back.jpg');

  await sharp(Buffer.from(honeyFrontSvg))
    .jpeg({ quality: 95 })
    .toFile(frontJpg);
  console.log('Created:', frontJpg);

  await sharp(Buffer.from(honeyBackSvg))
    .jpeg({ quality: 95 })
    .toFile(backJpg);
  console.log('Created:', backJpg);

  // Copy to frontend as well
  const frontEndDir = path.resolve('../frontend/assets/images/products');
  if (fs.existsSync(frontEndDir)) {
    fs.copyFileSync(frontJpg, path.join(frontEndDir, 'natural_honey_front.jpg'));
    fs.copyFileSync(backJpg, path.join(frontEndDir, 'natural_honey_back.jpg'));
    console.log('Copied to frontend/assets/images/products');
  }
}

createHoneyImages().catch(console.error);
