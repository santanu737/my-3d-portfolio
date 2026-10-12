import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Html, PerformanceMonitor, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Leva } from 'leva'
import * as THREE from 'three'
import { SceneController } from './SceneController'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useStore } from '../../store/useStore'

// ============================================================
// Loading Fallback
// ============================================================
function LoadingFallback() {
  const { progress } = useProgress()
  return (
    <Html fullscreen>
      <div className="scene-loading" aria-hidden="true">
        <div className="scene-loading__ring" />
        <div className="scene-loading__ring" style={{ animationDelay: '-0.4s' }} />
        <div className="scene-loading__ring" style={{ animationDelay: '-0.8s' }} />
        <span>{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

function ScenePostProcessing({ quality, reducedMotion, scrollProgress }) {
  const enabled = quality === 'high' && !reducedMotion
  if (!enabled) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Noise opacity={0.025} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.25} darkness={0.65} />
      <ChromaticAberration
        offset={[scrollProgress * 0.0015, scrollProgress * 0.0015]}
        radialModulation
        modulationOffset={0.2}
      />
    </EffectComposer>
  )
}

// ============================================================
// PageScene — main export, persistent fixed canvas
// ============================================================
export function PageScene({ activeSection, scrollProgress }) {
  const [error, setError] = useState(false)
  const isMobile = useIsMobile()
  const prefersReduced = useReducedMotion()
  const fogRef = useRef()
  const quality = useStore((state) => state.quality)
  const setQuality = useStore((state) => state.setQuality)

  // Show fallback for reduced-motion users on desktop; render 3D on mobile
  const showFallback = error || (prefersReduced && !isMobile)

  return (
    <div className="page-canvas-wrapper" onError={() => setError(true)}>
      <Leva hidden={!import.meta.env.DEV} />
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
          shadows="soft"
          dpr={isMobile ? 1 : Math.min(2, Math.max(1, window.devicePixelRatio))}
          frameloop="always"
          onCreated={({ gl }) => {
            gl.setPixelRatio(isMobile ? 1 : Math.min(2, Math.max(1, window.devicePixelRatio)))
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.outputColorSpace = THREE.SRGBColorSpace
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <AdaptiveDpr pixelated={quality === 'low'} />
            <PerformanceMonitor
              onDecline={() => setQuality('low')}
              onIncline={() => setQuality('high')}
            />
            <ScenePostProcessing
              quality={quality}
              reducedMotion={prefersReduced}
              scrollProgress={scrollProgress}
            />
            <SceneController
                activeSection={activeSection}
                scrollProgress={scrollProgress}
                isMobile={isMobile}
                quality={quality}
                fogRef={fogRef}
              />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}

export default PageScene
