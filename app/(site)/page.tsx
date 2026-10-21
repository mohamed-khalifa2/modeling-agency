import { ContactSection } from "@/components/site/ContactSection";
import { ContentSections } from "@/components/site/ContentSections";
import { FeaturedModelsSection } from "@/components/site/FeaturedModelsSection";
import { Hero } from "@/components/site/Hero";
import { ServicesSection } from "@/components/site/ServicesSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ContentSections />
      <FeaturedModelsSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
