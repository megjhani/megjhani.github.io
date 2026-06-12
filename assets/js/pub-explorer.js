import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* Publications brain explorer
   - Full-screen three.js brain (same procedural mesh)
   - 38 paper nodes on surface; mouse controls spin speed/direction
   - Hover a node → card with title/venue/year
   - Click → panel slides in from right with full details + search links
   - Hover over node = brain slows; move away = resumes spin
*/

const CAT = {
  neuro:   { color: "#55d6be", label: "Neurocritical Care AI" },
  ml:      { color: "#e6b85c", label: "Foundation Models & Methods" },
  mind:    { color: "#9edc76", label: "Music, Consciousness & Brain States" },
  imaging: { color: "#c9a6ff", label: "Biological Imaging & Signal Analysis" },
};

const PAPERS = [
  { y:2026, t:"ICP-WAVES: Intracranial Pressure Waveform Analysis and Visualization for Enhanced Signal Processing", v:"IEEE TBME",            c:"neuro",   auth:"Megjhani M, Li Y, Grassi G, et al." },
  { y:2025, t:"Application of a time series foundation model to noninvasively estimate intracranial pressure",     v:"J Clin Monit Comput",  c:"ml",      auth:"Megjhani M, Weinerman B, Alalqum T, et al." },
  { y:2025, t:"Physiological Signals Boosted by Artificial Intelligence Save Time and Brain Function",              v:"NEJM AI",              c:"neuro",   auth:"Park S, Li Y, Megjhani M" },
  { y:2025, t:"Let the Experts Speak: Improving Survival Prediction via Mixture-of-Experts Heads (CAMOE)",         v:"NeurIPS",              c:"ml",      auth:"Morrill T, Puli A, Megjhani M, Park S, Zemel R" },
  { y:2025, t:"Mathematical models for hospital dynamics via information theory",                                   v:"npj Digital Medicine", c:"ml",      auth:"Megjhani M et al." },
  { y:2025, t:"Pressure reactivity and cerebral oximetry in aneurysmal subarachnoid hemorrhage",                  v:"Neurocritical Care",   c:"neuro",   auth:"Megjhani M et al." },
  { y:2025, t:"Bronchiolitis low-risk respiratory deterioration cohort study",                                     v:"BMJ Open",             c:"neuro",   auth:"Megjhani M et al." },
  { y:2025, t:"Pulse-rate variability predicts length of stay in bronchiolitis PICU admissions",                   v:"J Clin Monit Comput",  c:"neuro",   auth:"Megjhani M et al." },
  { y:2025, t:"Pediatric VA-ECMO early risk factors for mortality",                                                v:"Perfusion",            c:"neuro",   auth:"Megjhani M et al." },
  { y:2024, t:"Non-invasive pulse arrival time and cardiac index estimation",                                      v:"Physiol Meas",         c:"neuro",   auth:"Megjhani M et al." },
  { y:2023, t:"Suboptimal cerebral perfusion pressure and ischemia after intracerebral hemorrhage",                v:"Neurocritical Care",   c:"neuro",   auth:"Megjhani M et al." },
  { y:2023, t:"Heart rate and HRV as prognostic biomarkers after cardiac arrest",                                  v:"Resuscitation Plus",   c:"neuro",   auth:"Megjhani M et al." },
  { y:2023, t:"Automatic ICP waveform morphology identification via wavelet analysis",                             v:"Physiol Meas",         c:"neuro",   auth:"Megjhani M et al." },
  { y:2023, t:"A Deep Learning Framework for Deriving Noninvasive Intracranial Pressure Waveforms from TCD",       v:"Annals of Neurology",  c:"neuro",   auth:"Megjhani M, Terilli K, Weinerman B, et al." },
  { y:2023, t:"Oxygen reactivity and disturbed cerebral perfusion after subarachnoid hemorrhage",                  v:"Critical Care",        c:"neuro",   auth:"Megjhani M et al." },
  { y:2023, t:"Generalizable DCI detection across centers via federated learning",                                 v:"IEEE BIBM",            c:"ml",      auth:"Megjhani M et al." },
  { y:2023, t:"Optimal cerebral perfusion pressure and brain tissue oxygen in aneurysmal SAH",                     v:"Stroke",               c:"neuro",   auth:"Megjhani M, Weiss M, Ford J, et al." },
  { y:2023, t:"Level of consciousness classification in a neurological intensive care unit",                       v:"Neurocritical Care",   c:"mind",    auth:"Megjhani M et al." },
  { y:2022, t:"Vector Angle Analysis of Multimodal Neuromonitoring for Continuous DCI Prediction",                v:"Neurocritical Care",   c:"neuro",   auth:"Megjhani M, Weiss M, Kwon SB, et al." },
  { y:2022, t:"Optimal cerebral perfusion pressure during delayed cerebral ischemia after aneurysmal SAH",         v:"Critical Care Medicine",c:"neuro",  auth:"Megjhani M et al." },
  { y:2022, t:"Real-time machine learning deployment for delayed cerebral ischemia detection",                     v:"IEEE HI-POCT",         c:"ml",      auth:"Megjhani M et al." },
  { y:2021, t:"Dynamic Detection of Delayed Cerebral Ischemia: A Study in Three Centers",                         v:"Stroke",               c:"neuro",   auth:"Megjhani M, Terilli K, Weiss M, et al." },
  { y:2021, t:"Dynamic ICP waveform morphology predicts ventriculostomy-related infection",                        v:"Neurocritical Care",   c:"neuro",   auth:"Megjhani M et al." },
  { y:2021, t:"Endotypes of hospitalized COVID-19 patients",                                                       v:"Frontiers in Medicine",c:"ml",      auth:"Megjhani M et al." },
  { y:2020, t:"Machine learning to predict delayed cerebral ischemia and outcomes in subarachnoid hemorrhage",     v:"Neurology",            c:"ml",      auth:"Megjhani M et al." },
  { y:2020, t:"Harnessing big data for neurocritical care precision medicine",                                     v:"Curr Treat Options",   c:"ml",      auth:"Megjhani M et al." },
  { y:2019, t:"Detection of brain activation in unresponsive patients with acute brain injury",                    v:"NEJM",                 c:"mind",    auth:"Megjhani M et al." },
  { y:2019, t:"HRV as a biomarker of neurocardiogenic injury after subarachnoid hemorrhage",                      v:"Neurocritical Care",   c:"neuro",   auth:"Megjhani M et al." },
  { y:2019, t:"Deep brain lesions and impaired consciousness after traumatic brain injury",                        v:"Scientific Reports",   c:"mind",    auth:"Megjhani M et al." },
  { y:2019, t:"Clustering ICP waveform morphology in patients with ventriculitis",                                 v:"Physiol Meas",         c:"neuro",   auth:"Megjhani M et al." },
  { y:2018, t:"Active-learning framework for ICP waveform morphology identification",                              v:"Physiol Meas",         c:"ml",      auth:"Megjhani M et al." },
  { y:2018, t:"Dictionary learning improves delayed cerebral ischemia prediction",                                 v:"Frontiers in Neurology",c:"ml",     auth:"Megjhani M et al." },
  { y:2017, t:"Mobile EEG brain dynamics during art museum experience",                                            v:"Front Hum Neurosci",   c:"mind",    auth:"Megjhani M et al." },
  { y:2017, t:"Morphological constraint spectral unmixing of biological tissues",                                  v:"Bioinformatics",       c:"imaging", auth:"Megjhani M, Roysam B" },
  { y:2015, t:"Your Brain on Art: Emergent Cortical Dynamics During Aesthetic Experiences",                        v:"Front Hum Neurosci",   c:"mind",    auth:"Megjhani M*, Kontson K*, Cruz-Garza JG, et al." },
  { y:2015, t:"Population-scale 3D reconstruction of microglial arbors from confocal stacks",                      v:"Bioinformatics",       c:"imaging", auth:"Megjhani M, Rey-Villamizar N, et al." },
  { y:2015, t:"Unsupervised population profiling of microglial morphologies",                                      v:"IEEE J-STSP",          c:"imaging", auth:"Megjhani M et al." },
  { y:2014, t:"Automated image analysis of tissue around chronically implanted neural devices",                    v:"Front Neuroinform",    c:"imaging", auth:"Megjhani M et al." },
];

