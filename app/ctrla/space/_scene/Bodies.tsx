"use client";

// ═══════════════════════════════════════════════════════
// SPACE — THE BODIES
//
// Renders every entry in the map registry: the sun, planets, moons,
// asteroids, and the comet. All geometry is procedural — a displaced
// icosahedron per body, generated once from its seed — so the whole system
// costs zero downloaded assets.
//
// Positions are recomputed every frame from orbit params (planets around the
// sun, moons around their parent) and written into `frame.bodyPositions`,
// which is what the ship's docking check and the HUD distances read.
// ═══════════════════════════════════════════════════════

import { Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BODIES, type CelestialBody } from "../_map/map";
import { frame, useSpace } from "../_state/useSpace";
import SunLogo from "./SunLogo";
import { hasPad, padDir, PAD_FLAT } from "../_map/pads";

// ── Simplex 3D Noise ───────────────────────────────────
const SNOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0; 
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z); 
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

// A fresnel shell: transparent face-on, glowing at the limb, in the body's
// own glow colour. Additive, so it reads as light, not paint. The same
// shader, tuned hotter, is the sun's bloom edge.
const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Smoother, thicker fresnel for better atmospheric scattering
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), uPower);
    gl_FragColor = vec4(uColor, rim * uStrength);
  }
`;
function makeAtmosphere(color: string, power: number, strength: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power * 0.8 }, // Thicker atmosphere
      uStrength: { value: strength * 1.5 }, // Brighter edge
    },
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
  });
}

// ── Procedural Clouds ──────────────────────────────────
// Scrolling simplex noise spheres mapped onto slightly larger geometry
const CLOUD_VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const CLOUD_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vPos;
  ${SNOISE}
  void main() {
    float n = snoise(vPos * 0.3 + uTime * 0.05);
    float n2 = snoise(vPos * 0.8 - uTime * 0.02);
    float clouds = smoothstep(0.1, 0.6, n * 0.6 + n2 * 0.4);
    gl_FragColor = vec4(uColor, clouds * 0.45);
  }
`;
function makeClouds(color: string) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: CLOUD_VERT,
    fragmentShader: CLOUD_FRAG,
  });
}

// ── Procedural terrain ─────────────────────────────────
// Icosahedron with per-vertex fractal noise displacement, flat-shaded. The
// seed makes every body's continents its own; the size scales them. Planets
// also carry an `aElev` attribute (-1..1, 0 = sea level) the terrain shader
// colours by, and a flattened plateau around the landing pad.
function hash3(x: number, y: number, z: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 53.3) * 43758.5453;
  return n - Math.floor(n);
}
const fade = (t: number) => t * t * (3 - 2 * t);
function valueNoise(x: number, y: number, z: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = fade(x - ix), fy = fade(y - iy), fz = fade(z - iz);
  const c = (dx: number, dy: number, dz: number) => hash3(ix + dx, iy + dy, iz + dz, seed);
  const x00 = c(0, 0, 0) + (c(1, 0, 0) - c(0, 0, 0)) * fx;
  const x10 = c(0, 1, 0) + (c(1, 1, 0) - c(0, 1, 0)) * fx;
  const x01 = c(0, 0, 1) + (c(1, 0, 1) - c(0, 0, 1)) * fx;
  const x11 = c(0, 1, 1) + (c(1, 1, 1) - c(0, 1, 1)) * fx;
  const y0 = x00 + (x10 - x00) * fy;
  const y1 = x01 + (x11 - x01) * fy;
  return (y0 + (y1 - y0) * fz) * 2 - 1;
}
/** Fractal noise on the unit sphere, -1..1, continents at the low octaves. */
function fbm(d: THREE.Vector3, seed: number, octaves: number) {
  let amp = 0.55, freq = 1.6, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise(d.x * freq + 7.3, d.y * freq + 3.1, d.z * freq + 11.9, seed + o * 17) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum / norm;
}

/** Relief scale: how far a full-height peak stands off the sphere. */
const RELIEF = 0.085;
const SEA_TYPES = new Set(["ocean", "ice"]);

