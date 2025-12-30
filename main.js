
// ======= State =======
const BASE_LENGTH_MM = 1200;

const state = {
  length_mm: 1200,
  cct: 3000,
  dali: false,
  suspend: false,
  ral: 'RAL9003'
};

// ======= UI hooks =======
const priceEl = document.getElementById('price');
const powerEl = document.getElementById('power');
const skuEl   = document.getElementById('sku');

function makeSKU() {
  const cct = state.cct + 'K';
  const ctrl = state.dali ? 'DALI' : 'STD';
  const mount = state.suspend ? 'SUS' : 'NOSUS';
  const ral = state.ral.replace(/\s+/g,'').toUpperCase();
  return `LINEAR-PRO-A-${state.length_mm}-${cct}-${ctrl}-${mount}-${ral}`;
}

function updateSummary() {
  priceEl.textContent = calcPrice(state.length_mm, state.dali) + ' €';
  powerEl.textContent = calcPower(state.length_mm);
  skuEl.textContent   = makeSKU();
}

// ======= Three.js =======
const canvas = document.getElementById('viewer');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0.8, 0.6, 1.8);

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);
const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(1,1,2);
scene.add(keyLight);

// Floor gaisma/vides tonis (neliels)
const hemi = new THREE.HemisphereLight(0x222233, 0x111111, 0.4);
scene.add(hemi);

// Modelis (vienkāršots profils)
const bodyGeo = new THREE.BoxGeometry(1.2, 0.05, 0.08); // bāze ≈ 1200mm
const bodyMat = new THREE.MeshStandardMaterial({ color: hexFromRAL(state.ral), metalness: 0.6, roughness: 0.35 });
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
scene.add(bodyMesh);

const diffGeo = new THREE.BoxGeometry(1.18, 0.03, 0.06);
const diffMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.9, emissive: 0x222222 });
const diffMesh = new THREE.Mesh(diffGeo, diffMat);
diffMesh.position.y = 0.02;
scene.add(diffMesh);

// Gala “vāciņi” (vienkārši kubi)
const capMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness:0.5, roughness:0.4 });
const capGeo = new THREE.BoxGeometry(0.02, 0.06, 0.09);
const capL = new THREE.Mesh(capGeo, capMat);
const capR = new THREE.Mesh(capGeo, capMat);
scene.add(capL, capR);

// Troses
const suspensionGroup = new THREE.Group();
const ropeMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness:0.3, roughness:0.6 });
const ropeGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.5, 12);
const ropeL = new THREE.Mesh(ropeGeo, ropeMat);
const ropeR = new THREE.Mesh(ropeGeo, ropeMat);
ropeL.position.set(-0.5, 0.3, 0);
ropeR.position.set( 0.5, 0.3, 0);
suspensionGroup.add(ropeL, ropeR);
scene.add(suspensionGroup);
suspensionGroup.visible = state.suspend;

function layoutByLength() {
  const scaleX = state.length_mm / BASE_LENGTH_MM;
  bodyMesh.scale.x = scaleX;
  diffMesh.scale.x = scaleX;

  // Gala vāciņu pozīcija: puse no garuma (metros) pret bāzi (1.2m)
  const half = (state.length_mm / 1000) / 2;
  capL.position.set(-half, 0, 0);
  capR.position.set( half, 0, 0);

  // Troses nobīde nedaudz iekšpusē
  ropeL.position.x = -Math.max(half - 0.2, 0.2);
  ropeR.position.x =  Math.max(half - 0.2, 0.2);
}

function updateModel() {
  // Garums
  layoutByLength();

  // Krāsa
  bodyMat.color.set(hexFromRAL(state.ral));

  // Piekare
  suspensionGroup.visible = state.suspend;

  // CCT — emisive tonis
  diffMat.emissive.setHex(state.cct === 3000 ? 0x332200 : 0x333333);

  render();
}

function render() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

window.addEventListener('resize', render);

// ======= UI Events =======
document.querySelectorAll('#lengths button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#lengths button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.length_mm = parseInt(btn.getAttribute('data-l'), 10);
    updateModel(); updateSummary();
  });
});

document.querySelectorAll('input[name="cct"]').forEach(r => {
  r.addEventListener('change', () => {
    state.cct = parseInt(r.value, 10);
    updateModel(); updateSummary();
  });
});

document.getElementById('dali').addEventListener('change', (e) => {
  state.dali = e.target.checked;  // piemaksa = 0, bet SKU atšķirsies
  updateSummary();
});

document.getElementById('suspend').addEventListener('change', (e) => {
  state.suspend = e.target.checked;
  updateModel(); updateSummary();
});

document.querySelectorAll('.ral-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.ral = btn.dataset.ral;
    document.querySelectorAll('.ral-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('ralInput').value = state.ral;
    updateModel(); updateSummary();
  });
});

document.getElementById('ralInput').addEventListener('change', (e) => {
  state.ral = e.target.value.trim().toUpperCase();
  // noņem aktīvo no pogām, jo ievade manuāla
  document.querySelectorAll('.ral-btn').forEach(b => b.classList.remove('active'));
  updateModel(); updateSummary();
});

// “PDF” speclapa — pagaidām teksts; vēlāk nomainīsim uz īstu PDF
document.getElementById('downloadSpec').addEventListener('click', () => {
  const spec = [
    'LINEĀRAIS GAISMEKLIS — SPECIFIKĀCIJA',
    `Garums: ${state.length_mm} mm`,
    `CCT: ${state.cct}K`,
    `Vadība: ${state.dali ? 'DALI' : 'Standarta'}`,
    `Montāža: ${state.suspend ? 'Ar trosītēm' : 'Bez trosītēm'}`,
    `Korpusa krāsa: ${state.ral}`,
    `Jauda (apr.): ${calcPower(state.length_mm)} W`,
    `Cena (bez PVN): ${calcPrice(state.length_mm, state.dali)} €`,
    `SKU: ${makeSKU()}`,
    `Barošana: 230V (iebūvēts pārveidotājs)`,
  ].join('\n');

  const blob = new Blob([spec], {type: 'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `spec_${makeSKU()}.txt`; // vēlāk būs .pdf
  a.click();
  URL.revokeObjectURL(a.href);
});

// Pieteikuma poga (mock)
document.getElementById('requestQuote').addEventListener('click', () => {
  alert('Pieteikuma forma tiks pievienota nākamajā iterācijā.\nSKU: ' + makeSKU());
});

// Sākums
function init() {
  // izmērs un pirmais renderis
  render();
  updateModel();
  updateSummary();
}
init();
