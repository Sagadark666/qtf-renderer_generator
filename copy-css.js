const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  fs.readdirSync(src).forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyRecursiveSync(srcFile, destFile);
    } else if (file.endsWith('.css')) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

copyRecursiveSync(srcDir, distDir);
