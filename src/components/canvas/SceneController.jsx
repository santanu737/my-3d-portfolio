import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import { useControls } from 'leva'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { Hero } from './Hero'
import { CameraRig } from './CameraRig'
import { SECTION_CONFIGS } from './sceneConfig'
import { ParticleField } from './ParticleField'
import { SecondaryRing } from './SecondaryRing'
import { WorldContent } from './WorldContent'
import { BackgroundShader } from './BackgroundShader'

const lerp = (a, b, t) => a + (b - a) * t
const SECTION_ORDER = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']

function SceneLighting() {
  const { keyIntensity, rimIntensity, environmentIntensity } = useControls('Scene Lighting', {
    keyIntensity: { value: 1.1, min: 0, max: 3, step: 0.05 },
    rimIntensity: { value: 0.8, min: 0, max: 2, step: 0.05 },
    environmentIntensity: { value: 0.35, min: 0, max: 2, step: 0.05 },
  })

  return (
    <>
      <Environment preset="city" environmentIntensity={environmentIntensity} />
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[5, 8, 5]}
        intensity={keyIntensity}
        color="#ffffff"
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={[-4, 3, 4]}
        color="#00d9ff"
        intensity={rimIntensity}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[4, -3, -3]}
        color="#ff006e"
        intensity={0.5}
        distance={20}
        decay={2}
      />
      <ContactShadows
        position={[5.5, -2.2, 0]}
        opacity={0.35}
        width={8}
        height={8}
        blur={2.5}
        far={4}
        resolution={256}
        color="#08080c"
      />
    </>
  )
}

