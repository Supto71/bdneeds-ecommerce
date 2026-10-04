const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, '.next', 'standalone');

console.log('--- Starting cPanel Build Preparation ---');

// 1. Build the Next.js app
console.log('\n> Running next build...');
try {
  execSync('npx next build --webpack', { stdio: 'inherit' });
} catch (error) {
  console.error('\nBuild failed! Aborting cPanel preparation.');
  process.exit(1);
}

// 2. Ensure standalone directory exists
if (!fs.existsSync(standaloneDir)) {
  console.error('\nError: .next/standalone directory not found.');
  console.error('Make sure output: "standalone" is in your next.config.ts');
  process.exit(1);
}

// Helper to copy directories recursively
function copyDirectorySync(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Copy necessary static files
console.log('\n> Copying public and static folders to standalone directory...');
copyDirectorySync(
  path.join(rootDir, 'public'),
  path.join(standaloneDir, 'public')
);
copyDirectorySync(
  path.join(rootDir, '.next', 'static'),
  path.join(standaloneDir, '.next', 'static')
);

// 4. Copy Prisma database file if using SQLite
const dbPath = path.join(rootDir, 'prisma', 'dev.db');
if (fs.existsSync(dbPath)) {
  console.log('> Copying SQLite database to standalone/prisma directory...');
  const destPrismaDir = path.join(standaloneDir, 'prisma');
  if (!fs.existsSync(destPrismaDir)) {
    fs.mkdirSync(destPrismaDir, { recursive: true });
  }
  fs.copyFileSync(dbPath, path.join(destPrismaDir, 'dev.db'));
} else {
  console.log('> No SQLite dev.db found. Skipping database copy (make sure to set your DB string on cPanel).');
}

// 5. Copy Prisma Client to standalone to fix cPanel module resolution
console.log('\n> Copying Prisma client to standalone node_modules...');
const standaloneNodeModules = path.join(standaloneDir, 'node_modules');

copyDirectorySync(
  path.join(rootDir, 'node_modules', '.prisma'),
  path.join(standaloneNodeModules, '.prisma')
);
copyDirectorySync(
  path.join(rootDir, 'node_modules', '@prisma'),
  path.join(standaloneNodeModules, '@prisma')
);

// 6. Zip the standalone folder
console.log('\n> Zipping the build for cPanel (bdneeds-cpanel-ready.zip)...');

try {
  const zip = new AdmZip();
  zip.addLocalFolder(standaloneDir);
  zip.writeZip(path.join(rootDir, 'bdneeds-cpanel-ready.zip'));
  
  console.log(`\n=== cPanel Build Complete! ===`);
  console.log(`Successfully created: bdneeds-cpanel-ready.zip`);
  console.log(`\nInstructions for cPanel Deployment:`);
  console.log(`1. Upload 'bdneeds-cpanel-ready.zip' to your cPanel File Manager and extract it.`);
  console.log(`2. Setup a "Setup Node.js App" in cPanel.`);
  console.log(`3. Set the Application root to the extracted folder.`);
  console.log(`4. Set the Application startup file to 'server.js'.`);
  console.log(`5. Add any necessary environment variables (e.g., NEXTAUTH_URL, DATABASE_URL, NEXTAUTH_SECRET).`);
  console.log(`6. Start/Restart the Node.js App in cPanel.`);
  console.log(`--------------------------------------`);
} catch (err) {
  console.error("Error creating zip file:", err);
  process.exit(1);
}
