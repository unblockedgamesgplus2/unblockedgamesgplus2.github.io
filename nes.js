const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('list-thumbnail')) {
      const newContent = content.replace(/<div class="list-thumbnail"><img src="https:\/\/math181124\.github\.io(\/img\/[^"]+)"[^>]*>/g, '<div class="list-thumbnail"><img src="$1" class="lazyload">');
      fs.writeFileSync(filePath, newContent);
      console.log(`Processed file: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      walkDir(filePath);
    } else if (stat.isFile()) {
      replaceInFile(filePath);
    }
  });
}

walkDir('.');