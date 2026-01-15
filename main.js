
// Elementi
const imageElement    = document.getElementById('productImage');
const suspendCheckbox = document.getElementById('suspend');
const colorButtons    = document.querySelectorAll('.ral-btn');

// Stāvoklis (noklusētais: "base")
let currentColor = 'base';

// Attēla atjaunošana pēc izvēlēm
function updateImage() {
  // ja piekare ieslēgta -> bez sufiksa; ja nav piekares -> _no_suspension
  const suffix = suspendCheckbox && !suspendCheckbox.checked ? '_no_suspension' : '';
  imageElement.src = `assets/img/linear_${currentColor}${suffix}.png`;
}

// Krāsu pogas
colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    colorButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentColor = btn.dataset.color;
    updateImage();
  });
});

// Piekare
if (suspendCheckbox) {
  suspendCheckbox.addEventListener('change', updateImage);
}

// Sākotnējais attēls (lai vienmēr sinhronizējas)
updateImage();
``
