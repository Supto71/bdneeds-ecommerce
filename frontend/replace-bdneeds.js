const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git') && !file.includes('data')) {
        results = results.concat(walk(file));
      }
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replacements for common visual texts
  content = content.replace(/ bdneeds/g, ' BdNeeds');
  content = content.replace(/>bdneeds/g, '>BdNeeds');
  content = content.replace(/'bdneeds'/g, "'BdNeeds'");
  content = content.replace(/"bdneeds"/g, '"BdNeeds"');
  content = content.replace(/bdneeds Admin/g, 'BdNeeds Admin');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
