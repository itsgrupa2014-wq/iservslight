
// Mini RAL karte (fallback, ja pilnais JSON nav pieejams)
const RAL_MAP_MINI = {
  'RAL9003': '#F5F5F5', // balts
  'RAL9005': '#0A0A0A', // melns
  'ANODIZED': '#B0B0B0' // anodēts imitēts tonis
};

/**
 * Atgriež HEX no RAL koda, prioritāri no pilnās tabulas, citādi no mini.
 */
function getHexFromRal(code) {
  const key = String(code || '').trim().toUpperCase();
  // Pilnā karte (ielādēta index.html skriptā)
  if (window.RAL_MAP_FULL && window.RAL_MAP_FULL[key]) return window.RAL_MAP_FULL[key];
  // Mini fallback
  if (RAL_MAP_MINI[key]) return RAL_MAP_MINI[key];
  // Nezināms tonis — neitrāls pelēks
  return '#CCCCCC';
}
