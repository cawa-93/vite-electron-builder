import { execSync } from 'child_process';
import packageJson from '../../package.json' with {type: 'json'};

const viteVersion = packageJson.devDependencies['create-vite'] ?? 'latest';
const templateIndex = process.argv.findIndex(arg => arg.startsWith('--template'))
let template = templateIndex !== -1 ? process.argv[templateIndex + 1] : '';
template = template ? `-- --template ${template}` : '';
execSync(`npm create vite@${viteVersion} renderer ${template}`, { stdio: 'inherit' });
