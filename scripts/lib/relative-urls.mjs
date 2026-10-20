// Turns root-relative URLs ("/assets/site.css", "/care/") into document-relative ones ("../assets/site.css",
// "../care/") so the same build works at a domain root, in a sub-folder, or opened from any path.
// The 404 page is left root-relative because it is served for URLs at any depth.
const prefixFor = file => {
  const depth = file.split('/').length - 1;
  return depth === 0 ? './' : '../'.repeat(depth);
};
const rel = (value, prefix) => (value.startsWith('/') && !value.startsWith('//') ? prefix + value.slice(1) : value);

export function relativizeHtml(html, file) {
  const prefix = prefixFor(file);
  return html
    .replace(/(\s(?:href|src|data-full|poster)=")([^"]*)"/g, (_, attr, value) => `${attr}${rel(value, prefix)}"`)
    .replace(/(\ssrcset=")([^"]*)"/g, (_, attr, value) => `${attr}${value.split(',').map(candidate => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      return [rel(url, prefix), ...descriptor].join(' ');
    }).join(', ')}"`);
}
