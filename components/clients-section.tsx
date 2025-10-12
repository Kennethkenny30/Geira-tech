"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ClientsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const clients = [
    { name: "TechCorp", logo: "/techcorp-logo.png" },
    { name: "InnovateLab", logo: "/innovatelab-logo.png" },
    { name: "Digital Solutions", logo: "/digital-solutions-logo.jpg" },
    { name: "Green Energy", logo: "/green-energy-logo.jpg" },
    { name: "Smart Systems", logo: "/smart-systems-logo.jpg" },
    { name: "Future Tech", logo: "/future-tech-logo.jpg" },
    { name: "Cloud Nine", logo: "/cloud-nine-logo.jpg" },
    { name: "Data Dynamics", logo: "/data-dynamics-logo.jpg" },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (scrollContainerRef.current) {
        const scrollWidth = scrollContainerRef.current.scrollWidth / 2

        gsap.to(scrollContainerRef.current, {
          x: -scrollWidth,
          duration: 30,
          ease: "none",
          repeat: -1,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="clients" ref={sectionRef} className="relative py-24 overflow-hidden bg-card/10">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">Nos Clients</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Ils nous font{" "}
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                confiance
              </span>
            </h2>
          </div>

          {/* Scrolling Logos */}
          <div className="overflow-hidden">
            <div ref={scrollContainerRef} className="flex gap-12 w-max">
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center min-w-[200px] h-20 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
