import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("projects-canvas");
const rootEl = document.querySelector(".projects-experience");
const copyEl = document.getElementById("projects-stage-copy");
const stageActions = document.getElementById("project-stage-actions");
const splitBtn = document.getElementById("project-split-btn");
const pillarBtns = Array.from(document.querySelectorAll(".pillar-picker"));
const backBtn = document.getElementById("gallery-back");
const prevBtn = document.getElementById("gallery-prev");
const nextBtn = document.getElementById("gallery-next");
const detail = document.getElementById("project-detail");
const detailClose = document.getElementById("project-detail-close");
const detailKicker = document.getElementById("project-detail-kicker");
const detailTitle = document.getElementById("project-detail-title");
const detailBody = document.getElementById("project-detail-body");
const detailTags = document.getElementById("project-detail-tags");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COLORS = {
  neuro: "#55d6be",
  music: "#9edc76",
  gold: "#e6b85c",
  ink: "#f5f2ea",
};

const PROJECTS = {
  neuro: {
    label: "Neurocritical Care AI",
    color: COLORS.neuro,
    intro: "The hemisphere unravels into an ICP pulse train. Each node along the signal is a project — click one to read it.",
    items: [
      {
        title: "Non-Invasive ICP Estimation",
        short: "Deep learning for continuous ICP waveforms from TCD and ABP.",
        body: "Intracranial pressure monitoring currently requires a neurosurgical procedure. This project estimates ICP continuously from transcranial Doppler ultrasound and arterial blood pressure waveforms, turning existing bedside signals into a non-invasive inference engine.",
        tags: ["ICP-WAVES", "TCD", "ABP", "Deep learning"],
      },
      {
        title: "Delayed Cerebral Ischemia Detection",
        short: "Real-time multimodal detectors for DCI after subarachnoid hemorrhage.",
        body: "After subarachnoid hemorrhage, delayed cerebral ischemia is a leading cause of disability. This work combines vector-angle analysis, wavelet decomposition, pressure reactivity, and multi-center learning to detect risk before clinical signs emerge.",
        tags: ["SAH", "DCI", "Real-time ML", "Stroke"],
      },
      {
        title: "Physiological Foundation Models",
        short: "Pre-training time-series models across ICU waveform corpora.",
        body: "FM-WAVES explores foundation models for physiological time series: EEG, ECG, ABP, and TCD. The goal is transfer across patients, centers, and clinical tasks when labeled data are scarce.",
        tags: ["FM-WAVES", "EEG", "ICU waveforms", "Few-shot"],
      },
      {
        title: "Federated and Uncertainty-Aware AI",
        short: "Privacy-preserving, calibrated models for clinical deployment.",
        body: "Hospital-to-hospital distribution shift is a quiet failure mode for clinical AI. This project focuses on privacy-preserving multi-center training and calibrated uncertainty so models can predict, defer, and communicate reliability.",
        tags: ["Federated learning", "Calibration", "Privacy", "Safety"],
      },
    ],
  },
  music: {
    label: "Music & the Brain",
    color: COLORS.music,
    intro: "The hemisphere unravels into a chord of harmonics. Each node along the signal is a project — click one to read it.",
    items: [
      {
        title: "Cortical Dynamics in Aesthetic Experience",
        short: "Mobile EEG during real-world art and music encounters.",
        body: "What happens in the brain when a person encounters genuine beauty? This work studies cortical dynamics during aesthetic experience outside the lab, including mobile EEG in museum settings.",
        tags: ["Mobile EEG", "Neuroaesthetics", "Art", "Affect"],
      },
      {
        title: "Acoustic Interventions in Migraine",
        short: "Sound as a non-pharmacological tool for pain-relevant brain states.",
        body: "This project asks whether precisely designed auditory stimuli can shift neural correlates of pain. It aims toward acoustic interventions grounded in auditory-cortical entrainment and migraine physiology.",
        tags: ["Migraine", "Acoustics", "EEG", "Intervention"],
      },
      {
        title: "Brain States in Disorders of Consciousness",
        short: "EEG classification for covert awareness and neuro ICU brain states.",
        body: "Some patients appear unresponsive yet retain covert awareness detectable only through neural signals. This line of work uses EEG classification to map consciousness and search for preserved networks.",
        tags: ["Consciousness", "EEG", "Neuro ICU", "Awareness"],
      },
      {
        title: "Sound-Mediated Neural Resonance",
        short: "Rhythm and harmony as tools for brain-state modulation.",
        body: "Rhythmic and harmonic sound structures can entrain neural oscillations. This project studies how entrainment generalizes across attention, mood, pain, and altered states.",
        tags: ["Neural oscillations", "Entrainment", "Cognition", "Sound"],
      },
    ],
  },
};

