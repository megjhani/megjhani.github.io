import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas      = document.querySelector("#brain-canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CONFIG = {
  samples:         24000,
  foldAmp:         0.46,
  foldFreq:        4.6,
  fissureDepth:    0.70,
  pointSize:       0.028,
  scaleDesktop:    0.94,
  scaleMobile:     0.88,
  offsetXDesktop:  1.42,
  rotateSpeed:     0.08,
  nodeSize:        0.016,
};

const CAT = {
  neuro:   "#55d6be",
  ml:      "#e6b85c",
  mind:    "#9edc76",
  imaging: "#c9a6ff",
};

const PAPERS = [
  { y:2026, t:"ICP-WAVES: ICP waveform analysis & visualization",           v:"IEEE TBME",            c:"neuro"   },
  { y:2025, t:"Time-series foundation model to estimate ICP",               v:"J Clin Monit Comput",  c:"ml"      },
  { y:2025, t:"Physiological signals boosted by AI save brain function",    v:"NEJM AI",              c:"neuro"   },
  { y:2025, t:"Let the experts speak: MoE survival heads (CAMOE)",         v:"NeurIPS",              c:"ml"      },
  { y:2025, t:"Math models for hospital dynamics via information theory",   v:"npj Digital Medicine", c:"ml"      },
  { y:2025, t:"Pressure reactivity & cerebral oximetry in aneurysmal SAH", v:"Neurocritical Care",   c:"neuro"   },
  { y:2025, t:"Bronchiolitis low-risk respiratory deterioration cohort",    v:"BMJ Open",             c:"neuro"   },
  { y:2025, t:"Pulse-rate variability predicts LOS in bronchiolitis PICU",  v:"J Clin Monit Comput",  c:"neuro"   },
  { y:2025, t:"Pediatric VA-ECMO early risk factors for mortality",         v:"Perfusion",            c:"neuro"   },
  { y:2024, t:"Non-invasive pulse arrival time & cardiac index",            v:"Physiol Meas",         c:"neuro"   },
  { y:2023, t:"Suboptimal cerebral perfusion & ischemia after ICH",         v:"Neurocritical Care",   c:"neuro"   },
  { y:2023, t:"Heart rate & HRV as prognosis after cardiac arrest",         v:"Resuscitation Plus",   c:"neuro"   },
  { y:2023, t:"Automatic ICP waveform ID via wavelet analysis",             v:"Physiol Meas",         c:"neuro"   },
  { y:2023, t:"Deep learning: non-invasive ICP from TCD",                  v:"Annals of Neurology",  c:"neuro"   },
  { y:2023, t:"Oxygen reactivity & disturbed perfusion after SAH",          v:"Critical Care",        c:"neuro"   },
  { y:2023, t:"Generalizable DCI detection via federated learning",         v:"IEEE BIBM",            c:"ml"      },
  { y:2023, t:"Optimal CPP & brain tissue oxygen in aneurysmal SAH",        v:"Stroke",               c:"neuro"   },
  { y:2023, t:"Level of consciousness classification in a neuro ICU",       v:"Neurocritical Care",   c:"mind"    },
  { y:2022, t:"Vector-angle analysis for continuous DCI prediction",        v:"Neurocritical Care",   c:"neuro"   },
  { y:2022, t:"Optimal CPP during DCI after aneurysmal SAH",                v:"Critical Care Medicine",c:"neuro"  },
  { y:2022, t:"Real-time ML deployment for DCI detection",                  v:"IEEE HI-POCT",         c:"ml"      },
  { y:2021, t:"Dynamic detection of DCI: a study in three centers",         v:"Stroke",               c:"neuro"   },
  { y:2021, t:"Dynamic ICP waveform morphology predicts ventriculitis",     v:"Neurocritical Care",   c:"neuro"   },
  { y:2021, t:"Endotypes of hospitalized COVID-19 patients",                v:"Frontiers in Medicine",c:"ml"      },
  { y:2020, t:"ML to predict DCI and outcomes in SAH",                     v:"Neurology",            c:"ml"      },
  { y:2020, t:"Harnessing big data in neurocritical precision medicine",    v:"Curr Treat Options",   c:"ml"      },
  { y:2019, t:"Detection of brain activation in unresponsive patients",     v:"NEJM",                 c:"mind"    },
  { y:2019, t:"HRV as a biomarker of neurocardiogenic injury after SAH",    v:"Neurocritical Care",   c:"neuro"   },
  { y:2019, t:"Deep brain lesions & impaired consciousness",                v:"Scientific Reports",   c:"mind"    },
  { y:2019, t:"Clustering ICP waveform morphology in ventriculitis",        v:"Physiol Meas",         c:"neuro"   },
  { y:2018, t:"Active-learning framework for ICP waveform ID",              v:"Physiol Meas",         c:"ml"      },
  { y:2018, t:"Dictionary learning improves DCI prediction",                v:"Frontiers in Neurology",c:"ml"     },
  { y:2017, t:"Mobile EEG in an art-museum setting",                        v:"Front Hum Neurosci",   c:"mind"    },
  { y:2017, t:"Morphological constraint spectral unmixing of tissue",       v:"Bioinformatics",       c:"imaging" },
  { y:2015, t:"Your Brain on Art: cortical dynamics in aesthetics",         v:"Front Hum Neurosci",   c:"mind"    },
  { y:2015, t:"Population-scale 3D reconstruction of microglia arbors",     v:"Bioinformatics",       c:"imaging" },
  { y:2015, t:"Unsupervised profiling of microglial morphologies",          v:"IEEE J-STSP",          c:"imaging" },
  { y:2014, t:"Automated image analysis around implanted devices",          v:"Front Neuroinform",    c:"imaging" },
];

