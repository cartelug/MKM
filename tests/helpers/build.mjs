// Builds the site into a temporary directory with optional environment overrides.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
export function build(env = {}) {
  const out = mkdtempSync(path.join(tmpdir(), 'mkm-build-'));
  const result = { out, error: null };
  try { execFileSync('node', [path.join(root, 'scripts/build.mjs')], { env: { ...process.env, MKM_OUT: out, ...env }, stdio: 'pipe' }); }
  catch (error) { result.error = String(error.stderr || error.message); }
  return result;
}
export const read = (out, file) => readFileSync(path.join(out, file), 'utf8');
export const exists = (out, file) => existsSync(path.join(out, file));
export function htmlFiles(out) {
  const found = [];
  const walk = dir => readdirSync(dir).forEach(name => { const p = path.join(dir, name); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && found.push(path.relative(out, p)); });
  walk(out);
  return found.sort();
}
