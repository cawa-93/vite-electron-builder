#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const RENDERER_PACKAGE_PATH = './packages/renderer/package.json';
const EXPECTED_PACKAGE_NAME = '@app/renderer';

try {
  // Check if renderer package.json exists
  if (!existsSync(RENDERER_PACKAGE_PATH)) {
    console.error('❌ Renderer package.json not found at:', RENDERER_PACKAGE_PATH);
    console.error('Please run "npm run create-renderer" first.');
    process.exit(1);
  }

  // Read and parse package.json
  const packageJsonContent = readFileSync(RENDERER_PACKAGE_PATH, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  // Check if package name is correctly set
  if (packageJson.name !== EXPECTED_PACKAGE_NAME) {
    console.error('❌ Renderer package name is not correct.');
    console.error(`Expected: "${EXPECTED_PACKAGE_NAME}"`);
    console.error(`Found: "${packageJson.name}"`);
    console.error('Please run "npm run integrate-renderer" first.');
    process.exit(1);
  }

  console.log('✅ Renderer package is properly configured.');
  process.exit(0);

} catch (error) {
  console.error('❌ Failed to validate renderer package:', error.message);
  process.exit(1);
}