// ---- value-noise helpers ------------------------------------------------
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

// ---- procedural brain surface -------------------------------------------
const _v = new THREE.Vector3();

// ridged, anisotropic noise → cortex-like gyral ridges (sharp thin sulci)
function brainFold(dir) {
  const wx = fbm(dir.x * 1.4 + 1.2, dir.y * 1.4 + 4.7, dir.z * 1.4 + 8.3);
  const wy = fbm(dir.x * 1.4 + 9.2, dir.y * 1.4 + 2.3, dir.z * 1.4 + 1.7);
  const F  = CONFIG.foldFreq;
  // coarse ridges, elongated front-to-back (gyri run mostly A→P)
  const n1 = fbm(dir.x*F*1.1 + wx*2.6, dir.y*F*1.9 + wy*2.6, dir.z*F*0.7 + wx*1.8);
  let r1 = 1 - Math.abs(2 * n1 - 1);
  r1 = r1 * r1 * (3 - 2 * r1);                       // sharpen ridge crests
  // finer secondary gyri
  const n2 = fbm(dir.x*F*2.4 + 5.1, dir.y*F*3.3 + 2.7, dir.z*F*1.6 + 9.4);
  const r2 = 1 - Math.abs(2 * n2 - 1);
  return r1 * 0.72 + r2 * 0.28;
}

