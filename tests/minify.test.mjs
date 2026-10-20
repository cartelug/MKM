import test from 'node:test';
import assert from 'node:assert/strict';
import { minifyCss } from '../scripts/lib/minify-css.mjs';
import { addFallbacks } from '../scripts/lib/css-fallbacks.mjs';
import { encodeAmpersands } from '../scripts/lib/html-entities.mjs';
import { relativizeHtml } from '../scripts/lib/relative-urls.mjs';

test('an apostrophe inside a comment cannot swallow the rest of the stylesheet', () => {
  const out = minifyCss("/* Monica's welcome ---- */\n.a { color: red; }\n/* it's fine */\n.b { margin: 0 auto; }\n.c { background: url(\"data:image/svg+xml;utf8,<svg a='1'/>\"); }");
  assert.equal(out, ".a{color:red}.b{margin:0 auto}.c{background:url(\"data:image/svg+xml;utf8,<svg a='1'/>\")}");
});
test('calc() keeps the spaces it needs and strings are untouched', () => {
  assert.equal(minifyCss('.a { width: calc(100% - 2 * var(--gutter)); content: "a  ,  b"; }'), '.a{width:calc(100% - 2 * var(--gutter));content:"a  ,  b"}');
});
test('older-browser fallbacks are added before the modern value, once per declaration', () => {
  assert.equal(addFallbacks('.a{min-height:100svh;}').replace(/\s/g, ''), '.a{min-height:100vh;min-height:100svh;}');
  assert.equal(addFallbacks('.a{height:calc(100dvh - 24px);}'), '.a{height: calc(100vh - 24px); height: calc(100dvh - 24px);}');
  assert.equal(addFallbacks('.a{overflow:clip;}').replace(/\s/g, ''), '.a{overflow:hidden;overflow:clip;}');
  assert.equal(addFallbacks('.a{overflow-x: clip;}').replace(/\s/g, ''), '.a{overflow-x:hidden;overflow-x:clip;}');
  assert.equal(addFallbacks('.a{height:100vh;}'), '.a{height:100vh;}');
});
test('ampersands are encoded everywhere except script and textarea content', () => {
  const html = '<p>Hair & skin &amp; home &copy; &#169;</p><a href="/x?a=1&b=2">x</a><script>if(a&&b){}</script><textarea>a & b</textarea>';
  assert.equal(encodeAmpersands(html), '<p>Hair &amp; skin &amp; home &copy; &#169;</p><a href="/x?a=1&amp;b=2">x</a><script>if(a&&b){}</script><textarea>a & b</textarea>');
});
test('root-relative URLs become document-relative at the right depth, including srcset', () => {
  const html = '<a href="/care/">c</a><a href="https://x.test/a">e</a><a href="#top">t</a><img src="/assets/a.webp" srcset="/assets/a-480.webp 480w, /assets/a.webp 800w"><button data-full="/assets/h.webp"></button>';
  assert.equal(relativizeHtml(html, 'index.html'), '<a href="./care/">c</a><a href="https://x.test/a">e</a><a href="#top">t</a><img src="./assets/a.webp" srcset="./assets/a-480.webp 480w, ./assets/a.webp 800w"><button data-full="./assets/h.webp"></button>');
  assert.equal(relativizeHtml('<a href="/">h</a><link href="/assets/site.css">', 'beauty/hair/index.html'), '<a href="../../">h</a><link href="../../assets/site.css">');
});
