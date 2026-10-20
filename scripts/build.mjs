import { mkdir, cp, writeFile, rm, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages as hairPages } from '../src/templates.mjs';
import { servicePages } from '../src/service-pages.mjs';
import { site } from '../src/config/site.js';

const pages=[...servicePages,...hairPages];

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(path.join(root,'public'),dist,{recursive:true});
for(const [filename,render] of pages){
  const destination=path.join(dist,filename);
  await mkdir(path.dirname(destination),{recursive:true});
  await writeFile(destination,render());
}
await mkdir(path.join(dist,'assets/config'),{recursive:true});
await mkdir(path.join(dist,'assets/data'),{recursive:true});
for(const filename of ['app.js','order.js','styles.css','group.css'])await cp(path.join(root,'src',filename),path.join(dist,'assets',filename));
await cp(path.join(root,'src/config/site.js'),path.join(dist,'assets/config/site.js'));
await cp(path.join(root,'src/data/hair.js'),path.join(dist,'assets/data/hair.js'));
await cp(path.join(root,'src/data/services.js'),path.join(dist,'assets/data/services.js'));
await writeFile(path.join(dist,'robots.txt'),site.previewMode?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\n');
await writeFile(path.join(dist,'_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'\n/assets/*\n  Cache-Control: public, max-age=3600\n`);
console.log(`Built ${pages.length-1} pages and a custom 404. No runtime dependencies.`);
