"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
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
    animationId: number | null
    targetCameraX: number
    targetCameraY: number
    targetCameraZ: number
    targetCameraRotX: number
    targetCameraRotY: number
    locations: number[]
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
    animationId: null,
    targetCameraX: 0,
    targetCameraY: 30,
    targetCameraZ: 100,
    targetCameraRotX: 0,
    targetCameraRotY: 0,
    locations: [],
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
      refs.renderer.toneMappingExposure = 0.8 // Increased from 0.2 to 0.8 for better visibility

      refs.composer = new EffectComposer(refs.renderer)
      const renderPass = new RenderPass(refs.scene, refs.camera)
      refs.composer.addPass(renderPass)

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.6, 0.4, 0.85)
      refs.composer.addPass(bloomPass)

      // Create scene elements
      createStarField()
      createNebula()
      createMoon()
      createMountains()
      createAtmosphere()
      getLocation()

      // Start animation
      animate()
      setIsReady(true)
    }

    const createStarField = () => {
      const { current: refs } = threeRefs
      const starCount = typeof window !== "undefined" && window.innerWidth < 768 ? 8000 : 5000

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(starCount * 3)
        const colors = new Float32Array(starCount * 3)
        const sizes = new Float32Array(starCount)

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[j * 3 + 2] = radius * Math.cos(phi)

          const color = new THREE.Color()
          const colorChoice = Math.random()
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.7 + Math.random() * 0.25) // Increased from 0.4-0.55 to 0.7-0.95
          } else if (colorChoice < 0.9) {
            color.setHSL(0.54, 0.6, 0.65) // Increased lightness
          } else {
            color.setHSL(0.69, 0.5, 0.6) // Increased lightness
          }

          colors[j * 3] = color.r
          colors[j * 3 + 1] = color.g
          colors[j * 3 + 2] = color.b

          sizes[j] = Math.random() * 2.5 + 0.8
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
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
              
              float angle = time * 0.03 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity * 0.9);
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

      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x000810) },
          color2: { value: new THREE.Color(0x000c18) },
          color3: { value: new THREE.Color(0x001020) },
          opacity: { value: 0.15 }, // Increased from 0.08 to 0.15
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time * 0.5) * cos(pos.y * 0.01 + time * 0.3) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor1 = sin(vUv.x * 10.0 + time * 0.5) * cos(vUv.y * 10.0 + time * 0.3);
            float mixFactor2 = sin(vUv.x * 5.0 - time * 0.2) * cos(vUv.y * 5.0 + time * 0.4);
            
            vec3 color = mix(color1, color2, mixFactor1 * 0.5 + 0.5);
            color = mix(color, color3, mixFactor2 * 0.3 + 0.3);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.5);
            alpha *= 1.0 + vElevation * 0.005;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      const nebula = new THREE.Mesh(geometry, material)
      nebula.position.z = -1050
      nebula.rotation.x = 0
      refs.scene!.add(nebula)
      refs.nebula = nebula
    }

    const createMoon = () => {
      const { current: refs } = threeRefs

      refs.moonGroup = new THREE.Group()
      refs.moonGroup.position.set(0, 20, -800)

      const moonGeometry = new THREE.SphereGeometry(120, 256, 256)

      const positions = moonGeometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = positions.getZ(i)

        // Multiple noise layers for realistic lunar surface
        const noise1 = Math.sin(x * 0.5) * Math.cos(y * 0.5) * Math.sin(z * 0.5) * 2
        const noise2 = Math.sin(x * 1.5) * Math.cos(z * 1.5) * 1.5
        const crater1 = Math.sin(x * 2) * Math.cos(z * 2) * 1.5
        const crater2 = Math.sin(x * 3 + 1.5) * Math.cos(y * 3 + 2.0) * 1.0
        const crater3 = Math.sin(x * 5) * Math.cos(z * 5) * 0.5

        const length = Math.sqrt(x * x + y * y + z * z)
        const displacement = (noise1 + noise2 + crater1 + crater2 + crater3) * 0.4

        positions.setXYZ(
          i,
          x + (x / length) * displacement,
          y + (y / length) * displacement,
          z + (z / length) * displacement,
        )
      }
      moonGeometry.computeVertexNormals()

      const moonMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          lightDirection: { value: new THREE.Vector3(-0.5, 0.3, 1.0).normalize() },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          varying vec3 vViewPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 lightDirection;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          varying vec3 vViewPosition;
          
          void main() {
            float crater1 = sin(vPosition.x * 3.0) * cos(vPosition.y * 3.0) * sin(vPosition.z * 3.0);
            float crater2 = sin(vPosition.x * 7.0 + 1.5) * cos(vPosition.y * 7.0 + 2.0);
            float crater3 = sin(vPosition.x * 15.0) * cos(vPosition.z * 15.0);
            float crater4 = sin(vPosition.y * 20.0) * cos(vPosition.z * 20.0);
            float crater5 = sin(vPosition.x * 30.0 + 3.0) * cos(vPosition.y * 30.0 + 1.5);
            
            float craterPattern = crater1 * 0.08 + crater2 * 0.04 + crater3 * 0.02 + crater4 * 0.01 + crater5 * 0.005 + 0.85;
            
            vec3 darkGray = vec3(0.15, 0.15, 0.16);
            vec3 mediumGray = vec3(0.22, 0.22, 0.24);
            vec3 lightGray = vec3(0.30, 0.30, 0.33);
            vec3 stonyWhite = vec3(0.38, 0.38, 0.42);
            
            vec3 baseColor = mix(darkGray, mediumGray, craterPattern);
            baseColor = mix(baseColor, lightGray, smoothstep(0.85, 0.95, craterPattern));
            baseColor = mix(baseColor, stonyWhite, smoothstep(0.92, 1.0, craterPattern));
            
            float detailNoise = sin(vUv.x * 100.0) * cos(vUv.y * 100.0) * 0.01;
            baseColor += vec3(detailNoise);
            
            vec3 normal = normalize(vNormal);
            float diffuse = max(dot(normal, lightDirection), 0.0);
            
            float ao = smoothstep(-0.1, 0.1, crater1) * 0.3 + 0.7;
            
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
            vec3 rimLight = vec3(0.0, 0.12, 0.18) * fresnel * 0.15;
            
            vec3 finalColor = baseColor * (0.6 + diffuse * 0.5) * ao + rimLight;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      })

      const moon = new THREE.Mesh(moonGeometry, moonMaterial)
      refs.moonGroup!.add(moon)
      refs.moon = moon

      refs.scene!.add(refs.moonGroup!)
    }

    const createMountains = () => {
      const { current: refs } = threeRefs

      const layers = [
        { distance: -50, height: 80, color: 0x1a1a2e, opacity: 1, roughness: 1.5, offset: 0 },
        { distance: -120, height: 100, color: 0x16213e, opacity: 0.9, roughness: 1.2, offset: 1.5 },
        { distance: -200, height: 120, color: 0x0f3460, opacity: 0.75, roughness: 0.9, offset: 3 },
        { distance: -300, height: 140, color: 0x0a2647, opacity: 0.6, roughness: 0.7, offset: 4.5 },
      ]

      layers.forEach((layer, index) => {
        const points = []
        const segments = 80

        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1200

          const noise1 = Math.sin(i * 0.1 + index * 2 + layer.offset) * layer.height * layer.roughness
          const noise2 = Math.sin(i * 0.05 + index + layer.offset) * layer.height * 0.5 * layer.roughness
          const noise3 = Math.sin(i * 0.2 + index * 3 + layer.offset) * layer.height * 0.3
          const noise4 = Math.random() * layer.height * 0.15 * layer.roughness
          const noise5 = Math.cos(i * 0.15 + layer.offset) * layer.height * 0.4 * layer.roughness

          const y = noise1 + noise2 + noise3 + noise4 + noise5 - 100

          points.push(new THREE.Vector2(x, y))
        }

        points.push(new THREE.Vector2(5000, -300))
        points.push(new THREE.Vector2(-5000, -300))

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
        mountain.userData = { baseZ: layer.distance, index }
        refs.scene!.add(mountain)
        refs.mountains.push(mountain)
      })
    }

    const createAtmosphere = () => {
      const { current: refs } = threeRefs

      const geometry = new THREE.SphereGeometry(600, 32, 32)
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
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.05, 0.1, 0.15) * intensity;
            
            float pulse = sin(time * 2.0) * 0.05 + 0.95;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.05);
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
        material.uniforms.time.value = time * 0.5
      }

      if (refs.moonGroup) {
        refs.moonGroup.rotation.y = time * 0.08
        refs.moonGroup.rotation.x = Math.sin(time * 0.1) * 0.08
      }

      // Update moon shader
      if (refs.moon) {
        const material = refs.moon.material as THREE.ShaderMaterial
        material.uniforms.time.value = time
      }

      // Update atmosphere
      if (refs.atmosphere) {
        const material = refs.atmosphere.material as THREE.ShaderMaterial
        material.uniforms.time.value = time
      }

      if (refs.camera) {
        const smoothingFactor = 0.05

        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor

        smoothCameraRot.current.x += (refs.targetCameraRotX - smoothCameraRot.current.x) * smoothingFactor
        smoothCameraRot.current.y += (refs.targetCameraRotY - smoothCameraRot.current.y) * smoothingFactor

        const floatX = Math.sin(time * 0.1) * 2
        const floatY = Math.cos(time * 0.15) * 1

        refs.camera.position.x = smoothCameraPos.current.x + floatX
        refs.camera.position.y = smoothCameraPos.current.y + floatY
        refs.camera.position.z = smoothCameraPos.current.z

        refs.camera.rotation.x = smoothCameraRot.current.x
        refs.camera.rotation.y = smoothCameraRot.current.y

        refs.camera.lookAt(0, 10, -600)
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.3
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor
      })

      if (refs.composer) {
        refs.composer.render()
      }
    }

    initThree()

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

      const totalSections = 3
      const totalProgress = progress * totalSections
      const currentSection = Math.floor(totalProgress)
      const sectionProgress = totalProgress % 1

      const cameraPositions = [
        { x: 0, y: 30, z: 300, rotX: 0, rotY: 0 },
        { x: -30, y: 45, z: 0, rotX: 0.2, rotY: -0.15 },
        { x: 40, y: 55, z: -400, rotX: -0.1, rotY: 0.2 },
        { x: -20, y: 60, z: -800, rotX: 0.15, rotY: -0.1 },
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
        const speed = 1 + i * 0.9
        mountain.position.z = refs.locations[i] + scrollY * speed * 0.5
      })

      if (refs.nebula && refs.mountains.length > 0) {
        refs.nebula.position.z = refs.mountains[refs.mountains.length - 1].position.z - 50
      }

      if (refs.moonGroup) {
        refs.moonGroup.rotation.z = progress * Math.PI * 0.3
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