/** Planet elevation at a unit direction, -1..1. Shared by geometry + pad. */
function elevationAt(d: THREE.Vector3, body: CelestialBody) {
  // Ridged upper octaves give mountain chains instead of mush.
  const base = fbm(d, body.look.seed, 4);
  const ridge = 1 - Math.abs(fbm(d, body.look.seed + 101, 3));
  return THREE.MathUtils.clamp(base * 1.35 + (ridge - 0.5) * 0.35, -1, 1);
}
function radiusFor(e: number, body: CelestialBody) {
  const sea = SEA_TYPES.has(body.look.terrain ?? "");
  const h = sea ? Math.max(e, 0) : e * 0.75;
  return body.size * (1 + h * RELIEF);
}
/** Pad elevation: the terrain there, lifted onto land if it fell in the sea. */
function padElevation(body: CelestialBody) {
  const pd = padDir(body);
  const d = new THREE.Vector3(pd.x, pd.y, pd.z);
  return Math.max(elevationAt(d, body), 0.18);
}
export function padRadius(body: CelestialBody) {
  return radiusFor(padElevation(body), body) + 0.02;
}

function makeBodyGeometry(body: CelestialBody) {
  const isPlanet = body.kind === "planet";
  const bumpy = body.kind === "asteroid" ? 0.22 : body.kind === "sun" ? 0.02 : 0.09;
  const geo = new THREE.IcosahedronGeometry(body.size, isPlanet ? 4 : 2);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const elev = new Float32Array(pos.count);
  const v = new THREE.Vector3();
  const d = new THREE.Vector3();
  const pad = padDir(body);
  const padV = new THREE.Vector3(pad.x, pad.y, pad.z);
  const padE = isPlanet ? padElevation(body) : 0;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    d.copy(v).normalize();
    if (isPlanet) {
      let e = elevationAt(d, body);
      if (hasPad(body)) {
        // Flatten a plateau under the pad, feathered at the edge.
        const ang = Math.acos(THREE.MathUtils.clamp(d.dot(padV), -1, 1));
        const k = 1 - THREE.MathUtils.smoothstep(ang, PAD_FLAT * 0.55, PAD_FLAT);
        e = THREE.MathUtils.lerp(e, padE, k);
      }
      elev[i] = e;
      v.copy(d).multiplyScalar(radiusFor(e, body));
    } else {
      // Cheap deterministic lumps from the vertex direction + seed.
      const seed = body.look.seed;
      const n = Math.sin(v.x * 2.1 + seed) * Math.sin(v.y * 1.7 + seed * 2.0) * Math.sin(v.z * 2.3 + seed * 0.5);
      v.multiplyScalar(1 + n * bumpy);
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.setAttribute("aElev", new THREE.BufferAttribute(elev, 1));
  // Flat shading needs unwelded faces. IcosahedronGeometry already ships
  // non-indexed in r184, so only unweld if some future geometry is indexed.
  const flat = geo.index ? geo.toNonIndexed() : geo;
  flat.computeVertexNormals();
  if (flat !== geo) geo.dispose();
  return flat;
}

// ── Terrain shader ─────────────────────────────────────
// Patched into MeshStandardMaterial so the planets keep real lighting. Colour
// comes from elevation + latitude: sea, shore, lowland, highland, peaks, ice
// caps. Water is glossier than land. Volcanic worlds glow in their cracks.
const TERRAIN_ID: Record<string, number> = { ocean: 0, rock: 1, ice: 2, volcanic: 3 };
const TERRAIN_VERT_DECL = /* glsl */ `
  attribute float aElev;
  varying float vElev;
  varying vec3 vLocal;
  varying vec3 vWorldPos;
`;
const TERRAIN_FRAG_DECL = /* glsl */ `
  uniform float uTime;
  uniform float uType;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uGlow;
  varying float vElev;
  varying vec3 vLocal;
  varying vec3 vWorldPos;
  float vSea;
  ${SNOISE}
`;
const TERRAIN_COLOR = /* glsl */ `
  {
    float e = vElev;
    float lat = abs(normalize(vLocal).y);
    float grain = snoise(vLocal * 0.9) * 0.5 + 0.5;
    vec3 water = mix(uDeep, uMid, 0.22);
    vec3 shallow = mix(uDeep, uMid, 0.55);
    vec3 low = mix(uMid, uDeep, 0.18 + grain * 0.18);
    vec3 high = mix(uMid, uGlow, smoothstep(0.18, 0.62, e));
    vec3 peak = mix(high, vec3(0.93, 0.9, 0.86), smoothstep(0.58, 0.95, e));
    vec3 land = mix(low, peak, smoothstep(0.02, 0.35, e));
    vec3 col;
    float sea = 0.0;
    bool isIce = uType > 1.5 && uType < 2.5;
    if (uType < 0.5 || isIce) {
      // ocean / ice: a real sea level
      sea = 1.0 - smoothstep(-0.005, 0.035, e);
      vec3 w = mix(water, shallow, smoothstep(-0.28, 0.0, e));
      col = mix(land, w, sea);
      float capEdge = isIce ? 0.42 : 0.74;
      float cap = smoothstep(capEdge, capEdge + 0.14, lat + grain * 0.06);
      vec3 ice = mix(vec3(0.86, 0.9, 0.96), uGlow, 0.18);
      col = mix(col, ice, cap * (isIce ? 0.95 : 0.85));
      if (isIce) col = mix(col, ice, 0.35 * (1.0 - sea));
    } else if (uType < 1.5) {
      // rock: no sea, banded strata, bright highlands
      vec3 basin = mix(uDeep, uMid, 0.55 + grain * 0.2);
      col = mix(basin, high, smoothstep(-0.2, 0.55, e));
      float strata = smoothstep(0.35, 0.65, fract(e * 6.0 + grain));
      col = mix(col, col * 0.86, strata * 0.5);
    } else {
      // volcanic: dark crust, glow pooled in the low cracks
      vec3 crust = mix(uDeep, uMid, 0.4 + grain * 0.25);
      col = mix(crust, mix(uMid, uGlow, 0.35), smoothstep(0.1, 0.7, e));
      float crack = smoothstep(0.55, 0.85, snoise(vLocal * 2.4 + 3.0) * 0.5 + 0.5) * (1.0 - smoothstep(-0.25, 0.2, e));
      col = mix(col, uGlow, crack * 0.7);
    }
    diffuseColor.rgb = col;
    vSea = sea;
  }
`;
const TERRAIN_EMISSIVE = /* glsl */ `
  {
    if (uType > 2.5) {
      float crack = smoothstep(0.55, 0.85, snoise(vLocal * 2.4 + 3.0) * 0.5 + 0.5) * (1.0 - smoothstep(-0.25, 0.2, vElev));
      totalEmissiveRadiance += uGlow * crack * (0.7 + 0.25 * sin(uTime * 1.7 + vLocal.x));
    }
    // City lights: land only, night side only, clustered.
    vec3 sunDir = normalize(-vWorldPos);
    float sunDot = dot(normalize(normal), normalize((viewMatrix * vec4(sunDir, 0.0)).xyz));
    if (sunDot < 0.1 && vSea < 0.5 && vElev < 0.5) {
      float n = snoise(vWorldPos * 2.0);
      if (n > 0.72) {
        totalEmissiveRadiance += vec3(1.0, 0.8, 0.4) * (0.1 - sunDot) * 2.5 * ((n - 0.72) * 3.5);
      }
    }
  }
`;

// ── Ring system ────────────────────────────────────────
// A flat annulus with radial bands drawn in the shader: dense inner ring,
// a gap, a thinner outer band, feathered on both edges, shaded where the
// planet blocks the sun.
const RING_VERT = /* glsl */ `
  varying float vR;
  varying vec3 vWorld;
  void main() {
    vR = length(position.xy);
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const RING_FRAG = /* glsl */ `
  uniform float uInner;
  uniform float uOuter;
  uniform vec3 uColor;
  uniform vec3 uGlow;
  uniform vec3 uCenter;
  uniform float uSize;
  varying float vR;
  varying vec3 vWorld;
  void main() {
    float t = (vR - uInner) / (uOuter - uInner);
    float edge = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.94, 1.0, t));
    float bands = 0.55 + 0.45 * sin(t * 62.0) * sin(t * 17.0 + 1.3);
    float gap = 1.0 - smoothstep(0.52, 0.55, t) * (1.0 - smoothstep(0.62, 0.66, t));
    float a = edge * bands * gap * 0.85;
    vec3 toSun = normalize(-uCenter);
    vec3 rel = vWorld - uCenter;
    float behind = step(0.0, -dot(rel, toSun));
    float across = length(rel - toSun * dot(rel, toSun));
    float shadow = behind * (1.0 - smoothstep(uSize * 0.9, uSize * 1.15, across));
    vec3 col = mix(uColor, uGlow, t * 0.6) * (1.0 - shadow * 0.75);
    gl_FragColor = vec4(col, a);
  }
