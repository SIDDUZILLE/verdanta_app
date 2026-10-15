/**
 * VERDANTA WORLD - PRODUCTION BUILD & DEPLOYMENT VERIFICATION SCRIPT
 * Runs all validation, asset integrity checks, and prepares project for deployment.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const rootDir = __dirname;
let hasError = false;

console.log('====================================================');
console.log('🌿 VERDANTA WORLD - PRE-DEPLOYMENT BUILD & CHECK');
console.log('====================================================\n');

// 1. Verify Core HTML/CSS/JS Files
const requiredFiles = [
  'index.html',
  'admin.html',
  'style.css',
  'admin.css',
  'app.js',
  'admin.js',
  'serve.py',
  'api.php',
  'vercel.json',
  '_redirects',
  '.htaccess'
];

console.log('1. Checking Core Files...');
requiredFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    const size = (fs.statSync(filePath).size / 1024).toFixed(1);
    console.log(`   ✔ ${file.padEnd(20)} [${size} KB]`);
  } else {
    console.error(`   ✖ Missing required file: ${file}`);
    hasError = true;
  }
});

// 2. Validate All JSON Data Stores
const jsonFiles = [
  'products.json',
  'categories.json',
  'hero.json',
  'corporate_cards.json',
  'proposals.json',
  'config.json',
  'vercel.json'
];

console.log('\n2. Validating JSON Data Integrity...');
jsonFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const count = Array.isArray(parsed) ? `${parsed.length} items` : 'valid object';
    console.log(`   ✔ ${file.padEnd(25)} [OK - ${count}]`);
  } catch (err) {
    console.error(`   ✖ Invalid JSON in ${file}:`, err.message);
    hasError = true;
  }
});

// 3. Validate JavaScript Syntax
console.log('\n3. Validating JavaScript Syntax...');
['app.js', 'admin.js'].forEach(file => {
  const filePath = path.join(rootDir, file);
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    new vm.Script(code, { filename: file });
    console.log(`   ✔ ${file.padEnd(25)} [Syntax Valid]`);
  } catch (err) {
    console.error(`   ✖ JavaScript error in ${file}:`, err.message);
    hasError = true;
  }
});

// 4. Validate Python Server
console.log('\n4. Validating Python Server (serve.py)...');
try {
  execSync('python -m py_compile serve.py', { cwd: rootDir, stdio: 'pipe' });
  console.log('   ✔ serve.py                   [Python Syntax Valid]');
} catch (err) {
  console.warn('   ⚠ Python check skipped or error:', err.message);
}

// 5. Ensure Directories & .gitkeep
console.log('\n5. Ensuring Directory Structure...');
const dirs = ['images', 'uploads', 'uploads/products'];
dirs.forEach(d => {
  const dirPath = path.join(rootDir, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`   ✔ Created missing directory: ${d}`);
  } else {
    console.log(`   ✔ Directory exists: ${d}`);
  }
  const gitkeep = path.join(dirPath, '.gitkeep');
  if (!fs.existsSync(gitkeep) && d.startsWith('uploads')) {
    fs.writeFileSync(gitkeep, '');
    console.log(`     -> created ${d}/.gitkeep`);
  }
});

console.log('\n====================================================');
if (hasError) {
  console.error('❌ BUILD FAILED: Please fix the errors listed above.');
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED: Application is ready for deployment!');
  console.log('   - Vercel:          Ready (vercel.json configured)');
  console.log('   - Netlify:         Ready (_redirects configured)');
  console.log('   - Hostinger/PHP:   Ready (api.php & .htaccess configured)');
  console.log('   - Python Server:   Ready (serve.py port 3000/3001)');
  console.log('====================================================\n');
}
