import { RetractableHeader } from "@/components/retractable-header"
import { HeroWithLoading } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ClientsSection } from "@/components/clients-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <>
      <RetractableHeader />
      <main className="relative">
        <HeroWithLoading />
        <AboutSection />
        <ServicesSection />
        <UseCasesSection />
        <ProcessSection />
        <TestimonialsSection />
        <ClientsSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}
