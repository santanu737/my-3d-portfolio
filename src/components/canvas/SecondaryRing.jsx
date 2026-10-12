import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ============================================================
// Secondary ring (skills/projects only) — positioned to the far right
// ============================================================
export function SecondaryRing({ accentColor }) {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.5
    meshRef.current.rotation.y += 0.005
  })
  return (
    <mesh ref={meshRef} position={[6.5, 0, -2]}>
      <torusGeometry args={[3.5, 0.008, 12, 64]} />
      <meshBasicMaterial
        color={accentColor}
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

