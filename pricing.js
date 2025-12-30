
// Cenu tabula pēc garuma (bez PVN)
const PRICE_BY_LENGTH = {
  600: 120,
  1200: 180,
  1800: 220,
  2400: 250,
  3000: 310
};

// DALI piemaksa pagaidām nav
const DALI_SURCHARGE = 0;

// W/m (piemērs; aizstāj ar jūsu reālo vērtību)
const POWER_W_PER_M = 12;

/**
 * Aprēķina cenu (bez PVN)
 */
function calcPrice(lengthMM, dali /*bool*/) {
  const base = PRICE_BY_LENGTH[lengthMM] || 0;
  const extra = dali ? DALI_SURCHARGE : 0;
  return Math.round(base + extra);
}

/**
 * Aprēķina jaudu (W) pēc garuma
 */
function calcPower(lengthMM) {
  const m = lengthMM / 1000;
  return Math.round(POWER_W_PER_M * m);
}
