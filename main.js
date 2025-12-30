
// ======= State =======
const BASE_LENGTH_MM = 1200;

const state = {
  length_mm: 1200,
  cct: 3000,
  dali: false,
  suspend: false,
  ral: 'RAL9003' // noklusējums (balts)
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

// ======= WebGL (Three.js) =======
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

const hemi = new THREE.HemisphereLight(0x222233, 0x111111, 0.4);
scene.add(hemi);

// Modelis (vienkāršots profils)
const bodyGeo = new THREE.BoxGeometry(1.2, 0.05, 0.08); // bāze ≈ 1200mm
const bodyMat = new THREE.MeshStandardMaterial({ color: getHexFromRal(state.ral), metalness: 0.6, roughness: 0.35 });
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
scene.add(bodyMesh);

const diffGeo = new THREE.BoxGeometry(1.18, 0.03, 0.06);
const diffMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.9, emissive: 0x222222 });
const diffMesh = new THREE.Mesh(diffGeo, diffMat);
diffMesh.position.y = 0.02;
scene.add(diffMesh);

// Gala “vāciņi”
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

  const half = (state.length_mm / 1000) / 2;
  capL.position.set(-half, 0, 0);
  capR.position.set( half, 0, 0);

  ropeL.position.x = -Math.max(half - 0.2, 0.2);
  ropeR.position.x =  Math.max(half - 0.2, 0.2);
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

function updateModel() {
  layoutByLength();
  bodyMat.color.set(getHexFromRal(state.ral));      // RAL krāsa
  suspensionGroup.visible = state.suspend;          // Piekare ON/OFF
  diffMat.emissive.setHex(state.cct === 3000 ? 0x332200 : 0x333333); // CCT sajūta
  render();
}

// ======= PNG FALLBACK attēlu pārslēgšana (ja WebGL nav pieejams) =======
const IMG = {
  withSuspension: {
    RAL9003: 'assets/img/linear_white.png',
    RAL9005: 'assets/img/linear_black.png',
    ANODIZED: 'assets/img/linear_anodized.png',
    default:  'assets/img/linear_base.png'
  },
  noSuspension: {
    RAL9003: 'assets/img/linear_white_no_suspension.png',
    RAL9005: 'assets/img/linear_black_no_suspension.png',
    ANODIZED: 'assets/img/linear_anodized_no_suspension.png',
    default:  'assets/img/linear_base_no_suspension.png'
  }
};

function updateFallbackImage() {
  const map = state.suspend ? IMG.withSuspension : IMG.noSuspension;
  const src = map[state.ral] || map.default;
  const img = document.getElementById('productImg');
  if (img) img.src = src;
}

// ======= UI Events =======
document.querySelectorAll('#lengths button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#lengths button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.length_mm = parseInt(btn.getAttribute('data-l'), 10);
    updateModel(); updateSummary(); updateFallbackImage();
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
  updateModel(); updateSummary(); updateFallbackImage();
});

// RAL pogas (ātrās)
document.querySelectorAll('.ral-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.ral = btn.dataset.ral;
    document.querySelectorAll('.ral-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('ralInput').value = state.ral;
    updateModel(); updateSummary(); updateFallbackImage();
  });
});

// RAL ievade (manuāla) + auto-complete
const ralInput = document.getElementById('ralInput');
const ralList  = document.getElementById('ralList');

ralInput.addEventListener('input', () => {
  const q = ralInput.value.trim().toUpperCase();
  const map = window.RAL_MAP_FULL || {}; // ja pilnais ielādējies
  const keys = Object.keys(map).length ? Object.keys(map) : Object.keys(RAL_MAP_MINI);
  const matches = keys.filter(k => k.includes(q)).slice(0, 20);
  ralList.innerHTML = matches.map(k =>
    `<button data-code="${k}" style="background:${getHexFromRal(k)};color:#111">${k}</button>`
  ).join('');
});

ralList.addEventListener('click', (e) => {
  const code = e.target.dataset.code;
  if (!code) return;
  ralInput.value = code;
  state.ral = code;
  ralList.innerHTML = '';
  updateModel(); updateSummary(); updateFallbackImage();
});

// “Specifikācija” (TXT; nākamajā iterācijā — PDF)
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
  a.download = `spec_${makeSKU()}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

// Pieteikuma poga (mock)
document.getElementById('requestQuote').addEventListener('click', () => {
  alert('Pieteikuma forma tiks pievienota nākamajā iterācijā.\nSKU: ' + makeSKU());
});

// Sākuma palaišana
window.addEventListener('DOMContentLoaded', () => {
  updateModel();
  updateSummary();
  updateFallbackImage();
});
