import { Suspense, useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ============================================================
// Section configurations
// Object is positioned at x: 5.5-6.5 (right side of viewport) to
// sit behind content which is constrained to the left half.
// Scale/glow is reduced in dense content sections.
// ============================================================
const SECTION_CONFIGS = {
  hero: {
    // Full showcase — hero content is on the left, object on right
    objectPos: [5.5, 0, 0],
    objectScale: 1.6,
    objectRotation: [0.1, 0, 0],
    accent: '#00d9ff',
    base: '#0e0e1a',
    cameraPos: [0, 0, 10],
    cameraTarget: [5.5, 0, 0],
    particles: 800,
    ringRadius: 2.8,
    ringPos: [5.5, 0, -1.5],
    haloSize: 3.4,
    haloPos: [5.5, 0, -1],
    fog: 0.03,
    intensity: 0.4,
    orbCount: 3,
    opacity: 1.0,
  },
  about: {
    // Object pushed far right — text content on the left half
    objectPos: [6.2, 0.2, 0],
    objectScale: 1.2,
    objectRotation: [0.2, 0.3, 0.1],
    accent: '#00d9ff',
    base: '#0e0e1a',
    cameraPos: [0, 0, 11],
    cameraTarget: [6.2, 0.2, 0],
    particles: 600,
    ringRadius: 2.4,
    ringPos: [6.2, 0, -1.5],
    haloSize: 2.8,
    haloPos: [6.2, 0, -1],
    fog: 0.025,
    intensity: 0.25,
    orbCount: 2,
    opacity: 0.7,
  },
  skills: {
    // Object tucked far right — dense skill grid takes left/center
    objectPos: [6.5, 0, 0],
    objectScale: 1.1,
    objectRotation: [0.2, 0.5, 0],
    accent: '#8338ec',
    base: '#10081e',
    cameraPos: [0, 0, 10],
    cameraTarget: [6.5, 0, 0],
    particles: 700,
    ringRadius: 2.4,
    ringPos: [6.5, 0, -1.5],
    haloSize: 2.8,
    haloPos: [6.5, 0, -1],
    fog: 0.022,
    intensity: 0.3,
    orbCount: 3,
    opacity: 0.6,
  },
  projects: {
    // Project cards take most of width — object barely visible on far right
    objectPos: [6.8, -0.3, 0],
    objectScale: 1.2,
    objectRotation: [0.1, 0.6, 0.2],
    accent: '#ff006e',
    base: '#1a0820',
    cameraPos: [0, 0, 11],
    cameraTarget: [6.8, -0.3, 0],
    particles: 700,
    ringRadius: 2.6,
    ringPos: [6.8, 0, -1.5],
    haloSize: 3.0,
    haloPos: [6.8, 0, -1],
    fog: 0.022,
    intensity: 0.3,
    orbCount: 2,
    opacity: 0.6,
  },
  experience: {
    // Timeline on the left, object barely peeks from far right
    objectPos: [6.5, 0, 0],
    objectScale: 1.1,
    objectRotation: [0, 0.3, 0],
    accent: '#00d9ff',
    base: '#0e0e1a',
    cameraPos: [0, 0, 11],
    cameraTarget: [6.5, 0, 0],
    particles: 500,
    ringRadius: 2.4,
    ringPos: [6.5, 0, -1.5],
    haloSize: 2.6,
    haloPos: [6.5, 0, -1],
    fog: 0.025,
    intensity: 0.25,
    orbCount: 2,
    opacity: 0.55,
  },
  contact: {
    // Calm final composition — object centered but subtle
    objectPos: [5.5, 0, 0],
    objectScale: 1.3,
    objectRotation: [0.15, 0.2, 0],
    accent: '#00d9ff',
    base: '#0a0a14',
    cameraPos: [0, 0, 11],
    cameraTarget: [5.5, 0, 0],
    particles: 500,
    ringRadius: 2.6,
    ringPos: [5.5, 0, -1.5],
    haloSize: 3.2,
    haloPos: [5.5, 0, -1],
    fog: 0.025,
    intensity: 0.35,
    orbCount: 2,
    opacity: 0.75,
  },
}

const lerp = (a, b, t) => a + (b - a) * t

// ============================================================
// Shaders (same as before but with extra uGlow from scroll)
// ============================================================
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform float uTime;
  uniform float uGlow;
  uniform float uOpacity;

  void main() {
    vec3 color = uColorBase;

    // Strong fresnel edge glow
    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fresnel = pow(fresnel, 2.2);
    color += uColorAccent * fresnel * 0.9;

    // Mouse-driven global glow
    color += uColorAccent * uGlow * 0.25;

    // Subtle breathing
    color += uColorAccent * 0.05 * (0.5 + 0.5 * sin(uTime * 0.5));

    gl_FragColor = vec4(color, uOpacity);
  }
`

// ============================================================
// Convert hex string to THREE.Color
// ============================================================
const hexToColor = (hex) => new THREE.Color(hex)

// ============================================================
// SceneController — reads scroll state, drives interpolated props
// Renders all 3D objects with smooth transitions
// ============================================================
function SceneController({ activeSection, scrollProgress, isMobile, fogRef }) {
  const objectRef = useRef()
  const haloRef = useRef()
  const ringRef = useRef()
  const orbsRef = useRef()
  const { scene, camera } = useThree()

  // Smoothed values to avoid hard jumps
  const stateRef = useRef({
    objectPos: new THREE.Vector3(...SECTION_CONFIGS.hero.objectPos),
    objectScale: SECTION_CONFIGS.hero.objectScale,
    objectRot: new THREE.Vector3(0, 0, 0),
    accentColor: hexToColor(SECTION_CONFIGS.hero.accent),
    baseColor: hexToColor(SECTION_CONFIGS.hero.base),
    cameraPos: new THREE.Vector3(0, 0, 10),
    fogDensity: SECTION_CONFIGS.hero.fog,
    ambientIntensity: SECTION_CONFIGS.hero.intensity,
    opacity: SECTION_CONFIGS.hero.opacity ?? 1.0,
    glow: 0,
  })

  // Reusable scratch objects (avoid allocation in useFrame)
  const scratch = useRef({
    targetPos: new THREE.Vector3(),
    targetScale: 0,
    targetCameraPos: new THREE.Vector3(),
    targetColor: new THREE.Color(),
    targetOpacity: 1,
    targetFogDensity: 0,
  })

  // Section index helper
  const sectionOrder = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']
  const idx = sectionOrder.indexOf(activeSection)

  useFrame((state) => {
    if (idx < 0) return

    const current = SECTION_CONFIGS[activeSection] || SECTION_CONFIGS.hero
    // For smooth transition, look at neighbors
    const nextIdx = Math.min(idx + 1, sectionOrder.length - 1)
    const next = SECTION_CONFIGS[sectionOrder[nextIdx]]

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
    s.targetColor.set(current.accent)

    // Smooth lerp toward target (critically damped feel)
    const smooth = 0.08

    stateRef.current.objectPos.lerp(s.targetPos, smooth)
    stateRef.current.objectScale = lerp(
      stateRef.current.objectScale,
      s.targetScale,
      smooth
    )
    stateRef.current.accentColor.lerp(s.targetColor, smooth)
    stateRef.current.baseColor.lerp(hexToColor(current.base), smooth)
    stateRef.current.cameraPos.lerp(s.targetCameraPos, smooth)
    stateRef.current.opacity = lerp(
      stateRef.current.opacity,
      s.targetOpacity,
      smooth
    )

    // Apply to mesh
    if (objectRef.current) {
      objectRef.current.position.copy(stateRef.current.objectPos)
      objectRef.current.scale.setScalar(stateRef.current.objectScale)
      // Update shader uniforms
      const mat = objectRef.current.material
      mat.uniforms.uTime.value = state.clock.elapsedTime
      mat.uniforms.uGlow.value = stateRef.current.glow
      mat.uniforms.uColorBase.value.copy(stateRef.current.baseColor)
      mat.uniforms.uColorAccent.value.copy(stateRef.current.accentColor)
      mat.uniforms.uOpacity.value = stateRef.current.opacity
    }

    // Halo follows object
    if (haloRef.current) {
      haloRef.current.position.copy(stateRef.current.objectPos)
      haloRef.current.position.z -= 1
      const haloSize = lerp(current.haloSize, next.haloSize, blend)
      haloRef.current.scale.setScalar(haloSize / 3.2) // base size 3.2
      // Tint halo with accent
      haloRef.current.material.color.copy(stateRef.current.accentColor)
    }

    // Ring follows object
    if (ringRef.current) {
      ringRef.current.position.copy(stateRef.current.objectPos)
      ringRef.current.position.z -= 1.5
      const ringRadius = lerp(current.ringRadius, next.ringRadius, blend)
      ringRef.current.scale.setScalar(ringRadius / 2.6)
      ringRef.current.material.color.copy(stateRef.current.accentColor)
    }

    // Orbs around object
    if (orbsRef.current) {
      orbsRef.current.children.forEach((child, i) => {
        const t = state.clock.elapsedTime + i * 1.2
        const radius = 2.8 + i * 0.4
        child.position.x = stateRef.current.objectPos.x + Math.cos(t * 0.4) * radius * 0.7
        child.position.y = stateRef.current.objectPos.y + Math.sin(t * 0.5) * radius * 0.6
        child.position.z = -1.5 + Math.sin(t * 0.3) * 0.5
        // Pulse size
        const pulse = 0.18 + Math.sin(t * 0.8) * 0.04
        child.scale.setScalar(pulse / 0.2)
      })
    }

    // Camera update
    camera.position.copy(stateRef.current.cameraPos)
    camera.lookAt(stateRef.current.objectPos)

    // Fog — update via fogRef (never mutate the hook-returned scene)
    if (fogRef.current) {
      const currentFog = current.fog
      fogRef.current.density = lerp(fogRef.current.density || currentFog, s.targetFogDensity, smooth)
    }

    // Mouse glow smoothing
    /* eslint-disable react-hooks/immutability */
    const targetGlow = stateRef.current.glowTarget ?? 0
    stateRef.current.glow = lerp(stateRef.current.glow, targetGlow, 0.1)
  })

  // Listen for mouse to set glow target
  useEffect(() => {
    const handleMouseMove = (e) => {
      const dx = e.clientX / window.innerWidth - 0.5
      const dy = e.clientY / window.innerHeight - 0.5
      const target = Math.max(0, 1 - Math.hypot(dx, dy) * 1.8)
      stateRef.current.glowTarget = target
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Apply initial fog — keep a ref to it so useFrame can mutate it
  useEffect(() => {
    const fog = new THREE.FogExp2(0x08080c, SECTION_CONFIGS.hero.fog)
    scene.fog = fog
    fogRef.current = fog
    return () => { scene.fog = null }
  }, [scene, fogRef])

  // Hide orbs on mobile for performance
  const visibleOrbCount = isMobile ? 2 : Math.max(2, SECTION_CONFIGS[activeSection]?.orbCount || 2)
  const orbColors = ['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b', '#00d9ff', '#ff006e']

  const uniforms = useMemo(() => ({
    uColorBase: { value: new THREE.Color(SECTION_CONFIGS.hero.base) },
    uColorAccent: { value: new THREE.Color(SECTION_CONFIGS.hero.accent) },
    uTime: { value: 0 },
    uGlow: { value: 0 },
    uOpacity: { value: 1.0 },
  }), [])

  return (
    <>
      {/* Lighting — uses dynamic intensity from section configs */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-4, 3, 4]} color="#00d9ff" intensity={0.8} distance={20} decay={2} />
      <pointLight position={[4, -3, -3]} color="#ff006e" intensity={0.5} distance={20} decay={2} />

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

      {/* Central object */}
      <mesh ref={objectRef} position={[5.5, 0, 0]} scale={1.6}>
        <torusKnotGeometry args={[1, 0.32, 96, 20]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      {/* Orbiting orbs */}
      <group ref={orbsRef}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
              color={orbColors[i % orbColors.length]}
              transparent
              opacity={i < visibleOrbCount ? 0.9 : 0}
            />
          </mesh>
        ))}
      </group>

      {/* Particles — render full count, dim unused */}
      <ParticleField count={isMobile ? 250 : 700} objectPosRef={stateRef} />

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
// ParticleField — particles follow the object smoothly
// ============================================================
function ParticleField({ count = 800, objectPosRef }) {
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
  const posAttr = useMemo(
    () => new THREE.BufferAttribute(positions, 3),
    [positions]
  )

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.elapsedTime
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
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={posAttr.array}
          itemSize={3}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00d9ff"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ============================================================
// Secondary ring (skills/projects only) — positioned to the far right
// ============================================================
function SecondaryRing({ accentColor }) {
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

// ============================================================
// Loading Fallback
// ============================================================
function LoadingFallback() {
  return (
    <div className="scene-loading" aria-hidden="true">
      <div className="scene-loading__ring" />
      <div className="scene-loading__ring" style={{ animationDelay: '-0.4s' }} />
      <div className="scene-loading__ring" style={{ animationDelay: '-0.8s' }} />
    </div>
  )
}

// ============================================================
// useReducedMotion + useIsMobile hooks
// ============================================================
function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReduced
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      )
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ============================================================
// PageScene — main export, persistent fixed canvas
// ============================================================
export function PageScene({ activeSection, scrollProgress }) {
  const [error, setError] = useState(false)
  const isMobile = useIsMobile()
  const prefersReduced = useReducedMotion()
  const fogRef = useRef()

  // Show fallback for reduced-motion users on desktop; render 3D on mobile
  const showFallback = error || (prefersReduced && !isMobile)

  return (
    <div className="page-canvas-wrapper" onError={() => setError(true)}>
      {showFallback ? (
        <div className="page-canvas-fallback" aria-hidden="true" />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
          frameloop="always"
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5))
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <SceneController
              activeSection={activeSection}
              scrollProgress={scrollProgress}
              isMobile={isMobile}
              fogRef={fogRef}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}

export default PageScene
