const fs = require('fs');
const path = require('path');

const scriptJsPath = path.join(__dirname, '..', 'assets', 'js', 'script.js');
let scriptContent = fs.readFileSync(scriptJsPath, 'utf8');

const REMOVE_REGEX = /coriander-premium|cumin-premium|poppy-seeds-premium|almond-oil-premium|neem-oil-premium|badam-powder|coconut-powder|coffee-powder|green-tea|mix-tutti|combo/i;
const REMOVE_NAME_REGEX = /Coriander Seeds|Cumin Seeds|Poppy Seeds|Almond Oil|Neem Oil|Badam Powder|Coconut Powder|Coffee Powder|Green Tea|Mix Tutti Frutti|Combo/i;

// Match FALLBACK_CATALOG or products array in script.js
const arrayMatch = scriptContent.match(/(const\s+FALLBACK_[A-Z_]*\s*=\s*\[[\s\S]*?\n\];)/g) ||
                   scriptContent.match(/(let\s+FALLBACK_[A-Z_]*\s*=\s*\[[\s\S]*?\n\];)/g);

let modified = false;

// Regex search for items in fallback array in script.js
// We can use JSON evaluation if possible or regex replacement of objects
const fallbackBlockMatch = scriptContent.match(/const\s+FALLBACK_[A-Z_]*\s*=\s*(\[[\s\S]*?\n\]);/);
if (fallbackBlockMatch) {
  const arrayStr = fallbackBlockMatch[1];
  try {
    const array = eval(arrayStr);
    console.log(`Original script.js fallback array length: ${array.length}`);
    const filtered = array.filter(item => {
      const m1 = item.handle && REMOVE_REGEX.test(item.handle);
      const m2 = item.id && REMOVE_REGEX.test(item.id);
      const m3 = item.name && REMOVE_NAME_REGEX.test(item.name);
      if (m1 || m2 || m3) {
        console.log(`  ❌ REMOVED from script.js: "${item.name}" (${item.handle || item.id})`);
        return false;
      }
      return true;
    });

    console.log(`Filtered script.js fallback array length: ${filtered.length}`);
    const newArrayStr = JSON.stringify(filtered, null, 2);
    scriptContent = scriptContent.replace(arrayStr, newArrayStr);
    fs.writeFileSync(scriptJsPath, scriptContent, 'utf8');
    console.log('✅ Successfully updated assets/js/script.js!');
  } catch (err) {
    console.error('Error evaluating script.js fallback array:', err);
  }
} else {
  console.log('No FALLBACK array block matched in script.js');
}
