import { execSync } from 'child_process';
import packageJson from '../../package.json' with {type: 'json'};

const viteVersion = packageJson.devDependencies['create-vite'] ?? 'latest';
const templateIndex = process.argv.findIndex(arg => arg.startsWith('--template'))
let template = templateIndex !== -1 ? process.argv[templateIndex + 1] : '';

// Vite Flags & Options
template = template ? `--template ${template}` : '';
const noImmediate = `--no-immediate`
const viteFlags = `-- ${template} ${noImmediate}`;

try {
    execSync(`npm create vite@${viteVersion} renderer ${viteFlags}`, { stdio: 'inherit' });
} catch (error) {
    console.error('Failed to execute the `npm create vite` command. Please check the Vite version, template, and your network connection.');
    console.error('Error details:', error.message);
    process.exit(1);
}
