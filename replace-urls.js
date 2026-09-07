const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend', 'src');

const replaceInFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5000/api')) {
    const updatedContent = content.replace(/http:\/\/localhost:5000\/api/g, '/api');
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
};

const walkSync = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkSync(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      replaceInFile(filePath);
    }
  });
};

walkSync(directoryPath);
console.log('Finished updating URLs');