// ---- value noise helpers (same as brain-scene.js) -----------------------
function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function smooth(t) { return t * t * (3 - 2 * t); }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = smooth(xf), v = smooth(yf), w = smooth(zf);
  const lerp = (a, b, t) => a + (b - a) * t;
  return lerp(
    lerp(lerp(hash3(xi,yi,zi),    hash3(xi+1,yi,zi),    u), lerp(hash3(xi,yi+1,zi),    hash3(xi+1,yi+1,zi),    u), v),
    lerp(lerp(hash3(xi,yi,zi+1),  hash3(xi+1,yi,zi+1),  u), lerp(hash3(xi,yi+1,zi+1),  hash3(xi+1,yi+1,zi+1),  u), v),
    w
  );
}
function fbm(x, y, z) {
  let f = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 5; i++) { f += amp * vnoise(x*freq, y*freq, z*freq); freq *= 2.1; amp *= 0.48; }
  return f;
}

const _v  = new THREE.Vector3();
const _v2 = new THREE.Vector3();

// ridged, anisotropic noise → cortex-like gyral ridges (shared with brain-scene.js)
function brainFold(dir) {
  const wx = fbm(dir.x*1.4+1.2, dir.y*1.4+4.7, dir.z*1.4+8.3);
  const wy = fbm(dir.x*1.4+9.2, dir.y*1.4+2.3, dir.z*1.4+1.7);
  const F = 4.6;
  const n1 = fbm(dir.x*F*1.1+wx*2.6, dir.y*F*1.9+wy*2.6, dir.z*F*0.7+wx*1.8);
  let r1 = 1 - Math.abs(2 * n1 - 1);
  r1 = r1 * r1 * (3 - 2 * r1);
  const n2 = fbm(dir.x*F*2.4+5.1, dir.y*F*3.3+2.7, dir.z*F*1.6+9.4);
  const r2 = 1 - Math.abs(2 * n2 - 1);
  return r1 * 0.72 + r2 * 0.28;
}
function brainPoint(dir, out, scale) {
  const r = 1 + 0.46 * (brainFold(dir) - 0.5);
  out.copy(dir).multiplyScalar(r * scale);
  out.x *= 0.96; out.z *= 1.26; out.y *= 0.94;
  const z = out.z / scale;
  const frontNarrow = 1 - 0.12 * smooth(Math.max(0, Math.min(1, (z - 0.25) / 0.85)));
  const backNarrow  = 1 - 0.18 * smooth(Math.max(0, Math.min(1, (-z - 0.70) / 0.60)));
  out.x *= frontNarrow * backNarrow;
  const fr = smooth(Math.max(0, Math.min(1, (z - 0.10) / 0.95)));
  if (out.y > 0) out.y *= 1 + fr * 0.08;
  // Sylvian fissure + temporal lobe
  const sideAbs = Math.abs(out.x) / scale;
  const sylLine = (-0.02 + z * 0.16) * scale;
  const sylDist = (out.y - sylLine) / scale;
  const syl = Math.exp(-(sylDist*sylDist) / 0.014) * smooth(Math.max(0, Math.min(1, (sideAbs - 0.28) / 0.35)));
  out.addScaledVector(dir, -0.30 * scale * syl);
  const tl = Math.max(0, (sylLine - out.y)/scale - 0.02) * smooth(Math.max(0, Math.min(1, (sideAbs - 0.24) / 0.4)));
  out.y -= tl * 0.42 * scale;
  out.x += Math.sign(out.x) * tl * 0.26 * scale;
  // longitudinal fissure
  const mid = Math.exp(-(out.x*out.x) / (0.0085*scale*scale));
  const top = smooth(Math.max(0, Math.min(1, (out.y/scale + 0.02) / 0.5)));
  out.addScaledVector(dir, -0.70 * scale * mid * top);
  // flat base
  if (out.y < -0.30*scale) out.y = -0.30*scale + (out.y + 0.30*scale) * 0.40;
  // occipital taper
  if (z < -0.55) {
    const t = (-z - 0.55) / 0.55;
    out.x *= 1 - t * 0.34;
    out.y -= t * t * 0.10 * scale;
  }
  // cerebellum
  const zb = out.z/scale + 0.70, yb = out.y/scale + 0.30;
  const cb = Math.exp(-(zb*zb)/0.055) * Math.exp(-(yb*yb)/0.045);
  out.y -= cb * 0.14 * scale;
  out.z -= cb * 0.08 * scale;
  // brainstem nub
  const zs = out.z/scale + 0.30, xs = out.x/scale;
  const bs = Math.exp(-(zs*zs)/0.03) * Math.exp(-(xs*xs)/0.02) * Math.max(0, -out.y/scale - 0.34);
  out.y -= bs * 0.5 * scale;
  return out;
}

