const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image 1 = Buffalo jar (media_1791019439149.jpg)
// Image 2 = Cow jar (media_1791019482856.png)
const BUFFALO_JAR = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02/.user_uploaded/media_1791019439149.jpg';
const COW_JAR = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02/.user_uploaded/media_1791019482856.png';

const TARGET_DIRS = [
  'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/assets/images/products',
  'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/frontend/assets/images/products',
];

// ─── Cow Ghee label style SVG overlay ───────────────────────────────────────
// The Cow Ghee jar (image 2) has:
//   - Arched label, black header with "ARSHITH -THE BEST IS INSIDE"
//   - Bold title, body text, cow icon, bowl illustration, 100% Natural badge
// We overlay this on top of the Cow jar (image 2) base, but changing text to BUFFALO.
// Cow jar label area: approx x=155..870, y=295..870 (1024x1024 image)

function makeCowStyleLabel(product) {
  const isBuffalo = product === 'buffalo';
  const title = isBuffalo ? 'PURE BUFFALO GHEE' : 'PURE COW GHEE';
  const body1 = isBuffalo ? 'Purely crafted without any artificial' : 'Purely crafted without any artificial';
  const body2 = isBuffalo ? 'additives or added aroma –' : 'additives or added aroma –';
  const body3 = isBuffalo ? 'just pure and natural goodness.' : 'just pure and natural goodness.';
  const badge1Text = isBuffalo ? 'Made From' : 'Made From';
  const badge1Sub = isBuffalo ? 'Buffalo Milk' : 'Cow Milk';
  const animalSvg = isBuffalo
    // simple buffalo silhouette
    ? `<path d="M 14 22 C 14 14, 20 10, 28 12 L 34 8 L 38 12 C 44 10, 50 14, 50 22 C 50 30, 44 36, 28 36 C 12 36, 14 30, 14 22 Z M 20 36 L 20 50 M 36 36 L 36 50 M 22 22 C 22 20, 24 18, 28 18 C 32 18, 34 20, 34 22" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>`
    // simple cow silhouette
    : `<path d="M 12 22 C 12 14, 18 10, 28 12 C 32 8, 36 8, 38 12 C 46 10, 52 16, 50 24 C 48 32, 40 36, 28 36 C 14 36, 12 30, 12 22 Z M 18 36 L 18 50 M 38 36 L 38 50 M 24 20 C 24 18, 26 16, 28 16 M 20 14 L 22 10 M 34 14 L 32 10" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="labelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffbe0"/>
      <stop offset="40%" stop-color="#ffe97a"/>
      <stop offset="100%" stop-color="#f5c800"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c47c3e"/>
      <stop offset="100%" stop-color="#7b4b1a"/>
    </linearGradient>
    <filter id="labelShadow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Label background: arched top, straight bottom -->
  <path d="M 175 568
           C 175 430, 265 330, 512 330
           C 759 330, 849 430, 849 568
           L 849 845
           C 849 862, 838 872, 820 872
           L 204 872
           C 186 872, 175 862, 175 845 Z"
        fill="url(#labelGrad)"
        filter="url(#labelShadow)"/>

  <!-- Header black arch -->
  <path d="M 175 568
           C 175 430, 265 330, 512 330
           C 759 330, 849 430, 849 568
           L 849 530
           C 849 390, 750 295, 512 295
           C 274 295, 175 390, 175 530 Z"
        fill="url(#headerGrad)"/>

  <!-- ARSHITH brand badge in header -->
  <!-- Hexagonal / shield badge -->
  <path d="M 380 345 L 644 345 C 658 345, 668 355, 664 370 L 650 415 C 646 428, 634 435, 618 435
           L 406 435 C 390 435, 378 428, 374 415 L 360 370 C 356 355, 366 345, 380 345 Z"
        fill="#1a1a1a"
        stroke="#c8a44a"
        stroke-width="4"/>
  <text x="512" y="400"
        font-family="'Arial Black', Impact, sans-serif"
        font-size="38"
        font-weight="900"
        letter-spacing="6"
        fill="#ffffff"
        text-anchor="middle">ARSHiTH</text>
  <circle cx="558" cy="377" r="5" fill="#d4aa45"/>

  <!-- -THE BEST IS INSIDE- text below badge -->
  <text x="512" y="458"
        font-family="'Arial', sans-serif"
        font-size="18"
        fill="#d4aa45"
        text-anchor="middle"
        letter-spacing="3">-THE BEST IS INSIDE</text>

  <!-- Divider gold line -->
  <line x1="210" y1="475" x2="814" y2="475" stroke="#c8a44a" stroke-width="2.5"/>

  <!-- MAIN PRODUCT TITLE -->
  <text x="512" y="530"
        font-family="'Arial Black', Impact, sans-serif"
        font-size="54"
        font-weight="900"
        fill="#1a0a00"
        text-anchor="middle">${title}</text>

  <!-- Divider line under title -->
  <line x1="210" y1="550" x2="814" y2="550" stroke="#c8a44a" stroke-width="2"/>

  <!-- Body description text -->
  <text x="512" y="590"
        font-family="'Arial', sans-serif"
        font-size="22"
        fill="#2e1800"
        text-anchor="middle">${body1}</text>
  <text x="512" y="618"
        font-family="'Arial', sans-serif"
        font-size="22"
        fill="#2e1800"
        text-anchor="middle">${body2}</text>
  <text x="512" y="646"
        font-family="'Arial', sans-serif"
        font-size="22"
        fill="#2e1800"
        text-anchor="middle">${body3}</text>

  <!-- Left column: badges -->
  <!-- Badge 1: Animal icon -->
  <circle cx="252" cy="718" r="44" fill="#1a1a1a"/>
  <g transform="translate(228,694)">${animalSvg}</g>
  <text x="252" y="776"
        font-family="'Arial Black', sans-serif"
        font-size="15"
        font-weight="900"
        fill="#1a0a00"
        text-anchor="middle">${badge1Text}</text>
  <text x="252" y="794"
        font-family="'Arial Black', sans-serif"
        font-size="15"
        font-weight="900"
        fill="#1a0a00"
        text-anchor="middle">${badge1Sub}</text>

  <!-- Badge 2: 100% Natural -->
  <circle cx="252" cy="835" r="28" fill="none" stroke="#1a1a1a" stroke-width="5"/>
  <line x1="232" y1="815" x2="272" y2="855" stroke="#1a1a1a" stroke-width="5"/>
  <line x1="236" y1="818" x2="268" y2="850" stroke="#1a1a1a" stroke-width="3"/>
  <text x="252" y="875"
        font-family="'Arial', sans-serif"
        font-size="13"
        fill="#1a0a00"
        text-anchor="middle">100% Natural</text>
  <text x="252" y="890"
        font-family="'Arial', sans-serif"
        font-size="13"
        fill="#1a0a00"
        text-anchor="middle">&amp; Pure</text>

  <!-- Right column: Ghee bowl illustration -->
  <!-- Bowl shadow -->
  <ellipse cx="660" cy="815" rx="120" ry="22" fill="#b87333" opacity="0.4"/>
  <!-- Bowl outer -->
  <path d="M 540 760 C 540 840, 580 830, 660 830 C 740 830, 780 840, 780 760 C 780 720, 740 700, 660 700 C 580 700, 540 720, 540 760 Z"
        fill="url(#bowlGrad)"/>
  <!-- Ghee pool inside bowl -->
  <ellipse cx="660" cy="748" rx="95" ry="40" fill="#ffd54f" opacity="0.95"/>
  <ellipse cx="645" cy="740" rx="55" ry="20" fill="#fff9c4" opacity="0.7"/>
  <!-- Wooden spoon -->
  <path d="M 755 665 L 778 688 L 710 756 L 690 740 Z"
        fill="#a0652a" stroke="#6d4200" stroke-width="2"/>
  <ellipse cx="700" cy="748" rx="22" ry="14" fill="#a0652a" stroke="#6d4200" stroke-width="2"/>
  <circle cx="765" cy="678" r="14" fill="#c8844e" stroke="#6d4200" stroke-width="2"/>
</svg>`;
}

