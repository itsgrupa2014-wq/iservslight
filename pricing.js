
// Vienkāršs piemērs cenas aprēķinam
const prices = {
  600: 20,
  1200: 30,
  1800: 40,
  2400: 50,
  3000: 60
};

document.addEventListener('DOMContentLoaded', () => {
  const priceEl = document.getElementById('price');
  const powerEl = document.getElementById('power');
  const skuEl = document.getElementById('sku');

  const lengthButtons = document.querySelectorAll('#lengths button');

  lengthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const length = btn.dataset.l;
      priceEl.textContent = prices[length] + ' €';
      powerEl.textContent = (length / 100) * 4; // aptuvena jauda
      skuEl.textContent = `LED-${length}`;
    });
  });
});