// ---- DOM refs -------------------------------------------------------
const canvas   = document.getElementById("pub-canvas");
const card     = document.getElementById("pub-card");
const cardTitle = document.getElementById("pc-title");
const cardMeta  = document.getElementById("pc-meta");
const cardDot   = document.getElementById("pc-dot");
const panel     = document.getElementById("pub-panel");
const panelBody = document.getElementById("pub-panel-body");
const closeBtn  = document.getElementById("pub-close");
const backdrop  = document.getElementById("pub-backdrop");
const hint      = document.getElementById("pub-hint");

if (!canvas) throw new Error("pub-canvas not found");

// ---- Three.js scene -------------------------------------------------
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(55, 1, 0.1, 50);
camera.position.set(0, 0.1, 5.0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

scene.add(new THREE.AmbientLight(0xbfeee6, 0.6));
const key = new THREE.DirectionalLight(0xffffff, 0.7);
key.position.set(2, 3, 4);
scene.add(key);

const world = new THREE.Group();
scene.add(world);

// ---- build brain ----------------------------------------------------
const BSCALE  = 1.55;
const ico     = new THREE.IcosahedronGeometry(1, 4);
const srcPos  = ico.getAttribute("position");
const faces   = srcPos.count / 3;
const dir     = new THREE.Vector3();
const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();

const posArr = [], colArr = [];
const sulcusC = new THREE.Color("#020a08");
const gyrusC  = new THREE.Color("#dffdf7");

for (let k = 0; k < 18000; k++) {
  const f = (Math.random() * faces) | 0;
  A.set(srcPos.getX(f*3),   srcPos.getY(f*3),   srcPos.getZ(f*3));
  B.set(srcPos.getX(f*3+1), srcPos.getY(f*3+1), srcPos.getZ(f*3+1));
  C.set(srcPos.getX(f*3+2), srcPos.getY(f*3+2), srcPos.getZ(f*3+2));
  let u = Math.random(), v = Math.random();
  if (u + v > 1) { u = 1 - u; v = 1 - v; }
  dir.copy(A).multiplyScalar(1-u-v).addScaledVector(B, u).addScaledVector(C, v).normalize();
  brainPoint(dir, _v, BSCALE);
  const groove = Math.exp(-(_v.x*_v.x) / (0.010*BSCALE*BSCALE)) * (_v.y > -0.02*BSCALE ? 1 : 0);
  if (groove > 0.38) continue;
  posArr.push(_v.x, _v.y, _v.z);
  const fv = brainFold(dir);
  const bc = sulcusC.clone().lerp(gyrusC, Math.pow(fv, 0.65));
  colArr.push(bc.r, bc.g, bc.b);
}

const brainGeo = new THREE.BufferGeometry();
brainGeo.setAttribute("position", new THREE.BufferAttribute(Float32Array.from(posArr), 3));
brainGeo.setAttribute("color",    new THREE.BufferAttribute(Float32Array.from(colArr), 3));

const brainMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: {
    uSize:  { value: 0.028 },
    uScale: { value: 1 },
    uFade:  { value: 1 },
  },
  vertexShader: `
    attribute vec3 color;
    uniform float uSize; uniform float uScale; uniform float uFade;
    varying vec3 vColor; varying float vAlpha;
    void main() {
      vColor = color;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float depth = clamp((-mv.z - 1.8) / 4.8, 0.0, 1.0);
      vAlpha = (0.80 - depth * 0.48) * uFade;
      gl_PointSize = uSize * uScale * (1.3 - depth * 0.38) / -mv.z;
      gl_Position  = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying vec3 vColor; varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      if (length(c) > 0.5) discard;
      float a = smoothstep(0.5, 0.06, length(c));
      gl_FragColor = vec4(vColor, a * vAlpha);
    }
  `,
});
world.add(new THREE.Points(brainGeo, brainMat));

