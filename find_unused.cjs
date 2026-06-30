const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

function getAllFiles(dirPath, arrayOfFiles) {
  const currentFiles = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  currentFiles.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(path.join(__dirname, 'src'));
const unused = [];

for (const file of files) {
  const baseName = file.replace('.tsx', '');
  let isUsed = false;
  
  for (const srcFile of allFiles) {
    if (srcFile.endsWith(file)) continue;
    
    const content = fs.readFileSync(srcFile, 'utf8');
    if (content.includes(`ui/${baseName}`) || content.includes(`ui/${baseName}"`) || content.includes(`ui/${baseName}'`)) {
      isUsed = true;
      break;
    }
  }
  
  if (!isUsed) {
    unused.push(file);
  }
}

console.log(unused.join('\n'));
