import { useRef } from 'react'
import { Float, Instance, Instances, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { dampE } from 'maath/easing'

export function Hero({ objectPosRef, transitionRef, isMobile, quality }) {
  const groupRef = useRef()
  const { pointer } = useThree()
  const sphereCount = isMobile || quality === 'low' ? 6 : 10

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    const objectPosition = objectPosRef.current.objectPos
    groupRef.current.position.copy(objectPosition)
    groupRef.current.scale.setScalar(transitionRef.current.scale / 1.6)
    dampE(
      groupRef.current.rotation,
      [
        transitionRef.current.rotation.x + pointer.y * 0.18,
        transitionRef.current.rotation.y + pointer.x * 0.24,
        transitionRef.current.rotation.z + Math.sin(clock.elapsedTime * 0.25) * 0.08,
      ],
      4,
      delta
    )
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
        <mesh castShadow scale={1.15}>
          <icosahedronGeometry args={[1.45, 1]} />
          <MeshTransmissionMaterial
            backside
            flatShading
            thickness={0.45}
            roughness={0.08}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.04}
            anisotropy={0.1}
            color="#00d9ff"
            attenuationColor="#8338ec"
            attenuationDistance={2}
          />
        </mesh>
      </Float>

      <Instances limit={sphereCount} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ff006e" />
        {Array.from({ length: sphereCount }).map((_, index) => {
          const angle = (index / sphereCount) * Math.PI * 2
          return (
            <Instance
              key={index}
              position={[
                Math.cos(angle) * 2.25,
                Math.sin(angle * 1.3) * 0.55,
                Math.sin(angle) * 2.25,
              ]}
            />
          )
        })}
      </Instances>
    </group>
  )
}
