
const imageElement = document.getElementById('productImage');
const suspendCheckbox = document.getElementById('suspend');
const colorButtons = document.querySelectorAll('.ral-btn');

let currentColor = 'base';

function updateImage() {
  const suspend = suspendCheckbox.checked ? '_no_suspension' : '';
  imageElement.src = `assets/img/linear_${currentColor}${suspend}.png`;
}

colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    colorButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentColor = btn.dataset.color;
    updateImage();
  });
});

suspendCheckbox.addEventListener('change', updateImage);
