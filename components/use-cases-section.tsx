"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function UseCasesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const cases = [
    {
      title: "E-commerce Moderne",
      client: "Fashion Boutique",
      category: "Développement Web",
      description:
        "Plateforme e-commerce complète avec paiement sécurisé, gestion des stocks et tableau de bord analytique avancé.",
      results: [
        { label: "Ventes", value: "+300%", icon: TrendingUp },
        { label: "Temps de gestion", value: "-50%", icon: CheckCircle2 },
        { label: "Satisfaction", value: "98%", icon: CheckCircle2 },
      ],
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
      tags: ["Next.js", "Stripe", "Analytics"],
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Automatisation Industrielle",
      client: "Manufacturing Corp",
      category: "Automatisation",
      description:
        "Système d'automatisation complet pour optimiser la chaîne de production et réduire significativement les coûts opérationnels.",
      results: [
        { label: "Productivité", value: "+40%", icon: TrendingUp },
        { label: "Réduction erreurs", value: "-60%", icon: CheckCircle2 },
        { label: "ROI", value: "8 mois", icon: CheckCircle2 },
      ],
      image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop",
      tags: ["IoT", "Python", "RPA"],
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Installation Solaire",
      client: "Green Energy Co",
      category: "Énergie",
      description:
        "Installation de 500 panneaux solaires avec système de monitoring intelligent et optimisation énergétique en temps réel.",
      results: [
        { label: "Économie énergie", value: "70%", icon: TrendingUp },
        { label: "Amortissement", value: "5 ans", icon: CheckCircle2 },
        { label: "CO2 réduit", value: "50T/an", icon: CheckCircle2 },
      ],
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1d?w=800&h=600&fit=crop",
      tags: ["Solaire", "IoT", "Monitoring"],
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
      title: "Identité Visuelle Complète",
      client: "Tech Startup",
      category: "Design",
      description:
        "Création d'une identité de marque complète incluant logo, charte graphique et supports marketing multicanaux.",
      results: [
        { label: "Reconnaissance", value: "+200%", icon: TrendingUp },
        { label: "Engagement", value: "+150%", icon: CheckCircle2 },
        { label: "Conversion", value: "+80%", icon: CheckCircle2 },
      ],
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      tags: ["Branding", "UI/UX", "Marketing"],
      gradient: "from-green-500/20 to-emerald-500/20",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation du header
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
          y: 80,
          opacity: 0,
          stagger: 0.2,
        })
      }

      // Scroll horizontal optimisé
      if (containerRef.current && scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current
        const cards = Array.from(scrollContainer.children) as HTMLElement[]
        
        // Fonction pour calculer les dimensions
        const calculateDimensions = () => {
          const gap = 32 // 2rem = 32px
          let totalWidth = 0
          
          cards.forEach((card) => {
            totalWidth += card.offsetWidth + gap
          })
          
          // Retirer le dernier gap
          totalWidth -= gap
          
          const viewportWidth = window.innerWidth
          
          // Distance de scroll = largeur totale - largeur du viewport + padding
          const scrollDistance = totalWidth - viewportWidth + 100
          
          return { scrollDistance, totalWidth }
        }

        const { scrollDistance } = calculateDimensions()

        // Animation principale de scroll horizontal
        gsap.to(scrollContainer, {
          x: () => -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50px", // Espace pour le header rétractable
            end: () => `+=${scrollDistance * 1.2}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Animation progressive des cards pendant le scroll
              cards.forEach((card, index) => {
                const progress = self.progress * cards.length
                const cardProgress = progress - index
                
                // Apparition progressive
                if (cardProgress >= 0 && cardProgress <= 1) {
                  gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                  })
                } else if (cardProgress < 0) {
                  gsap.to(card, {
                    opacity: 0.3,
                    scale: 0.95,
                    duration: 0.3,
                    ease: "power2.out"
                  })
                }
              })
            }
          },
        })

        // Initialiser l'état des cards
        cards.forEach((card, index) => {
          if (index === 0) {
            gsap.set(card, { opacity: 1, scale: 1 })
          } else {
            gsap.set(card, { opacity: 0.3, scale: 0.95 })
          }
        })

        // Rafraîchir au redimensionnement
        const handleResize = () => {
          ScrollTrigger.refresh()
        }

        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 overflow-hidden bg-transparent">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">Nos Réalisations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Projets qui font
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                la différence
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez comment nous avons transformé les défis de nos clients en succès mesurables
            </p>
          </div>

          {/* Horizontal Scroll Container avec padding top pour le header */}
          <div ref={containerRef} className="relative h-[85vh] flex items-center pt-24">
            <div ref={scrollContainerRef} className="flex gap-8 will-change-transform">
              {cases.map((caseItem, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-[90vw] sm:w-[80vw] md:w-[65vw] lg:w-[450px] xl:w-[480px] 
                             h-[70vh] max-h-[650px] min-h-[550px]
                             overflow-hidden bg-card/50 backdrop-blur-sm border-border 
                             hover:border-geira-cyan/50 transition-all duration-500 group flex flex-col
                             hover:shadow-lg hover:shadow-geira-cyan/10"
                >
                  {/* Image with gradient overlay */}
                  <div className="relative h-44 md:h-48 overflow-hidden flex-shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${caseItem.gradient} opacity-40 z-10`} />
                    <Image
                      src={caseItem.image || "/placeholder.svg"}
                      alt={caseItem.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-geira-cyan/90 backdrop-blur-sm text-primary-foreground border-0">
                        {caseItem.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="flex-shrink-0 pb-3">
                    <CardDescription className="text-xs text-muted-foreground uppercase tracking-wider">
                      {caseItem.client}
                    </CardDescription>
                    <CardTitle className="text-xl md:text-2xl font-bold group-hover:text-geira-cyan transition-colors">
                      {caseItem.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-grow overflow-y-auto">
                    <p className="text-sm text-muted-foreground leading-relaxed">{caseItem.description}</p>

                    {/* Results with icons */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-geira-cyan uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Résultats clés
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {caseItem.results.map((result, resultIndex) => (
                          <div
                            key={resultIndex}
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-card/50 border border-border/50 
                                       hover:border-geira-cyan/30 transition-all hover:bg-geira-cyan/5"
                          >
                            <result.icon className="w-3 h-3 text-geira-cyan mb-1" />
                            <span className="text-sm md:text-base font-bold text-geira-cyan">{result.value}</span>
                            <span className="text-xs text-muted-foreground text-center leading-tight">{result.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {caseItem.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs border-geira-cyan/30 text-geira-cyan hover:bg-geira-cyan/10 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-border pt-3 flex-shrink-0">
                    <Button variant="ghost" className="w-full group/btn hover:bg-geira-cyan/10 h-10">
                      Voir le projet
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              ← Faites défiler pour découvrir tous nos projets →
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


