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
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 2, 18)
    camera.lookAt(0, -2, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const sphereGeo = new THREE.SphereGeometry(6, 24, 18)
    const wireframeGeo = new THREE.WireframeGeometry(sphereGeo)
    const material = new THREE.LineDashedMaterial({
      color: 0xffffff,
      opacity: 0.12,
      transparent: true,
      dashSize: 0.12,
      gapSize: 0.06,
      linewidth: 1,
    })

    const globe = new THREE.LineSegments(wireframeGeo, material)
    globe.computeLineDistances()
    // Y -6 so only the top hemisphere is visible above the fold
    globe.position.y = -6
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
