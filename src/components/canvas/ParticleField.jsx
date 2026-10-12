import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const particleVertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aScale;
  varying float vTwinkle;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.82 + 0.18 * sin(uTime * 0.8 + position.x * 0.45);
    gl_PointSize = aScale * pulse * (180.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vTwinkle = pulse;
  }
`

const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vTwinkle;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float distanceFromCenter = length(centered);
    float alpha = smoothstep(0.5, 0.08, distanceFromCenter) * vTwinkle;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

// ============================================================
// ParticleField — particles follow the object smoothly
// ============================================================
export function ParticleField({ count = 800, objectPosRef }) {
  const pointsRef = useRef()

  /* eslint-disable react-hooks/purity */
  const { positions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const off = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i * 3]     = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      spd[i] = 0.0001 + Math.random() * 0.0003
      off[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, speeds: spd, offsets: off }
  }, [count])

  // Reuse the positions array directly for the buffer attribute
  const posAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions])
  const scaleAttr = useMemo(() => {
    const scales = new Float32Array(count)
    for (let i = 0; i < count; i++) scales[i] = 0.025 + Math.random() * 0.045
    return new THREE.BufferAttribute(scales, 1)
  }, [count])
  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00d9ff') },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.elapsedTime
    pointsRef.current.material.uniforms.uTime.value = t
    const pos = pointsRef.current.geometry.attributes.position.array

    // Offset based on object position
    const ox = objectPosRef?.current?.objectPos?.x ?? 0
    const oy = objectPosRef?.current?.objectPos?.y ?? 0

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = t * speeds[i] + offsets[i]
      const radius = Math.sqrt(pos[i3] * pos[i3] + pos[i3 + 2] * pos[i3 + 2])
      pos[i3]     = Math.cos(angle) * radius + ox
      pos[i3 + 1] = pos[i3 + 1] + (Math.sin(t * 0.3 + offsets[i]) * 0.0003) + oy * 0.3
      pos[i3 + 2] = Math.sin(angle) * radius
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points key={count} ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={posAttr.array}
          itemSize={3}
          count={count}
        />
        <bufferAttribute
          attach="attributes-aScale"
          array={scaleAttr.array}
          itemSize={1}
          count={count}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={shaderUniforms}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
