
// Mini RAL karte (papildināsim pēc vajadzības)
const RAL_MAP = {
  'RAL9003': '#F5F5F5',
  'RAL9005': '#0A0A0A',
  'ANODIZED': '#B0B0B0',
  // 'RAL9010': '#F7F7F2', ...
};

function hexFromRAL(code) {
  const key = String(code || '').trim().toUpperCase();
  return RAL_MAP[key] || '#CCCCCC';
}