// faint body
const bodyGeo = new THREE.IcosahedronGeometry(1, 4);
const bp      = bodyGeo.getAttribute("position");
for (let i = 0; i < bp.count; i++) {
  dir.set(bp.getX(i), bp.getY(i), bp.getZ(i)).normalize();
  brainPoint(dir, _v, BSCALE);
  bp.setXYZ(i, _v.x, _v.y, _v.z);
}
bp.needsUpdate = true;
bodyGeo.computeVertexNormals();
world.add(new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({
  color: 0x2f9e93, transparent: true, opacity: 0.06,
  roughness: 0.8, metalness: 0, depthWrite: false,
})));

// ---- paper nodes on surface -----------------------------------------
function glowTex() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const ctx = cv.getContext("2d");
  const g   = ctx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,   "rgba(255,255,255,1)");
  g.addColorStop(0.35,"rgba(255,255,255,0.65)");
  g.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(0,0,64,64);
  return new THREE.CanvasTexture(cv);
}
const glowTexture = glowTex();
const nodeGroup   = new THREE.Group();
world.add(nodeGroup);
const nodeObjs = [], hitObjs = [];
const golden   = Math.PI * (3 - Math.sqrt(5));

for (let i = 0; i < PAPERS.length; i++) {
  const y   = 1 - (i / (PAPERS.length - 1)) * 2;
  const rad = Math.sqrt(1 - y * y);
  dir.set(Math.cos(golden * i) * rad, y, Math.sin(golden * i) * rad).normalize();
  brainPoint(dir, _v, BSCALE);
  _v.addScaledVector(dir, 0.07);   // lift off surface

  const color = new THREE.Color(CAT[PAPERS[i].c].color);
  const group = new THREE.Group();
  group.position.copy(_v);

  // visible sphere
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 12, 12),
    new THREE.MeshBasicMaterial({ color })
  );
  // glow sprite
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture, color, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glow.scale.setScalar(0.16);
  // invisible hit sphere (larger for comfort)
  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  );
  hit.userData.index = i;
  hitObjs.push(hit);

  group.add(core, glow, hit);
  group.userData = { hover: 0, base: color };
  nodeGroup.add(group);
  nodeObjs.push(group);
}

