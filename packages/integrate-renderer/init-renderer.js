import { execSync } from 'child_process';
import * as fs from 'node:fs';
import packageJson from '../../package.json' with {type: 'json'};

const mainPackagePath = './main/package.json';

// Backup and temporarily remove @app/renderer dependency to prevent npm resolution issues during Angular CLI project creation
function temporarilyRemoveRendererDependency() {
  if (!fs.existsSync(mainPackagePath)) {
    console.warn('Main package.json not found. Skipping dependency modification.');
    return null;
  }
  
  const mainPkg = JSON.parse(fs.readFileSync(mainPackagePath, 'utf8'));
  const hasRendererDep = mainPkg.dependencies && mainPkg.dependencies['@app/renderer'];
  
  if (hasRendererDep) {
    console.log('Temporarily removing @app/renderer dependency from main package...');
    const backup = JSON.parse(JSON.stringify(mainPkg)); // Deep copy
    delete mainPkg.dependencies['@app/renderer'];
    fs.writeFileSync(mainPackagePath, JSON.stringify(mainPkg, null, 2), 'utf8');
    return backup;
  }
  
  return null;
}

// Restore @app/renderer dependency
function restoreRendererDependency(backupMainPkg) {
  if (backupMainPkg) {
    console.log('Restoring @app/renderer dependency to main package...');
    fs.writeFileSync(mainPackagePath, JSON.stringify(backupMainPkg, null, 2), 'utf8');
  }
}

// Main execution
const backupMainPkg = temporarilyRemoveRendererDependency();

try {
  // Run create-renderer script
  const viteVersion = packageJson.devDependencies['create-vite'] ?? 'latest';
  const templateIndex = process.argv.findIndex(arg => arg.startsWith('--template'))
  let template = templateIndex !== -1 ? process.argv[templateIndex + 1] : '';
  template = template ? `-- --template ${template}` : '';
  
  console.log('Creating renderer project...');
  execSync(`npm create vite@${viteVersion} renderer ${template}`, { stdio: 'inherit' });
  
  // Restore dependency before integration
  restoreRendererDependency(backupMainPkg);
  
  // Run integration script
  console.log('Running integration script...');
  execSync('npm start --workspace @app/integrate-renderer', { stdio: 'inherit' });
  
} catch (error) {
  // Make sure to restore dependency even if creation fails
  restoreRendererDependency(backupMainPkg);
  console.error('Failed to create or integrate renderer. Please check the error above.');
  console.error('Error details:', error.message);
  process.exit(1);
}