if (!canvas) {
  throw new Error("projects-canvas not found");
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050706, 0.03);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
camera.position.set(0, 0.18, 6.0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

const brainGroup = new THREE.Group();
const flowGroup = new THREE.Group();
const nodeGroup = new THREE.Group();
nodeGroup.visible = false;
scene.add(brainGroup, flowGroup, nodeGroup);

let seed = 97;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
function smooth(t) { return t * t * (3 - 2 * t); }
function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = smooth(xf), v = smooth(yf), w = smooth(zf);
  const lerp = (a, b, t) => a + (b - a) * t;
  return lerp(
    lerp(lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u), lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u), v),
    lerp(lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u), lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u), v),
    w
  );
}
function fbm(x, y, z) {
  let f = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 5; i++) {
    f += amp * vnoise(x * freq, y * freq, z * freq);
    freq *= 2.1;
    amp *= 0.48;
  }
  return f;
}
// ridged, anisotropic noise → cortex-like gyral ridges (shared with brain-scene.js)
function brainFold(dir) {
  const wx = fbm(dir.x * 1.4 + 1.2, dir.y * 1.4 + 4.7, dir.z * 1.4 + 8.3);
  const wy = fbm(dir.x * 1.4 + 9.2, dir.y * 1.4 + 2.3, dir.z * 1.4 + 1.7);
  const F = 4.6;
  const n1 = fbm(dir.x * F * 1.1 + wx * 2.6, dir.y * F * 1.9 + wy * 2.6, dir.z * F * 0.7 + wx * 1.8);
  let r1 = 1 - Math.abs(2 * n1 - 1);
  r1 = r1 * r1 * (3 - 2 * r1);
  const n2 = fbm(dir.x * F * 2.4 + 5.1, dir.y * F * 3.3 + 2.7, dir.z * F * 1.6 + 9.4);
  const r2 = 1 - Math.abs(2 * n2 - 1);
  return r1 * 0.72 + r2 * 0.28;
}
function brainPoint(dir, out) {
  const r = 1 + 0.46 * (brainFold(dir) - 0.5);
  out.copy(dir).multiplyScalar(r);
  out.x *= 0.96; out.z *= 1.26; out.y *= 0.94;
  const z = out.z;
  const frontNarrow = 1 - 0.12 * smooth(Math.max(0, Math.min(1, (z - 0.25) / 0.85)));
  const backNarrow  = 1 - 0.18 * smooth(Math.max(0, Math.min(1, (-z - 0.70) / 0.60)));
  out.x *= frontNarrow * backNarrow;
  const fr = smooth(Math.max(0, Math.min(1, (z - 0.10) / 0.95)));
  if (out.y > 0) out.y *= 1 + fr * 0.08;
  // Sylvian fissure + temporal lobe
  const sideAbs = Math.abs(out.x);
  const sylLine = -0.02 + z * 0.16;
  const sylDist = out.y - sylLine;
  const syl = Math.exp(-(sylDist * sylDist) / 0.014) * smooth(Math.max(0, Math.min(1, (sideAbs - 0.28) / 0.35)));
  out.addScaledVector(dir, -0.30 * syl);
  const tl = Math.max(0, sylLine - out.y - 0.02) * smooth(Math.max(0, Math.min(1, (sideAbs - 0.24) / 0.4)));
  out.y -= tl * 0.42;
  out.x += Math.sign(out.x) * tl * 0.26;
  // longitudinal fissure
  const mid = Math.exp(-(out.x * out.x) / 0.0085);
  const top = smooth(Math.max(0, Math.min(1, (out.y + 0.02) / 0.5)));
  out.addScaledVector(dir, -0.70 * mid * top);
  // flat base
  if (out.y < -0.30) out.y = -0.30 + (out.y + 0.30) * 0.40;
  // occipital taper
  if (z < -0.55) {
    const t = (-z - 0.55) / 0.55;
    out.x *= 1 - t * 0.34;
    out.y -= t * t * 0.10;
  }
  // cerebellum
  const zb = out.z + 0.70, yb = out.y + 0.30;
  const cb = Math.exp(-(zb * zb) / 0.055) * Math.exp(-(yb * yb) / 0.045);
  out.y -= cb * 0.14;
  out.z -= cb * 0.08;
  // brainstem nub
  const bs = Math.exp(-((out.z + 0.30) * (out.z + 0.30)) / 0.03) *
             Math.exp(-(out.x * out.x) / 0.02) * Math.max(0, -out.y - 0.34);
  out.y -= bs * 0.5;
  return out;
}

