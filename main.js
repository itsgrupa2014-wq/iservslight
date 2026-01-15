
const imageElement = document.getElementById('productImage');
const suspendCheckbox = document.getElementById('suspend');
const daliCheckbox = document.getElementById('dali');
const colorButtons = document.querySelectorAll('.ral-btn');
const lengthButtons = document.querySelectorAll('#lengths button');
const priceElement = document.getElementById('price');
const powerElement = document.getElementById('power');
const skuElement = document.getElementById('sku');

let currentColor = 'base';
let currentLength = 1200;

// Attēla maiņa
function updateImage() {
  const suffix = suspendCheckbox && !suspendCheckbox.checked ? '_no_suspension' : '';
  imageElement.src = `assets/img/linear_${currentColor}${suffix}.png`;
}

// Cena + SKU
function updateSummary() {
  const basePrice = 50; // EUR
  const lengthFactor = currentLength / 600; // piem. 600mm = 1x, 1200mm = 2x
  const colorExtra = currentColor !== 'base' ? 10 : 0;
  const daliExtra = daliCheckbox.checked ? 5 : 0;
  const suspendExtra = suspendCheckbox.checked ? 3 : 0;

  const price = basePrice * lengthFactor + colorExtra + daliExtra + suspendExtra;
  const power = (currentLength / 300) * 5; // aptuvena jauda W
  const sku = `LIN-${currentLength}-${currentColor}${suspendCheckbox.checked ? '-S' : ''}${daliCheckbox.checked ? '-DALI' : ''}`;

  priceElement.textContent = price.toFixed(2) + ' €';
  powerElement.textContent = power.toFixed(1);
  skuElement.textContent = sku;
}

// Krāsu pogas
colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    colorButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentColor = btn.dataset.color;
    updateImage();
    updateSummary();
  });
});

// Garuma pogas
lengthButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    lengthButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLength = parseInt(btn.dataset.l);
    updateSummary();
  });
});

// Checkbox
[suspendCheckbox, daliCheckbox].forEach(chk => {
  chk.addEventListener('change', () => {
    updateImage();
    updateSummary();
  });
});

// Sākotnējais stāvoklis
updateImage();
updateSummary();