// ============================================================
// SceneController — reads scroll state, drives interpolated props
// Renders all 3D objects with smooth transitions
// ============================================================
export function SceneController({ activeSection, scrollProgress, isMobile, quality, fogRef }) {
  const haloRef = useRef()
  const ringRef = useRef()
  const { scene } = useThree()

  // Smoothed values to avoid hard jumps
  const stateRef = useRef({
    objectPos: new THREE.Vector3(...SECTION_CONFIGS.hero.objectPos),
    objectScale: SECTION_CONFIGS.hero.objectScale,
    objectRot: new THREE.Vector3(0, 0, 0),
    cameraPos: new THREE.Vector3(0, 0, 10),
    fogDensity: SECTION_CONFIGS.hero.fog,
    ambientIntensity: SECTION_CONFIGS.hero.intensity,
    opacity: SECTION_CONFIGS.hero.opacity ?? 1.0,
  })
  const transitionRef = useRef({
    scale: SECTION_CONFIGS.hero.objectScale,
    rotation: new THREE.Vector3(...SECTION_CONFIGS.hero.objectRotation),
  })

  // Reusable scratch objects (avoid allocation in useFrame)
  const scratch = useRef({
    targetPos: new THREE.Vector3(),
    targetScale: 0,
    targetCameraPos: new THREE.Vector3(),
    targetOpacity: 1,
    targetFogDensity: 0,
  })

  // Section index helper
  const idx = SECTION_ORDER.indexOf(activeSection)

  useEffect(() => {
    const activateSection = (section) => {
      const config = SECTION_CONFIGS[section]
      if (!config) return
      gsap.to(transitionRef.current, {
        scale: config.objectScale,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: true,
      })
      gsap.to(transitionRef.current.rotation, {
        x: config.objectRotation[0],
        y: config.objectRotation[1],
        z: config.objectRotation[2],
        duration: 0.9,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const transition = transitionRef.current
    const triggers = SECTION_ORDER.map((section) => {
      const element = document.getElementById(section)
      if (!element) return null
      return ScrollTrigger.create({
        trigger: element,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => activateSection(section),
        onEnterBack: () => activateSection(section),
      })
    }).filter(Boolean)

    activateSection('hero')
    return () => {
      triggers.forEach((trigger) => trigger.kill())
      gsap.killTweensOf(transition)
      gsap.killTweensOf(transition.rotation)
    }
  }, [])

  useFrame(() => {
    if (idx < 0) return

    const current = SECTION_CONFIGS[activeSection] || SECTION_CONFIGS.hero
    // For smooth transition, look at neighbors
    const nextIdx = Math.min(idx + 1, SECTION_ORDER.length - 1)
    const next = SECTION_CONFIGS[SECTION_ORDER[nextIdx]]

    // Use scrollProgress within section for a fine-tuned blend
    // 0.5 means we're halfway between current and next
    const blend = Math.min(1, scrollProgress * 0.5) // gentle blend

    // Compute target values into scratch (no allocations)
    const s = scratch.current
    s.targetPos.set(
      lerp(current.objectPos[0], next.objectPos[0], blend),
      lerp(current.objectPos[1], next.objectPos[1], blend),
      lerp(current.objectPos[2], next.objectPos[2], blend)
    )
    s.targetScale = lerp(current.objectScale, next.objectScale, blend)
    s.targetCameraPos.set(
      lerp(current.cameraPos[0], next.cameraPos[0], blend),
      lerp(current.cameraPos[1], next.cameraPos[1], blend),
      lerp(current.cameraPos[2], next.cameraPos[2], blend)
    )
    s.targetOpacity = lerp(current.opacity ?? 1, next.opacity ?? 1, blend)
    s.targetFogDensity = lerp(current.fog, next.fog, blend)
    // Smooth lerp toward target (critically damped feel)
    const smooth = 0.08

    stateRef.current.objectPos.lerp(s.targetPos, smooth)
    stateRef.current.objectScale = lerp(
      stateRef.current.objectScale,
      s.targetScale,
      smooth
    )
    stateRef.current.cameraPos.lerp(s.targetCameraPos, smooth)
    stateRef.current.opacity = lerp(
      stateRef.current.opacity,
      s.targetOpacity,
      smooth
    )

    // Halo follows object
    if (haloRef.current) {
      haloRef.current.position.copy(stateRef.current.objectPos)
      haloRef.current.position.z -= 1
      const haloSize = lerp(current.haloSize, next.haloSize, blend)
      haloRef.current.scale.setScalar(haloSize / 3.2) // base size 3.2
      // Tint halo with accent
    }

    // Ring follows object
    if (ringRef.current) {
      ringRef.current.position.copy(stateRef.current.objectPos)
      ringRef.current.position.z -= 1.5
      const ringRadius = lerp(current.ringRadius, next.ringRadius, blend)
      ringRef.current.scale.setScalar(ringRadius / 2.6)
    }

    // Fog — update via fogRef (never mutate the hook-returned scene)
    if (fogRef.current) {
      const currentFog = current.fog
      fogRef.current.density = lerp(fogRef.current.density || currentFog, s.targetFogDensity, smooth)
    }

  })

  // Apply initial fog — keep a ref to it so useFrame can mutate it
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    const fog = new THREE.FogExp2(0x08080c, SECTION_CONFIGS.hero.fog)
    scene.fog = fog
    fogRef.current = fog
    return () => { scene.fog = null }
  }, [scene, fogRef])
  return (
    <>
      <BackgroundShader scrollProgress={scrollProgress} />
      <SceneLighting />

      {/* Halo (soft glow) */}
      <mesh ref={haloRef} position={[5.5, 0, -1]}>
        <sphereGeometry args={[3.4, 24, 24]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central ring */}
      <mesh ref={ringRef} position={[5.5, 0, -1.5]}>
        <torusGeometry args={[2.8, 0.008, 12, 64]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <CameraRig scrollProgress={scrollProgress} />
      <Hero
        objectPosRef={stateRef}
        transitionRef={transitionRef}
        isMobile={isMobile}
        quality={quality}
      />
      <WorldContent
        activeSection={activeSection}
        isMobile={isMobile}
        quality={quality}
      />

      {/* Particles — render full count, dim unused */}
      <ParticleField count={isMobile ? 250 : quality === 'low' ? 350 : 700} objectPosRef={stateRef} />

      {/* Optional: secondary ring for skills/projects (more visual interest) */}
      {(activeSection === 'skills' || activeSection === 'projects') && (
        <SecondaryRing
          accentColor={SECTION_CONFIGS[activeSection].accent}
        />
      )}
    </>
  )
}

// ============================================================
