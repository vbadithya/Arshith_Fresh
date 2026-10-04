const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// The buffalo jar is 1024x1024.
// Looking at the label on the original buffalo jar:
// The label rectangle sits at approximately:
//   left: ~130, right: ~880 (width ~750)
//   top: ~345, bottom: ~880 (height ~535)
//   rounded corners ~22px
// The label has:
//   - cream/light yellow background
//   - top section: 100% Neturd badge (top-left), ARSHITH oval (center), veg dot (top-right)
//   - DESI [PRODUCT] GHEE bold title
//   - 100% Pure subtitle
//   - golden illustration area with woman churning, clay pot, plant
//   - dark brown footer "FREE-GRAZED • HANDMADE"

const BUFFALO_JAR = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02/.user_uploaded/media_1791019439149.jpg';

const TARGET_DIRS = [
  'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/assets/images/products',
  'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/frontend/assets/images/products',
];

// SVG is 1024x1024, label is placed exactly at the same position as the buffalo label
function makeDesiCowLabel() {
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="labelBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fdf8e4"/>
      <stop offset="55%" stop-color="#f7eba4"/>
      <stop offset="100%" stop-color="#e8d060"/>
    </linearGradient>
    <linearGradient id="illustBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffe694"/>
      <stop offset="50%" stop-color="#f5bf38"/>
      <stop offset="100%" stop-color="#c8900a"/>
    </linearGradient>
    <linearGradient id="footerBrown" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7a3e0a"/>
      <stop offset="100%" stop-color="#4a2005"/>
    </linearGradient>
    <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#dda020"/>
      <stop offset="100%" stop-color="#b87a08"/>
    </linearGradient>
  </defs>

  <!-- ─── Label background (matching exact position of buffalo jar label) ─── -->
  <rect x="130" y="300" width="750" height="545" rx="22" fill="url(#labelBg)"/>

  <!-- ─── TOP BAR: badges + ARSHITH oval ─── -->
  <!-- 100% Neturd green badge (top left) -->
  <rect x="144" y="312" width="88" height="58" rx="10" fill="#1e7a2e"/>
  <text x="188" y="331" font-family="'Arial Black', sans-serif" font-size="13" font-weight="900" fill="#fff" text-anchor="middle">100%</text>
  <text x="188" y="347" font-family="'Arial Black', sans-serif" font-size="12" font-weight="800" fill="#a5d6a7" text-anchor="middle">Neturd</text>

  <!-- ARSHITH Oval badge (top center) -->
  <ellipse cx="505" cy="347" rx="128" ry="42" fill="#ffffff" stroke="#1a1a1a" stroke-width="3"/>
  <ellipse cx="505" cy="347" rx="120" ry="35" fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
  <!-- Wheat/leaf icon in oval -->
  <path d="M 393 342 C 397 335, 402 342, 393 348 Z" stroke="#8B6914" stroke-width="2" fill="none"/>
  <path d="M 393 344 L 400 335" stroke="#8B6914" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="512" y="356" font-family="'Georgia', 'Times New Roman', serif" font-size="30" font-weight="700" fill="#1a1a1a" text-anchor="middle" letter-spacing="2">ARSHITH</text>

  <!-- Veg green square indicator (top right) -->
  <rect x="848" y="316" width="36" height="36" rx="5" fill="#fff" stroke="#1b7339" stroke-width="3"/>
  <circle cx="866" cy="334" r="9" fill="#1b7339"/>

  <!-- ─── PRODUCT TITLE ─── -->
  <text x="505" y="435"
        font-family="'Arial Black', Impact, sans-serif"
        font-size="60"
        font-weight="900"
        fill="#1a0a00"
        text-anchor="middle">DESI COW GHEE</text>
  <text x="505" y="472"
        font-family="'Arial', sans-serif"
        font-size="30"
        fill="#3e2010"
        text-anchor="middle">100% Pure</text>

  <!-- ─── ILLUSTRATION AREA ─── -->
  <!-- Golden gradient background panel -->
  <path d="M 130 490 
           C 175 476, 320 466, 505 466 
           C 690 466, 835 476, 880 490 
           L 880 790 L 130 790 Z"
        fill="url(#illustBg)"/>

  <!-- Hill silhouettes -->
  <path d="M 130 730 
           C 200 685, 300 710, 400 695 
           C 470 682, 540 715, 630 700 
           C 710 686, 790 715, 880 700 
           L 880 830 L 130 830 Z"
        fill="url(#hillGrad)" opacity="0.55"/>

  <!-- ─── WOMAN ILLUSTRATION (matches buffalo style exactly) ─── -->
  <!-- Body (red sari) -->
  <ellipse cx="346" cy="755" rx="88" ry="72" fill="#c0392b"/>
  <!-- Neck -->
  <rect x="326" y="668" width="38" height="30" rx="10" fill="#c8844a"/>
  <!-- Head -->
  <circle cx="345" cy="648" r="52" fill="#c8844a"/>
  <!-- Hair - long black ponytail -->
  <path d="M 298 628 C 294 598, 300 575, 345 572 C 390 575, 396 598, 392 628 C 376 618, 356 614, 336 618 Z"
        fill="#1a1a1a"/>
  <!-- Ponytail hanging right -->
  <path d="M 390 625 C 400 655, 396 690, 390 715"
        stroke="#1a1a1a" stroke-width="18" fill="none" stroke-linecap="round"/>
  <!-- Smile -->
  <path d="M 330 652 Q 345 665, 360 652"
        stroke="#8B4513" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="334" cy="640" r="5" fill="#1a1a1a"/>
  <circle cx="357" cy="640" r="5" fill="#1a1a1a"/>
  <!-- Left arm reaching down to bowl -->
  <path d="M 262 745 C 235 728, 208 738, 200 762 L 228 770 C 230 752, 248 742, 268 750 Z"
        fill="#c8844a"/>
  <!-- Right arm with stick -->
  <path d="M 428 738 C 455 720, 478 728, 485 752 L 458 760 C 456 742, 438 732, 418 742 Z"
        fill="#c8844a"/>

  <!-- Golden mixing bowl with cow ghee -->
  <!-- Bowl outer -->
  <path d="M 222 768 C 218 818, 255 835, 345 835 C 435 835, 472 818, 468 768 C 462 734, 418 718, 345 718 C 272 718, 228 734, 222 768 Z"
        fill="#c8a030" stroke="#8B6914" stroke-width="3.5"/>
  <!-- Ghee inside bowl (lighter gold) -->
  <ellipse cx="345" cy="764" rx="100" ry="40" fill="#fffde7" opacity="0.9"/>
  <!-- Ghee shimmer / highlight -->
  <ellipse cx="330" cy="756" rx="58" ry="20" fill="#ffffff" opacity="0.6"/>
  <!-- Churner stick in bowl -->
  <path d="M 460 715 L 474 728 L 370 788 L 356 775 Z"
        fill="#8B5E3C" stroke="#5C3A1E" stroke-width="2.5"/>
  <circle cx="467" cy="722" r="12" fill="#A0703A" stroke="#5C3A1E" stroke-width="2"/>

  <!-- ─── CLAY POT with PLANT (right side) ─── -->
  <!-- Pot body -->
  <path d="M 598 710 C 588 732, 590 775, 630 780 C 670 783, 685 740, 674 715 C 667 700, 657 694, 636 696 C 614 697, 602 700, 598 710 Z"
        fill="#c0692a" stroke="#8B4513" stroke-width="3"/>
  <!-- Pot rim -->
  <ellipse cx="636" cy="710" rx="36" ry="12" fill="#d4803a" stroke="#8B4513" stroke-width="2.5"/>
  <!-- Plant stem -->
  <line x1="636" y1="700" x2="636" y2="635" stroke="#2e7d32" stroke-width="6" stroke-linecap="round"/>
  <!-- Plant leaves - left -->
  <path d="M 636 660 C 618 645, 608 628, 614 616 C 622 624, 634 638, 636 655"
        stroke="#2e7d32" stroke-width="5" fill="#4caf50" fill-opacity="0.3" stroke-linecap="round"/>
  <!-- Plant leaves - right -->
  <path d="M 636 650 C 655 634, 666 616, 660 604 C 652 612, 638 628, 636 645"
        stroke="#2e7d32" stroke-width="5" fill="#4caf50" fill-opacity="0.3" stroke-linecap="round"/>
  <!-- Top leaf cluster -->
  <path d="M 636 635 C 626 622, 622 610, 628 600 C 634 608, 638 620, 636 632"
        stroke="#2e7d32" stroke-width="4" fill="#4caf50" fill-opacity="0.3" stroke-linecap="round"/>

  <!-- ─── FOOTER BROWN BANNER ─── -->
  <path d="M 130 830 L 880 830 L 880 870 C 880 884, 868 895, 852 895 L 158 895 C 142 895, 130 884, 130 870 Z"
        fill="url(#footerBrown)"/>
  <text x="505" y="869"
        font-family="'Arial Black', sans-serif"
        font-size="27"
        font-weight="900"
        fill="#ffd54f"
        text-anchor="middle"
        letter-spacing="3">FREE-GRAZED • HANDMADE</text>
</svg>`;
}

async function buildCowFront() {
  const svgBuf = Buffer.from(makeDesiCowLabel());

  const outBuf = await sharp(BUFFALO_JAR)
    .composite([{ input: svgBuf, top: 0, left: 0 }])
    .jpeg({ quality: 97 })
    .toBuffer();

  const artifactDir = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02';
  fs.writeFileSync(path.join(artifactDir, 'cow_ghee_front_v3.jpg'), outBuf);

  for (const dir of TARGET_DIRS) {
    fs.writeFileSync(path.join(dir, 'cow_ghee_front.jpg'), outBuf);
    console.log('Saved cow_ghee_front.jpg to', dir);
  }

  console.log('Done!');
}

buildCowFront().catch(console.error);