`;
function makeRingMaterial(inner: number, outer: number, mid: string, glow: string, size: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uInner: { value: inner },
      uOuter: { value: outer },
      uColor: { value: new THREE.Color(mid) },
      uGlow: { value: new THREE.Color(glow) },
      uCenter: { value: new THREE.Vector3() },
      uSize: { value: size },
    },
    vertexShader: RING_VERT,
    fragmentShader: RING_FRAG,
  });
}

// ── Gold small-caps label sprite ───────────────────────
// Canvas-rasterized text on a sprite, so every body carries its name the way
// the magazine's labels do. Generated once per body.
function makeLabelTexture(text: string) {
  const canvas = document.createElement("canvas");
  const scale = 4;
  const ctx = canvas.getContext("2d")!;
  const font = `700 ${13 * scale}px 'Neue Montreal', 'Helvetica Neue', Arial, sans-serif`;
  ctx.font = font;
  const label = text.toUpperCase();
  const spacing = 4 * scale;
  const w = ctx.measureText(label).width + spacing * label.length + 8 * scale;
  canvas.width = Math.ceil(w);
  canvas.height = 22 * scale;
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#E3C24A";
  let x = 4 * scale;
  for (const ch of label) {
    ctx.fillText(ch, x, canvas.height / 2);
    x += ctx.measureText(ch).width + spacing;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return { tex, aspect: canvas.width / canvas.height };
}

// Soft radial gold dot, shared by the sun's core glow. Drawn once.
let glowTexCache: THREE.CanvasTexture | null = null;
function getGlowTex() {
  if (glowTexCache) return glowTexCache;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,244,200,1)");
  g.addColorStop(0.25, "rgba(227,194,74,0.7)");
  g.addColorStop(0.6, "rgba(227,194,74,0.18)");
  g.addColorStop(1, "rgba(227,194,74,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTexCache = new THREE.CanvasTexture(c);
  return glowTexCache;
}

function Body({ body }: { body: CelestialBody }) {
  const group = useRef<THREE.Group>(null);
  const glowTex = useMemo(getGlowTex, []);
  const ringRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Sprite>(null);
  const coreGlowRef = useRef<THREE.Sprite>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const isSun = body.kind === "sun";
  const isSmall = body.kind === "moon" || body.kind === "asteroid";

  const isPlanet = body.kind === "planet";
  const geometry = useMemo(() => makeBodyGeometry(body), [body]);
  const label = useMemo(() => makeLabelTexture(body.label), [body.label]);
  const atmosphere = useMemo(
    () => makeAtmosphere(body.look.palette[2], isSun ? 2.2 : isSmall ? 3.2 : 2.6, isSun ? 1.1 : isSmall ? 0.45 : 0.7),
    [body.look.palette, isSun, isSmall]
  );
  const clouds = useMemo(
    () => (body.kind === "planet" ? makeClouds("#FFFFFF") : null),
    [body.kind]
  );
  const terrainUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uType: { value: TERRAIN_ID[body.look.terrain ?? "rock"] ?? 1 },
      uDeep: { value: new THREE.Color(body.look.palette[0]) },
      uMid: { value: new THREE.Color(body.look.palette[1]) },
      uGlow: { value: new THREE.Color(body.look.palette[2]) },
    }),
    [body.look]
  );
  const rings = useMemo(() => {
    if (!body.look.rings) return null;
    const inner = body.size * 1.55;
    const outer = body.size * 2.6;
    return { geo: new THREE.RingGeometry(inner, outer, 128, 1), mat: makeRingMaterial(inner, outer, body.look.palette[1], body.look.palette[2], body.size) };
  }, [body]);
  const pad = useMemo(() => {
    if (!hasPad(body)) return null;
    const d = padDir(body);
    const dir = new THREE.Vector3(d.x, d.y, d.z);
    const r = padRadius(body);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return { dir, r, q, pos: dir.clone().multiplyScalar(r) };
  }, [body]);
  const beaconRef = useRef<THREE.Sprite>(null);
  const padRingRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    frame.bodyPositions.set(body.id, new THREE.Vector3());
    return () => {
      frame.bodyPositions.delete(body.id);
      geometry.dispose();
      label.tex.dispose();
      atmosphere.dispose();
      if (clouds) clouds.dispose();
      if (rings) {
        rings.geo.dispose();
        rings.mat.dispose();
      }
      frame.pads.delete(body.id);
    };
  }, [body.id, geometry, label, atmosphere, clouds, rings]);

  useFrame(({ clock, camera }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const { radius, speed, phase } = body.orbit;
    const a = phase + t * speed;
    // Moons orbit their parent's live position; everything else the origin.
    const cx = body.parent ? frame.bodyPositions.get(body.parent)?.x ?? 0 : 0;
    const cz = body.parent ? frame.bodyPositions.get(body.parent)?.z ?? 0 : 0;
    g.position.set(cx + Math.cos(a) * radius, 0, cz + Math.sin(a) * radius);
    frame.bodyPositions.get(body.id)?.copy(g.position);
    g.rotation.y = t * (isSun ? 0.02 : 0.1);
    
    if (clouds) clouds.uniforms.uTime.value = t;
    terrainUniforms.uTime.value = t;
    if (rings) (rings.mat.uniforms.uCenter.value as THREE.Vector3).copy(g.position);

    // Pad: rotate its local spot with the planet and publish it for the ship.
    if (pad) {
      const ry = g.rotation.y;
      const c = Math.cos(ry), sn = Math.sin(ry);
      const px = pad.pos.x * c + pad.pos.z * sn;
      const pz = -pad.pos.x * sn + pad.pos.z * c;
      let rec = frame.pads.get(body.id);
      if (!rec) {
        rec = { x: 0, y: 0, z: 0, nx: 0, ny: 0, nz: 0 };
        frame.pads.set(body.id, rec);
      }
      rec.x = g.position.x + px;
      rec.y = g.position.y + pad.pos.y;
      rec.z = g.position.z + pz;
      rec.nx = pad.dir.x * c + pad.dir.z * sn;
      rec.ny = pad.dir.y;
      rec.nz = -pad.dir.x * sn + pad.dir.z * c;
      // Beacon breathes; brighter while this is the near or landing body.
      const s = useSpace.getState();
      const hot = s.nearId === body.id || s.landingId === body.id || s.landedId === body.id;
      if (beaconRef.current) {
        const m = beaconRef.current.material as THREE.SpriteMaterial;
        m.opacity = (hot ? 0.95 : 0.6) * (0.7 + 0.3 * Math.sin(t * (hot ? 5 : 2.2)));
      }
      if (padRingRef.current) {
        const m = padRingRef.current.material as THREE.MeshBasicMaterial;
        m.opacity = hot ? 0.95 : 0.7;
      }
    }

    // Dock ring: visible and breathing only while this body is the near one.
    if (ringRef.current) {
      const near = useSpace.getState().nearId === body.id;
      const m = ringRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = THREE.MathUtils.lerp(m.opacity, near ? 0.55 + Math.sin(t * 4) * 0.2 : 0, 0.1);
    }

    // The sun's halos are sized to read from the outer orbits. Up close,
    // additive sprites that wide would wash the whole frame gold, so they
    // fade out as the camera closes in and the fresnel edge takes over.
    if (isSun && (coreGlowRef.current || haloRef.current)) {
      const d = camera.position.distanceTo(g.position);
      if (coreGlowRef.current) {
        (coreGlowRef.current.material as THREE.SpriteMaterial).opacity = 0.85 * THREE.MathUtils.smoothstep(d, 16, 50);
      }
      if (haloRef.current) {
        (haloRef.current.material as THREE.SpriteMaterial).opacity = 0.26 * THREE.MathUtils.smoothstep(d, 34, 150);
      }
    }

    // Labels are screen-constant, so a distant cluster of moons would pile
    // its names on top of each other. Big stops stay labelled from anywhere;
    // small bodies only announce themselves once the ship is fairly close.
    if (labelRef.current) {
      const d = Math.hypot(g.position.x - frame.shipPosition.x, g.position.z - frame.shipPosition.z);
      const reach = isSmall ? 70 : 400;
      const want = THREE.MathUtils.clamp(1 - (d - reach * 0.7) / (reach * 0.3), 0, 1) * 0.92;
      const m = labelRef.current.material as THREE.SpriteMaterial;
      m.opacity = THREE.MathUtils.lerp(m.opacity, want, 0.15);
    }
  });

  const [deep, mid, glow] = body.look.palette;

  return (
    <group ref={group}>
      {isSun ? (
        <>
          {/* The system's key light lives inside the sun. r184 lights are in
              physical units with inverse-square falloff, so the intensity
              is in the thousands to reach the outer orbits. */}
          <pointLight intensity={14000} decay={2} color="#F2D27A" />
          {/* The mark itself, extruded and turning. The plain core stands in
              while the SVG loads. */}
          <Suspense
            fallback={
              <mesh geometry={geometry}>
                <meshBasicMaterial color={glow} />
              </mesh>
            }
          >
            <SunLogo size={body.size} />
          </Suspense>
          {/* A dim amber heart behind the mark, so it never reads as a cut-out
              when seen edge-on. */}
          <mesh scale={body.size * 0.4}>
            <sphereGeometry args={[1, 24, 18]} />
            <meshBasicMaterial color={mid} />
          </mesh>
          {/* Bloom without a post pass: a hot core sprite, a wide soft halo,
              and a fresnel edge on the heart. */}
          <sprite ref={coreGlowRef} scale={[body.size * 6, body.size * 6, 1]}>
            <spriteMaterial map={glowTex} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
          </sprite>
          <sprite ref={haloRef} scale={[body.size * 13, body.size * 13, 1]}>
            <spriteMaterial map={glowTex} transparent opacity={0.26} blending={THREE.AdditiveBlending} depthWrite={false} />
          </sprite>
          <mesh scale={body.size * 1.05} material={atmosphere}>
            <sphereGeometry args={[1, 32, 24]} />
          </mesh>
        </>
      ) : (
        <>
          <mesh geometry={geometry}>
            {/* Emissive carries the body's own colour on the night side, so a
                planet turned away from the sun is dim, never black. Planets
                get the terrain shader patched in on top. */}
            <meshStandardMaterial
              color={mid}
              emissive={mid}
              emissiveIntensity={isPlanet ? 0.16 : 0.28}
              flatShading
              roughness={0.85}
              onBeforeCompile={(shader) => {
                if (!isPlanet) return;
                Object.assign(shader.uniforms, terrainUniforms);
                shader.vertexShader = `${TERRAIN_VERT_DECL}\n${shader.vertexShader}`.replace(
                  `#include <worldpos_vertex>`,
                  `#include <worldpos_vertex>
                   vElev = aElev;
                   vLocal = position;
                   vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
                );
                shader.fragmentShader = `${TERRAIN_FRAG_DECL}\n${shader.fragmentShader}`
                  .replace(`#include <color_fragment>`, `#include <color_fragment>\n${TERRAIN_COLOR}`)
                  .replace(
                    `#include <roughnessmap_fragment>`,
                    `#include <roughnessmap_fragment>
                     roughnessFactor = mix(0.9, 0.32, vSea);`
                  )
                  .replace(`#include <emissivemap_fragment>`, `#include <emissivemap_fragment>\n${TERRAIN_EMISSIVE}`);
              }}
            />
          </mesh>
          {/* Rings, tilted off the ecliptic. */}
          {rings && body.look.rings && (
            <mesh geometry={rings.geo} material={rings.mat} rotation={[Math.PI / 2 + body.look.rings.tilt, 0, 0]} />
          )}
          {/* Landing pad: a gold ring on a flattened plateau, with a beacon
              you can spot from orbit. Sized for the ship, not the planet. */}
          {pad && (
            <group position={pad.pos} quaternion={pad.q}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                <circleGeometry args={[2.4, 40]} />
                <meshStandardMaterial color="#1A1230" roughness={0.6} metalness={0.3} />
              </mesh>
              <mesh ref={padRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[2.0, 2.35, 48]} />
                <meshBasicMaterial color="#E3C24A" transparent opacity={0.7} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[0.55, 0.7, 32]} />
                <meshBasicMaterial color="#E3C24A" transparent opacity={0.8} side={THREE.DoubleSide} />
              </mesh>
              {[0, 1, 2, 3].map((i) => {
                const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
                return (
                  <mesh key={i} position={[Math.cos(a) * 2.9, 0.35, Math.sin(a) * 2.9]}>
                    <boxGeometry args={[0.22, 0.7, 0.22]} />
                    <meshStandardMaterial color="#E3C24A" emissive="#E3C24A" emissiveIntensity={1.4} />
                  </mesh>
                );
              })}
              <sprite ref={beaconRef} position={[0, 1.6, 0]} scale={[4.5, 4.5, 1]}>
                <spriteMaterial map={glowTex} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
              </sprite>
            </group>
          )}
          {/* Atmosphere: a lit limb in the body's glow colour. */}
          <mesh scale={body.size * (isSmall ? 1.16 : 1.2)} material={atmosphere}>
            <sphereGeometry args={[1, 24, 18]} />
          </mesh>
          {/* Clouds for planets */}
          {clouds && (
            <mesh scale={body.size * 1.08} material={clouds}>
              <sphereGeometry args={[1, 24, 18]} />
            </mesh>
          )}
        </>
      )}

      {/* Comet tail: a stretched cone of additive gold behind the head. */}
      {body.kind === "comet" && (
        <mesh position={[-body.size * 3.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[body.size * 0.9, body.size * 6, 8, 1, true]} />
          <meshBasicMaterial color="#E3C24A" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Dock ring, flat on the ecliptic. */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[body.size * 2.1, body.size * 2.25, 48]} />
        <meshBasicMaterial color="#E3C24A" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* The name, floating above. Screen-constant size, so a label never
          balloons when the ship passes close. */}
      <sprite ref={labelRef} position={[0, body.size + (isSun ? 6 : 2.6), 0]} scale={[label.aspect * (isSmall ? 0.03 : 0.04), isSmall ? 0.03 : 0.04, 1]}>
        <spriteMaterial map={label.tex} transparent opacity={0} depthWrite={false} depthTest={false} sizeAttenuation={false} />
      </sprite>
    </group>
  );
}

