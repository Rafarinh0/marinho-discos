const PALETTES: Array<[string, string]> = [
  ['#c14a2b', '#1e1410'], // burnt orange
  ['#e8c44d', '#1a1410'], // mustard
  ['#5e8c49', '#0e1a0a'], // moss
  ['#d34a7e', '#1a0d14'], // rose
  ['#3d6e9e', '#0e1620'], // dusty blue
  ['#a83a2a', '#1a0e0a'], // brick
  ['#9a7c4a', '#1a1408'], // sienna
  ['#7a4ec1', '#140a1a'], // plum
  ['#3d8a4a', '#0a1a0e'], // forest
  ['#d4a13e', '#1a0e08'], // amber
  ['#6a8e8a', '#0e1818'], // sage
  ['#b85c4a', '#1a0e0a'], // terracotta
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function paletteFor(seed: string): { c1: string; c2: string } {
  const idx = hashString(seed) % PALETTES.length;
  const [c1, c2] = PALETTES[idx];
  return { c1, c2 };
}
