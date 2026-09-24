const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, 'data', 'bdneeds-db.json'),
  path.join(__dirname, 'data', 'novacart-db.json'),
  path.join(__dirname, 'src', 'lib', 'seed-data.ts')
];

let counter = 1;

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace all Unsplash URLs with picsum seed URLs
    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+[^"'\s]*/g, () => {
      counter++;
      return `https://picsum.photos/seed/${counter}/800/800`;
    });
    
    // Also replace plus.unsplash.com
    content = content.replace(/https:\/\/plus\.unsplash\.com\/premium_photo-[a-zA-Z0-9\-]+[^"'\s]*/g, () => {
      counter++;
      return `https://picsum.photos/seed/${counter}/800/800`;
    });
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated images in: ' + file);
    }
  }
});