function brainPoint(dir, out) {
  const r = 1 + CONFIG.foldAmp * (brainFold(dir) - 0.5);
  out.copy(dir).multiplyScalar(r);
  // base proportions: +z front, +y up, x lateral. Rounder + taller than a grain.
  out.x *= 0.96; out.z *= 1.26; out.y *= 0.94;

  const z = out.z;
  // --- silhouette: egg-shaped top view — rounded, slightly narrower front ---
  const frontNarrow = 1 - 0.12 * smooth(Math.max(0, Math.min(1, (z - 0.25) / 0.85)));
  const backNarrow  = 1 - 0.18 * smooth(Math.max(0, Math.min(1, (-z - 0.70) / 0.60)));
  out.x *= frontNarrow * backNarrow;

  // frontal lobe fullness: front-top rounds upward and forward
  const fr = smooth(Math.max(0, Math.min(1, (z - 0.10) / 0.95)));
  if (out.y > 0) out.y *= 1 + fr * 0.08;

  // --- Sylvian (lateral) fissure: diagonal cleft on each side that lifts
  //     the temporal lobe away from the frontal/parietal lobes ---
  const sideAbs = Math.abs(out.x);
  // fissure sits at mid-height, tilts up toward the back
  const sylLine = -0.02 + z * 0.16;
  const sylDist = (out.y - sylLine);
  const syl = Math.exp(-(sylDist * sylDist) / 0.014) * smooth(Math.max(0, Math.min(1, (sideAbs - 0.28) / 0.35)));
  out.addScaledVector(dir, -0.30 * syl);

  // temporal lobe: protrusion below the Sylvian fissure
  const tl = Math.max(0, sylLine - out.y - 0.02) * smooth(Math.max(0, Math.min(1, (sideAbs - 0.24) / 0.4)));
  out.y -= tl * 0.42;
  out.x += Math.sign(out.x) * tl * 0.26;

  // --- longitudinal fissure: deep midline groove, full A→P length ---
  const mid = Math.exp(-(out.x * out.x) / 0.0085);
  const top = smooth(Math.max(0, Math.min(1, (out.y + 0.02) / 0.5)));
  out.addScaledVector(dir, -CONFIG.fissureDepth * mid * top);

  // flat base (orbitofrontal / temporal underside) — soft clamp
  if (out.y < -0.30) out.y = -0.30 + (out.y + 0.30) * 0.40;

  // occipital taper (back narrows + tucks down)
  if (z < -0.55) {
    const t = (-z - 0.55) / 0.55;
    out.x *= 1 - t * 0.34;
    out.y -= t * t * 0.10;
  }

  // cerebellum: rounded bulge tucked under the occipital lobe
  const zb = out.z + 0.70, yb = out.y + 0.30;
  const cb = Math.exp(-(zb * zb) / 0.055) * Math.exp(-(yb * yb) / 0.045);
  out.y -= cb * 0.14;
  out.z -= cb * 0.08;

  // brainstem nub at the very base-center-back
  const bs = Math.exp(-((out.z + 0.30) * (out.z + 0.30)) / 0.03) *
             Math.exp(-(out.x * out.x) / 0.02) * Math.max(0, -out.y - 0.34);
  out.y -= bs * 0.5;
  return out;
}