// ---- signal corridor waveforms -------------------------------------------
const WAVE = { x0: -4.6, x1: 4.6 };

function waveY(pillar, u) {
  if (pillar === "neuro") {
    // ICP-like pulse train: percussion / tidal / dicrotic peaks per beat
    const t = (u * 3.0) % 1;
    const g = (c, w, h) => h * Math.exp(-((t - c) * (t - c)) / (w * w));
    return (g(0.16, 0.06, 0.9) + g(0.40, 0.085, 0.62) + g(0.64, 0.09, 0.38) - 0.34) * 0.78;
  }
  // music: layered harmonics
  return (
    Math.sin(u * Math.PI * 2 * 2.6) * 0.42 +
    Math.sin(u * Math.PI * 2 * 5.2 + 1.2) * 0.18 +
    Math.sin(u * Math.PI * 2 * 9.1 + 0.4) * 0.07
  ) * 0.86;
}

// ---- brain particle system ------------------------------------------------
const SPLIT = 1.42;
const uniforms = {
  uSplit:   { value: 0 },
  uGallery: { value: 0 },
  uTime:    { value: 0 },
  uOpacity: { value: 1 },
  uSize:    { value: 0.028 },
  uScale:   { value: 1 },
};

const hemisphereHits = [];
let brainGeo = null;
let pointSides = null;   // -1 left (neuro) | +1 right (music)
let pointRand = null;    // 3 randoms per point