// ─── Buffalo Desi label style SVG overlay ────────────────────────────────────
// Image 1 (buffalo jar) style: beige/cream jar, rounded square label with:
//   - ARSHITH oval badge, "100% Natural" green badge (top left), veg dot (top right)
//   - "DESI [PRODUCT] GHEE" bold, "100% Pure"
//   - Indian woman illustration churning ghee
//   - "FREE-GRAZED • HANDMADE" brown footer
// We overlay changed text on image 1 for cow_ghee_front.jpg

function makeBuffaloStyleLabel(product) {
  const isBuffalo = product === 'buffalo';
  const mainTitle = isBuffalo ? 'DESI BUFFALO GHEE' : 'DESI COW GHEE';
  const tagline = isBuffalo ? '100% Pure' : '100% Pure';
  const footer = isBuffalo ? 'FREE-GRAZED • HANDMADE' : 'FREE-GRAZED • HANDMADE';

  return `<svg width="980" height="980" viewBox="0 0 980 980" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="labelBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fdf9e5"/>
      <stop offset="60%" stop-color="#f8edb0"/>
      <stop offset="100%" stop-color="#e8c840"/>
    </linearGradient>
    <linearGradient id="footerBrown" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7a3e0a"/>
      <stop offset="100%" stop-color="#4a2005"/>
    </linearGradient>
    <linearGradient id="illustBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffe082"/>
      <stop offset="55%" stop-color="#f0c040"/>
      <stop offset="100%" stop-color="#c47c00"/>
    </linearGradient>
    <filter id="labelShadow2">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Full label rect with rounded corners matching buffalo jar proportions -->
  <rect x="118" y="298" width="744" height="562" rx="24" fill="url(#labelBg)" filter="url(#labelShadow2)"/>

  <!-- TOP LEFT: 100% Natural green badge -->
  <rect x="128" y="308" width="95" height="60" rx="10" fill="#1e7a2e"/>
  <text x="175" y="368" font-family="'Arial Black', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">100%</text>
  <text x="175" y="384" font-family="'Arial Black', sans-serif" font-size="12" font-weight="900" fill="#a5d6a7" text-anchor="middle">Neturd</text>

  <!-- TOP CENTER: ARSHITH oval logo -->
  <ellipse cx="490" cy="390" rx="135" ry="44" fill="#ffffff" stroke="#1a1a1a" stroke-width="3"/>
  <ellipse cx="490" cy="390" rx="128" ry="37" fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
  <text x="490" y="386" font-family="'Georgia', serif" font-size="30" font-weight="700" fill="#1a1a1a" text-anchor="middle" letter-spacing="2">ARSHITH</text>
  <!-- Wheat icon in oval -->
  <path d="M 374 385 C 378 380, 382 386, 374 390 Z M 374 388 L 380 380" stroke="#8B6914" stroke-width="2" fill="none"/>

  <!-- TOP RIGHT: Veg green dot indicator -->
  <rect x="839" y="348" width="38" height="38" rx="5" fill="#fff" stroke="#1b7339" stroke-width="3"/>
  <circle cx="858" cy="367" r="9" fill="#1b7339"/>

  <!-- PRODUCT TITLE -->
  <text x="490" y="468"
        font-family="'Arial Black', Impact, sans-serif"
        font-size="52"
        font-weight="900"
        fill="#1a0a00"
        text-anchor="middle">${mainTitle}</text>
  <text x="490" y="504"
        font-family="'Arial', sans-serif"
        font-size="28"
        fill="#3e2010"
        text-anchor="middle">${tagline}</text>

  <!-- ILLUSTRATION AREA (golden background arch) -->
  <path d="M 130 520 L 130 810 L 850 810 L 850 520 C 850 520, 700 490, 490 490 C 280 490, 130 520, 130 520 Z"
        fill="url(#illustBg)"/>

  <!-- Hills / landscape silhouette in illustration -->
  <path d="M 130 720 C 200 650, 300 680, 400 660 C 480 645, 550 690, 650 665 C 730 645, 800 680, 850 660 L 850 810 L 130 810 Z"
        fill="#d4a020" opacity="0.5"/>

  <!-- Indian woman illustration: simple SVG -->
  <!-- Body -->
  <ellipse cx="330" cy="730" rx="85" ry="70" fill="#c0392b"/>
  <!-- Head -->
  <circle cx="330" cy="635" r="52" fill="#d4935a"/>
  <!-- Hair -->
  <path d="M 285 620 C 280 590, 285 570, 330 568 C 375 570, 380 590, 375 620 C 360 612, 340 608, 320 612 Z"
        fill="#1a1a1a"/>
  <path d="M 375 620 C 385 650, 378 680, 375 700" stroke="#1a1a1a" stroke-width="18" fill="none" stroke-linecap="round"/>
  <!-- Face smile -->
  <path d="M 315 640 Q 330 652, 345 640" stroke="#8B4513" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="320" cy="630" r="4" fill="#1a1a1a"/>
  <circle cx="340" cy="630" r="4" fill="#1a1a1a"/>
  <!-- Arms -->
  <path d="M 250 720 C 220 700, 190 710, 185 740 L 215 750 C 218 730, 235 720, 258 730 Z" fill="#d4935a"/>
  <path d="M 410 720 C 440 700, 470 710, 475 740 L 445 750 C 442 730, 425 720, 402 730 Z" fill="#d4935a"/>
  <!-- Golden Bowl with ghee -->
  <path d="M 210 755 C 205 800, 240 820, 330 820 C 420 820, 455 800, 450 755 C 445 725, 400 710, 330 710 C 260 710, 215 725, 210 755 Z"
        fill="#c8a030" stroke="#8B6914" stroke-width="3"/>
  <ellipse cx="330" cy="752" rx="95" ry="36" fill="#fffde7" opacity="0.85"/>
  <ellipse cx="318" cy="745" rx="55" ry="18" fill="#ffffff" opacity="0.6"/>
  <!-- Churner stick -->
  <path d="M 450 700 L 460 712 L 352 780 L 342 768 Z" fill="#8B5E3C" stroke="#5C3A1E" stroke-width="2"/>
  <circle cx="456" cy="706" r="10" fill="#A0703A"/>
  <!-- Small clay pot on right -->
  <path d="M 580 700 C 570 720, 572 760, 610 765 C 648 768, 660 728, 650 705 C 644 692, 635 688, 615 690 C 594 690, 583 694, 580 700 Z"
        fill="#c0692a" stroke="#8B4513" stroke-width="2.5"/>
  <ellipse cx="615" cy="703" rx="34" ry="10" fill="#d4803a" stroke="#8B4513" stroke-width="2"/>
  <!-- Green plant in pot -->
  <path d="M 615 680 L 615 630 M 615 660 C 600 645, 590 630, 595 618 C 605 625, 615 635, 615 650 M 615 650 C 630 635, 640 618, 635 605 C 625 612, 615 625, 615 645"
        stroke="#2e7d32" stroke-width="5" fill="none" stroke-linecap="round"/>

  <!-- Small ghee heap at bottom right corner (outside jar) -->

  <!-- FOOTER BROWN BANNER -->
  <path d="M 118 810 L 862 810 L 862 856 C 862 870, 852 880, 836 880 L 144 880 C 128 880, 118 870, 118 856 Z"
        fill="url(#footerBrown)"/>
  <text x="490" y="853"
        font-family="'Arial Black', sans-serif"
        font-size="26"
        font-weight="900"
        fill="#ffd54f"
        text-anchor="middle"
        letter-spacing="3">${footer}</text>
</svg>`;
}