// ---- main ---------------------------------------------------------------
if (canvas) {
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.06, 6.0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const root  = new THREE.Group();
  const brain = new THREE.Group();
  root.add(brain);
  scene.add(root);

  scene.add(new THREE.AmbientLight(0xbfeee6, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(2.5, 3, 4);
  scene.add(key);

  // ---- sample brain surface with fold-based coloring ----
  const ico    = new THREE.IcosahedronGeometry(1, 4);
  const srcPos = ico.getAttribute("position");
  const faces  = srcPos.count / 3;
  const dir    = new THREE.Vector3();
  const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();

  const posArr = [], colArr = [], morphColArr = [];

  // fold-based palette: very dark sulcus → bright gyrus
  const sulcusC = new THREE.Color("#020a08");
  const gyrusC  = new THREE.Color("#dffdf7");
  const neuroC  = new THREE.Color(CAT.neuro);
  const musicC  = new THREE.Color(CAT.mind);

  for (let k = 0; k < CONFIG.samples; k++) {
    const f = (Math.random() * faces) | 0;
    A.set(srcPos.getX(f*3),   srcPos.getY(f*3),   srcPos.getZ(f*3));
    B.set(srcPos.getX(f*3+1), srcPos.getY(f*3+1), srcPos.getZ(f*3+1));
    C.set(srcPos.getX(f*3+2), srcPos.getY(f*3+2), srcPos.getZ(f*3+2));
    let u = Math.random(), v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    dir.copy(A).multiplyScalar(1-u-v).addScaledVector(B, u).addScaledVector(C, v).normalize();
    brainPoint(dir, _v);

    const groove = Math.exp(-(_v.x * _v.x) / 0.010) * (_v.y > -0.02 ? 1 : 0);
    if (groove > 0.38) continue;

    posArr.push(_v.x, _v.y, _v.z);

    // gyrus = bright, sulcus = dark → folds become visible in point cloud
    const fv = brainFold(dir);
    const bc = sulcusC.clone().lerp(gyrusC, Math.pow(fv, 0.65));
    colArr.push(bc.r, bc.g, bc.b);

    // semantic color for wave state (left=neuro teal, right=music green)
    const wc = _v.x < 0 ? neuroC : musicC;
    morphColArr.push(wc.r, wc.g, wc.b);
  }

  const pcount = posArr.length / 3;

  // ---- two-brain split: each hemisphere drifts outward (brain → two brains) ----
  const SPLIT = 1.28;
  const morphArr = new Float32Array(posArr.length);
  for (let i = 0; i < pcount; i++) {
    const sx = posArr[i*3], sy = posArr[i*3+1], sz = posArr[i*3+2];
    morphArr[i*3]   = sx + (sx < 0 ? -SPLIT : SPLIT);
    morphArr[i*3+1] = sy;
    morphArr[i*3+2] = sz;
  }

  // ---- geometry -----------------------------------------------------------
  const brainGeo = new THREE.BufferGeometry();
  brainGeo.setAttribute("position",    new THREE.BufferAttribute(Float32Array.from(posArr), 3));
  brainGeo.setAttribute("color",       new THREE.BufferAttribute(Float32Array.from(colArr), 3));
  brainGeo.setAttribute("morphTarget", new THREE.BufferAttribute(morphArr, 3));
  brainGeo.setAttribute("morphColor",  new THREE.BufferAttribute(Float32Array.from(morphColArr), 3));

  const uniforms = {
    uSize:  { value: CONFIG.pointSize },
    uScale: { value: 1 },
    uFade:  { value: 1 },
    uMorph: { value: 0 },
  };

  const brainMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 color;
      attribute vec3 morphTarget;
      attribute vec3 morphColor;
      uniform float uSize;
      uniform float uScale;
      uniform float uFade;
      uniform float uMorph;
      varying vec3  vColor;
      varying float vAlpha;
      void main() {
        vec3 pos  = mix(position, morphTarget, uMorph);
        vColor    = mix(color, morphColor, uMorph);
        vec4 mv   = modelViewMatrix * vec4(pos, 1.0);
        float depth = clamp((-mv.z - 4.6) / 2.8, 0.0, 1.0);
        vAlpha      = (0.78 - depth * 0.48) * uFade;
        gl_PointSize = uSize * uScale * (1.25 - depth * 0.35) / -mv.z;
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3  vColor;
      varying float vAlpha;
      void main() {
        vec2  c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor, a * vAlpha);
      }
    `,
  });
  brain.add(new THREE.Points(brainGeo, brainMat));

  // faint volume body for sense of mass
  const bodyGeo = new THREE.IcosahedronGeometry(1, 4);
  const bp      = bodyGeo.getAttribute("position");
  for (let i = 0; i < bp.count; i++) {
    dir.set(bp.getX(i), bp.getY(i), bp.getZ(i)).normalize();
    brainPoint(dir, _v);
    bp.setXYZ(i, _v.x, _v.y, _v.z);
  }
  bp.needsUpdate = true;
  bodyGeo.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({
    color: 0x2f9e93, transparent: true, opacity: 0.10,
    roughness: 0.7, metalness: 0, depthWrite: false,
  }));
  brain.add(body);

  // synapse lines
  const linePos = [];
  for (let i = 0; i < 900; i++) {
    const a = (Math.random() * pcount) | 0;
    const ax = posArr[a*3], ay = posArr[a*3+1], az = posArr[a*3+2];
    let best = -1, bd = 0.17;
    for (let j = 0; j < 12; j++) {
      const b  = (Math.random() * pcount) | 0;
      const dx = ax - posArr[b*3], dy = ay - posArr[b*3+1], dz = az - posArr[b*3+2];
      const dd = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dd < bd && dd > 0.05) { best = b; bd = dd; }
    }
    if (best >= 0) linePos.push(ax, ay, az, posArr[best*3], posArr[best*3+1], posArr[best*3+2]);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
  const synapses = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: 0x55d6be, transparent: true, opacity: 0.12,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  synapses.visible = false;
  brain.add(synapses);

  // ---- signal flow: particle streams between the split hemispheres --------
  // Lives in `root` (not `brain`) — brain rotation damps to 0 at full split,
  // so the stream stays aligned with the two hemispheres.
  const FLOW = {
    strands: 3,
    per: 260,
    span: 1.30,          // half-width: hemispheres sit at ±1.28 after split
    amp: [0.30, 0.20, 0.12],
    cycles: [2.0, 3.1, 4.3],
    speed: [0.105, 0.155, 0.225],
  };
  const flowCount = FLOW.strands * FLOW.per;
  const flowPos  = new Float32Array(flowCount * 3);
  const flowCol  = new Float32Array(flowCount * 3);
  const flowSize = new Float32Array(flowCount);
  const flowSeed = new Float32Array(flowCount);
  for (let i = 0; i < flowCount; i++) flowSeed[i] = Math.random();

  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPos, 3));
  flowGeo.setAttribute("color",    new THREE.BufferAttribute(flowCol, 3));
  flowGeo.setAttribute("aSize",    new THREE.BufferAttribute(flowSize, 1));

  const flowVertex = `
    attribute vec3 color;
    attribute float aSize;
    uniform float uScale;
    uniform float uFade;
    uniform float uSizeMul;
    varying vec3  vColor;
    varying float vAlpha;
    void main() {
      vColor = color;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vAlpha = uFade;
      gl_PointSize = aSize * uSizeMul * uScale / -mv.z;
      gl_Position  = projectionMatrix * mv;
    }
  `;
  const flowFragment = `
    varying vec3  vColor;
    varying float vAlpha;
    void main() {
      vec2  c = gl_PointCoord - 0.5;
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
  const flowMat  = makeFlowMaterial(1.0);   // crisp core particles
  const haloMat  = makeFlowMaterial(3.4);   // soft glow body around the stream
  const flowPoints = new THREE.Points(flowGeo, flowMat);
  const haloPoints = new THREE.Points(flowGeo, haloMat);
  flowPoints.visible = haloPoints.visible = false;
  flowPoints.frustumCulled = haloPoints.frustumCulled = false;
  root.add(haloPoints, flowPoints);

  // ---- clickable hemispheres: at full split each half links to its pillar ----
  const hemiHitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hemiHits = [];
  [["/projects/#neuro", -SPLIT], ["/projects/#music", SPLIT]].forEach(([href, x]) => {
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.95, 16, 16), hemiHitMat);
    hit.position.set(x, 0, 0);
    hit.userData.href = href;
    root.add(hit);
    hemiHits.push(hit);
  });
  let hemiHover = false;

  window.addEventListener("click", (e) => {
    if (morph < 0.85 || fade < 0.4) return;
    if (e.target.closest("a, button")) return;
    if (!e.target.closest(".hero-sticky")) return;
    raycaster.setFromCamera(pointer, camera);
    const hh = raycaster.intersectObjects(hemiHits, false)[0];
    if (hh) window.location.href = hh.object.userData.href;
  });

  const flowTeal  = new THREE.Color(CAT.neuro);
  const flowGreen = new THREE.Color(CAT.mind);
  const flowWhite = new THREE.Color("#eafff8");
  const _fc = new THREE.Color();

  function updateFlow(t) {
    for (let s = 0; s < FLOW.strands; s++) {
      const amp = FLOW.amp[s], k = FLOW.cycles[s], sp = FLOW.speed[s];
      for (let j = 0; j < FLOW.per; j++) {
        const i = s * FLOW.per + j;
        const u = (flowSeed[i] + t * sp) % 1;                 // travel left → right
        const env = Math.sin(Math.PI * u);                    // pinch into hemispheres
        const wig = vnoise(u * 7.0 + s * 13.7, t * 0.35, s * 4.1) - 0.5;
        const x = -FLOW.span + 2 * FLOW.span * u;
        const y = Math.sin(u * Math.PI * 2 * k - t * (1.1 + s * 0.5)) * amp * env + wig * 0.10 * env;
        const z = Math.cos(u * Math.PI * 2 * (k * 0.6) + t * 0.7 + s * 2.1) * 0.12 * env;
        flowPos[i * 3] = x; flowPos[i * 3 + 1] = y; flowPos[i * 3 + 2] = z;

        // traveling bright packets — the "signal" racing along each strand
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

  // ---- paper nodes (Fibonacci sphere on brain surface) --------------------
  function glowTexture() {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 64;
    const ctx = cv.getContext("2d");
    const g   = ctx.createRadialGradient(32,32,0,32,32,32);
    g.addColorStop(0,   "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(255,255,255,0.7)");
    g.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(cv);
  }
  const glowTex   = glowTexture();
  const nodeGroup = new THREE.Group();
  brain.add(nodeGroup);
  const nodes = [], cores = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < PAPERS.length; i++) {
    const y   = 1 - (i / (PAPERS.length - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    dir.set(Math.cos(golden * i) * rad, y, Math.sin(golden * i) * rad).normalize();
    brainPoint(dir, _v);
    _v.addScaledVector(dir, 0.05);

    const color = new THREE.Color(CAT[PAPERS[i].c] || CAT.neuro);
    const node  = new THREE.Group();
    node.position.copy(_v);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(CONFIG.nodeSize, 10, 10),
      new THREE.MeshBasicMaterial({ color })
    );
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color, transparent: true, opacity: 0.42,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    glow.scale.setScalar(0.1);
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.userData.index = i;
    cores.push(hit);
    node.add(core, glow, hit);
    node.userData = { hover: 0 };
    nodeGroup.add(node);
    nodes.push(node);
  }

  // ---- tooltip -----------------------------------------------------------
  let tip = document.querySelector("#brain-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "brain-tip";
    tip.className = "brain-tip";
    tip.setAttribute("aria-hidden", "true");
    (document.querySelector(".hero") || document.body).appendChild(tip);
  }

  // ---- DOM refs for morph overlays ---------------------------------------
  const waveLabels   = document.getElementById("wave-labels");
  const heroContent  = document.querySelector(".hero-content");
  const heroHint     = document.querySelector(".hero-hint");
  const splitVision  = document.getElementById("split-vision");

  // ---- interaction -------------------------------------------------------
  const mouse     = new THREE.Vector2(0, 0);
  const pointer   = new THREE.Vector2(-2, -2);
  const raycaster = new THREE.Raycaster();
  let hovered = -1;
  let rect    = canvas.getBoundingClientRect();

  function resize() {
    rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uScale.value   = renderer.domElement.height * 0.5;
    const small             = w < 900;
    root.userData.scale     = small ? CONFIG.scaleMobile : CONFIG.scaleDesktop;
    root.userData.offsetX   = small ? 0 : CONFIG.offsetXDesktop;
    root.userData.baseY     = small ? 0.45 : 0.0;
    root.userData.small     = small;
  }
  window.addEventListener("resize",       resize);
  window.addEventListener("scroll",       () => { rect = canvas.getBoundingClientRect(); }, { passive: true });
  window.addEventListener("pointermove",  (e) => {
    mouse.x   = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y   = (e.clientY / window.innerHeight - 0.5) * 2;
    pointer.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    pointer.y = -(((e.clientY - rect.top)  / rect.height) * 2 - 1);
  });
  resize();

  // ---- scroll: CSS sticky hero; a small scroll fully splits the brain ----
  // .hero is 200svh tall; .hero-sticky is sticky top:0 (100svh viewport).
  // morph is scrubbed DIRECTLY from scrollY: the split completes within the
  // first ~55% of a viewport scroll, then holds. Scroll back up to reassemble.
  let morph = 0, fade = 1;
  let splitRange = window.innerHeight * 0.55;   // scroll dist for a full split
  let fadeRange  = window.innerHeight * 1.30;   // scroll dist before hero fades

  // dev helper: ?morph=0.95 pins the unravel state (for headless screenshots)
  const morphOverride = new URLSearchParams(window.location.search).get("morph");
  if (morphOverride !== null) morph = Math.max(0, Math.min(1, parseFloat(morphOverride) || 0));

  function onScroll() {
    if (morphOverride !== null) return;
    const m = Math.max(0, Math.min(1, window.scrollY / splitRange));
    morph = m * m * (3 - 2 * m);                                  // smoothstep
    const fp = Math.max(0, (window.scrollY - fadeRange) / (window.innerHeight * 0.5));
    fade = Math.max(0, 1 - fp);
  }
  function recalcRanges() {
    splitRange = window.innerHeight * 0.55;
    fadeRange  = window.innerHeight * 1.30;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { recalcRanges(); onScroll(); });
  onScroll();   // pick up restored scroll position on load

  // ---- render loop -------------------------------------------------------
  const tmp = new THREE.Vector3();
  let spin  = 0.32;
  let flowT = 0;

  // dev helper: ?view=lateral|top|front|rear pins rotation for screenshots
  const viewParam = new URLSearchParams(window.location.search).get("view");
  const viewPin = {
    lateral: { x: 0,            y: Math.PI / 2 },
    top:     { x: Math.PI / 2,  y: 0 },
    front:   { x: 0,            y: 0 },
    rear:    { x: 0,            y: Math.PI },
    threeq:  { x: -0.18,        y: -0.9 },
  }[viewParam] || null;

  function animate() {
    const splitAmt = Math.max(0, Math.min(1, (morph - 0.82) / 0.18));
    if (heroContent) {
      heroContent.style.opacity = String(Math.max(0, 1 - morph * 2.2));
      heroContent.style.pointerEvents = morph > 0.3 ? "none" : "";  // don't block hemisphere clicks
    }
    if (heroHint)    heroHint.style.opacity    = String(Math.max(0, 1 - morph * 3.0));
    if (waveLabels)  waveLabels.classList.toggle("is-unraveled", morph > 0.45);
    if (splitVision) splitVision.style.opacity = String(splitAmt * fade);

    // zoom out as brain splits so both brains fit in frame
    camera.fov = THREE.MathUtils.lerp(42, 62, morph);
    camera.updateProjectionMatrix();

    uniforms.uMorph.value      = morph;
    uniforms.uFade.value       = fade;
    body.material.opacity      = 0.10 * fade * (1 - morph);
    synapses.material.opacity  = 0.12 * fade * (1 - morph);

    // signal flow appears as the split completes
    const flowAmt = Math.max(0, Math.min(1, (morph - 0.78) / 0.22)) * fade;
    flowPoints.visible = haloPoints.visible = flowAmt > 0.01;
    flowMat.uniforms.uFade.value = flowAmt * 0.95;
    haloMat.uniforms.uFade.value = flowAmt * 0.16;
    if (flowPoints.visible) {
      if (!reduceMotion) flowT += 0.016;
      updateFlow(flowT);
    }

    // on narrow screens, shrink the splayed brains as they split so both
    // hemispheres stay inside the frame (the ±SPLIT offset is baked in world space)
    const splitShrink = root.userData.small ? (1 - 0.34 * morph) : 1;
    root.scale.setScalar((root.userData.scale || 1) * splitShrink);
    // slide from right-offset to center as brain unravels
    root.position.x = THREE.MathUtils.lerp(root.userData.offsetX || 0, 0, morph);
    root.position.y = root.userData.baseY || 0;

    if (!reduceMotion) spin += CONFIG.rotateSpeed * 0.016;
    const rotDamp    = 1 - morph;
    if (viewPin) {
      brain.rotation.y = viewPin.y;
      brain.rotation.x = viewPin.x;
    } else {
      brain.rotation.y = (spin + mouse.x * 0.25) * rotDamp;
      brain.rotation.x = (-0.24 + mouse.y * 0.12) * rotDamp;
    }

    // hover only while brain is visible
    if (fade > 0.1 && morph < 0.45) {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(cores, false);
      hovered = hits.length ? hits[0].object.userData.index : -1;
    } else {
      hovered = -1;
    }

    // hemisphere hover at full split → pointer cursor (canvas sits behind DOM)
    if (morph > 0.85 && fade > 0.4) {
      raycaster.setFromCamera(pointer, camera);
      hemiHover = raycaster.intersectObjects(hemiHits, false).length > 0;
    } else {
      hemiHover = false;
    }
    document.body.style.cursor = hemiHover ? "pointer" : "";

    nodes.forEach((node, i) => {
      const d = node.userData;
      d.hover += ((i === hovered ? 1 : 0) - d.hover) * 0.18;
      const nodeVis = Math.max(0, fade * (1 - morph * 2.2));
      node.scale.setScalar(1 + d.hover * 1.6);
      node.children[1].material.opacity = (0.4 + d.hover * 0.6) * nodeVis;
      node.children[0].material.opacity = nodeVis;
      node.children[0].material.transparent = true;
    });

    if (hovered >= 0 && fade > 0.1 && morph < 0.3) {
      tmp.setFromMatrixPosition(nodes[hovered].matrixWorld);
      tmp.project(camera);
      const x = rect.left + (tmp.x * 0.5 + 0.5) * rect.width;
      const y = rect.top  + (-tmp.y * 0.5 + 0.5) * rect.height;
      const p = PAPERS[hovered];
      tip.innerHTML = `<span class="tip-dot" style="--dot:${CAT[p.c]}"></span><span class="tip-body"><strong>${p.t}</strong><span>${p.v} &middot; ${p.y}</span></span>`;
      tip.style.transform = `translate(-50%,-118%) translate(${x}px,${y}px)`;
      tip.classList.add("is-visible");
      canvas.style.cursor = "pointer";
    } else {
      tip.classList.remove("is-visible");
      canvas.style.cursor = "";
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
