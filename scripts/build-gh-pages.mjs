import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();
const apiDir = path.join(root, 'app', 'api');
const tempApiDir = path.join(root, 'app', '_api_temp');
const middlewareFile = path.join(root, 'middleware.ts');
const tempMiddlewareFile = path.join(root, '_middleware_temp.ts');
const dotNextDir = path.join(root, '.next');
const outDir = path.join(root, 'out');
const docsDir = path.join(root, 'docs');

let apiMoved = false;
let middlewareMoved = false;

try {
  console.log('📦 Preparing GreenMind for GitHub Pages static export...');

  // Clean .next cache to prevent type validator caching issues
  if (fs.existsSync(dotNextDir)) {
    try {
      fs.rmSync(dotNextDir, { recursive: true, force: true });
      console.log('✓ Cleaned .next cache');
    } catch (e) {
      console.log('⚠ Could not clean .next, continuing...');
    }
  }

  // 1. Temporarily move app/api and middleware.ts
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, tempApiDir);
    apiMoved = true;
    console.log('✓ Stashed server API routes');
  }

  if (fs.existsSync(middlewareFile)) {
    fs.renameSync(middlewareFile, tempMiddlewareFile);
    middlewareMoved = true;
    console.log('✓ Stashed server middleware');
  }

  // 2. Run Next.js build with static export target
  console.log('🚀 Running Next.js static build...');
  execSync('npx next build', {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      DEPLOY_TARGET: 'gh-pages',
      NODE_ENV: 'production',
    },
  });

  console.log('✓ Next.js static export completed successfully!');

  // 3. Populate docs/ folder
  if (fs.existsSync(outDir)) {
    if (fs.existsSync(docsDir)) {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
    fs.cpSync(outDir, docsDir, { recursive: true });
    console.log('✓ Copied static bundle to docs/');

    // Crucial for GitHub Pages: .nojekyll disables Jekyll so _next folder is served
    fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
    console.log('✓ Created docs/.nojekyll');

    // 404 fallback page for client-side routing on GitHub Pages
    const notFoundSource = path.join(docsDir, '404', 'index.html');
    const notFoundDest = path.join(docsDir, '404.html');
    if (fs.existsSync(notFoundSource)) {
      fs.copyFileSync(notFoundSource, notFoundDest);
      console.log('✓ Created docs/404.html from 404/index.html');
    } else {
      fs.copyFileSync(path.join(docsDir, 'index.html'), notFoundDest);
      console.log('✓ Created docs/404.html from index.html');
    }
  }
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exitCode = 1;
} finally {
  // Always restore server files so dev and Vercel workflows remain pristine
  if (apiMoved && fs.existsSync(tempApiDir)) {
    fs.renameSync(tempApiDir, apiDir);
    console.log('✓ Restored server API routes');
  }
  if (middlewareMoved && fs.existsSync(tempMiddlewareFile)) {
    fs.renameSync(tempMiddlewareFile, middlewareFile);
    console.log('✓ Restored server middleware');
  }
}
