"use client"
import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import Image from "next/image"

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

function getRGBA(cssColor: any, fallback = "rgba(180, 180, 180)") {
  if (typeof window === "undefined") return fallback
  if (!cssColor) return fallback

  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div")
      element.style.color = cssColor
      document.body.appendChild(element)
      const computedColor = window.getComputedStyle(element).color
      document.body.removeChild(element)
      return computedColor
    }
    return cssColor
  } catch (e) {
    return fallback
  }
}

function colorWithOpacity(color: string, opacity: number) {
  if (!color.startsWith("rgb")) return color
  const match = color.match(/\d+/g)
  if (!match) return color
  return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`
}

// Flickering Grid Component
function FlickeringGrid({
  squareSize = 2,
  gridGap = 2,
  flickerChance = 0.1,
  color = "#6B7280",
  width,
  height,
  className,
  maxOpacity = 0.3,
  text = "",
  fontSize = 90,
  fontWeight = 600,
}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const memoizedColor = useMemo(() => getRGBA(color), [color])

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height)

      const maskCanvas = document.createElement("canvas")
      maskCanvas.width = width
      maskCanvas.height = height
      const maskCtx = maskCanvas.getContext("2d", {
        willReadFrequently: true,
      })
      if (!maskCtx) return

      if (text) {
        maskCtx.save()
        maskCtx.scale(dpr, dpr)
        maskCtx.fillStyle = "white"
        maskCtx.font = `${fontWeight} ${fontSize}px "Orbitron", -apple-system, sans-serif`
        maskCtx.textAlign = "center"
        maskCtx.textBaseline = "middle"
        maskCtx.fillText(text, width / (2 * dpr), height / (2 * dpr))
        maskCtx.restore()
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr
          const y = j * (squareSize + gridGap) * dpr
          const squareWidth = squareSize * dpr
          const squareHeight = squareSize * dpr

          const maskData = maskCtx.getImageData(x, y, squareWidth, squareHeight).data
          const hasText = maskData.some((value, index) => index % 4 === 0 && value > 0)

          const opacity = squares[i * rows + j]
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity)
          ctx.fillRect(x, y, squareWidth, squareHeight)
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  )

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.ceil(width / (squareSize + gridGap))
      const rows = Math.ceil(height / (squareSize + gridGap))

      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity],
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let gridParams: ReturnType<typeof setupCanvas>

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth
      const newHeight = height || container.clientHeight
      setCanvasSize({ width: newWidth, height: newHeight })
      gridParams = setupCanvas(canvas, newWidth, newHeight)
    }

    updateCanvasSize()

    let lastTime = 0
    const animate = (time: number) => {
      if (!isInView) return

      const deltaTime = (time - lastTime) / 1000
      lastTime = time

      updateSquares(gridParams.squares, deltaTime)
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr)
      animationFrameId = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    intersectionObserver.observe(canvas)

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView])

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  )
}

export function Footer() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const services = [
    { label: "Design Graphique", href: "#services" },
    { label: "Développement Web", href: "#services" },
    { label: "Automatisation", href: "#services" },
    { label: "Panneaux Solaires", href: "#services" },
  ]

  const company = [
    { label: "À propos", href: "#about" },
    { label: "Nos réalisations", href: "#projects" },
    { label: "Processus", href: "#process" },
    { label: "Contact", href: "#contact" },
  ]

  const legal = [
    { label: "Mentions légales", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "CGV", href: "#" },
    { label: "Cookies", href: "#" },
  ]

  const socials = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

  return (
    <footer id="footer" className="w-full pb-0 relative">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-10 relative z-10 gap-y-10">
        <div className="flex flex-col items-start justify-start gap-y-5 max-w-xs mx-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center overflow-visible group-hover:scale-110 transition-transform duration-300 py-2">
              <Image
                src="/logo-geira-gradient.png"
                alt="Geira Tech Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                Geira Tech
              </span>
              <span className="text-xs text-muted-foreground">Innovation & Excellence</span>
            </div>
          </Link>

          <p className="tracking-tight text-muted-foreground font-medium text-sm leading-relaxed">
            Solutions innovantes en design, développement, IT et énergie pour propulser votre entreprise vers l'avenir.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-md bg-card/50 border border-geira-cyan/20 text-xs font-medium text-geira-cyan">
              SOC 2
            </div>
            <div className="px-3 py-1.5 rounded-md bg-card/50 border border-geira-cyan/20 text-xs font-medium text-geira-cyan">
              HIPAA
            </div>
            <div className="px-3 py-1.5 rounded-md bg-card/50 border border-geira-cyan/20 text-xs font-medium text-geira-cyan">
              GDPR
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="pt-5 md:w-1/2">
          <div className="flex flex-col items-start justify-start md:flex-row md:items-start md:justify-between gap-y-8 md:gap-y-0 lg:pl-10">
            {[
              { title: "Services", links: services },
              { title: "Entreprise", links: company },
              { title: "Légal", links: legal },
            ].map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-3">
                <li className="mb-2 text-sm font-semibold text-primary">{column.title}</li>
                {column.links.map((link, linkIndex) => (
                  <li
                    key={linkIndex}
                    className="group inline-flex cursor-pointer items-center justify-start gap-2 text-sm text-muted-foreground hover:text-geira-cyan transition-colors duration-300"
                  >
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                    <div className="flex size-4 items-center justify-center border border-geira-cyan/30 rounded opacity-0 translate-x-0 transform transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRight className="h-3 w-3 text-geira-cyan" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-56 md:h-72 relative mt-16 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text="GEIRA TECH"
            fontSize={isMobile ? 50 : 90}
            className="h-full w-full"
            squareSize={2}
            gridGap={isMobile ? 2 : 3}
            color="oklch(0.75 0.15 195)"
            maxOpacity={0.35}
            flickerChance={0.12}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full border-t border-geira-cyan/20 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-2">
                © {new Date().getFullYear()} Geira Tech. Tous droits réservés.
              </p>
              <p className="text-xs text-muted-foreground">
                Conçu et développé avec passion pour l'innovation technologique.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card/50 border border-geira-cyan/30 hover:border-geira-cyan/60 flex items-center justify-center hover:bg-geira-cyan/10 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-geira-cyan transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-geira-cyan/20 to-transparent" />

          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-geira-cyan" />
              <a
                href="mailto:contact@geiratech.com"
                className="text-xs text-muted-foreground hover:text-geira-cyan transition-colors"
              >
                contact@geiratech.com
              </a>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-geira-cyan" />
              <a
                href="tel:+2290197012345"
                className="text-xs text-muted-foreground hover:text-geira-cyan transition-colors"
              >
                +229 01 97 01 23 45
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-2">
              <MapPin className="w-4 h-4 text-geira-cyan" />
              <span className="text-xs text-muted-foreground">Cotonou, Bénin</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