function buildBrain() {
  const ico = new THREE.IcosahedronGeometry(1, 4);
  const src = ico.getAttribute("position");
  const faces = src.count / 3;
  const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
  const dir = new THREE.Vector3(), p = new THREE.Vector3();
  const pos = [], split = [], color = [], sides = [], rands = [];
  const sulcus = new THREE.Color("#020a08");
  const leftColor = new THREE.Color(COLORS.neuro);
  const rightColor = new THREE.Color(COLORS.music);
  const bright = new THREE.Color("#e6fff8");
  const count = 18000;

  for (let k = 0; k < count; k++) {
    const f = (rand() * faces) | 0;
    A.set(src.getX(f * 3), src.getY(f * 3), src.getZ(f * 3));
    B.set(src.getX(f * 3 + 1), src.getY(f * 3 + 1), src.getZ(f * 3 + 1));
    C.set(src.getX(f * 3 + 2), src.getY(f * 3 + 2), src.getZ(f * 3 + 2));
    let u = rand(), v = rand();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    dir.copy(A).multiplyScalar(1 - u - v).addScaledVector(B, u).addScaledVector(C, v).normalize();
    brainPoint(dir, p);
    const groove = Math.exp(-(p.x * p.x) / 0.010) * (p.y > -0.02 ? 1 : 0);
    if (groove > 0.38) continue;

    pos.push(p.x, p.y, p.z);
    const side = p.x < 0 ? -1 : 1;
    sides.push(side);
    rands.push(rand(), rand(), rand());
    split.push(p.x + side * SPLIT, p.y, p.z);

    const fold = Math.pow(brainFold(dir), 0.7);
    const semantic = side < 0 ? leftColor : rightColor;
    const c = sulcus.clone().lerp(bright, fold * 0.72).lerp(semantic, 0.42);
    color.push(c.r, c.g, c.b);
  }

  const n = pos.length / 3;
  pointSides = sides;
  pointRand = rands;

  brainGeo = new THREE.BufferGeometry();
  brainGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  brainGeo.setAttribute("splitPosition", new THREE.Float32BufferAttribute(split, 3));
  brainGeo.setAttribute("color", new THREE.Float32BufferAttribute(color, 3));
  brainGeo.setAttribute("waveTarget", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  brainGeo.setAttribute("waveColor", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  brainGeo.setAttribute("aGhost", new THREE.BufferAttribute(new Float32Array(n), 1));

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 splitPosition;
      attribute vec3 color;
      attribute vec3 waveTarget;
      attribute vec3 waveColor;
      attribute float aGhost;
      uniform float uSplit;
      uniform float uGallery;
      uniform float uTime;
      uniform float uOpacity;
      uniform float uSize;
      uniform float uScale;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec3 base = mix(position, splitPosition, uSplit);
        vec3 wpos = waveTarget;
        float live = 1.0 - aGhost;
        // the waveform keeps flowing: ripple + drift along the corridor
        wpos.y += sin(waveTarget.x * 2.1 - uTime * 2.3) * 0.055 * live;
        wpos.z += cos(waveTarget.x * 1.3 + uTime * 0.9) * 0.05 * live;
        vec3 pos = mix(base, wpos, uGallery);

        // luminance packets racing left -> right along the signal
        float packet = pow(max(0.0, sin(pos.x * 1.35 - uTime * 2.1)), 6.0) * uGallery * live;
        vColor = mix(color, waveColor, uGallery) + vec3(packet * 0.55);

        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        float depth = clamp((-mv.z - 3.6) / 4.0, 0.0, 1.0);
        float ghostFade = mix(1.0, 1.0 - 0.94 * aGhost, uGallery);
        vAlpha = (0.82 - depth * 0.42) * uOpacity * ghostFade;
        gl_PointSize = uSize * uScale * (1.25 - depth * 0.35) * (1.0 + packet * 0.9 + 0.3 * uGallery * live) / -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor, a * vAlpha);
      }
    `,
  });
  brainGroup.add(new THREE.Points(brainGeo, mat));

  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  [["neuro", -1.55], ["music", 1.55]].forEach(([pillar, x]) => {
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.92, 18, 18), hitMat);
    hit.position.set(x, 0.0, 0);
    hit.userData.pillar = pillar;
    brainGroup.add(hit);
    hemisphereHits.push(hit);
  });
}
buildBrain();

// ---- signal flow bridge: particle stream between the split hemispheres ----
const FLOW = {
  strands: 3,
  per: 240,
  span: 1.44,
  amp: [0.30, 0.20, 0.12],
  cycles: [2.0, 3.1, 4.3],
  speed: [0.105, 0.155, 0.225],
};
const flowCount = FLOW.strands * FLOW.per;
const flowPos = new Float32Array(flowCount * 3);
const flowCol = new Float32Array(flowCount * 3);
const flowSize = new Float32Array(flowCount);
const flowSeed = new Float32Array(flowCount);
for (let i = 0; i < flowCount; i++) flowSeed[i] = rand();

const flowGeo = new THREE.BufferGeometry();
flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPos, 3));
flowGeo.setAttribute("color", new THREE.BufferAttribute(flowCol, 3));
flowGeo.setAttribute("aSize", new THREE.BufferAttribute(flowSize, 1));

const flowVertex = `
  attribute vec3 color;
  attribute float aSize;
  uniform float uScale;
  uniform float uFade;
  uniform float uSizeMul;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vAlpha = uFade;
    gl_PointSize = aSize * uSizeMul * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const flowFragment = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.04, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;
function makeFlowMaterial(sizeMul) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uScale: uniforms.uScale,
      uFade: { value: 0 },
      uSizeMul: { value: sizeMul },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: flowVertex,
    fragmentShader: flowFragment,
  });
}
const flowMat = makeFlowMaterial(1.0);
const haloMat = makeFlowMaterial(3.4);
flowGroup.add(new THREE.Points(flowGeo, flowMat), new THREE.Points(flowGeo, haloMat));
flowGroup.children.forEach((p) => { p.frustumCulled = false; });
flowGroup.visible = false;

