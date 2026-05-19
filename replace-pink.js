const fs = require('fs');
const path = require('path');

function replaceInDir(dir, searchStr, replaceStr) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceInDir(filePath, searchStr, replaceStr);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchStr)) {
        const newContent = content.split(searchStr).join(replaceStr);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Replaced in ${filePath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'app'), 'light-pink', 'light-blue');
replaceInDir(path.join(__dirname, 'components'), 'light-pink', 'light-blue');
