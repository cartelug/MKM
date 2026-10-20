// The repository root must carry the same site as dist/, so hosts that serve the root (GitHub Pages) show V2.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { root } from './helpers/build.mjs';

const dist = path.join(root, 'dist');
const walk = (dir, base = dir) => readdirSync(dir).flatMap(name => {
  const full = path.join(dir, name);
  return statSync(full).isDirectory() ? walk(full, base) : [path.relative(base, full)];
});

test('index.html is in the repository root and identical to dist/index.html', () => {
  assert.ok(existsSync(path.join(root, 'index.html')), 'run npm run publish:root');
  assert.equal(readFileSync(path.join(root, 'index.html'), 'utf8'), readFileSync(path.join(dist, 'index.html'), 'utf8'));
  assert.ok(existsSync(path.join(root, '.nojekyll')));
});

test('every file in dist/ is published unchanged at the repository root (run npm run publish:root after a build)', () => {
  const published = JSON.parse(readFileSync(path.join(root, '.root-publish.json'), 'utf8'));
  const names = readdirSync(dist).sort();
  assert.deepEqual(published, names);
  const stale = [];
  for (const file of walk(dist)) {
    const copy = path.join(root, file);
    if (!existsSync(copy) || !readFileSync(copy).equals(readFileSync(path.join(dist, file)))) stale.push(file);
  }
  assert.deepEqual(stale, []);
});

test('publishing never overwrites source, docs, tests or configuration', () => {
  for (const name of readdirSync(dist)) assert.ok(!['src', 'public', 'scripts', 'tests', 'docs', 'dist', 'README.md', 'package.json', '.git', '.openai'].includes(name), name);
});
