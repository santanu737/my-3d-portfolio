import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { sceneContent } from '../../data/portfolio'

const SECTION_POSITIONS = {
  about: [-1.2, 2.4, -0.8],
  skills: [-1.1, 2.5, -0.8],
  projects: [-1.1, 2.4, -0.8],
  experience: [-1.1, 2.4, -0.8],
  contact: [-1.1, 2.4, -0.8],
}

function FloatingLabel({ label, color, position, active }) {
  const groupRef = useRef()
  const textRef = useRef()

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const targetScale = active ? 1 : 0.82
    const targetOpacity = active ? 0.7 : 0
    const scale = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      1 - Math.exp(-4 * delta)
    )
    groupRef.current.scale.setScalar(scale)
    if (textRef.current?.material) {
      textRef.current.material.opacity = THREE.MathUtils.lerp(
        textRef.current.material.opacity,
        targetOpacity,
        1 - Math.exp(-4 * delta)
      )
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Text
        ref={textRef}
        color={color}
        fontSize={0.34}
        letterSpacing={0.16}
        anchorX="center"
        anchorY="middle"
        fillOpacity={active ? 0.7 : 0}
      >
        {label}
      </Text>
    </group>
  )
}

function SkillNodes({ isMobile, quality }) {
  const [hovered, setHovered] = useState(null)
  const nodes = sceneContent.skillNodes.slice(0, isMobile || quality === 'low' ? 8 : 14)

  return (
    <group>
      {nodes.map((node, index) => (
        <group
          key={node.label}
          position={[
            Math.cos((index / nodes.length) * Math.PI * 2) * 2.1,
            Math.sin((index / nodes.length) * Math.PI * 2) * 1.5,
            -0.6,
          ]}
        >
          <mesh
            scale={hovered === node.label ? 1.25 : 1}
            onPointerOver={() => setHovered(node.label)}
            onPointerOut={() => setHovered(null)}
          >
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color="#8338ec" transparent opacity={0.8} />
          </mesh>
          {hovered === node.label && (
            <Text
              position={[0, 0.18, 0]}
              color="#8338ec"
              fontSize={0.14}
              anchorX="center"
              anchorY="bottom"
            >
              {node.label}
            </Text>
          )}
        </group>
      ))}
    </group>
  )
}

function ProjectNodes({ isMobile }) {
  const projects = sceneContent.projectNodes.slice(0, isMobile ? 2 : 4)

  return (
    <group rotation={[0.08, -0.15, 0]}>
      {projects.map((project, index) => {
        const angle = Math.PI * 0.25 + (index / Math.max(projects.length - 1, 1)) * Math.PI * 0.5
        const position = [Math.cos(angle) * 2.3, Math.sin(angle) * 1.2 - 0.6, -0.9]
        return (
          <group key={project.id} position={position}>
            <mesh>
              <boxGeometry args={[0.42, 0.04, 0.24]} />
              <meshBasicMaterial
                color={project.featured ? '#ff006e' : '#00d9ff'}
                transparent
                opacity={0.7}
              />
            </mesh>
            <Text
              position={[0, -0.16, 0]}
              color={project.featured ? '#ff006e' : '#00d9ff'}
              fontSize={0.11}
              maxWidth={1.1}
              anchorX="center"
              anchorY="top"
              textAlign="center"
            >
              {project.title}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

function ContactBeacon() {
  const ringRef = useRef()

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25
      ringRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.08)
    }
  })

  return (
    <group position={[0, -0.7, -0.8]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.6, 0.012, 8, 64]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.45} />
      </mesh>
      <Text
        position={[0, 0, 0]}
        color="#00d9ff"
        fontSize={0.2}
        maxWidth={2.6}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {sceneContent.contactLabel}
      </Text>
    </group>
  )
}

export function WorldContent({ activeSection, isMobile, quality }) {
  return (
    <group position={[5.5, 0, 0]}>
      {sceneContent.sectionLabels.map((section) => (
        <FloatingLabel
          key={section.id}
          label={section.label}
          color={section.color}
          position={SECTION_POSITIONS[section.id]}
          active={activeSection === section.id}
        />
      ))}
      {activeSection === 'skills' && <SkillNodes isMobile={isMobile} quality={quality} />}
      {activeSection === 'projects' && <ProjectNodes isMobile={isMobile} />}
      {activeSection === 'contact' && <ContactBeacon />}
    </group>
  )
}