// ---- resize ---------------------------------------------------------
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  brainMat.uniforms.uScale.value = renderer.domElement.height * 0.5;
}
window.addEventListener("resize", resize);
resize();

// ---- interaction ----------------------------------------------------
const mouse   = new THREE.Vector2(0, 0);
const pointer = new THREE.Vector2(0, 0);
let rect      = canvas.getBoundingClientRect();
let hovIdx    = -1;
let panelOpen = false;

function updatePointer(e) {
  mouse.x   = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y   = -((e.clientY / window.innerHeight) * 2 - 1);
  pointer.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  pointer.y = -(((e.clientY - rect.top)  / rect.height) * 2 - 1);
}
window.addEventListener("pointermove", updatePointer);
window.addEventListener("scroll", () => { rect = canvas.getBoundingClientRect(); }, { passive: true });

// drag (mouse or finger) rotates the brain directly, with inertia
let dragging = false, dragMoved = 0, lastDragX = 0, dragVel = 0;
canvas.addEventListener("pointerdown", (e) => {
  updatePointer(e);          // touch never fires pointermove before tap
  dragging = true;
  dragMoved = 0;
  lastDragX = e.clientX;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!dragging || panelOpen) return;
  const dx = e.clientX - lastDragX;
  lastDragX = e.clientX;
  dragMoved += Math.abs(dx);
  dragVel = dx * 0.005;
  autoAngle += dragVel;
});
window.addEventListener("pointerup", () => { dragging = false; });

canvas.addEventListener("click", () => {
  if (dragMoved > 8) return;          // it was a drag, not a tap
  if (hovIdx >= 0) openPanel(hovIdx);
});

if (closeBtn) closeBtn.addEventListener("click",  closePanel);
if (backdrop) backdrop.addEventListener("click",  closePanel);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

