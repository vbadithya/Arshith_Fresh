const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function renderRefinedGhee() {
  const honeyPath = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02/.user_uploaded/media_1791011795632.png';

  // Label coordinates:
  // Top apex: (508, 252)
  // Left curve starts around y=480 at x=248, goes down to y=890 at x=248
  // Right curve starts around y=480 at x=768, goes down to y=890 at x=768
  // Bottom corners rounded from y=890 to y=910, x from 270 to 746
  
  function getGheeSvg(type) {
    const isBuffalo = type === 'buffalo';
    const archedTopText = isBuffalo ? 'NATURAL BUFFALO GHEE' : 'NATURAL COW GHEE';
    const titleText = isBuffalo ? 'Buffalo Ghee' : 'Cow Ghee';
    const subBadge1 = isBuffalo ? 'TRADITIONAL' : 'VEDIC A2';
    const subBadge2 = isBuffalo ? 'BILONA METHOD' : 'BILONA METHOD';
    const potColor = isBuffalo ? '#d4af37' : '#e6a117';
    const gheeGlow = isBuffalo ? '#fff8db' : '#ffef78';

    return `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients -->
        <linearGradient id="labelBrown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4a2211" />
          <stop offset="50%" stop-color="#321609" />
          <stop offset="100%" stop-color="#240f06" />
        </linearGradient>

        <linearGradient id="artBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fff8e1" />
          <stop offset="25%" stop-color="#ffe082" />
          <stop offset="65%" stop-color="#ffca28" />
          <stop offset="100%" stop-color="#ffb300" />
        </linearGradient>

        <linearGradient id="greenBar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#144222" />
          <stop offset="100%" stop-color="#0a2a14" />
        </linearGradient>

        <linearGradient id="brassHandi" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff3a8" />
          <stop offset="30%" stop-color="#e5b839" />
          <stop offset="70%" stop-color="#aa7c11" />
          <stop offset="100%" stop-color="#5e4204" />
        </linearGradient>

        <linearGradient id="clayHandi" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f39c12" />
          <stop offset="50%" stop-color="#d35400" />
          <stop offset="100%" stop-color="#7e2d00" />
        </linearGradient>

        <linearGradient id="woodTool" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0a96d" />
          <stop offset="50%" stop-color="#a3692b" />
          <stop offset="100%" stop-color="#5c380d" />
        </linearGradient>

        <linearGradient id="gheeLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${gheeGlow}" />
          <stop offset="100%" stop-color="${isBuffalo ? '#f7d368' : '#e09800'}" />
        </linearGradient>

        <filter id="subtleDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.35" />
        </filter>

        <!-- Curve for Arched Text -->
        <path id="archPath" d="M 280 540 C 330 458, 412 422, 508 422 C 604 422, 686 458, 736 540" fill="none" />
      </defs>

      <!-- 1. FULL OUTER LABEL (Matching Honey Label Boundary Precisely) -->
      <path d="M 248 480 
               C 248 335, 348 252, 508 252 
               C 668 252, 768 335, 768 480 
               L 768 880 
               C 768 902, 752 912, 728 912 
               L 288 912 
               C 264 912, 248 902, 248 880 Z" 
            fill="url(#labelBrown)" />

      <!-- 2. ARSHITH LOGO (TOP) -->
      <g transform="translate(328, 308)">
        <!-- Green hexagonal badge with white border -->
        <path d="M 25 0 L 335 0 C 348 0, 358 10, 354 23 L 342 62 C 339 72, 330 78, 318 78 L 42 78 C 30 78, 21 72, 18 62 L 6 23 C 2 10, 12 0, 25 0 Z" 
              fill="#0b3820" 
              stroke="#ffffff" 
              stroke-width="3.5" />
        <!-- ARSHITH Text -->
        <text x="180" y="50" 
              font-family="'Trebuchet MS', 'Arial Black', sans-serif" 
              font-weight="900" 
              font-size="35" 
              letter-spacing="5px" 
              fill="#ffffff" 
              text-anchor="middle">ARSHITH</text>
        <!-- Pink Dot on I -->
        <circle cx="218" cy="28" r="4.5" fill="#d82b78" />
        <!-- Underline Arc -->
        <path d="M 125 63 Q 180 74 235 63" stroke="#38a169" stroke-width="3.5" fill="none" stroke-linecap="round" />
      </g>

      <!-- 3. VEG LOGO (TOP RIGHT) -->
      <g transform="translate(650, 428)">
        <rect x="0" y="0" width="36" height="36" rx="4" fill="#ffffff" stroke="#1b7339" stroke-width="3" />
        <circle cx="18" cy="18" r="8.5" fill="#1b7339" />
      </g>

      <!-- 4. ARCHED TOP TITLE TEXT (e.g. PURE BUFFALO GHEE / PURE COW GHEE) -->
      <text font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="2.5px">
        <textPath href="#archPath" startOffset="50%" text-anchor="middle">
          ${archedTopText}
        </textPath>
      </text>

      <!-- 5. MIDDLE ARTWORK ARCHED CONTAINER -->
      <g filter="url(#subtleDrop)">
        <path d="M 266 545 
                 C 266 480, 372 435, 508 435 
                 C 644 435, 750 480, 750 545 
                 L 750 826 
                 L 266 826 Z" 
              fill="url(#artBg)" />
      </g>

      <!-- Background Traditional Glow Pattern inside artwork -->
      <g opacity="0.25">
        <circle cx="508" cy="600" r="165" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="8 8" />
        <circle cx="508" cy="600" r="115" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="6 6" />
        <!-- Honeycomb-like hexagonal grid subtle texture -->
        <path d="M 440 500 L 460 490 L 480 500 L 480 520 L 460 530 L 440 520 Z" fill="none" stroke="#d48806" stroke-width="2" />
        <path d="M 480 500 L 500 490 L 520 500 L 520 520 L 500 530 L 480 520 Z" fill="none" stroke="#d48806" stroke-width="2" />
        <path d="M 520 500 L 540 490 L 560 500 L 560 520 L 540 530 L 520 520 Z" fill="none" stroke="#d48806" stroke-width="2" />
        <path d="M 460 530 L 480 520 L 500 530 L 500 550 L 480 560 L 460 550 Z" fill="none" stroke="#d48806" stroke-width="2" />
        <path d="M 500 530 L 520 520 L 540 530 L 540 550 L 520 560 L 500 550 Z" fill="none" stroke="#d48806" stroke-width="2" />
      </g>

      <!-- 6. GHEE POT & WOODEN BILONA SPOON ILLUSTRATION -->
      <g transform="translate(435, 520)">
        <!-- Shadow beneath pot -->
        <ellipse cx="75" cy="195" rx="85" ry="16" fill="#000000" opacity="0.35" />

        <!-- Handi Pot Body -->
        <path d="M 18 115 
                 C -8 150, 0 190, 75 190 
                 C 150 190, 158 150, 132 115 
                 C 122 100, 118 95, 75 95 
                 C 32 95, 28 100, 18 115 Z" 
              fill="${isBuffalo ? 'url(#brassHandi)' : 'url(#brassHandi)'}" 
              stroke="#3d2002" 
              stroke-width="3" />

        <!-- Pot Neck & Rim -->
        <ellipse cx="75" cy="97" rx="55" ry="14" fill="#ffe066" stroke="#3d2002" stroke-width="3" />
        
        <!-- Molten Granular Golden Ghee inside pot -->
        <ellipse cx="75" cy="99" rx="46" ry="11" fill="url(#gheeLiquid)" />
        <ellipse cx="75" cy="99" rx="38" ry="7" fill="#ffffff" opacity="0.45" />

        <!-- Granular Ghee Shimmer Dots -->
        <circle cx="62" cy="99" r="2.5" fill="#fff" opacity="0.9" />
        <circle cx="85" cy="98" r="3" fill="#fff" opacity="0.9" />
        <circle cx="75" cy="101" r="2" fill="#fff" opacity="0.9" />
        <circle cx="95" cy="100" r="1.5" fill="#fff" opacity="0.8" />
        <circle cx="53" cy="100" r="1.5" fill="#fff" opacity="0.8" />

        <!-- Wooden Bilona Spoon / Churner Handle -->
        <path d="M 135 15 L 152 26 L 86 118 L 72 108 Z" fill="url(#woodTool)" stroke="#3e2005" stroke-width="2.5" />
        <circle cx="145" cy="20" r="10" fill="#a3692b" stroke="#3e2005" stroke-width="2.5" />
        
        <!-- Spoon Ladle Bowl with Ghee -->
        <ellipse cx="78" cy="112" rx="18" ry="11" fill="url(#woodTool)" stroke="#3e2005" stroke-width="2.5" />
        
        <!-- Stream of Golden Ghee Drip -->
        <path d="M 78 117 C 78 140, 74 158, 74 168 C 77 173, 81 173, 84 168 C 84 158, 83 140, 83 117 Z" fill="url(#gheeLiquid)" />
        <circle cx="79" cy="170" r="5.5" fill="${gheeGlow}" />
        <circle cx="77" cy="168" r="2" fill="#ffffff" />
      </g>

      <!-- 7. LEAF BADGE: TRADITIONAL BILONA METHOD -->
      <g transform="translate(300, 580)">
        <!-- Green double leaf shape -->
        <path d="M 15 35 C 5 20, 20 5, 55 5 C 55 35, 35 45, 15 35 Z" fill="#2d7a36" />
        <path d="M 50 10 C 70 15, 75 35, 65 50 C 45 45, 45 25, 50 10 Z" fill="#1e5c26" />
        <!-- Badge Banner Rectangle -->
        <rect x="22" y="8" width="142" height="44" rx="8" fill="#133d1c" stroke="#34a853" stroke-width="2" />
        <text x="93" y="26" font-family="'Arial Black', sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">${subBadge1}</text>
        <text x="93" y="42" font-family="'Arial Black', sans-serif" font-size="10.5" font-weight="800" fill="#a3e635" text-anchor="middle">${subBadge2}</text>
      </g>

      <!-- 8. BIG PRODUCT TITLE: Buffalo Ghee / Cow Ghee (Exact Honey Jar Typography) -->
      <g transform="translate(508, 800)" filter="url(#subtleDrop)">
        <text x="0" y="0" 
              font-family="'Cooper Black', 'Arial Black', Impact, cursive, sans-serif" 
              font-weight="900" 
              font-size="54" 
              letter-spacing="0.5px" 
              text-anchor="middle" 
              fill="#2e1408" 
              stroke="#ffffff" 
              stroke-width="14" 
              stroke-linejoin="round" 
              stroke-linecap="round" 
              paint-order="stroke fill">${titleText}</text>
      </g>

      <!-- 9. BOTTOM BANNER: 100% PURITY GUARANTEED -->
      <g>
        <path d="M 248 826 
                 L 768 826 
                 L 768 880 
                 C 768 902, 752 912, 728 912 
                 L 288 912 
                 C 264 912, 248 902, 248 880 Z" 
              fill="url(#greenBar)" />
        <!-- Top Gold Accent Line -->
        <line x1="248" y1="827" x2="768" y2="827" stroke="#d4af37" stroke-width="3" />

        <!-- Gold Purity Guarantee Text -->
        <text x="508" y="878" 
              font-family="'Arial Black', Impact, sans-serif" 
              font-weight="900" 
              font-size="24" 
              letter-spacing="2.5px" 
              fill="#f1d261" 
              text-anchor="middle">100% PURITY GUARANTEED</text>
      </g>
    </svg>
    `;
  }

  const buffaloSvgBuf = Buffer.from(getGheeSvg('buffalo'));
  const cowSvgBuf = Buffer.from(getGheeSvg('cow'));

  const outBuffalo = await sharp(honeyPath)
    .composite([{ input: buffaloSvgBuf, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toBuffer();

  const outCow = await sharp(honeyPath)
    .composite([{ input: cowSvgBuf, top: 0, left: 0 }])
    .jpeg({ quality: 96 })
    .toBuffer();

  const targetDirs = [
    'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/assets/images/products',
    'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/frontend/assets/images/products',
    'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02'
  ];

  for (const dir of targetDirs) {
    fs.writeFileSync(path.join(dir, 'buffalo_ghee_front.jpg'), outBuffalo);
    fs.writeFileSync(path.join(dir, 'cow_ghee_front.jpg'), outCow);
    console.log(`Saved front images to ${dir}`);
  }
}

renderRefinedGhee().catch(console.error);
