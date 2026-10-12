import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SECTION_CONFIGS } from './sceneConfig'

const SECTION_ORDER = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']
const WAYPOINTS = SECTION_ORDER.map((section) => new THREE.Vector3(...SECTION_CONFIGS[section].cameraPos))
const TARGETS = SECTION_ORDER.map((section) => new THREE.Vector3(...SECTION_CONFIGS[section].cameraTarget))
const CAMERA_CURVE = new THREE.CatmullRomCurve3(WAYPOINTS, false, 'centripetal')
const TARGET_CURVE = new THREE.CatmullRomCurve3(TARGETS, false, 'centripetal')

export function CameraRig({ scrollProgress }) {
  const { camera } = useThree()
  const position = new THREE.Vector3()
  const target = new THREE.Vector3()
  const currentTarget = new THREE.Vector3(...SECTION_CONFIGS.hero.cameraTarget)

  useFrame((_, delta) => {
    const progress = THREE.MathUtils.clamp(scrollProgress, 0, 1)
    CAMERA_CURVE.getPointAt(progress, position)
    TARGET_CURVE.getPointAt(progress, target)

    camera.position.lerp(position, 1 - Math.exp(-4 * delta))
    currentTarget.lerp(target, 1 - Math.exp(-5 * delta))
    camera.lookAt(currentTarget)
  })

  return null
}
