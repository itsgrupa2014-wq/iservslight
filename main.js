
document.addEventListener('DOMContentLoaded', () => {
  const lengthButtons = document.querySelectorAll('#lengths button');
  const colorButtons  = document.querySelectorAll('.ral-btn');
  const suspendCheckbox = document.getElementById('suspend');
  const productImg = document.getElementById('product');

  // Atjauno attēlu pēc izvēlēm
  function updateImage() {
    const color = document.querySelector('.ral-btn.active')?.dataset.color || 'base';
    const suspended = suspendCheckbox?.checked ? '_no_suspension' : '';
    productImg.src = `./assets/img/linear_${color}${suspended}.png`;
  }

  // Garums – UI tikai (attēlam garums nav atsevišķi faili)
  lengthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lengthButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Krāsa
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateImage();
    });
  });

  // Trosītes
  if (suspendCheckbox) suspendCheckbox.addEventListener('change', updateImage);

  // Sākotnējais attēls
  updateImage();
});
