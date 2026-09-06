import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nextDir = path.join(root, '.next');

const failures = [];
const warnings = [];
const notes = [];

function ok(message) {
  console.log(`OK   ${message}`);
}
function fail(message) {
  failures.push(message);
  console.log(`FAIL ${message}`);
}
function warn(message) {
  warnings.push(message);
  console.log(`WARN ${message}`);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
}

function walk(dir, predicate, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, results);
    else if (predicate(full)) results.push(full);
  }
  return results;
}

function dirSizeBytes(dir) {
  return walk(dir, () => true).reduce((sum, file) => sum + statSync(file).size, 0);
}

// 1. package.json sanity
const pkg = readJson(path.join(root, 'package.json'));
if (!pkg) {
  fail('package.json is missing or invalid JSON');
} else {
  const requiredScripts = ['dev', 'build', 'start', 'test'];
  const missingScripts = requiredScripts.filter((name) => !pkg.scripts?.[name]);
  if (missingScripts.length) fail(`package.json missing script(s): ${missingScripts.join(', ')}`);
  else ok('package.json has all required scripts');

  const required = pkg.engines?.node?.match(/(\d+)/);
  if (required && Number(process.versions.node.split('.')[0]) < Number(required[1])) {
    fail(`Node ${process.versions.node} does not satisfy engines.node "${pkg.engines.node}"`);
  } else {
    ok(`Node ${process.versions.node} satisfies engines.node "${pkg.engines?.node ?? 'any'}"`);
  }
}

// 2. Build output presence
if (!existsSync(nextDir)) {
  fail('.next/ not found - run "npm run build" first');
} else {
  const buildIdFile = path.join(nextDir, 'BUILD_ID');
  const buildId = existsSync(buildIdFile) ? readFileSync(buildIdFile, 'utf8').trim() : '';
  if (!buildId) fail('.next/BUILD_ID is missing or empty - build output is incomplete');
  else ok(`BUILD_ID present (${buildId})`);

  const buildManifest = readJson(path.join(nextDir, 'build-manifest.json'));
  const pageCount = buildManifest?.pages ? Object.keys(buildManifest.pages).length : 0;
  if (!pageCount) fail('build-manifest.json missing or lists no pages');
  else ok(`build-manifest.json lists ${pageCount} page group(s)`);

  const appPaths = readJson(path.join(nextDir, 'server', 'app-paths-manifest.json'));
  if (!appPaths) {
    fail('app-paths-manifest.json missing - App Router build output not found');
  } else {
    const builtRoutes = Object.keys(appPaths);
    if (!builtRoutes.includes('/page')) fail('app-paths-manifest.json has no root "/page" entry');
    else ok(`App Router build contains ${builtRoutes.length} route(s)`);

    // Every source route/page must have matching build output.
    const routeFiles = walk(path.join(root, 'app'), (file) => /[\\/](page|route)\.[tj]sx?$/.test(file));
    for (const file of routeFiles) {
      const relative = path.relative(path.join(root, 'app'), file).replace(/\\/g, '/');
      const key = `/${relative.replace(/\.[tj]sx?$/, '')}`.replace(/\/index$/, '');
      if (!builtRoutes.includes(key)) {
        fail(`source route app/${relative} has no build output (expected "${key}")`);
      }
    }
    if (routeFiles.length) ok(`all ${routeFiles.length} source route(s)/page(s) exist in build output`);
  }

  if (!readJson(path.join(nextDir, 'prerender-manifest.json'))) {
    fail('prerender-manifest.json missing or invalid');
  } else {
    ok('prerender-manifest.json present');
  }

  const staticDir = path.join(nextDir, 'static');
  if (!existsSync(staticDir) || walk(staticDir, () => true).length === 0) {
    fail('.next/static is missing or empty - client bundles were not produced');
  } else {
    ok('.next/static client bundles present');
  }

  // 3. Staleness: build output must be newer than the newest source file.
  if (buildId) {
    const sourceFiles = [
      ...walk(path.join(root, 'app'), () => true),
      ...walk(path.join(root, 'components'), () => true),
      ...walk(path.join(root, 'src'), () => true),
      ...['package.json', 'next.config.js', 'tsconfig.json']
        .map((file) => path.join(root, file))
        .filter(existsSync)
    ];
    const newestSource = Math.max(0, ...sourceFiles.map((file) => statSync(file).mtimeMs));
    const builtAt = statSync(buildIdFile).mtimeMs;
    if (newestSource > builtAt) {
      fail('build output is older than source files - rerun "npm run build" before deploying');
    } else {
      ok('build output is up to date with source files');
    }
  }

  notes.push(`.next size: ${(dirSizeBytes(nextDir) / 1024 / 1024).toFixed(1)} MB`);
}

// 4. Environment hygiene (warnings only - the app can run in built-in bank mode)
const envLocal = path.join(root, '.env.local');
if (existsSync(envLocal)) {
  const content = readFileSync(envLocal, 'utf8');
  const placeholders = content
    .split('\n')
    .filter((line) => /^\s*[A-Z0-9_]+\s*=\s*(your[_-]|xxx|changeme|placeholder)/i.test(line))
    .map((line) => line.split('=')[0].trim());
  if (placeholders.length) {
    warn(`.env.local still has placeholder value(s): ${placeholders.join(', ')}`);
  } else {
    ok('.env.local contains no placeholder values');
  }
} else {
  warn('.env.local not found - app will run in built-in question bank mode only');
}

console.log('');
for (const note of notes) console.log(`NOTE ${note}`);
console.log(`\n${failures.length} failure(s), ${warnings.length} warning(s)`);

if (failures.length) {
  console.log('\nFAIL Build output is NOT production-ready.');
  process.exitCode = 1;
} else {
  console.log('\nOK Build output is production-ready.');
}
