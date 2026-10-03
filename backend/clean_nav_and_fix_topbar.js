const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Clean HTML files in pages/ and root
function cleanHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      cleanHtmlFiles(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Remove circle top-nav item for cooking-essentials, pickles, flours, etc.
      content = content.replace(/<a\s+href="[^"]*cooking-essentials\.html"[^>]*class="category-circle-item[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
      content = content.replace(/<a\s+href="[^"]*pickles\.html"[^>]*class="category-circle-item[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
      content = content.replace(/<a\s+href="[^"]*household[^"]*\.html"[^>]*class="category-circle-item[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

      // Remove dropdown / footer nav links for deleted categories
      content = content.replace(/<li><a\s+href="[^"]*cooking-essentials\.html"[^>]*>[\s\S]*?<\/a><\/li>/gi, '');
      content = content.replace(/<li><a\s+href="[^"]*pickles\.html"[^>]*>[\s\S]*?<\/a><\/li>/gi, '');
      content = content.replace(/<li><a\s+href="[^"]*household[^"]*\.html"[^>]*>[\s\S]*?<\/a><\/li>/gi, '');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Cleaned HTML: ${path.relative(rootDir, fullPath)}`);
      }
    }
  }
}

cleanHtmlFiles(rootDir);
console.log('HTML cleanup done.');
