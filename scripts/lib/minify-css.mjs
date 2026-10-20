// Conservative CSS minifier: strips comments and redundant whitespace, never touches quoted strings
// (the grain data URIs) and keeps the spaces calc() needs.
export function minifyCss(source) {
  const parts = source.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) return part;
    return part
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .replace(/\s*>\s*/g, '>')
      .replace(/:\s+/g, ':');
  }).join('').trim();
}
