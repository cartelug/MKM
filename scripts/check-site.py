"""Check rendered routes, anchors, duplicate IDs, metadata, images and assets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.path=path;self.ids=set();self.links=[];self.errors=[];self.h1=0;self.main=0;self.title=False;self.description=False;self.images=0
 def handle_starttag(self,tag,attributes):
  a=dict(attributes)
  if 'id' in a:
   if a['id'] in self.ids:self.errors.append('Duplicate ID: '+a['id'])
   self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='main':self.main+=1
  if tag=='title':self.title=True
  if tag=='meta' and a.get('name')=='description':self.description=bool(a.get('content'))
  if tag=='a':
   if not a.get('href'):self.errors.append('Anchor without destination')
   elif a['href']=='#':self.errors.append('Empty hash link')
   else:self.links.append(a['href'])
  if tag=='img':
   self.images+=1
   if 'alt' not in a:self.errors.append('Image missing alt')
   if not a.get('width') or not a.get('height'):self.errors.append('Image missing dimensions')
   if a.get('srcset'):
    for candidate in a['srcset'].split(','):
     asset=candidate.strip().split()[0]
     if not (ROOT/asset.lstrip('/')).is_file():self.errors.append('Missing responsive image '+asset)
  if tag in ['img','script','link']:
   src=a.get('src') if tag!='link' else a.get('href')
   if src and not urlsplit(src).scheme:
    target=ROOT/src.lstrip('/')
    if not target.is_file():self.errors.append('Missing asset '+src)

pages={}
for f in ROOT.rglob('*.html'):
 p=Page(f);p.feed(f.read_text());pages['/'+str(f.relative_to(ROOT))]=p
errors=[]
for name,p in pages.items():
 if p.h1!=1:p.errors.append(f'Expected one H1, got {p.h1}')
 if p.main!=1:p.errors.append('Expected one main element')
 if not p.title or not p.description:p.errors.append('Missing page metadata')
 for link in p.links:
  url=urlsplit(link)
  if url.scheme:continue
  if not url.path:target_name=name
  elif url.path.endswith('/'):target_name=url.path+'index.html'
  else:target_name=url.path
  target=pages.get(target_name)
  if not target:p.errors.append('Missing route '+link)
  elif url.fragment and unquote(url.fragment) not in target.ids:p.errors.append('Missing fragment '+link)
 errors.extend(f'{name}: {e}' for e in p.errors)
 text=p.path.read_text()
 for private in ['US$1,050','US$525','US$800','US$500']:
  if private in text:errors.append(name+': private quote leaked')
 for forbidden in ['wa.me/','href="tel:','href="mailto:','AUD','UGX']:
  if forbidden in text:errors.append(name+': unverified contact or currency '+forbidden)
for css in (ROOT/'assets').rglob('*.css'):
 for url in re.findall(r'url\([\'"]?([^\)\'\"]+)',css.read_text()):
  if url.startswith('/') and not (ROOT/url.lstrip('/')).exists():errors.append('Missing CSS asset '+url)
for js in (ROOT/'assets').rglob('*.js'):
 for module in re.findall(r"from\s+['\"]([^'\"]+)['\"]",js.read_text()):
  if module.startswith('.') and not (js.parent/module).resolve().is_file():errors.append('Missing JS module '+module)
assert len(pages)==16,f'Expected fifteen routes plus 404, got {len(pages)}'
home=(ROOT/'index.html').read_text()
for service in ['MKM Care Services','MKM Beauty','MKM Tax Return Services']:
 if service not in home:errors.append('Home is missing '+service)
for route in ['care','beauty','tax','beauty/skincare','beauty/home-decor']:
 if not (ROOT/route/'index.html').exists():errors.append('Missing new service page '+route)
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML documents; all routes, fragments, images, styles and metadata resolve.')
