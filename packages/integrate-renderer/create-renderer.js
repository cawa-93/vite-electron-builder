import { execSync } from 'child_process';
import { existsSync } from 'fs';
import packageJson from '../../package.json' with {type: 'json'};

const viteVersion = packageJson.devDependencies['create-vite'] ?? 'latest';
const templateIndex = process.argv.findIndex(arg => arg.startsWith('--template'))
let template = templateIndex !== -1 ? process.argv[templateIndex + 1] : '';
template = template ? `-- --template ${template}` : '';

try {
    console.log('Creating renderer with Vite...');
    execSync(`npm create vite@${viteVersion} renderer ${template}`, { stdio: 'inherit' });
    
    // Validate that the renderer directory was created
    if (!existsSync('./renderer')) {
        console.error('❌ Renderer directory was not created. The create-vite command may have failed.');
        process.exit(1);
    }
    
    // Validate that package.json exists
    if (!existsSync('./renderer/package.json')) {
        console.error('❌ Renderer package.json was not created. The create-vite command may have failed.');
        process.exit(1);
    }
    
    console.log('✅ Renderer created successfully.');
    
} catch (error) {
    console.error('Failed to execute the `npm create vite` command. Please check the Vite version, template, and your network connection.');
    console.error('Error details:', error.message);
    process.exit(1);
}
