"""Check rendered routes, anchors, references, metadata, images, scripts and styles in dist/."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1] / 'dist'
VOID = {'img', 'meta', 'link', 'br', 'hr', 'input', 'source', 'use', 'path', 'circle', 'rect', 'stop'}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids, self.links, self.errors = set(), [], []
        self.h1 = self.main = self.eager = self.high = 0
        self.title = self.description = False
        self.refs = []          # (attribute, id) that must exist on the page
        self.stack = []         # open anchors / buttons collecting accessible text
        self.headings = []

    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if 'id' in a:
            if a['id'] in self.ids:
                self.errors.append('Duplicate ID: ' + a['id'])
            self.ids.add(a['id'])
        if 'style' in a:
            self.errors.append('Inline style attribute (blocked by the CSP)')
        if tag == 'h1':
            self.h1 += 1
        if tag in ('h1', 'h2', 'h3', 'h4'):
            self.headings.append(int(tag[1]))
        if tag == 'main':
            self.main += 1
        if tag == 'title':
            self.title = True
        if tag == 'meta' and a.get('name') == 'description':
            self.description = bool(a.get('content'))
        for attr in ('aria-controls', 'aria-labelledby', 'aria-describedby'):
            for ref in (a.get(attr) or '').split():
                self.refs.append((attr, ref))
        if tag == 'label' and a.get('for'):
            self.refs.append(('for', a['for']))
        if tag == 'a':
            if not a.get('href'):
                self.errors.append('Anchor without destination')
            elif a['href'] == '#':
                self.errors.append('Empty hash link')
            else:
                self.links.append(a['href'])
            if a.get('target') == '_blank' and 'noopener' not in (a.get('rel') or ''):
                self.errors.append('target=_blank without rel=noopener: ' + a.get('href', ''))
            self.stack.append({'tag': 'a', 'label': bool(a.get('aria-label')), 'text': '', 'href': a.get('href', '')})
        if tag == 'button':
            if 'type' not in a:
                self.errors.append('Button without a type')
            self.stack.append({'tag': 'button', 'label': bool(a.get('aria-label') or a.get('aria-labelledby')), 'text': '', 'href': ''})
        if tag == 'img':
            if 'alt' not in a:
                self.errors.append('Image missing alt')
            if not a.get('width') or not a.get('height'):
                self.errors.append('Image missing dimensions')
            if a.get('loading') == 'eager':
                self.eager += 1
            if a.get('fetchpriority') == 'high':
                self.high += 1
            if self.stack and a.get('alt'):
                self.stack[-1]['text'] += a['alt']
            if a.get('srcset'):
                if re.search(r'\d+w', a['srcset']) and not a.get('sizes'):
                    self.errors.append('srcset with width descriptors needs sizes: ' + a.get('src', ''))
                for candidate in a['srcset'].split(','):
                    asset = candidate.strip().split()[0]
                    if not (ROOT / asset.lstrip('/')).is_file():
                        self.errors.append('Missing responsive image ' + asset)
        if tag in ['img', 'script', 'link']:
            src = a.get('src') if tag != 'link' else a.get('href')
            if src and not urlsplit(src).scheme and not src.startswith('data:'):
                if not (ROOT / urlsplit(src).path.lstrip('/')).is_file():
                    self.errors.append('Missing asset ' + src)

    def handle_endtag(self, tag):
        if tag in ('a', 'button') and self.stack and self.stack[-1]['tag'] == tag:
            item = self.stack.pop()
            if not item['label'] and not item['text'].strip():
                self.errors.append(f'{tag} without an accessible name ({item["href"] or "button"})')

    def handle_data(self, data):
        if self.stack:
            self.stack[-1]['text'] += data


pages = {}
for f in ROOT.rglob('*.html'):
    p = Page(f)
    p.feed(f.read_text())
    pages['/' + str(f.relative_to(ROOT))] = p

errors = []
for name, p in pages.items():
    if p.h1 != 1:
        p.errors.append(f'Expected one H1, got {p.h1}')
    if p.main != 1:
        p.errors.append('Expected one main element')
    if not p.title or not p.description:
        p.errors.append('Missing page metadata')
    for attr, ref in p.refs:
        if ref not in p.ids:
            p.errors.append(f'{attr} points at a missing id: {ref}')
    for previous, current in zip(p.headings, p.headings[1:]):
        if current > previous + 1:
            p.errors.append(f'Heading level skipped (h{previous} to h{current})')
    if p.eager > 8:
        p.errors.append(f'Too many eager images ({p.eager}); keep below-the-fold images lazy')
    if p.high > 1:
        p.errors.append('More than one fetchpriority=high image')
    for link in p.links:
        url = urlsplit(link)
        if url.scheme:
            continue
        if not url.path:
            target_name = name
        elif url.path.endswith('/'):
            target_name = url.path + 'index.html'
        else:
            target_name = url.path
        target = pages.get(target_name)
        if not target:
            p.errors.append('Missing route ' + link)
        elif url.fragment and unquote(url.fragment) not in target.ids:
            p.errors.append('Missing fragment ' + link)
    errors.extend(f'{name}: {e}' for e in p.errors)
    text = p.path.read_text()
    for private in ['US$1,050', 'US$525', 'US$800', 'US$500']:
        if private in text:
            errors.append(name + ': private quote leaked')
    for forbidden in ['wa.me/', 'href="tel:', 'href="mailto:', 'AUD', 'UGX']:
        if forbidden in text:
            errors.append(name + ': unverified contact or currency ' + forbidden)

for css in (ROOT / 'assets').rglob('*.css'):
    for url in re.findall(r'url\(\s*[\'"]?([^)\'"]+)', css.read_text()):
        if url.startswith('data:') or url.startswith('%23'):
            continue
        if url.startswith('/') and not (ROOT / url.lstrip('/')).exists():
            errors.append('Missing CSS asset ' + url)
for js in (ROOT / 'assets').rglob('*.js'):
    code = js.read_text()
    for module in re.findall(r"from\s+['\"]([^'\"]+)['\"]", code) + re.findall(r"import\(\s*['\"]([^'\"]+)['\"]", code) + re.findall(r"^import\s+['\"]([^'\"]+)['\"]", code, re.M):
        if module.startswith('.') and not (js.parent / module).resolve().is_file():
            errors.append(f'{js.name}: missing JS module {module}')

assert len(pages) == 16, f'Expected fifteen routes plus 404, got {len(pages)}'
home = (ROOT / 'index.html').read_text()
for service in ['MKM Care Services', 'MKM Beauty', 'MKM Tax Return Services']:
    if service not in home and service.replace('MKM ', '') not in home:
        errors.append('Home is missing ' + service)
for route in ['care', 'beauty', 'tax', 'beauty/skincare', 'beauty/home-decor', 'contact', 'about', 'shop/hair-enquiry']:
    if not (ROOT / route / 'index.html').exists():
        errors.append('Missing service page ' + route)
for generated in ['manifest.webmanifest', 'robots.txt', '_headers', 'assets/site.css', 'assets/js/main.js', 'assets/brand/og-image.png']:
    if not (ROOT / generated).exists():
        errors.append('Missing generated file ' + generated)
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML documents; routes, fragments, ARIA references, link safety, images, scripts, styles and metadata resolve.')
