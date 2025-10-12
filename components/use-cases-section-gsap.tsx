"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function UseCasesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const cases = [
    {
      title: "E-commerce Moderne",
      client: "Fashion Boutique",
      category: "Développement Web",
      description:
        "Plateforme e-commerce complète avec paiement sécurisé, gestion des stocks et tableau de bord analytique.",
      results: ["300% d'augmentation des ventes", "50% de réduction du temps de gestion", "98% de satisfaction client"],
      image: "/modern-ecommerce-website.png",
    },
    {
      title: "Automatisation Industrielle",
      client: "Manufacturing Corp",
      category: "Automatisation",
      description:
        "Système d'automatisation complet pour optimiser la chaîne de production et réduire les coûts opérationnels.",
      results: ["40% de gain de productivité", "60% de réduction des erreurs", "ROI en 8 mois"],
      image: "/industrial-automation-system.jpg",
    },
    {
      title: "Installation Solaire",
      client: "Green Energy Co",
      category: "Énergie",
      description:
        "Installation de 500 panneaux solaires avec système de monitoring intelligent et optimisation énergétique.",
      results: ["70% d'économie d'énergie", "Amortissement en 5 ans", "Réduction CO2 de 50 tonnes/an"],
      image: "/solar-panel-installation.png",
    },
    {
      title: "Identité Visuelle Complète",
      client: "Tech Startup",
      category: "Design",
      description: "Création d'une identité de marque complète incluant logo, charte graphique et supports marketing.",
      results: ["Reconnaissance de marque +200%", "Engagement social +150%", "Conversion +80%"],
      image: "/brand-identity-design.png",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header parallax
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
      })

      // Horizontal scroll for cases
      const scrollWidth = scrollContainerRef.current!.scrollWidth
      const containerWidth = scrollContainerRef.current!.offsetWidth

      gsap.to(scrollContainerRef.current, {
        x: -(scrollWidth - containerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${scrollWidth - containerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 overflow-hidden bg-card/20">
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
          </div>

          {/* Horizontal Scroll Container */}
          <div className="overflow-hidden">
            <div ref={scrollContainerRef} className="flex gap-8 w-max">
              {cases.map((caseItem, index) => (
                <Card
                  key={index}
                  className="overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-geira-cyan/50 transition-all duration-300 w-[600px] flex-shrink-0"
                >
                  <div className="relative h-80">
                    <Image
                      src={caseItem.image || "/placeholder.svg"}
                      alt={caseItem.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 rounded-full bg-geira-cyan/90 backdrop-blur-sm text-xs font-medium">
                        {caseItem.category}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{caseItem.client}</p>
                      <h3 className="text-2xl font-bold mb-4">{caseItem.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{caseItem.description}</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-geira-cyan">Résultats clés :</p>
                      <ul className="space-y-2">
                        {caseItem.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-geira-cyan mt-2" />
                            <span className="text-sm">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="ghost" className="group w-full">
                      Voir le projet
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
