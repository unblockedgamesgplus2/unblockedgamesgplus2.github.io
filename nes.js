const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Mario64unblocked.github.io')) {
      const newContent = content.replace(/GamesGPlus\.gitlab\.io/g, 'Mario 64 unblocked');
      fs.writeFileSync(filePath, newContent);
      console.log(`Processed file: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function walkDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
        walkDir(filePath);
      } else if (stat.isFile() && (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.json'))) {
        replaceInFile(filePath);
      }
    });
  } catch (err) {
    console.error(`Error walking directory ${dir}:`, err);
  }
}

walkDir('.');