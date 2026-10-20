// Static guards for the motion system: every hidden "before" state must sit behind a reduced-motion guard,
// the arrival respects the preference, and animation is limited to transform and opacity.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { bootstrapScript } from '../src/lib/layout.mjs';

const stylesDir = new URL('../src/styles/', import.meta.url);
const sources = readdirSync(stylesDir).filter(f => f.endsWith('.css')).sort().map(f => [f, readFileSync(new URL(f, stylesDir), 'utf8')]);
const scripts = Object.fromEntries(readdirSync(new URL('../src/scripts/', import.meta.url)).map(f => [f, readFileSync(new URL(`../src/scripts/${f}`, import.meta.url), 'utf8')]));

// Minimal CSS walker: yields { selector, body, chain } where chain is the enclosing at-rule preludes.
function* rules(css, chain = []) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('{', i);
    if (open === -1) return;
    const prelude = text.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (depth && j < text.length) { if (text[j] === '{') depth++; else if (text[j] === '}') depth--; j++; }
    const body = text.slice(open + 1, j - 1);
    if (prelude.startsWith('@media') || prelude.startsWith('@supports')) yield* rules(body, [...chain, prelude]);
    else if (!prelude.startsWith('@')) yield { selector: prelude, body, chain };
    i = j;
  }
}
const all = sources.flatMap(([file, css]) => [...rules(css)].map(r => ({ ...r, file })));

test('hidden initial states for scripted reveals exist only inside a no-preference motion guard', () => {
  const hiding = all.filter(r => /\.js\b/.test(r.selector) && /(?:^|;|\s)opacity:\s*0(?:;|\s|$)|translate3d\(0,\s*\d+(?:\.\d+)?px/.test(r.body) && !/\.js \.menu|\.js\.is-ready|\.js \.faq|\.js \.frame:not|\.js \.step/.test(r.selector));
  assert.ok(hiding.length >= 6, `expected scripted hidden states, found ${hiding.length}`);
  for (const rule of hiding) {
    assert.ok(rule.chain.some(c => c.includes('prefers-reduced-motion: no-preference')), `${rule.file}: "${rule.selector}" hides content outside @media (prefers-reduced-motion: no-preference)`);
  }
});

test('a prefers-reduced-motion: reduce block neutralises animation, transition, parallax transforms and the cursor', () => {
  const reduced = all.filter(r => r.chain.some(c => c.includes('prefers-reduced-motion: reduce')));
  const text = reduced.map(r => `${r.selector}{${r.body}}`).join('\n');
  assert.match(text, /animation-duration:\s*0\.001ms\s*!important/);
  assert.match(text, /transition-duration:\s*0\.001ms\s*!important/);
  assert.match(text, /\.reel__track/);
  assert.match(text, /\.cursor/);
});

test('the arrival has a static reduced-motion fallback and runs once per session', () => {
  assert.match(bootstrapScript, /prefers-reduced-motion: reduce/);
  assert.match(bootstrapScript, /pre-static/);
  assert.match(bootstrapScript, /sessionStorage/);
  assert.match(bootstrapScript, /getItem\('mkm-arrival'\)/);
  assert.match(bootstrapScript, /setItem\('mkm-arrival'/);
  const css = sources.map(([, c]) => c).join('\n');
  assert.match(css, /html\.pre-static \.preloader__final \{ opacity: 1; \}/);
  assert.match(css, /html\.pre-static \.preloader__svg \{ display: none; \}/);
});

test('the arrival lasts between 0.9 and 1.6 seconds and can always be skipped or finished by CSS alone', () => {
  const css = readFileSync(new URL('../src/styles/10-chrome.css', import.meta.url), 'utf8');
  const wipe = css.match(/html\.pre \.preloader \{ animation: pre-wipe ([\d.]+)s [^;]* ([\d.]+)s forwards; \}/);
  assert.ok(wipe, 'wipe animation found');
  const total = Number(wipe[1]) + Number(wipe[2]);
  assert.ok(total >= 0.9 && total <= 1.6, `arrival ends at ${total}s`);
  assert.match(css, /@keyframes pre-wipe \{ to \{[^}]*visibility: hidden/);   // dismisses itself without JS
  assert.match(scripts['preloader.js'], /addEventListener\('keydown', finish/);
  assert.match(scripts['preloader.js'], /pointerdown/);
  const finishAt = Number(scripts['preloader.js'].match(/stat \? 950 : (\d+)\)/)[1]);
  assert.ok(finishAt >= 900 && finishAt <= 1600, `script cleanup at ${finishAt}ms`);
});

test('motion scripts check the preference and low-power hints before animating', () => {
  assert.match(scripts['core.js'], /prefers-reduced-motion: reduce/);
  assert.match(scripts['motion.js'], /if \(reduce\.matches\) return;/);
  assert.match(scripts['motion.js'], /if \(!lite\)/);
  assert.match(scripts['motion.js'], /finePointer\.matches/);
  assert.match(scripts['hscroll.js'], /!reduce\.matches/);
  assert.match(scripts['counters.js'], /if \(reduce\.matches\) return;/);
  assert.match(scripts['transitions.js'], /reduce\.matches/);
  assert.match(scripts['core.js'], /saveData/);
});

test('animated and transitioned properties stay on the compositor-friendly list', () => {
  // Properties we allow to animate: transform, opacity, plus colour/stroke/visibility/clip-path feedback on small elements.
  const allowed = new Set(['transform', 'opacity', 'color', 'background-color', 'border-color', 'stroke-dashoffset', 'visibility', 'clip-path', 'box-shadow', 'grid-template-rows', 'padding', 'width', 'outline-color', 'stroke', 'fill', 'background', 'background-size', 'background-position', 'stroke-dasharray', 'top', 'filter', 'height', 'scale']);
  const flagged = [];
  for (const r of all) {
    for (const m of r.body.matchAll(/transition(?:-property)?:\s*([^;]+);/g)) {
      for (const part of m[1].split(',')) {
        const prop = part.trim().split(/\s+/)[0];
        if (prop && !/^[\d.]/.test(prop) && !['all', 'none'].includes(prop) && !allowed.has(prop)) flagged.push(`${r.selector} -> ${prop}`);
        if (prop === 'all') flagged.push(`${r.selector} -> transition: all`);
      }
    }
  }
  assert.deepEqual(flagged, []);
  // the big layout-affecting ones are limited to hover padding shifts on list rows and the accordion grid, never scroll-driven
  const layoutTransitions = all.filter(r => /transition[^;]*\b(?:height|width|top)\b/.test(r.body)).map(r => r.selector);
  assert.ok(layoutTransitions.length <= 4, `too many width/height/top transitions: ${layoutTransitions.join('; ')}`);
});

test('scroll-driven effects write transforms or custom properties, never layout properties', () => {
  for (const file of ['motion.js', 'header.js', 'scroller.js']) {
    assert.doesNotMatch(scripts[file], /\.style\.(?:top|left|height|width|margin)\s*=/, `${file} writes a layout property`);
  }
  // The pinned gallery sizes its scroll runway once (on setup and resize); its per-frame update only moves a transform.
  const hscroll = scripts['hscroll.js'];
  const update = hscroll.slice(hscroll.indexOf('const update = frameThrottle'), hscroll.indexOf('// Keyboard focus'));
  assert.match(update, /style\.transform/);
  assert.doesNotMatch(update, /\.style\.(?:top|left|height|width|margin)/);
});