function openPanel(idx) {
  const p = PAPERS[idx];
  const cat = CAT[p.c];
  const qTitle = encodeURIComponent(p.t);
  panelBody.innerHTML = `
    <span class="pp-cat" style="--cc:${cat.color}">${cat.label}</span>
    <h2 class="pp-title">${p.t}</h2>
    <p class="pp-auth">${p.auth}</p>
    <div class="pp-meta">
      <span class="pp-venue">${p.v}</span>
      <span class="pp-year">${p.y}</span>
    </div>
    <div class="pp-actions">
      <a class="pp-btn pp-btn--primary" href="https://scholar.google.com/scholar?q=${qTitle}" target="_blank" rel="noreferrer">
        Open on Google Scholar
      </a>
      <a class="pp-btn" href="https://pubmed.ncbi.nlm.nih.gov/?term=${qTitle}" target="_blank" rel="noreferrer">
        Search PubMed
      </a>
    </div>
  `;
  panel.classList.add("is-open");
  if (backdrop) backdrop.classList.add("is-open");
  panelOpen = true;
  if (hint) hint.style.opacity = "0";
}

function closePanel() {
  panel.classList.remove("is-open");
  if (backdrop) backdrop.classList.remove("is-open");
  panelOpen = false;
  if (hint) hint.style.opacity = "";
}

// dev helper: ?open=N opens paper N's panel (also handy for deep links)
const openParam = new URLSearchParams(window.location.search).get("open");
if (openParam !== null) {
  const idx = Math.max(0, Math.min(PAPERS.length - 1, parseInt(openParam, 10) || 0));
  openPanel(idx);
}

// ---- animate --------------------------------------------------------
const raycaster = new THREE.Raycaster();
const tmp       = new THREE.Vector3();
let autoAngle   = 0;
let smoothMouse = 0;
let smoothTiltX = 0;

function animate() {
  // auto-spin; mouse X adjusts speed/direction; hover slows; drag overrides
  smoothMouse += (mouse.x - smoothMouse) * 0.04;
  const hoverSlow = hovIdx >= 0 ? 0.05 : 1.0;
  const spinSpeed = (0.0016 + smoothMouse * 0.007) * hoverSlow;
  if (!dragging) {
    autoAngle += spinSpeed + dragVel;   // dragVel = inertia after release
    dragVel *= 0.94;
  }
  smoothTiltX += (-0.18 - mouse.y * 0.20 - smoothTiltX) * 0.04;

  if (!panelOpen) {
    world.rotation.y = autoAngle;
    world.rotation.x = smoothTiltX;
  }

  // raycasting
  raycaster.setFromCamera(pointer, camera);
  const hits  = raycaster.intersectObjects(hitObjs, false);
  const newHov = hits.length ? hits[0].object.userData.index : -1;

  // update node scales
  nodeObjs.forEach((node, i) => {
    const target = (i === newHov) ? 1.9 : 1.0;
    node.userData.hover += (target - node.userData.hover) * 0.14;
    node.scale.setScalar(node.userData.hover);
    node.children[1].material.opacity = (0.45 + (node.userData.hover - 1) * 0.4);
  });

  // update hover card
  if (newHov !== hovIdx) {
    hovIdx = newHov;
    if (hovIdx >= 0) {
      const p = PAPERS[hovIdx];
      cardTitle.textContent = p.t;
      cardMeta.textContent  = `${p.v} · ${p.y}`;
      cardDot.style.setProperty("--dc", CAT[p.c].color);
      cardDot.style.boxShadow = `0 0 10px ${CAT[p.c].color}`;
      card.classList.add("is-visible");
      canvas.style.cursor = "pointer";
    } else {
      card.classList.remove("is-visible");
      canvas.style.cursor = "";
    }
  }

  // reposition hover card every frame while visible
  if (hovIdx >= 0 && !panelOpen) {
    tmp.setFromMatrixPosition(nodeObjs[hovIdx].matrixWorld);
    tmp.project(camera);
    const sx = rect.left + (tmp.x * 0.5 + 0.5) * rect.width;
    const sy = rect.top  + (-tmp.y * 0.5 + 0.5) * rect.height;
    card.style.transform = `translate(-50%, -120%) translate(${sx}px, ${sy}px)`;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
