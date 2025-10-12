"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Palette,
  Code,
  Video,
  Workflow,
  Server,
  Network,
  Sun,
  Camera,
  Battery,
  Shield,
  Cpu,
  TrendingUp,
  BookOpen,
  Cloud,
  Bell,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const additionalRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("creative")

  const services = {
    creative: [
      {
        icon: Palette,
        title: "Design Graphique",
        description: "Identités visuelles, logos, supports print et digital pour une image de marque percutante.",
        tags: ["Branding", "UI/UX", "Print"],
      },
      {
        icon: Code,
        title: "Développement Web & Mobile",
        description: "Applications web et mobiles performantes, responsive et optimisées SEO.",
        tags: ["React", "Next.js", "Mobile"],
      },
      {
        icon: Video,
        title: "Montage Vidéo",
        description: "Production et montage vidéo professionnel pour vos contenus marketing et corporate.",
        tags: ["Motion", "Editing", "Animation"],
      },
    ],
    automation: [
      {
        icon: Workflow,
        title: "Automatisation de Processus",
        description: "Optimisation et automatisation de vos workflows pour gagner en efficacité.",
        tags: ["RPA", "Workflow", "API"],
      },
      {
        icon: Server,
        title: "Maintenance Informatique",
        description: "Support technique et maintenance préventive pour assurer la continuité de vos opérations.",
        tags: ["Support", "Monitoring", "Updates"],
      },
      {
        icon: Network,
        title: "Réseaux Informatiques",
        description: "Installation, configuration et sécurisation de vos infrastructures réseau.",
        tags: ["LAN/WAN", "VPN", "Firewall"],
      },
    ],
    energy: [
      {
        icon: Sun,
        title: "Panneaux Solaires",
        description: "Installation de solutions photovoltaïques pour réduire vos coûts énergétiques.",
        tags: ["Solaire", "Économie", "Écologie"],
      },
      {
        icon: Camera,
        title: "Caméras de Surveillance",
        description: "Systèmes de vidéosurveillance intelligents pour sécuriser vos locaux.",
        tags: ["Sécurité", "IP", "Cloud"],
      },
      {
        icon: Battery,
        title: "Optimisation Énergétique",
        description: "Audit et solutions pour optimiser votre consommation énergétique.",
        tags: ["Audit", "Batteries", "Smart Grid"],
      },
    ],
  }

  const additionalServices = [
    { icon: Shield, title: "Audit IT & Sécurité" },
    { icon: Cpu, title: "IoT & Objets Connectés" },
    { icon: TrendingUp, title: "Maintenance Prédictive" },
    { icon: BookOpen, title: "Formation IT" },
    { icon: Cloud, title: "Hébergement & Cloud" },
    { icon: Bell, title: "Monitoring 24/7" },
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

      // Tabs parallax
      gsap.from(tabsRef.current, {
        scrollTrigger: {
          trigger: tabsRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: 1,
        },
        y: 80,
        opacity: 0,
      })

      // Cards staggered entrance from different directions
      const cards = cardsRef.current?.querySelectorAll(".service-card")
      cards?.forEach((card, index) => {
        const direction = index % 3 === 0 ? -100 : index % 3 === 1 ? 0 : 100
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          x: direction,
          y: direction === 0 ? 100 : 0,
          opacity: 0,
          rotation: direction === 0 ? 0 : direction > 0 ? 5 : -5,
        })
      })

      // Additional services continuous scroll animation
      if (scrollContainerRef.current) {
        const scrollWidth = scrollContainerRef.current.scrollWidth
        const containerWidth = scrollContainerRef.current.offsetWidth

        gsap.to(scrollContainerRef.current, {
          x: -(scrollWidth - containerWidth),
          ease: "none",
          duration: 20,
          repeat: -1,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [activeTab])

  return (
    <section id="services" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-geira-cyan/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-geira-blue/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">Nos Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Des solutions complètes pour
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                tous vos besoins
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Trois domaines d'expertise, une seule mission : propulser votre entreprise vers le succès.
            </p>
          </div>

          {/* Services Tabs */}
          <div ref={tabsRef}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-auto p-1 bg-card/50 backdrop-blur-sm">
                <TabsTrigger
                  value="creative"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-geira-cyan data-[state=active]:to-geira-blue data-[state=active]:text-primary-foreground py-3"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Services </span>Créatifs
                </TabsTrigger>
                <TabsTrigger
                  value="automation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-geira-cyan data-[state=active]:to-geira-blue data-[state=active]:text-primary-foreground py-3"
                >
                  <Workflow className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Solutions </span>IT
                </TabsTrigger>
                <TabsTrigger
                  value="energy"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-geira-cyan data-[state=active]:to-geira-blue data-[state=active]:text-primary-foreground py-3"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Énergie
                </TabsTrigger>
              </TabsList>

              {Object.entries(services).map(([key, serviceList]) => (
                <TabsContent key={key} value={key} className="mt-12">
                  <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
                    {serviceList.map((service, index) => (
                      <Card
                        key={index}
                        className="service-card p-6 bg-card/50 backdrop-blur-sm border-border hover:border-geira-cyan/50 transition-all duration-500 hover:shadow-2xl hover:shadow-geira-cyan/10 group hover:-translate-y-2"
                      >
                        <div className="space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-geira-cyan/20 to-geira-blue/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <service.icon className="w-7 h-7 text-geira-cyan" />
                          </div>
                          <h3 className="text-xl font-semibold group-hover:text-geira-cyan transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {service.tags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="secondary"
                                className="bg-geira-cyan/10 text-geira-cyan border-geira-cyan/20"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Additional Services with continuous scroll */}
          <div ref={additionalRef} className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Services Complémentaires</h3>
              <p className="text-muted-foreground">Et bien plus encore pour accompagner votre croissance</p>
            </div>
            <div className="overflow-hidden">
              <div ref={scrollContainerRef} className="flex gap-4 w-max">
                {[...additionalServices, ...additionalServices].map((service, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-card/30 backdrop-blur-sm border-border hover:border-geira-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-geira-cyan/10 group text-center min-w-[200px]"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-geira-cyan/20 to-geira-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-6 h-6 text-geira-cyan" />
                      </div>
                      <p className="text-sm font-medium">{service.title}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
