"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  Database,
  Lock,
  Zap,
  Settings,
  Globe,
  Smartphone,
  Wifi,
  HardDrive,
} from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
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
    {
      icon: Shield,
      title: "Audit IT & Sécurité",
      description: "Analyse complète de votre infrastructure",
    },
    {
      icon: Cpu,
      title: "IoT & Objets Connectés",
      description: "Solutions intelligentes connectées",
    },
    {
      icon: TrendingUp,
      title: "Maintenance Prédictive",
      description: "Anticipez les pannes",
    },
    { icon: BookOpen, title: "Formation IT", description: "Formations sur mesure" },
    {
      icon: Cloud,
      title: "Hébergement & Cloud",
      description: "Solutions cloud scalables",
    },
    { icon: Bell, title: "Monitoring 24/7", description: "Surveillance continue" },
    {
      icon: Database,
      title: "Gestion de Données",
      description: "Architecture et optimisation",
    },
    {
      icon: Lock,
      title: "Cybersécurité",
      description: "Protection avancée",
    },
    { icon: Zap, title: "Performance Web", description: "Optimisation vitesse" },
    {
      icon: Settings,
      title: "DevOps & CI/CD",
      description: "Automatisation déploiement",
    },
    { icon: Globe, title: "SEO & Marketing", description: "Visibilité en ligne" },
    {
      icon: Smartphone,
      title: "Apps Mobiles",
      description: "iOS & Android natif",
    },
    { icon: Wifi, title: "Réseaux Sans Fil", description: "Infrastructure WiFi" },
    {
      icon: HardDrive,
      title: "Sauvegarde & Backup",
      description: "Protection données",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.5,
          },
          y: 100,
          opacity: 0,
          stagger: 0.2,
        })
      }

      if (tabsRef.current) {
        gsap.from(tabsRef.current, {
          scrollTrigger: {
            trigger: tabsRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Animation de défilement infini pour les services supplémentaires
  useEffect(() => {
    if (!scrollContainerRef.current || !additionalRef.current) return

    const container = scrollContainerRef.current
    const totalWidth = container.scrollWidth / 2 // Diviser par 2 car on duplique

    const tl = gsap.timeline({ repeat: -1 })

    tl.to(container, {
      x: -totalWidth,
      duration: 20, // Augmenté la vitesse (réduit la durée)
      ease: "none",
    }).set(container, {
      x: 0,
    })

    return () => {
      tl.kill()
    }
  }, [])

  // Animation fluide lors du changement de tab
  useEffect(() => {
    const cards = document.querySelectorAll(`[data-tab="${activeTab}"] .service-card`)

    // Initialiser les cards comme invisibles
    gsap.set(cards, { 
      opacity: 0,
      y: 60,
      scale: 0.9,
    })

    // Animation d'entrée fluide
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: {
        amount: 0.3,
        from: "start",
      },
      ease: "power3.out",
    })
  }, [activeTab])

  return (
    <section id="services" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-geira-cyan/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-geira-blue/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">Nos Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Des solutions complètes pour
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                tous vos besoins
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Trois domaines d'expertise, une seule mission : propulser votre entreprise vers le succès.
            </p>
          </div>

          {/* Services Tabs */}
          <div ref={tabsRef}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-auto p-1 bg-card/50 backdrop-blur-sm border border-geira-cyan/10">
                <TabsTrigger
                  value="creative"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-geira-cyan data-[state=active]:to-geira-blue data-[state=active]:text-black py-3 transition-all duration-300"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Services </span>Créatifs
                </TabsTrigger>
                <TabsTrigger
                  value="automation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-geira-cyan data-[state=active]:to-geira-blue data-[state=active]:text-black py-3 transition-all duration-300"
                >
                  <Workflow className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Solutions </span>IT
                </TabsTrigger>
                <TabsTrigger
                  value="energy"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-geira-cyan data-[state=active]:to-geira-blue data-[state=active]:text-black py-3 transition-all duration-300"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Énergie
                </TabsTrigger>
              </TabsList>

              {Object.entries(services).map(([key, serviceList]) => (
                <TabsContent key={key} value={key} data-tab={key} className="mt-12">
                  <div className="grid md:grid-cols-3 gap-6">
                    {serviceList.map((service, index) => (
                      <Card
                        key={index}
                        className="service-card p-6 bg-card/70 backdrop-blur-sm border-geira-cyan/20 hover:border-geira-cyan/60 transition-all duration-500 hover:shadow-2xl hover:shadow-geira-cyan/15 group hover:-translate-y-2"
                      >
                        <div className="space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-geira-cyan/30 to-geira-blue/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-geira-cyan/10">
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
                                className="bg-geira-cyan/15 text-geira-cyan border-geira-cyan/30"
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

          {/* Additional Services with smooth horizontal scroll */}
          <div ref={additionalRef} className="space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">Services Complémentaires</h3>
              <p className="text-muted-foreground text-lg">Et bien plus encore pour accompagner votre croissance</p>
            </div>
            <div className="overflow-hidden">
              <div ref={scrollContainerRef} className="flex gap-3 md:gap-4 w-max" style={{ willChange: "transform" }}>
                {[...additionalServices, ...additionalServices].map((service, index) => (
                  <Card
                    key={index}
                    className="p-4 md:p-6 bg-card/60 backdrop-blur-sm border-geira-cyan/20 hover:border-geira-cyan/60 transition-all duration-300 hover:shadow-lg hover:shadow-geira-cyan/15 group text-center min-w-[160px] md:min-w-[220px] flex-shrink-0"
                  >
                    <div className="space-y-2 md:space-y-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-gradient-to-br from-geira-cyan/30 to-geira-blue/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-5 h-5 md:w-6 md:h-6 text-geira-cyan" />
                      </div>
                      <p className="text-xs md:text-sm font-semibold">{service.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">{service.description}</p>
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