async function processImages() {
  // 1. buffalo_ghee_front.jpg = Image 1 (buffalo jar) directly
  const bufFrontBuf = await sharp(BUFFALO_JAR).jpeg({ quality: 97 }).toBuffer();

  // 2. buffalo_ghee_back.jpg = Image 2 (cow jar) with label changed to BUFFALO
  const bufBackOverlay = Buffer.from(makeCowStyleLabel('buffalo'));
  const bufBackBuf = await sharp(COW_JAR)
    .composite([{ input: bufBackOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 97 })
    .toBuffer();

  // 3. cow_ghee_back.jpg = Image 2 (cow jar) directly
  const cowBackBuf = await sharp(COW_JAR).jpeg({ quality: 97 }).toBuffer();

  // 4. cow_ghee_front.jpg = Image 1 (buffalo jar) with label changed to COW
  const cowFrontOverlay = Buffer.from(makeBuffaloStyleLabel('cow'));
  const cowFrontBuf = await sharp(BUFFALO_JAR)
    .composite([{ input: cowFrontOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 97 })
    .toBuffer();

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'buffalo_ghee_front.jpg'), bufFrontBuf);
    fs.writeFileSync(path.join(dir, 'buffalo_ghee_back.jpg'), bufBackBuf);
    fs.writeFileSync(path.join(dir, 'cow_ghee_back.jpg'), cowBackBuf);
    fs.writeFileSync(path.join(dir, 'cow_ghee_front.jpg'), cowFrontBuf);
    console.log('Saved all ghee images to:', dir);
  }

  // Also save previews to artifact dir for verification
  const artifactDir = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02';
  fs.writeFileSync(path.join(artifactDir, 'buffalo_ghee_front_v2.jpg'), bufFrontBuf);
  fs.writeFileSync(path.join(artifactDir, 'buffalo_ghee_back_v2.jpg'), bufBackBuf);
  fs.writeFileSync(path.join(artifactDir, 'cow_ghee_front_v2.jpg'), cowFrontBuf);
  fs.writeFileSync(path.join(artifactDir, 'cow_ghee_back_v2.jpg'), cowBackBuf);

  console.log('All 4 ghee images generated and saved!');
}

processImages().catch(console.error);
