'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

export default function GlobeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    )
    // Straight-on view — full sphere visible in side panel
    camera.position.set(0, 1, 16)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const sphereGeo = new THREE.SphereGeometry(6, 28, 20)
    const wireframeGeo = new THREE.WireframeGeometry(sphereGeo)
    const material = new THREE.LineDashedMaterial({
      color: 0xffffff,
      opacity: 0.18,
      transparent: true,
      dashSize: 0.12,
      gapSize: 0.06,
      linewidth: 1,
    })

    const globe = new THREE.LineSegments(wireframeGeo, material)
    globe.computeLineDistances()
    // Y = 0: full sphere centered, fully visible in panel
    globe.position.y = 0
    scene.add(globe)

    let animId: number

    function animate() {
      animId = requestAnimationFrame(animate)
      globe.rotation.y += 0.0008
      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      sphereGeo.dispose()
      wireframeGeo.dispose()
      material.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <motion.div
      ref={mountRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
