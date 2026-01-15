
document.addEventListener('DOMContentLoaded', () => {
  const colorButtons = document.querySelectorAll('.ral-btn');
  const suspendCheckbox = document.getElementById('suspend');
  const productImg = document.getElementById('product');

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
