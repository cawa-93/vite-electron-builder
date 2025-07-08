import { execSync } from 'child_process';
import packageJson from '../../package.json' with {type: 'json'};

const viteVersion = packageJson.devDependencies['create-vite'] ?? 'latest';

execSync(`npm create vite@${viteVersion} renderer`, { stdio: 'inherit' });
