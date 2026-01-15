
document.addEventListener('DOMContentLoaded', () => {
  const lengthButtons = document.querySelectorAll('#lengths button');
  const colorButtons = document.querySelectorAll('.ral-btn');
  const suspendCheckbox = document.getElementById('suspend');
  const productImg = document.getElementById('product');

  lengthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lengthButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateImage();
    });
  });

  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateImage();
    });
  });

  suspendCheckbox.addEventListener('change', updateImage);

  function updateImage() {
    const color = document.querySelector('.ral-btn.active').dataset.color;
    const suspend = suspendCheckbox.checked ? '_no_suspension' : '';
    productImg.src = `./assets/img/linear_${color}${suspend}.png`;
  }
});
