// Builds the site and copies it into the repository root, so a host that serves the repo root
// (for example GitHub Pages "Deploy from a branch: main / (root)") finds index.html there.
// dist/ is rebuilt as well, so both locations always match. URLs are document-relative, so the
// published copy works at a domain root or in a sub-folder such as https://user.github.io/MKM/.
//
//     npm run publish:root
import { execFileSync } from 'node:child_process';
import { cp, rm, readdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = path.join(root, 'dist');
const record = path.join(root, '.root-publish.json');
// Never touched, whatever dist contains.
const protectedNames = new Set(['.git', '.github', '.openai', '.gitignore', '.nojekyll', '.root-publish.json', 'README.md', 'package.json', 'package-lock.json', 'node_modules', 'src', 'public', 'scripts', 'tests', 'docs', 'dist']);

execFileSync('node', [path.join(root, 'scripts/build.mjs')], { stdio: 'inherit', env: { ...process.env, MKM_OUT: '' } });

const names = (await readdir(dist)).sort();
const clash = names.filter(name => protectedNames.has(name));
if (clash.length) throw new Error(`dist/ contains names that would overwrite repository files: ${clash.join(', ')}`);

// Remove what the previous publish put in the root (so deleted pages do not linger), then copy afresh.
let previous = [];
try { previous = JSON.parse(await readFile(record, 'utf8')); } catch { /* first publish */ }
for (const name of new Set([...previous, ...names])) {
  if (!protectedNames.has(name)) await rm(path.join(root, name), { recursive: true, force: true });
}
for (const name of names) await cp(path.join(dist, name), path.join(root, name), { recursive: true });
await writeFile(record, JSON.stringify(names, null, 2) + '\n');
await writeFile(path.join(root, '.nojekyll'), ''); // serve files exactly as they are, no Jekyll processing
console.log(`Published ${names.length} entries to the repository root (index.html is at ./index.html).`);
