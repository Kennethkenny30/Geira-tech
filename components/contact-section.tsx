"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, CheckCircle, Calendar, Users, Award } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const infoGridRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setFormSubmitted(true)

    setTimeout(() => {
      setFormSubmitted(false)
      ;(e.target as HTMLFormElement).reset()
    }, 3000)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // FIX #1: Utiliser fromTo avec initialisation clear des propriétés
      // Cela évite les conflits avec les états initiaux cachés
      
      if (headerRef.current) {
        const children = headerRef.current.children
        
        gsap.fromTo(
          children,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              end: "top 30%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
            overwrite: "auto",
          }
        )
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
            overwrite: "auto",
          }
        )

        const formFields = formRef.current.querySelectorAll(".form-field")
        
        gsap.fromTo(
          formFields,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 75%",
              end: "top 20%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
            overwrite: "auto",
          }
        )
      }

      if (infoGridRef.current) {
        const infoCards = infoGridRef.current.querySelectorAll(".info-card")
        
        gsap.fromTo(
          infoCards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: infoGridRef.current,
              start: "top 85%",
              end: "top 40%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
            overwrite: "auto",
          }
        )
      }

      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-card")
        
        gsap.fromTo(
          statCards,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              end: "top 40%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
            overwrite: "auto",
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "geira@tech.com",
      link: "mailto:contact@geiratech.com",
      description: "Réponse en 24h",
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+229 01 97 01 23 45",
      link: "tel:+2290197012345",
      description: "Lun-Ven 9h-18h",
    },
    {
      icon: MapPin,
      title: "Localisation",
      value: "Cotonou, Bénin",
      link: "https://maps.google.com",
      description: "Sur rendez-vous",
    },
    {
      icon: Clock,
      title: "Disponibilité",
      value: "24/7",
      link: "#",
      description: "Support toujours là",
    },
  ]

  const stats = [
    { icon: Users, value: "200+", label: "Clients satisfaits" },
    { icon: Award, value: "350+", label: "Projets réalisés" },
    { icon: Calendar, value: "5 ans", label: "D'expérience" },
  ]

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-geira-cyan/50 to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-geira-cyan/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div ref={headerRef} className="text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">Contactez-nous</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Prêt à démarrer
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                votre projet ?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Discutons de vos besoins et trouvons ensemble la solution idéale pour transformer votre vision en réalité.
            </p>
          </div>

          <Card
            ref={formRef}
            className="p-8 lg:p-10 bg-card/90 backdrop-blur-md border border-geira-cyan/20 shadow-2xl shadow-geira-cyan/10"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-geira-cyan/20">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-geira-cyan/20 to-geira-blue/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-geira-cyan" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Envoyez-nous un message</h3>
                  <p className="text-sm text-muted-foreground">Nous vous répondrons au plus vite</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="form-field space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Prénom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      required
                      className="bg-background/60 border-geira-cyan/30 focus:border-geira-cyan transition-colors h-11"
                    />
                  </div>
                  <div className="form-field space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Nom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      required
                      className="bg-background/60 border-geira-cyan/30 focus:border-geira-cyan transition-colors h-11"
                    />
                  </div>
                  <div className="form-field space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+229 01 96 01 23 45"
                      className="bg-background/60 border-geira-cyan/30 focus:border-geira-cyan transition-colors h-11"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-field space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean.dupont@example.com"
                      required
                      className="bg-background/60 border-geira-cyan/30 focus:border-geira-cyan transition-colors h-11"
                    />
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="service" className="text-sm font-medium">
                      Service souhaité <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="service"
                      className="w-full h-11 px-4 rounded-md border border-geira-cyan/30 bg-background/60 text-foreground focus:outline-none focus:ring-2 focus:ring-geira-cyan focus:border-geira-cyan transition-colors"
                      required
                    >
                      <option value="">Sélectionnez un service</option>
                      <option value="design">Design Graphique</option>
                      <option value="web">Développement Web & Mobile</option>
                      <option value="video">Montage Vidéo</option>
                      <option value="automation">Automatisation</option>
                      <option value="it">Maintenance IT</option>
                      <option value="network">Réseaux</option>
                      <option value="solar">Panneaux Solaires</option>
                      <option value="security">Caméras de Surveillance</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="form-field space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre projet en détail..."
                    rows={4}
                    required
                    className="bg-background/60 resize-none border-geira-cyan/30 focus:border-geira-cyan transition-colors"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || formSubmitted}
                    className="flex-1 bg-gradient-to-r from-geira-cyan to-geira-blue hover:opacity-90 transition-all duration-300 shadow-lg shadow-geira-cyan/25 group h-12 text-base font-semibold text-black"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                        Envoi en cours...
                      </>
                    ) : formSubmitted ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Message envoyé !
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-geira-cyan/50 hover:bg-geira-cyan/10 h-12"
                  >
                    Demander un devis
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  En soumettant, vous acceptez notre politique de confidentialité
                </p>
              </form>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <div ref={infoGridRef} className="grid grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="info-card p-5 bg-card/70 backdrop-blur-md border border-geira-cyan/20 hover:border-geira-cyan/60 transition-all duration-300 group hover:shadow-lg hover:shadow-geira-cyan/15"
                >
                  <a
                    href={info.link}
                    className="flex flex-col items-start gap-3 h-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-geira-cyan/30 to-geira-blue/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="w-5 h-5 text-geira-cyan" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                        {info.title}
                      </p>
                      <p className="font-semibold group-hover:text-geira-cyan transition-colors text-sm mb-2">
                        {info.value}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {info.description}
                      </p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <div ref={statsRef} className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="stat-card p-4 bg-gradient-to-br from-geira-cyan/10 to-geira-blue/10 border border-geira-cyan/30 hover:border-geira-cyan/60 transition-all text-center"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-lg bg-geira-cyan/20 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-geira-cyan" />
                      </div>
                      <p className="text-2xl font-bold text-geira-cyan">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 bg-card/70 backdrop-blur-md border border-geira-cyan/20 h-[200px]">
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-geira-cyan/5 to-geira-blue/5 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="w-8 h-8 text-geira-cyan mx-auto" />
                    <p className="text-sm font-medium">Carte interactive</p>
                    <p className="text-xs text-muted-foreground">Cotonou, Bénin</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-geira-cyan/10">
            <p className="text-muted-foreground mb-6">
              Une question ? Consultez notre FAQ ou contactez directement notre équipe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-geira-cyan/50 hover:bg-geira-cyan/10 bg-transparent">
                Voir la FAQ
              </Button>
              <Button className="bg-gradient-to-r from-geira-cyan to-geira-blue text-black hover:shadow-lg hover:shadow-geira-cyan/30">
                Parler à un expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}