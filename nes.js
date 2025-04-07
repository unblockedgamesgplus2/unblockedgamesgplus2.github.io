
const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let modified = false;

    if (content.includes('Mario64unblocked.gitlab.io')) {
      newContent = content.replace(/Mario64unblocked\.github\.io/g, 'Mario64unblocked.gitlab.io');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated file: ${filePath}`);
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