import { StationBody } from "./Station";
import { FLIGHT } from "../_map/flight";

// ── Asteroid Belt (world border) ────────────────────────
// A ring of small procedural rocks at WORLD_RADIUS to visually
// represent the edge of the navigable map.
function AsteroidBelt() {
  const rocks = useMemo(() => {
    const count = 260;
    const radius = FLIGHT.WORLD_RADIUS;
    const arr: { pos: [number, number, number]; rot: [number, number, number]; scale: number; seed: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.sin(i * 137.5) * 0.04);
      const r = radius + Math.sin(i * 7.3) * 18 + Math.cos(i * 13.1) * 10;
      const y = Math.sin(i * 3.7) * 6 + Math.cos(i * 11.3) * 4;
      const s = 0.3 + Math.abs(Math.sin(i * 17.7)) * 1.4;
      arr.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        rot: [i * 1.1, i * 2.3, i * 0.7],
        scale: s,
        seed: i,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} rotation={rock.rot} scale={rock.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6B5B4F" flatShading roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function Bodies() {
  const ordered = useMemo(() => {
    const rank = { sun: 0, planet: 1, comet: 2, asteroid: 3, moon: 4, station: 5 } as const;
    return [...BODIES].sort((a, b) => rank[a.kind] - rank[b.kind]);
  }, []);
  return (
    <>
      {ordered.map((b) => (
        b.kind === "station" ? <StationBody key={b.id} body={b} /> : <Body key={b.id} body={b} />
      ))}
      <AsteroidBelt />
    </>
  );
}

