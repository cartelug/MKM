// Optional local preview for the repository owner. No external dependencies.
// Mirrors a static host: directory index pages, a real 404 status, text compression and cache headers.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = process.env.MKM_OUT ? path.resolve(process.env.MKM_OUT) : path.resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };
const prefix = (process.env.MKM_PREFIX ?? '').replace(/\/+$/, ''); // e.g. /MKM to simulate a project page
// Apply the site's own _headers file (security headers and caching), as Netlify / Cloudflare Pages would.
async function loadHeaderRules() {
  try {
    const rules = [];
    for (const line of (await readFile(path.join(root, '_headers'), 'utf8')).split('\n')) {
      if (!line.trim()) continue;
      if (!/^\s/.test(line)) { rules.push({ pattern: line.trim(), headers: {} }); continue; }
      const [name, ...value] = line.trim().split(':');
      rules.at(-1).headers[name.trim()] = value.join(':').trim();
    }
    return rules;
  } catch { return []; }
}
const matches = (pattern, pathname) => pattern.endsWith('*') ? pathname.startsWith(pattern.slice(0, -1)) : pathname === pattern;
const compressible = new Set(['.html', '.css', '.js', '.json', '.txt', '.svg', '.xml', '.webmanifest']);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (prefix) {
      if (pathname === prefix) { res.writeHead(301, { Location: prefix + '/' + url.search }); res.end(); return; }
      if (!pathname.startsWith(prefix + '/')) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found (outside the simulated sub-folder)'); return; }
      pathname = pathname.slice(prefix.length);
    }
    if (pathname.split('/').some(part => part.startsWith('.') && part !== '')) { res.writeHead(404); res.end('Not found'); return; }
    let filename = path.resolve(root, '.' + pathname);
    if (!filename.startsWith(root + path.sep) && filename !== root) { res.writeHead(403); res.end('Forbidden'); return; }
    const headerRules = await loadHeaderRules(); // re-read each time so a rebuild is picked up
    let status = 200;
    try {
      if ((await stat(filename)).isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' + url.search }); res.end(); return; }
        filename = path.join(filename, 'index.html');
      }
    } catch { filename = path.join(root, '404.html'); status = 404; }
    let data = await readFile(filename);
    const ext = path.extname(filename);
    const headers = { 'Content-Type': types[ext] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' };
    for (const rule of headerRules) if (matches(rule.pattern, pathname)) Object.assign(headers, rule.headers);
    const accepts = req.headers['accept-encoding'] ?? '';
    if (compressible.has(ext)) {
      headers.Vary = 'Accept-Encoding';
      if (/\bbr\b/.test(accepts)) { data = zlib.brotliCompressSync(data); headers['Content-Encoding'] = 'br'; }
      else if (/\bgzip\b/.test(accepts)) { data = zlib.gzipSync(data); headers['Content-Encoding'] = 'gzip'; }
    }
    headers['Content-Length'] = data.length;
    res.writeHead(status, headers);
    res.end(data);
  } catch { res.writeHead(400); res.end('Unable to serve this request'); }
});
const port = Number(process.env.PORT) || 4173;
server.listen(port, '0.0.0.0', () => console.log(`MKM Services local preview: http://localhost:${port}`));
