import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import * as THREE from 'three'
import { hero } from '../lib/store'
import { isCoarse, reducedMotion } from '../lib/env'
import Adaptive from './Adaptive'

const { damp } = THREE.MathUtils

/** 3D-шум (simplex) для деформации вершин — вставляется в стандартный шейдер MeshPhysicalMaterial */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float field(vec3 p){ return snoise(p*uFreq+vec3(0.0,0.0,uTime*0.16))*uAmp + snoise(p*uFreq*1.9-vec3(uTime*0.1))*uAmp*0.18; }
`

/**
 * «Жидкий хром»: сфера, поверхность которой медленно течёт (шум в вершинном шейдере, нормали пересчитываются
 * по соседним точкам — отражения остаются честными). Курсор «притягивает» волну, скролл усиливает деформацию.
 */
function Chrome() {
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAmp: { value: 0.2 }, uFreq: { value: 0.62 }, uPull: { value: new THREE.Vector3() } }), [])
  const mat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({ color: '#c9ccd2', metalness: 1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.35, iridescence: 0.25, iridescenceIOR: 1.3 })
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, uniforms)
      s.vertexShader = 'uniform float uTime; uniform float uAmp; uniform float uFreq; uniform vec3 uPull;\n' + NOISE + s.vertexShader
        .replace('#include <beginnormal_vertex>', `
          vec3 pos0 = position;
          float pull = smoothstep(1.6, 0.0, distance(normalize(pos0), normalize(uPull + vec3(0.0001)))) * length(uPull);
          vec3 tg = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
          vec3 bt = normalize(cross(normal, tg)); float e = 0.01;
          vec3 pA = pos0 + normal * (field(pos0) + pull * 0.35);
          vec3 pB = (pos0 + tg * e); pB += normalize(pB) * (field(pB) + pull * 0.35);
          vec3 pC = (pos0 + bt * e); pC += normalize(pC) * (field(pC) + pull * 0.35);
          vec3 objectNormal = normalize(cross(pB - pA, pC - pA));
          if (dot(objectNormal, normal) < 0.0) objectNormal = -objectNormal;
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3( tangent.xyz );
          #endif`)
        .replace('#include <begin_vertex>', 'vec3 transformed = pA;')
    }
    return m
  }, [uniforms])
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.5, isCoarse ? 48 : 96), [])
  useEffect(() => () => { mat.dispose(); geo.dispose() }, [mat, geo])
  useEffect(() => { hero.ready = true }, [])
  const camera = useThree((s) => s.camera), size = useThree((s) => s.size)
  const st = useRef({ mx: 0, my: 0, in: 0 })

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const s = st.current, m = mesh.current!
    s.mx = damp(s.mx, isCoarse ? Math.sin(state.clock.elapsedTime * 0.3) * 0.4 : hero.mx, 3, dt)
    s.my = damp(s.my, isCoarse ? 0 : hero.my, 3, dt)
    s.in = damp(s.in, 1, 1.2, dt)
    if (!reducedMotion) uniforms.uTime.value += dt
    uniforms.uAmp.value = 0.26 + hero.scroll * 0.3
    uniforms.uPull.value.set(s.mx * 1.4, -s.my * 1.4, 1.2)
    m.rotation.y += reducedMotion ? 0 : dt * 0.08
    m.rotation.x = damp(m.rotation.x, s.my * 0.35, 3, dt)
    m.position.y = (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.06) + hero.scroll * 0.9
    m.scale.setScalar((0.7 + 0.3 * s.in) * (1 - hero.scroll * 0.15))
    camera.position.x = damp(camera.position.x, s.mx * 0.5, 2, dt)
    camera.position.y = damp(camera.position.y, -s.my * 0.35, 2, dt)
    // на узком экране — дальше, чтобы объект не перекрывал текст
    camera.position.z = damp(camera.position.z, size.width / size.height < 1 ? 7.4 : 6, 3, dt)
    camera.lookAt(0, 0, 0)
  })
  return <mesh ref={mesh} geometry={geo} material={mat} />
}

/** Отражения: процедурная студия + светящиеся «софтбоксы» (лайм и холодный) — хром получает фирменный блик */
function Studio() {
  const gl = useThree((s) => s.gl), scene = useThree((s) => s.scene)
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl), room = new RoomEnvironment()
    const box = (color: string, x: number, y: number, z: number, sx: number, sy: number, intensity: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sy), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }))
      m.position.set(x, y, z); m.lookAt(0, 0, 0); room.add(m)
    }
    box('#d4ff5a', -6, 2, 4, 2.5, 8, 6)
    box('#9fb8ff', 7, -1, -2, 2, 6, 4)
    const rt = pm.fromScene(room, 0.02)
    scene.environment = rt.texture
    room.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose() } })
    pm.dispose()
    return () => { scene.environment = null; rt.dispose() }
  }, [gl, scene])
  return null
}

function Frameloop() {
  const set = useThree((s) => s.setFrameloop)
  useEffect(() => { const id = setInterval(() => set(hero.visible ? 'always' : 'never'), 250); return () => clearInterval(id) }, [set])
  return null
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, isCoarse ? 1.5 : 1.75]} camera={{ position: [0, 0, 6], fov: 35 }} aria-hidden
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
      <Frameloop />
      <Adaptive />
      <Studio />
      <Chrome />
    </Canvas>
  )
}