const flowTeal = new THREE.Color(COLORS.neuro);
const flowGreen = new THREE.Color(COLORS.music);
const flowWhite = new THREE.Color("#eafff8");
const _fc = new THREE.Color();

function updateFlow(t) {
  for (let s = 0; s < FLOW.strands; s++) {
    const amp = FLOW.amp[s], k = FLOW.cycles[s], sp = FLOW.speed[s];
    for (let j = 0; j < FLOW.per; j++) {
      const i = s * FLOW.per + j;
      const u = (flowSeed[i] + t * sp) % 1;
      const env = Math.sin(Math.PI * u);
      const wig = vnoise(u * 7.0 + s * 13.7, t * 0.35, s * 4.1) - 0.5;
      flowPos[i * 3]     = -FLOW.span + 2 * FLOW.span * u;
      flowPos[i * 3 + 1] = Math.sin(u * Math.PI * 2 * k - t * (1.1 + s * 0.5)) * amp * env + wig * 0.10 * env;
      flowPos[i * 3 + 2] = Math.cos(u * Math.PI * 2 * (k * 0.6) + t * 0.7 + s * 2.1) * 0.12 * env;

      const packet = Math.pow(Math.max(0, Math.sin(u * Math.PI * 2 * 2.0 - t * 3.6 + s * 2.4)), 8);
      flowSize[i] = (0.017 + 0.006 * env + 0.042 * packet) * (0.55 + 0.45 * env);

      _fc.copy(flowTeal).lerp(flowGreen, u).lerp(flowWhite, 0.15 + packet * 0.8);
      flowCol[i * 3] = _fc.r; flowCol[i * 3 + 1] = _fc.g; flowCol[i * 3 + 2] = _fc.b;
    }
  }
  flowGeo.attributes.position.needsUpdate = true;
  flowGeo.attributes.color.needsUpdate = true;
  flowGeo.attributes.aSize.needsUpdate = true;
}

// ---- project nodes on the signal ------------------------------------------
function glowTexture() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
}
const glowTex = glowTexture();
const NODE_US = [0.13, 0.38, 0.62, 0.87];
let nodes = [];
let nodeHits = [];

function buildNodes(pillar) {
  nodeGroup.clear();
  nodes = [];
  nodeHits = [];
  const accent = new THREE.Color(PROJECTS[pillar].color);
  PROJECTS[pillar].items.forEach((project, index) => {
    const u = NODE_US[index];
    const x = WAVE.x0 + (WAVE.x1 - WAVE.x0) * u;
    const node = new THREE.Group();
    node.position.set(x, waveY(pillar, u), 0);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: "#f3fffb", transparent: true })
    );
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: accent, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    glow.scale.setScalar(0.42);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.085, 0.10, 40),
      new THREE.MeshBasicMaterial({
        color: accent, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide, depthWrite: false,
      })
    );
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(0.30, 8, 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.userData = { index, pillar };
    node.add(glow, core, ring, hit);
    node.userData = { hover: 0, baseU: u, project };
    nodeGroup.add(node);
    nodes.push(node);
    nodeHits.push(hit);
  });
}

