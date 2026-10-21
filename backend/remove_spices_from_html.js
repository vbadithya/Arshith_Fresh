const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function cleanHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      cleanHtmlFiles(fullPath);
    } else if (file.endsWith('.html')) {
      // Skip spices.html itself, as that will be replaced with redirect
      if (file === 'spices.html') continue;

      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // 1. Remove category-circle-item for spices.html
      content = content.replace(/<a\s+href="[^"]*spices\.html"[^>]*class="category-circle-item[^"]*"[^>]*>[\s\S]*?<\/a>\s*/gi, '');

      // 2. Remove dropdown/nav links for spices.html
      content = content.replace(/<li><a\s+href="[^"]*spices\.html"[^>]*>\s*Spices\s*<\/a><\/li>\s*/gi, '');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Cleaned HTML: ${path.relative(rootDir, fullPath)}`);
      }
    }
  }
}

cleanHtmlFiles(rootDir);
console.log('All HTML files cleaned of Spices links.');
