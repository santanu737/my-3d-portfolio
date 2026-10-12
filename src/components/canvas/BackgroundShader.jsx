import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uBase;
  uniform vec3 uCyan;
  uniform vec3 uPink;
  varying vec2 vUv;

  float hash(vec2 position) {
    return fract(sin(dot(position, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 position) {
    vec2 cell = floor(position);
    vec2 local = fract(position);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
      local.y
    );
  }

  void main() {
    vec2 centered = vUv - 0.5;
    float drift = uTime * 0.018 + uScroll * 0.8;
    float clouds = noise(vUv * 3.2 + vec2(drift, -drift * 0.6));
    float cyanGlow = smoothstep(0.72, 0.05, length(centered - vec2(0.22, 0.1)));
    float pinkGlow = smoothstep(0.68, 0.04, length(centered - vec2(0.36, -0.28)));
    vec3 color = uBase;
    color += uCyan * cyanGlow * (0.06 + clouds * 0.04);
    color += uPink * pinkGlow * (0.025 + clouds * 0.025);
    gl_FragColor = vec4(color, 0.42);
  }
`

export function BackgroundShader({ scrollProgress }) {
  const materialRef = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uBase: { value: new THREE.Color('#08080c') },
      uCyan: { value: new THREE.Color('#00d9ff') },
      uPink: { value: new THREE.Color('#ff006e') },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = clock.elapsedTime
    materialRef.current.uniforms.uScroll.value = scrollProgress
  })

  return (
    <mesh position={[4.5, 0, -5]} scale={[14, 9, 1]} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
