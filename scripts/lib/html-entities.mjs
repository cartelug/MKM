// Encodes bare ampersands in generated HTML (text and attribute values) so the output is valid HTML.
// Script blocks (JSON-LD, the bootstrap script) and textareas are left untouched.
const bare = /&(?![a-zA-Z][a-zA-Z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/g;
export function encodeAmpersands(html) {
  return html.split(/(<script[\s\S]*?<\/script>|<textarea[\s\S]*?<\/textarea>)/g).map((part, i) => (i % 2 ? part : part.replace(bare, '&amp;'))).join('');
}