// ---- tooltip ----------------------------------------------------------------
const tip = document.createElement("div");
tip.className = "brain-tip";
tip.setAttribute("aria-hidden", "true");
document.body.appendChild(tip);

// ---- state -------------------------------------------------------------------
let mode = "brain";
let activePillar = "neuro";
let selectedIndex = 0;
let targetSplit = 0;
let targetGallery = 0;
let pointer = new THREE.Vector2(-2, -2);
let mouse = new THREE.Vector2(0, 0);
let hoveredNode = -1;
let targetCam = new THREE.Vector3(0, 0.18, 6.0);
let targetLook = new THREE.Vector3(0, 0, 0);
let camLook = new THREE.Vector3(0, 0, 0);
let time = 0;

const raycaster = new THREE.Raycaster();

function setMode(nextMode) {
  mode = nextMode;
  rootEl.dataset.mode = nextMode;
  if (stageActions) stageActions.style.display = nextMode === "brain" ? "" : "none";
}

function enterSplit() {
  setMode("split");
  targetSplit = 1;
  targetGallery = 0;
  targetCam.set(0, 0.18, 6.0);
  targetLook.set(0, 0, 0);
  if (copyEl) copyEl.textContent = "Choose a hemisphere to explore its projects.";
}

function fillWaveTargets(pillar) {
  const wt = brainGeo.attributes.waveTarget.array;
  const wc = brainGeo.attributes.waveColor.array;
  const gh = brainGeo.attributes.aGhost.array;
  const sp = brainGeo.attributes.splitPosition.array;
  const accent = new THREE.Color(PROJECTS[pillar].color);
  const brightC = new THREE.Color("#eafff8");
  const dimC = new THREE.Color("#0a201b");
  const chosenSide = pillar === "neuro" ? -1 : 1;
  const n = gh.length;
  const c = new THREE.Color();

  for (let i = 0; i < n; i++) {
    const ghost = pointSides[i] === chosenSide ? 0 : 1;
    gh[i] = ghost;
    const r1 = pointRand[i * 3], r2 = pointRand[i * 3 + 1], r3 = pointRand[i * 3 + 2];
    if (ghost) {
      // the other hemisphere stays parked where the split left it, as faint dust
      wt[i * 3] = sp[i * 3]; wt[i * 3 + 1] = sp[i * 3 + 1]; wt[i * 3 + 2] = sp[i * 3 + 2];
      wc[i * 3] = 0.02; wc[i * 3 + 1] = 0.08; wc[i * 3 + 2] = 0.07;
    } else {
      const u = r1;
      wt[i * 3]     = WAVE.x0 + (WAVE.x1 - WAVE.x0) * u;
      wt[i * 3 + 1] = waveY(pillar, u) + (r2 - 0.5) * 0.20;
      wt[i * 3 + 2] = (r3 - 0.5) * 0.55;
      c.copy(dimC).lerp(accent, 0.35 + 0.65 * Math.abs(r2 * 2 - 1)).lerp(brightC, r3 * 0.22);
      wc[i * 3] = c.r; wc[i * 3 + 1] = c.g; wc[i * 3 + 2] = c.b;
    }
  }
  brainGeo.attributes.waveTarget.needsUpdate = true;
  brainGeo.attributes.waveColor.needsUpdate = true;
  brainGeo.attributes.aGhost.needsUpdate = true;
}

function enterGallery(pillar, immediate = false) {
  activePillar = pillar;
  selectedIndex = 0;
  fillWaveTargets(pillar);
  buildNodes(pillar);
  nodeGroup.visible = true;
  setMode("gallery");
  targetSplit = 1;
  targetGallery = 1;
  if (immediate) {
    uniforms.uSplit.value = 1;
    uniforms.uGallery.value = 1;
  }
  focusNode(0);
  if (copyEl) copyEl.textContent = PROJECTS[pillar].intro;
  closeDetail();
}

