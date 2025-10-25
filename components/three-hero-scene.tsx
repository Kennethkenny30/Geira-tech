"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"
import { RenderPass } from "three/addons/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js"

gsap.registerPlugin(ScrollTrigger)

export function ThreeHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)

  const threeRefs = useRef<{
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    composer: EffectComposer | null
    stars: THREE.Points[]
    nebula: THREE.Mesh | null
    moon: THREE.Mesh | null
    moonGroup: THREE.Group | null
    mountains: THREE.Mesh[]
    atmosphere: THREE.Mesh | null
    spatialGlow: THREE.Mesh | null
    animationId: number | null
    targetCameraX: number
    targetCameraY: number
    targetCameraZ: number
    targetCameraRotX: number
    targetCameraRotY: number
    locations: number[]
    mouseX: number
    mouseY: number
    moonMainLight: THREE.DirectionalLight | null
    moonKeyLight: THREE.PointLight | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    moon: null,
    moonGroup: null,
    mountains: [],
    atmosphere: null,
    spatialGlow: null,
    animationId: null,
    targetCameraX: 0,
    targetCameraY: 30,
    targetCameraZ: 100,
    targetCameraRotX: 0,
    targetCameraRotY: 0,
    locations: [],
    mouseX: 0,
    mouseY: 0,
    moonMainLight: null,
    moonKeyLight: null,
  })

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 })
  const smoothCameraRot = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!canvasRef.current) return

    const initThree = () => {
      const { current: refs } = threeRefs

      refs.scene = new THREE.Scene()
      refs.scene.background = new THREE.Color(0x000000)
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025)

      // Camera
      refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
      refs.camera.position.set(0, 30, 300)

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      })
      refs.renderer.setSize(window.innerWidth, window.innerHeight)
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping
      refs.renderer.toneMappingExposure = 1.2

      refs.composer = new EffectComposer(refs.renderer)
      const renderPass = new RenderPass(refs.scene, refs.camera)
      refs.composer.addPass(renderPass)

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.6, 0.85)
      refs.composer.addPass(bloomPass)

      // Create scene elements
      createStarField()
      createNebula()
      createSpatialGlow()
      loadMoonModel()
      createMountains()
      createAtmosphere()
      getLocation()

      // Start animation
      animate()
      setIsReady(true)
    }

    const createStarField = () => {
      const { current: refs } = threeRefs
      const starCount = typeof window !== "undefined" && window.innerWidth < 768 ? 12000 : 15000

      for (let layer = 0; layer < 4; layer++) {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(starCount * 3)
        const colors = new Float32Array(starCount * 3)
        const sizes = new Float32Array(starCount)

        for (let j = 0; j < starCount; j++) {
          const radius = 400 + Math.random() * 1200 + layer * 200
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 100
          positions[j * 3 + 2] = radius * Math.cos(phi) - 500 - layer * 100

          const color = new THREE.Color()
          const colorChoice = Math.random()
          if (colorChoice < 0.6) {
            color.setHSL(0, 0, 0.85 + Math.random() * 0.15)
          } else if (colorChoice < 0.85) {
            color.setHSL(0.54, 0.7, 0.75)
          } else {
            color.setHSL(0.15, 0.6, 0.7)
          }

          colors[j * 3] = color.r
          colors[j * 3 + 1] = color.g
          colors[j * 3 + 2] = color.b

          sizes[j] = Math.random() * 3 + 0.5 + layer * 0.3
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: layer },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              float angle = time * 0.02 * (1.0 - depth * 0.2);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              float twinkle = sin(time * 3.0 + pos.x * 0.1 + pos.y * 0.1) * 0.3 + 0.7;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z) * twinkle;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity * 0.95);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })

        const stars = new THREE.Points(geometry, material)
        refs.scene!.add(stars)
        refs.stars.push(stars)
      }
    }

    const createNebula = () => {
      const { current: refs } = threeRefs

      const geometry = new THREE.PlaneGeometry(10000, 5000, 120, 120)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x000510) },
          color2: { value: new THREE.Color(0x000a15) },
          color3: { value: new THREE.Color(0x001428) },
          color4: { value: new THREE.Color(0x0a1a2e) },
          opacity: { value: 0.25 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.008 + time * 0.3) * cos(pos.y * 0.008 + time * 0.2) * 30.0;
            elevation += sin(pos.x * 0.015 + time * 0.5) * cos(pos.y * 0.012 + time * 0.4) * 15.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform vec3 color4;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor1 = sin(vUv.x * 12.0 + time * 0.3) * cos(vUv.y * 12.0 + time * 0.2);
            float mixFactor2 = sin(vUv.x * 6.0 - time * 0.15) * cos(vUv.y * 6.0 + time * 0.25);
            float mixFactor3 = sin(vUv.x * 3.0 + time * 0.1) * cos(vUv.y * 3.0 - time * 0.1);
            
            vec3 color = mix(color1, color2, mixFactor1 * 0.5 + 0.5);
            color = mix(color, color3, mixFactor2 * 0.4 + 0.4);
            color = mix(color, color4, mixFactor3 * 0.3 + 0.3);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.2);
            alpha *= 1.0 + vElevation * 0.008;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      const nebula = new THREE.Mesh(geometry, material)
      nebula.position.z = -1200
      nebula.rotation.x = 0
      refs.scene!.add(nebula)
      refs.nebula = nebula
    }

    const loadMoonModel = () => {
      const { current: refs } = threeRefs

      refs.moonGroup = new THREE.Group()
      refs.moonGroup.position.set(0, 10, -400)

      const loader = new GLTFLoader()
      
      loader.load(
        '/models/lune.glb',
        (gltf) => {
          const model = gltf.scene
          
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true
              child.receiveShadow = true
              child.renderOrder = 10
              
              console.log("[v0] Mesh found with material:", child.material)
            }
          })

          model.scale.set(140, 140, 140)
          refs.moonGroup!.add(model)
          console.log("[v0] Lune GLB model loaded successfully")
        },
        (xhr) => {
          console.log("[v0] Lune loading:", (xhr.loaded / xhr.total) * 100 + "% loaded")
        },
        (error) => {
          console.error("[v0] Error loading lune model:", error)
        }
      )

      // Lumière principale - simule le soleil éclairant la lune
      const mainLight = new THREE.DirectionalLight(0xffffff, 4.0)
      mainLight.position.set(100, 80, 150)
      mainLight.castShadow = true
      mainLight.shadow.mapSize.width = 2048
      mainLight.shadow.mapSize.height = 2048
      refs.scene!.add(mainLight)
      refs.moonMainLight = mainLight

      // Lumière ponctuelle - pour créer un effet de brillance
      const keyLight = new THREE.PointLight(0xffffff, 1.5, 500)
      keyLight.position.set(0, 10, -400)
      refs.scene!.add(keyLight)
      refs.moonKeyLight = keyLight

      refs.moonGroup.renderOrder = 10
      refs.scene!.add(refs.moonGroup!)
    }

    const createMountains = () => {
      const { current: refs } = threeRefs

      const layers = [
        { distance: -50, height: 90, color: 0x0a0a15, opacity: 1, roughness: 1.8, offset: 0 },
        { distance: -140, height: 115, color: 0x0d0d1a, opacity: 0.95, roughness: 1.5, offset: 1.8 },
        { distance: -250, height: 140, color: 0x101020, opacity: 0.85, roughness: 1.2, offset: 3.5 },
        { distance: -380, height: 165, color: 0x12122a, opacity: 0.7, roughness: 0.9, offset: 5.2 },
        { distance: -530, height: 190, color: 0x141435, opacity: 0.55, roughness: 0.7, offset: 7.0 },
      ]

      layers.forEach((layer, index) => {
        const points = []
        const segments = 100

        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1400

          const noise1 = Math.sin(i * 0.08 + index * 2.5 + layer.offset) * layer.height * layer.roughness
          const noise2 = Math.sin(i * 0.04 + index * 1.2 + layer.offset) * layer.height * 0.6 * layer.roughness
          const noise3 = Math.sin(i * 0.15 + index * 3.5 + layer.offset) * layer.height * 0.4
          const noise4 = Math.random() * layer.height * 0.18 * layer.roughness
          const noise5 = Math.cos(i * 0.12 + layer.offset) * layer.height * 0.5 * layer.roughness
          const peaks = Math.sin(i * 0.25 + index * 2) * layer.height * 0.3

          const y = noise1 + noise2 + noise3 + noise4 + noise5 + peaks - 120

          points.push(new THREE.Vector2(x, y))
        }

        points.push(new THREE.Vector2(6000, -400))
        points.push(new THREE.Vector2(-6000, -400))

        const shape = new THREE.Shape(points)
        const geometry = new THREE.ShapeGeometry(shape)
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        })

        const mountain = new THREE.Mesh(geometry, material)
        mountain.position.z = layer.distance
        mountain.position.y = 50
        mountain.userData = { baseZ: layer.distance, index, baseY: 50 }
        refs.scene!.add(mountain)
        refs.mountains.push(mountain)
      })
    }

    const createAtmosphere = () => {
      const { current: refs } = threeRefs

      const geometry = new THREE.SphereGeometry(700, 48, 48)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
            vec3 atmosphere = vec3(0.02, 0.04, 0.06) * intensity;
            
            float pulse = sin(time * 1.5) * 0.08 + 0.92;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.02);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      })

      const atmosphere = new THREE.Mesh(geometry, material)
      refs.scene!.add(atmosphere)
      refs.atmosphere = atmosphere
    }

    const createSpatialGlow = () => {
      const { current: refs } = threeRefs

      const glowGeometry = new THREE.SphereGeometry(80, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      })

      const spatialGlow = new THREE.Mesh(glowGeometry, glowMaterial)
      spatialGlow.position.set(0, 50, -1500)
      spatialGlow.renderOrder = 1
      refs.scene!.add(spatialGlow)
      refs.spatialGlow = spatialGlow

      const ambientLight = new THREE.AmbientLight(0x0a1a2e, 1.2)
      refs.scene!.add(ambientLight)

      const backLight = new THREE.DirectionalLight(0x2244aa, 0.8)
      backLight.position.set(-100, 100, -500)
      refs.scene!.add(backLight)
    }

    const getLocation = () => {
      const { current: refs } = threeRefs
      refs.locations = []
      refs.mountains.forEach((mountain, i) => {
        refs.locations[i] = mountain.position.z
      })
    }

    const animate = () => {
      const { current: refs } = threeRefs
      refs.animationId = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      refs.stars.forEach((starField, i) => {
        const material = starField.material as THREE.ShaderMaterial
        material.uniforms.time.value = time
      })

      if (refs.nebula && (refs.nebula.material as THREE.ShaderMaterial).uniforms) {
        const material = refs.nebula.material as THREE.ShaderMaterial
        material.uniforms.time.value = time * 0.4
      }

      if (refs.moonGroup) {
        refs.moonGroup.rotation.y = time * 0.08
        refs.moonGroup.rotation.x = Math.sin(time * 0.05) * 0.08
        refs.moonGroup.rotation.z = Math.cos(time * 0.04) * 0.05

        // Mettre à jour la position de la lumière ponctuelle pour suivre la lune
        if (refs.moonKeyLight) {
          refs.moonKeyLight.position.copy(refs.moonGroup.position)
        }

        // Ajuster la lumière principale pour toujours éclairer la lune depuis un angle optimal
        if (refs.moonMainLight) {
          const moonPos = refs.moonGroup.position
          refs.moonMainLight.position.set(
            moonPos.x + 100,
            moonPos.y + 80,
            moonPos.z + 150
          )
          refs.moonMainLight.target.position.copy(moonPos)
          refs.moonMainLight.target.updateMatrixWorld()
        }
      }

      if (refs.atmosphere) {
        const material = refs.atmosphere.material as THREE.ShaderMaterial
        material.uniforms.time.value = time
      }

      if (refs.spatialGlow) {
        refs.spatialGlow.position.x = Math.sin(time * 0.5) * 100
        refs.spatialGlow.position.y = 50 + Math.cos(time * 0.3) * 30
        refs.spatialGlow.position.z = -1500 + Math.sin(time * 0.2) * 50

        const glowMaterial = refs.spatialGlow.material as THREE.MeshBasicMaterial
        glowMaterial.opacity = 0.3 + Math.sin(time * 2) * 0.1
      }

      if (refs.camera) {
        const smoothingFactor = 0.04

        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor

        smoothCameraRot.current.x += (refs.targetCameraRotX - smoothCameraRot.current.x) * smoothingFactor
        smoothCameraRot.current.y += (refs.targetCameraRotY - smoothCameraRot.current.y) * smoothingFactor

        const floatX = Math.sin(time * 0.08) * 3 + refs.mouseX * 0.02
        const floatY = Math.cos(time * 0.12) * 2 + refs.mouseY * 0.02

        refs.camera.position.x = smoothCameraPos.current.x + floatX
        refs.camera.position.y = smoothCameraPos.current.y + floatY
        refs.camera.position.z = smoothCameraPos.current.z

        refs.camera.rotation.x = smoothCameraRot.current.x
        refs.camera.rotation.y = smoothCameraRot.current.y

        refs.camera.lookAt(0, 10, -600)
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.4
        mountain.position.x = Math.sin(time * 0.08) * 3 * parallaxFactor
        mountain.position.y = mountain.userData.baseY + Math.cos(time * 0.1) * 1.5 * parallaxFactor
      })

      if (refs.composer) {
        refs.composer.render()
      }
    }

    initThree()

    const handleMouseMove = (event: MouseEvent) => {
      const { current: refs } = threeRefs
      refs.mouseX = (event.clientX / window.innerWidth) * 2 - 1
      refs.mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    const handleResize = () => {
      const { current: refs } = threeRefs
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight
        refs.camera.updateProjectionMatrix()
        refs.renderer.setSize(window.innerWidth, window.innerHeight)
        refs.composer.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      const { current: refs } = threeRefs
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId)
      }
      if (refs.renderer) {
        refs.renderer.dispose()
      }
      if (refs.composer) {
        refs.composer.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (!isReady) return

    const { current: refs } = threeRefs

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = documentHeight - windowHeight
      const progress = Math.min(scrollY / maxScroll, 1)

      const totalSections = 4
      const totalProgress = progress * totalSections
      const currentSection = Math.floor(totalProgress)
      const sectionProgress = totalProgress % 1

      const cameraPositions = [
        { x: 0, y: 30, z: 300, rotX: 0, rotY: 0 },
        { x: -40, y: 50, z: 50, rotX: 0.15, rotY: -0.12 },
        { x: 50, y: 65, z: -300, rotX: -0.08, rotY: 0.18 },
        { x: -30, y: 75, z: -700, rotX: 0.12, rotY: -0.08 },
        { x: 0, y: 85, z: -1100, rotX: 0, rotY: 0 },
      ]

      const currentPos = cameraPositions[currentSection] || cameraPositions[0]
      const nextPos = cameraPositions[currentSection + 1] || currentPos

      const easedProgress =
        sectionProgress < 0.5
          ? 4 * sectionProgress * sectionProgress * sectionProgress
          : 1 - Math.pow(-2 * sectionProgress + 2, 3) / 2

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * easedProgress
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * easedProgress
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * easedProgress
      refs.targetCameraRotX = currentPos.rotX + (nextPos.rotX - currentPos.rotX) * easedProgress
      refs.targetCameraRotY = currentPos.rotY + (nextPos.rotY - currentPos.rotY) * easedProgress

      refs.mountains.forEach((mountain, i) => {
        const speed = 0.8 + i * 0.6
        mountain.position.z = refs.locations[i] + scrollY * speed * 0.4
      })

      if (refs.nebula && refs.mountains.length > 0) {
        refs.nebula.position.z = refs.mountains[refs.mountains.length - 1].position.z - 80
      }

      if (refs.moonGroup) {
        refs.moonGroup.rotation.z = progress * Math.PI * 0.1
        refs.moonGroup.position.y = 10
        refs.moonGroup.position.x = Math.sin(progress * Math.PI) * 10
        refs.moonGroup.position.z = -400
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isReady])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        background: "#000000",
      }}
    />
  )
}