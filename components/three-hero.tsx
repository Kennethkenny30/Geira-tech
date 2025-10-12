"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { trackCTAClick } from "@/lib/analytics"

gsap.registerPlugin(ScrollTrigger)

export function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const [isReady, setIsReady] = useState(false)

  const threeRefs = useRef<{
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    stars: THREE.Points[]
    nebula: THREE.Mesh | null
    mountains: THREE.Mesh[]
    animationId: number | null
    targetCameraX?: number
    targetCameraY?: number
    targetCameraZ?: number
  }>({
    scene: null,
    camera: null,
    renderer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
  })

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 })

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return

    const { current: refs } = threeRefs

    // Scene setup
    refs.scene = new THREE.Scene()
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025)

    // Camera
    refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    refs.camera.position.set(0, 30, 100)

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })
    refs.renderer.setSize(window.innerWidth, window.innerHeight)
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping
    refs.renderer.toneMappingExposure = 0.5

    // Create scene elements
    createStarField()
    createNebula()
    createMountains()

    // Start animation
    animate()

    // Handle resize
    const handleResize = () => {
      if (!refs.camera || !refs.renderer) return
      refs.camera.aspect = window.innerWidth / window.innerHeight
      refs.camera.updateProjectionMatrix()
      refs.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    setIsReady(true)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      refs.renderer?.dispose()
    }
  }, [])

  const createStarField = () => {
    const { current: refs } = threeRefs
    if (!refs.scene) return

    const starCount = 5000

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
          color.setHSL(0, 0, 0.8 + Math.random() * 0.2)
        } else if (colorChoice < 0.9) {
          color.setHSL(0.55, 0.7, 0.8)
        } else {
          color.setHSL(0.5, 0.7, 0.8)
        }

        colors[j * 3] = color.r
        colors[j * 3 + 1] = color.g
        colors[j * 3 + 2] = color.b

        sizes[j] = Math.random() * 2 + 0.5
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
            
            float angle = time * 0.05 * (1.0 - depth * 0.3);
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
            gl_FragColor = vec4(vColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      const stars = new THREE.Points(geometry, material)
      refs.scene.add(stars)
      refs.stars.push(stars)
    }
  }

  const createNebula = () => {
    const { current: refs } = threeRefs
    if (!refs.scene) return

    const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x38bdf8) },
        color2: { value: new THREE.Color(0x3b82f6) },
        opacity: { value: 0.3 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float time;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
          pos.z += elevation;
          vElevation = elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float opacity;
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
          vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
          
          float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
          alpha *= 1.0 + vElevation * 0.01;
          
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
    refs.scene.add(nebula)
    refs.nebula = nebula
  }

  const createMountains = () => {
    const { current: refs } = threeRefs
    if (!refs.scene) return

    const layers = [
      { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
      { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
      { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
      { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 },
    ]

    layers.forEach((layer, index) => {
      const points = []
      const segments = 50

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments - 0.5) * 1000
        const y =
          Math.sin(i * 0.1) * layer.height +
          Math.sin(i * 0.05) * layer.height * 0.5 +
          Math.random() * layer.height * 0.2 -
          100
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
      mountain.position.y = 0
      mountain.userData = { baseZ: layer.distance, index }
      refs.scene.add(mountain)
      refs.mountains.push(mountain)
    })
  }

  const animate = () => {
    const { current: refs } = threeRefs
    refs.animationId = requestAnimationFrame(animate)

    const time = Date.now() * 0.001

    // Update stars
    refs.stars.forEach((starField) => {
      if (starField.material instanceof THREE.ShaderMaterial && starField.material.uniforms) {
        starField.material.uniforms.time.value = time
      }
    })

    // Update nebula
    if (refs.nebula && refs.nebula.material instanceof THREE.ShaderMaterial && refs.nebula.material.uniforms) {
      refs.nebula.material.uniforms.time.value = time * 0.5
    }

    // Smooth camera movement
    if (refs.camera && refs.targetCameraX !== undefined) {
      const smoothingFactor = 0.05

      smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor
      smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * smoothingFactor
      smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * smoothingFactor

      const floatX = Math.sin(time * 0.1) * 2
      const floatY = Math.cos(time * 0.15) * 1

      refs.camera.position.x = smoothCameraPos.current.x + floatX
      refs.camera.position.y = smoothCameraPos.current.y + floatY
      refs.camera.position.z = smoothCameraPos.current.z
      refs.camera.lookAt(0, 10, -600)
    }

    // Parallax mountains
    refs.mountains.forEach((mountain, i) => {
      const parallaxFactor = 1 + i * 0.5
      mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor
    })

    if (refs.renderer && refs.scene && refs.camera) {
      refs.renderer.render(refs.scene, refs.camera)
    }
  }

  // GSAP Animations
  useEffect(() => {
    if (!isReady) return

    const tl = gsap.timeline()

    // Animate title characters
    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll(".title-char")
      tl.from(titleChars, {
        y: 200,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out",
      })
    }

    // Animate subtitle
    if (subtitleRef.current) {
      tl.from(
        subtitleRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8",
      )
    }

    // Animate CTAs
    if (ctaRef.current) {
      tl.from(
        ctaRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5",
      )
    }

    // Animate stats
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll(".stat-item")
      tl.from(
        statItems,
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.5",
      )
    }

    // Scroll-based camera movement
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const { current: refs } = threeRefs

        refs.targetCameraX = 0
        refs.targetCameraY = 30 + progress * 20
        refs.targetCameraZ = 100 - progress * 150

        // Parallax mountains
        refs.mountains.forEach((mountain, i) => {
          const speed = 1 + i * 0.9
          mountain.position.z = mountain.userData.baseZ + progress * speed * 100
        })
      },
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [isReady])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 py-32 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border">
            <div className="w-2 h-2 rounded-full bg-geira-cyan animate-glow" />
            <span className="text-sm text-muted-foreground">Innovation digitale & énergétique</span>
          </div>

          {/* Main Heading with split text */}
          <div ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <div className="overflow-hidden">
              {"GEIRA TECH".split("").map((char, i) => (
                <span key={i} className="title-char inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
            <div className="overflow-hidden mt-4">
              <span className="bg-gradient-to-r from-geira-cyan via-geira-accent to-geira-blue bg-clip-text text-transparent">
                {"SOLUTIONS DIGITALES".split("").map((char, i) => (
                  <span key={i} className="title-char inline-block">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed"
          >
            Transformez votre entreprise avec nos solutions innovantes en design, développement, automatisation et
            énergie renouvelable.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-geira-cyan to-geira-blue hover:opacity-90 transition-all duration-300 shadow-2xl shadow-geira-cyan/25 group text-lg px-8 py-6"
              onClick={() => trackCTAClick("hero-primary-cta", "Démarrer un projet", "hero")}
            >
              Démarrer un projet
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-geira-cyan/50 hover:bg-geira-cyan/10 transition-all duration-300 group text-lg px-8 py-6 bg-transparent"
              onClick={() => trackCTAClick("hero-secondary-cta", "Voir nos réalisations", "hero")}
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Voir nos réalisations
            </Button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
            {[
              { value: "150+", label: "Projets réalisés" },
              { value: "98%", label: "Clients satisfaits" },
              { value: "24/7", label: "Support disponible" },
              { value: "5+", label: "Ans d'expérience" },
            ].map((stat, index) => (
              <div key={index} className="stat-item space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-geira-cyan/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-geira-cyan animate-pulse" />
        </div>
      </div>
    </section>
  )
}