function returnToBrain() {
  setMode("split");
  targetGallery = 0;
  closeDetail();
  tip.classList.remove("is-visible");
  targetCam.set(0, 0.18, 6.0);
  targetLook.set(0, 0, 0);
  if (copyEl) copyEl.textContent = "Choose a hemisphere to explore its projects.";
}

function focusNode(deltaOrIndex, isDelta = false) {
  const count = PROJECTS[activePillar].items.length;
  selectedIndex = isDelta
    ? (selectedIndex + deltaOrIndex + count) % count
    : ((deltaOrIndex % count) + count) % count;
  const node = nodes[selectedIndex];
  if (!node) return;
  const fx = node.position.x * nodeGroup.scale.x * 0.85;
  targetCam.set(fx, 0.55, 4.9);
  targetLook.set(fx, 0.0, 0);
  const item = PROJECTS[activePillar].items[selectedIndex];
  if (copyEl && mode === "gallery") {
    copyEl.innerHTML = `<strong>${String(selectedIndex + 1).padStart(2, "0")} &middot; ${item.title}</strong> &mdash; ${item.short}`;
  }
}

function openDetail(index) {
  selectedIndex = index;
  focusNode(index);
  const data = PROJECTS[activePillar];
  const project = data.items[index];
  detailKicker.textContent = data.label;
  detailTitle.textContent = project.title;
  detailBody.textContent = project.body;
  detailTags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
  detail.classList.add("is-open");
  detail.setAttribute("aria-hidden", "false");
}

function closeDetail() {
  detail.classList.remove("is-open");
  detail.setAttribute("aria-hidden", "true");
}

splitBtn.addEventListener("click", enterSplit);
pillarBtns.forEach((button) => {
  button.addEventListener("click", () => enterGallery(button.dataset.pillar));
});
backBtn.addEventListener("click", returnToBrain);
prevBtn.addEventListener("click", () => { focusNode(-1, true); closeDetail(); });
nextBtn.addEventListener("click", () => { focusNode(1, true); closeDetail(); });
detailClose.addEventListener("click", closeDetail);

function routeFromHash() {
  const pillar = window.location.hash.replace("#", "");
  if (pillar === "split") {
    enterSplit();
    uniforms.uSplit.value = 1;
    return;
  }
  if (PROJECTS[pillar]) {
    enterGallery(pillar, true);
  }
}
window.addEventListener("hashchange", routeFromHash);
routeFromHash();

function updatePointer(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
}
window.addEventListener("pointermove", updatePointer, { passive: true });
// touch fires no pointermove before a tap — set raycast coords on pointerdown
canvas.addEventListener("pointerdown", updatePointer);

