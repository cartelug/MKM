// Older-browser fallbacks, added mechanically so every rule gets them:
//  * a plain `vh` declaration before any `svh` / `dvh` one (iOS before 15.4, older Android)
//  * `overflow: hidden` before `overflow: clip` (iOS before 16), where clipping decorative overflow prevents sideways scrolling
// Browsers that understand the newer value simply use the later declaration.
export function addFallbacks(css) {
  return css
    .replace(/(^|[;{\s])([a-z-]+):\s*([^;{}]*\b\d+(?:\.\d+)?[sd]vh\b[^;{}]*);/g, (match, lead, prop, value) =>
      `${lead}${prop}: ${value.replace(/([sd])vh\b/g, 'vh')};${' '}${prop}: ${value};`)
    .replace(/(^|[;{\s])(overflow(?:-x|-y)?):\s*clip;/g, (match, lead, prop) => `${lead}${prop}: hidden; ${prop}: clip;`);
}
