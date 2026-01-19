import { HeroSection } from "@/components/hero-section"
import { EditorSection } from "@/components/editor-section"
import { FeaturesSection } from "@/components/features-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { FAQSection } from "@/components/faq-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <EditorSection />
      <FeaturesSection />
      <ShowcaseSection />
      <FAQSection />
    </main>
  )
}