canvas.addEventListener("click", () => {
  raycaster.setFromCamera(pointer, camera);
  if (mode === "brain") {
    enterSplit();
    return;
  }
  if (mode === "split") {
    const hit = raycaster.intersectObjects(hemisphereHits, false)[0];
    if (hit) enterGallery(hit.object.userData.pillar);
    return;
  }
  if (mode === "gallery") {
    const hit = raycaster.intersectObjects(nodeHits, false)[0];
    if (hit) openDetail(hit.object.userData.index);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDetail();
  if (mode !== "gallery") return;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { focusNode(1, true); closeDetail(); }
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { focusNode(-1, true); closeDetail(); }
  if (event.key === "Enter") openDetail(selectedIndex);
});

function resize() {
  const w = Math.max(1, canvas.clientWidth);
  const h = Math.max(1, canvas.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  uniforms.uScale.value = h * 0.5;
  const small = w < 760;
  brainGroup.scale.setScalar(small ? 0.82 : 1.08);
  flowGroup.scale.copy(brainGroup.scale);
  nodeGroup.scale.copy(brainGroup.scale);
  camera.fov = small ? 58 : 48;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

const _proj = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  time += reduceMotion ? 0.005 : 0.016;
  uniforms.uTime.value = time;

  uniforms.uSplit.value += (targetSplit - uniforms.uSplit.value) * 0.075;
  uniforms.uGallery.value += (targetGallery - uniforms.uGallery.value) * 0.055;
  const split = uniforms.uSplit.value;
  const gallery = uniforms.uGallery.value;

  // bridge flows while the brains are split, fades inside the corridor
  const flowAmt = Math.max(0, split - 0.72) / 0.28 * (1 - gallery);
  flowGroup.visible = flowAmt > 0.01 && mode !== "brain";
  flowMat.uniforms.uFade.value = flowAmt * 0.95;
  haloMat.uniforms.uFade.value = flowAmt * 0.16;
  if (flowGroup.visible) updateFlow(time);

  // brain idles in brain/split modes; the corridor needs a level horizon
  const idleRot = reduceMotion ? 0 : Math.sin(time * 0.55) * 0.08;
  const rotAmt = 1 - gallery;
  brainGroup.rotation.y = (idleRot + mouse.x * 0.08 * (1 - split * 0.35)) * rotAmt;
  brainGroup.rotation.x = (-0.12 + mouse.y * 0.04) * rotAmt;
  flowGroup.rotation.copy(brainGroup.rotation);

  if (mode === "gallery") {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(nodeHits, false)[0];
    hoveredNode = hit ? hit.object.userData.index : -1;
    canvas.style.cursor = hoveredNode >= 0 ? "pointer" : "";
  } else {
    hoveredNode = -1;
    canvas.style.cursor = mode === "brain" ? "pointer" : "";
  }

  nodes.forEach((node, i) => {
    const d = node.userData;
    d.hover += ((i === hoveredNode || i === selectedIndex ? 1 : 0) - d.hover) * 0.14;
    const vis = gallery;
    node.scale.setScalar(1 + d.hover * 0.65);
    node.position.y = waveY(activePillar, d.baseU) +
      Math.sin(node.position.x * 2.1 - time * 2.3) * 0.055;  // ride the ripple
    node.children[0].material.opacity = (0.4 + d.hover * 0.6) * vis;   // glow
    node.children[1].material.opacity = vis;                            // core
    node.children[2].material.opacity = (0.35 + d.hover * 0.65) * vis;  // ring
    node.children[2].lookAt(camera.position);
    node.children[2].rotation.z = time * (0.5 + i * 0.13);
  });
  nodeGroup.visible = gallery > 0.02;

  // tooltip for hovered node
  if (hoveredNode >= 0 && gallery > 0.6) {
    const node = nodes[hoveredNode];
    const rect = canvas.getBoundingClientRect();
    _proj.copy(node.position).applyMatrix4(nodeGroup.matrixWorld).project(camera);
    const x = rect.left + (_proj.x * 0.5 + 0.5) * rect.width;
    const y = rect.top + (-_proj.y * 0.5 + 0.5) * rect.height;
    const item = PROJECTS[activePillar].items[hoveredNode];
    tip.innerHTML = `<span class="tip-dot" style="--dot:${PROJECTS[activePillar].color}"></span><span class="tip-body"><strong>${item.title}</strong><span>${item.short}</span></span>`;
    tip.style.transform = `translate(-50%,-130%) translate(${x}px,${y}px)`;
    tip.classList.add("is-visible");
  } else {
    tip.classList.remove("is-visible");
  }

  const sway = mode === "gallery" ? 0.18 : 0.0;
  camera.position.lerp(
    new THREE.Vector3(targetCam.x + mouse.x * sway, targetCam.y + mouse.y * 0.08 * (mode === "gallery" ? 1 : 0), targetCam.z),
    0.06
  );
  camLook.lerp(targetLook, 0.06);
  camera.lookAt(camLook);

  renderer.render(scene, camera);
}
animate();
