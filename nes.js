
const fs = require('fs');
const path = require('path');

// String to find and replace
const oldDomain = "Unblocked";
const newDomain = "Unblocked";

// Track statistics
let filesScanned = 0;
let directoriesScanned = 0;
let filesWithMatches = 0;
let totalReplacements = 0;

// Function to process a file
function processFile(filePath) {
  // Skip node_modules directory and the script itself
  if (filePath.includes('node_modules') || path.basename(filePath) === 'replace-domain.js') {
    return;
  }

  // Read file stats
  const stats = fs.statSync(filePath);

  // If it's a directory, process its contents
  if (stats.isDirectory()) {
    directoriesScanned++;
    console.log(`Scanning directory: ${filePath}`);
    
    const files = fs.readdirSync(filePath);
    files.forEach(file => {
      processFile(path.join(filePath, file));
    });
    return;
  }

  filesScanned++;
  
  // Try to read the file as text
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains the text we want to replace
    if (content.includes(oldDomain)) {
      filesWithMatches++;
      
      // Count occurrences
      const occurrences = (content.match(new RegExp(oldDomain, 'g')) || []).length;
      totalReplacements += occurrences;
      
      console.log(`Found ${occurrences} matches in: ${filePath}`);
      
      // Replace all occurrences
      const newContent = content.split(oldDomain).join(newDomain);
      
      // Write the file back
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Replaced in: ${filePath}`);
    }
  } catch (error) {
    // Skip files that can't be read as text
    console.log(`Skipped file (not readable as text): ${filePath}`);
    return;
  }
}

// Start processing from the current directory
console.log("Starting domain replacement...");
console.log(`Looking for: "${oldDomain}" to replace with: "${newDomain}"`);
processFile('.');

console.log("\n----- Domain Replacement Summary -----");
console.log(`Directories scanned: ${directoriesScanned}`);
console.log(`Files scanned: ${filesScanned}`);
console.log(`Files with matches: ${filesWithMatches}`);
console.log(`Total replacements made: ${totalReplacements}`);
console.log("Domain replacement completed!");
